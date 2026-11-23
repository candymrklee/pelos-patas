
(() => {
 const carousel = document.querySelector('.founder-carousel');
 if (!carousel) return;
 const slides = [...carousel.querySelectorAll('.founder-slide')];
 const controls = carousel.querySelector('.founder-controls');
 const dotsHost = carousel.querySelector('.founder-dots');
 const live = carousel.querySelector('.founder-live');
 let active = 0, touchStart = null;
 const dots = [];
 function show(index, announce = true) {
  active = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
   slide.hidden = i !== active;
   slide.setAttribute('aria-label', (i + 1) + ' de ' + slides.length);
  });
  dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === active)));
  if (announce) live.textContent = 'Foto ' + (active + 1) + ' de ' + slides.length;
 }
 if (slides.length > 1) {
  slides.forEach((slide, i) => {
   const button = document.createElement('button');
   button.type = 'button'; button.className = 'founder-dot';
   button.setAttribute('aria-label', 'Ver foto ' + (i + 1));
   button.addEventListener('click', () => show(i));
   dotsHost.append(button); dots.push(button);
  });
  controls.hidden = false;
  carousel.querySelectorAll('[data-direction]').forEach(button => button.addEventListener('click', () => show(active + Number(button.dataset.direction))));
  carousel.addEventListener('keydown', event => {
   if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault(); show(active + (event.key === 'ArrowRight' ? 1 : -1));
   }
  });
  const viewport = carousel.querySelector('.founder-viewport');
  viewport.addEventListener('touchstart', event => {touchStart = {x:event.touches[0].clientX, y:event.touches[0].clientY};}, {passive:true});
  viewport.addEventListener('touchend', event => {
   if (!touchStart) return;
   const dx=event.changedTouches[0].clientX-touchStart.x, dy=event.changedTouches[0].clientY-touchStart.y;
   if (Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)) show(active+(dx<0?1:-1));
   touchStart=null;
  }, {passive:true});
 } else {
  carousel.removeAttribute('tabindex');
 }
 show(0, false);
})();
