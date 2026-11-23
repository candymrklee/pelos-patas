
    (() => {
      const carousel = document.querySelector(".reviews-carousel");

      if (!carousel) return;

      const track = carousel.querySelector(".reviews-track");
      const cards = [...track.querySelectorAll(".review-card")];
      const previous = carousel.querySelector(".reviews-prev");
      const next = carousel.querySelector(".reviews-next");
      const dots = carousel.querySelector(".reviews-dots");

      let active = 0;
      let pages = 0;

      function itemsVisible() {
        return window.matchMedia("(max-width: 767px)").matches ? 1 : 2;
      }

      function update() {
        pages = Math.max(1, cards.length - itemsVisible() + 1);

        const cardOffset = cards[1]
          ? cards[1].offsetLeft - cards[0].offsetLeft
          : cards[0].offsetWidth;

        active = Math.max(
          0,
          Math.min(
            pages - 1,
            Math.round(track.scrollLeft / Math.max(cardOffset, 1))
          )
        );

        previous.disabled = active === 0;
        next.disabled = active === pages - 1;

        if (dots.children.length !== pages) {
          dots.replaceChildren();

          for (let i = 0; i < pages; i++) {
            const button = document.createElement("button");

            button.type = "button";
            button.className = "reviews-dot";

            button.setAttribute(
              "aria-label",
              "Mostrar avaliações, página " + (i + 1)
            );

            button.addEventListener("click", () => go(i));
            dots.append(button);
          }
        }

        [...dots.children].forEach((dot, i) => {
          dot.setAttribute("aria-current", String(i === active));
        });
      }

      function go(index) {
        const target = Math.max(
          0,
          Math.min(cards.length - itemsVisible(), index)
        );

        track.scrollTo({
          left: cards[target].offsetLeft - cards[0].offsetLeft,
          behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches ? "instant" : "smooth"
        });

        active = target;
        previous.disabled = active === 0;
        next.disabled = active === pages - 1;

        [...dots.children].forEach((dot, i) => {
          dot.setAttribute("aria-current", String(i === active));
        });
      }

      previous.addEventListener("click", () => go(active - 1));
      next.addEventListener("click", () => go(active + 1));

      track.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);

      update();
    })();
  