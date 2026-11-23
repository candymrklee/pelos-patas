
    let generator = null;
    let running = false;

    const history = [];
    let systemPrompt = "";

    self.onmessage = async ({ data }) => {
      try {
        if (data.type === "init") {
          if (data.device === "webgpu") {
            const adapter =
              self.navigator.gpu &&
              await self.navigator.gpu.requestAdapter();

            if (!adapter) {
              throw new Error("WEBGPU_UNAVAILABLE");
            }
          }

          const { pipeline, env } = await import(
            "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1"
          );

          env.allowLocalModels = false;
          env.allowRemoteModels = true;
          env.backends.onnx.wasm.numThreads = 1;

          systemPrompt = data.system;

          generator = await pipeline(
            "text-generation",
            "onnx-community/Qwen2.5-0.5B-Instruct",
            {
              device: data.device,
              dtype: data.device === "webgpu" ? "q4" : "int8",

              progress_callback: progress => {
                if (
                  progress.status === "progress" &&
                  Number.isFinite(progress.progress)
                ) {
                  self.postMessage({
                    type: "progress",
                    progress: Math.round(progress.progress)
                  });
                }
              }
            }
          );

          self.postMessage({
            type: "ready",
            device: data.device
          });
        }

        if (data.type === "clear") {
          history.length = 0;
        }

        if (data.type === "generate") {
          if (!generator || running) return;

          running = true;

          try {
            const messages = [
              {
                role: "system",
                content: systemPrompt
              },
              ...history.slice(-4),
              {
                role: "user",
                content: data.text
              }
            ];

            const output = await generator(messages, {
              max_new_tokens: 96,
              repetition_penalty: 1.15,
              do_sample: false
            });

            const generated = output?.[0]?.generated_text;
            let answer = "";

            if (Array.isArray(generated)) {
              const last = generated[generated.length - 1];

              answer =
                typeof last === "string"
                  ? last
                  : last?.content || "";
            } else if (typeof generated === "string") {
              answer = generated;
            }

            answer = answer.trim().slice(0, 1400);

            if (!answer) {
              throw new Error("EMPTY_ANSWER");
            }

            history.push(
              {
                role: "user",
                content: data.text
              },
              {
                role: "assistant",
                content: answer
              }
            );

            if (history.length > 4) {
              history.splice(0, history.length - 4);
            }

            self.postMessage({
              type: "answer",
              text: answer
            });
          } finally {
            running = false;
          }
        }
      } catch (error) {
        self.postMessage({
          type: "error",
          message: error?.message || String(error)
        });
      }
    };
  