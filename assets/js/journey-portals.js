// Minha Jornada — Os Portais do Tempo.
// Aprimoramento progressivo: sem JavaScript, os portais são âncoras e todos os capítulos ficam visíveis.
// Com JavaScript, um capítulo por vez abre no palco, com animação de ativação via Web Animations API
// (a mesma base usada pelo Motion), sem dependências, sem travar o scroll e sem recarregar a página.
(() => {
  const section = document.getElementById('jornada');
  const stage = section?.querySelector('.journey-stage');
  if (!section || !stage) return;

  const gates = [...section.querySelectorAll('[data-journey-gate]')];
  const chapters = gates.map(gate => document.getElementById(gate.hash.slice(1)));
  if (!gates.length || chapters.some(chapter => !chapter)) return;

  const controls = stage.querySelector('.journey-stage__controls');
  const stepButtons = [...stage.querySelectorAll('[data-journey-step]')];
  const closeButton = stage.querySelector('[data-journey-close]');
  const status = stage.querySelector('.journey-stage__status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canAnimate = () => !reducedMotion.matches && typeof Element.prototype.animate === 'function';

  let activeIndex = -1;
  let busy = false;

  const gateLabel = index => {
    const gate = gates[index];
    return `${gate.querySelector('.journey-gate__year').textContent} · ${gate.querySelector('.journey-gate__title').textContent}`;
  };

  // Estado inicial aprimorado.
  section.classList.add('is-enhanced');
  chapters.forEach(chapter => { chapter.hidden = true; });
  controls.hidden = true;
  gates.forEach((gate, index) => {
    gate.setAttribute('role', 'button');
    gate.setAttribute('aria-controls', chapters[index].id);
    gate.setAttribute('aria-expanded', 'false');
    gate.setAttribute('aria-label', `Abrir o portal ${gateLabel(index)}`);
    gate.tabIndex = index === 0 ? 0 : -1;
  });

  function setRovingFocus(index, focus = false) {
    gates.forEach((gate, i) => { gate.tabIndex = i === index ? 0 : -1; });
    if (focus) gates[index].focus();
  }

  function setHash(hash) {
    if (location.hash === hash) return;
    try { history.replaceState(null, '', hash); } catch { /* file:// ou sandbox */ }
  }

  function scrollStageIntoView() {
    const top = stage.getBoundingClientRect().top;
    if (top > 80 && top < window.innerHeight * 0.55) return;
    stage.scrollIntoView({ behavior: canAnimate() ? 'smooth' : 'auto', block: 'start' });
  }

  // Ativação do arco: o vórtice se expande, as runas brilham e o arco pulsa.
  function playActivation(gate) {
    if (!canAnimate()) return Promise.resolve();
    const arch = gate.querySelector('.journey-gate__arch');
    const vortex = gate.querySelector('.journey-gate__vortex');
    const opening = gate.querySelector('.journey-gate__opening');
    const easing = 'cubic-bezier(0.2, 0.7, 0.2, 1)';
    const animations = [
      vortex.animate(
        [{ transform: 'rotate(0turn) scale(0.6)', opacity: 0.3 }, { transform: 'rotate(0.75turn) scale(1.5)', opacity: 1 }, { transform: 'rotate(1turn) scale(1)', opacity: 0.85 }],
        { duration: 620, easing }
      ),
      opening.animate(
        [{ filter: 'brightness(1)' }, { filter: 'brightness(2.1)' }, { filter: 'brightness(1)' }],
        { duration: 620, easing: 'ease-out' }
      ),
    ];
    // Nas artes em camadas, a moldura de pedra permanece imóvel.
    // O pulso do clique acontece apenas na energia dentro do arco.
    if (!arch.classList.contains('journey-gate__arch--art')) {
      animations.unshift(arch.animate(
        [{ transform: 'translateY(-4px) scale(1)' }, { transform: 'translateY(-8px) scale(1.06)' }, { transform: 'translateY(-4px) scale(1)' }],
        { duration: 620, easing }
      ));
    }
    return Promise.all(animations.map(animation => animation.finished)).catch(() => {});
  }

  function revealChapter(chapter) {
    if (!canAnimate()) return;
    chapter.animate(
      [{ opacity: 0, transform: 'translateY(18px) scale(0.985)' }, { opacity: 1, transform: 'none' }],
      { duration: 420, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' }
    );
  }

  function updateControls() {
    stepButtons.forEach(button => {
      const target = activeIndex + Number(button.dataset.journeyStep);
      const valid = target >= 0 && target < gates.length;
      button.disabled = !valid;
      const label = button.querySelector('[data-journey-step-label]');
      const direction = Number(button.dataset.journeyStep) < 0 ? 'Portal anterior' : 'Próximo portal';
      label.textContent = valid ? gateLabel(target) : direction;
      button.setAttribute('aria-label', valid ? `${direction}: ${gateLabel(target)}` : direction);
    });
  }

  async function openChapter(index, { animate = true, focus = true, scroll = true } = {}) {
    if (busy || index < 0 || index >= gates.length) return;
    busy = true;
    const gate = gates[index];
    const item = gate.closest('.journey-gate');

    gates.forEach((other, i) => {
      other.closest('.journey-gate').classList.toggle('is-active', i === index);
      other.setAttribute('aria-expanded', String(i === index));
    });
    setRovingFocus(index);
    if (animate) await playActivation(gate);

    chapters.forEach((chapter, i) => { chapter.hidden = i !== index; });
    stage.style.setProperty('--gate', item.style.getPropertyValue('--gate'));
    stage.style.setProperty('--gate-rgb', item.style.getPropertyValue('--gate-rgb'));
    controls.hidden = false;
    section.classList.add('has-open-chapter');
    activeIndex = index;
    updateControls();
    setHash(`#${chapters[index].id}`);
    status.textContent = `Portal ${gateLabel(index)} aberto.`;

    if (animate) revealChapter(chapters[index]);
    if (scroll) scrollStageIntoView();
    if (focus) chapters[index].querySelector('h3')?.focus({ preventScroll: true });
    busy = false;
  }

  function closeChapter({ focusGate = true } = {}) {
    if (activeIndex < 0) return;
    const index = activeIndex;
    chapters.forEach(chapter => { chapter.hidden = true; });
    gates.forEach(gate => {
      gate.closest('.journey-gate').classList.remove('is-active');
      gate.setAttribute('aria-expanded', 'false');
    });
    controls.hidden = true;
    section.classList.remove('has-open-chapter');
    activeIndex = -1;
    setHash('#jornada');
    status.textContent = 'Capítulo fechado.';
    if (focusGate) {
      setRovingFocus(index, true);
      const top = section.querySelector('.journey-gates').getBoundingClientRect().top;
      if (top < 0) section.querySelector('.journey-gates').scrollIntoView({ behavior: canAnimate() ? 'smooth' : 'auto', block: 'center' });
    }
  }

  // Mouse e toque.
  gates.forEach((gate, index) => {
    gate.addEventListener('click', event => {
      event.preventDefault();
      if (index === activeIndex) closeChapter();
      else openChapter(index);
    });
  });

  // Teclado nos portais: setas/Home/End movem o foco; Enter (nativo do link) e Espaço ativam.
  section.querySelector('.journey-gates').addEventListener('keydown', event => {
    const index = gates.indexOf(document.activeElement);
    if (index < 0) return;
    const keys = { ArrowRight: index + 1, ArrowDown: index + 1, ArrowLeft: index - 1, ArrowUp: index - 1, Home: 0, End: gates.length - 1 };
    if (event.key in keys) {
      event.preventDefault();
      setRovingFocus((keys[event.key] + gates.length) % gates.length, true);
    } else if (event.key === ' ') {
      event.preventDefault();
      gates[index].click();
    }
  });

  stepButtons.forEach(button => button.addEventListener('click', () => {
    openChapter(activeIndex + Number(button.dataset.journeyStep), { scroll: false });
  }));
  closeButton.addEventListener('click', () => closeChapter());

  // Esc fecha o capítulo aberto quando o foco está na seção.
  section.addEventListener('keydown', event => {
    if (event.key === 'Escape' && activeIndex >= 0) {
      event.preventDefault();
      closeChapter();
    }
  });

  // Links diretos (#capitulo-2024) abrem o capítulo correspondente, inclusive ao carregar a página.
  function openFromHash({ animate }) {
    const index = chapters.findIndex(chapter => `#${chapter.id}` === location.hash);
    if (index >= 0 && index !== activeIndex) openChapter(index, { animate, focus: false });
  }
  window.addEventListener('hashchange', () => openFromHash({ animate: true }));
  openFromHash({ animate: false });
})();
