
(() => {
 const controls = document.getElementById('catalog-controls');
 const buttons = [...document.querySelectorAll('[data-filter]')];
 const products = [...document.querySelectorAll('.product-card')];
 const status = document.getElementById('catalog-status');
 const empty = document.getElementById('catalog-empty');
 let category = 'todos';
 function update() {
  let count = 0;
  for (const card of products) {
   card.hidden = category !== 'todos' && card.dataset.category !== category;
   if (!card.hidden) count++;
  }
  status.textContent = count + (count === 1 ? ' produto encontrado' : ' produtos encontrados');
  empty.hidden = count > 0;
 }
 for (const button of buttons) button.addEventListener('click', () => {
  category = button.dataset.filter;
  buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  update();
 });
 document.getElementById('reset-products').addEventListener('click', () => {
  category = 'todos';
  buttons.forEach(item => item.setAttribute('aria-pressed', String(item.dataset.filter === 'todos')));
  update(); buttons[0].focus();
 });
 controls.hidden = false;
 update();
})();
