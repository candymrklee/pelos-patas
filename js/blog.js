
(() => {
  const filtros = document.getElementById('filtros');
  const botoes = [...filtros.querySelectorAll('[data-filter]')];
  const artigos = [...document.querySelectorAll('.post[data-category]')];
  const contagem = document.getElementById('contagem');
  function filtrar(categoria) {
    let total = 0;
    for (const artigo of artigos) {
      artigo.hidden = categoria !== 'todos' && !artigo.dataset.category.split(' ').includes(categoria);
      if (!artigo.hidden) total++;
    }
    for (const botao of botoes) botao.setAttribute('aria-pressed', String(botao.dataset.filter === categoria));
    contagem.textContent = total === 1 ? '1 artigo' : total + ' artigos';
  }
  for (const botao of botoes) botao.addEventListener('click', () => filtrar(botao.dataset.filter));
  filtros.hidden = false;
  filtrar('todos');
})();
