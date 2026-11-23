
(() => {
  const root = document.getElementById('a24Dynamic');
  const monitor = document.getElementById('a24Monitor');
  const state = document.getElementById('a24State');
  const widthLabel = document.getElementById('a24Width');
  const orientationLabel = document.getElementById('a24Orientation');
  const gridLabel = document.getElementById('a24Columns');
  const renderLabel = document.getElementById('a24Render');
  const grid = document.querySelector('.services-grid');
  if (!root || !grid) return;

  // Dados obtidos dos cards já existentes: mantém os valores do site.
  const services = [...grid.querySelectorAll('.service-card')].map((card,index) => ({
    id: String(index),
    name: card.querySelector('h3').textContent.trim(),
    price: card.querySelector('.price').textContent.trim(),
    description: card.querySelector('p').textContent.trim()
  }));
  if (!services.length) return;

  // Tópico 11: detecção das características da viewport, sem adivinhar aparelho.
  const largeScreen = window.matchMedia('(min-width: 768px)');
  const landscape = window.matchMedia('(orientation: landscape)');
  const demo = new URLSearchParams(window.location.search).get('atividade') === '1';
  monitor.hidden = !demo;
  document.documentElement.classList.toggle('a24-activity', demo);
  let selected = 0;
  let currentLayout = null;
  let disclosureOpen = false;
  let frame = null;

  function element(tag,className,text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function updateMonitor() {
    const isLarge = largeScreen.matches;
    state.textContent = isLarge ? 'Tela grande · Desktop' : 'Tela pequena · Mobile';
    state.dataset.large = String(isLarge);
    widthLabel.textContent = window.innerWidth + ' px';
    orientationLabel.textContent = landscape.matches ? 'Paisagem' : 'Retrato';
    gridLabel.textContent = isLarge ? '3 colunas' : '1 coluna';
    renderLabel.textContent = isLarge ? 'Painel aberto' : 'Seção expansível';
    document.documentElement.dataset.a24Screen = isLarge ? 'large' : 'small';
  }
  function updateSelection() {
    const service = services[selected];
    const summary = root.querySelector('[data-a24-summary]');
    if (!summary) return;
    const name = element('h4','',service.name);
    const price = element('p','a24-value',service.price);
    const action = element('a','btn btn-azul','Consultar pelo WhatsApp');
    action.href = 'https://wa.me/5511978128470?text=' + encodeURIComponent(
      'Olá! Tenho interesse em ' + service.name + ', anunciado no site por ' + service.price + '. Gostaria de confirmar as condições e consultar os horários para meu pet.'
    );
    action.target = '_blank';
    action.rel = 'noopener noreferrer';
    const note = element('small','','A equipe confirma as condições e a disponibilidade do atendimento.');
    summary.replaceChildren(name,price,action,note);
    root.querySelector('[data-a24-notice]').textContent = 'Selecionado: ' + service.name + ' — ' + service.price + '.';
  }
  // Tópico 12: muda a estrutura real do DOM ao cruzar o breakpoint.
  function renderComponent() {
    const isLarge = largeScreen.matches;
    if (currentLayout === isLarge) return;
    const hadFocus = root.contains(document.activeElement);
    currentLayout = isLarge;
    root.dataset.layout = isLarge ? 'desktop' : 'mobile';

    const layout = element('div','a24-booking-layout');
    const controls = element('div');
    if (isLarge) {
      const heading = element('h3','','Vamos escolher o próximo cuidado?');
      heading.id = 'a24BookingHeading';
      controls.append(heading,element('p','','Escolha um pacote e converse com a equipe para combinar seu horário.'));
    }
    const form = element('form');
    form.addEventListener('submit',event => event.preventDefault());
    const label = element('label','','Qual pacote você prefere?');
    label.htmlFor = 'a24ServiceSelect';
    const select = element('select');
    select.id = 'a24ServiceSelect';
    select.name = 'pacote';
    services.forEach((service,index) => {
      const option = element('option','',service.name + ' — ' + service.price);
      option.value = String(index);
      option.selected = index === selected;
      select.append(option);
    });
    select.addEventListener('change',() => {
      selected = Number(select.value);
      updateSelection();
    });
    form.append(label,select);
    controls.append(form,element('p','a24-booking-help','O contato é feito diretamente pelo WhatsApp do Pelos & Patas.'));
    const notice = element('p','a24-status-text');
    notice.dataset.a24Notice = '';
    notice.setAttribute('role','status');
    notice.setAttribute('aria-live','polite');
    controls.append(notice);
    const summary = element('div','a24-selection');
    summary.dataset.a24Summary = '';
    layout.append(controls,summary);

    let component;
    if (isLarge) {
      component = element('div');
      component.setAttribute('role','region');
      component.setAttribute('aria-labelledby','a24BookingHeading');
      component.append(layout);
    } else {
      component = element('details');
      component.open = disclosureOpen || hadFocus;
      const trigger = element('summary','','Escolha um pacote e agende');
      component.append(trigger,layout);
      component.addEventListener('toggle',() => {disclosureOpen = component.open;});
    }
    root.replaceChildren(component);
    updateSelection();
    // Mantém a seleção e o foco quando a pessoa redimensiona durante o uso.
    if (hadFocus) select.focus({preventScroll:true});
  }
  function sync() {
    updateMonitor();
    renderComponent();
  }
  largeScreen.addEventListener('change',sync);
  landscape.addEventListener('change',updateMonitor);
  window.addEventListener('resize',() => {
    if (frame !== null) return;
    frame = requestAnimationFrame(() => {
      frame = null;
      sync();
    });
  });
  sync();
})();
