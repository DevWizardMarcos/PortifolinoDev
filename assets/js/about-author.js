// Aprimoramento progressivo: sem JavaScript, a seção permanece visível.
(() => {
  const section = document.querySelector('.author-section');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!section || reducedMotion.matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    section.classList.remove('is-entering');
    observer.disconnect();
  }, { threshold: 0.12 });
  section.classList.add('is-entering');
  observer.observe(section);
  reducedMotion.addEventListener('change', event => {
    if (!event.matches) return;
    section.classList.remove('is-entering');
    observer.disconnect();
  });
})();

// A máscara fica imóvel; o wrapper interno pode receber camadas no futuro.
(() => {
  const viewport = document.querySelector('[data-author-parallax]');
  if (!viewport) return;
  const enabled = window.matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const maxOffset = 5;
  let listeners;
  let bounds;
  let frame = 0;
  let x = 0;
  let y = 0;

  function reset() {
    cancelAnimationFrame(frame);
    frame = 0;
    bounds = null;
    viewport.classList.remove('is-parallax-active');
    viewport.style.removeProperty('--parallax-x');
    viewport.style.removeProperty('--parallax-y');
  }

  function move(event) {
    if (event.pointerType !== 'mouse') return;
    bounds ||= viewport.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const normalize = value => Math.max(-1, Math.min(1, value));
    x = normalize((event.clientX - bounds.left) / bounds.width * 2 - 1);
    y = normalize((event.clientY - bounds.top) / bounds.height * 2 - 1);
    viewport.classList.add('is-parallax-active');
    if (frame) return;
    frame = requestAnimationFrame(() => {
      viewport.style.setProperty('--parallax-x', `${(x * maxOffset).toFixed(2)}px`);
      viewport.style.setProperty('--parallax-y', `${(y * maxOffset).toFixed(2)}px`);
      frame = 0;
    });
  }

  function configure() {
    listeners?.abort();
    reset();
    if (!enabled.matches) return;
    listeners = new AbortController();
    const options = { signal: listeners.signal, passive: true };
    viewport.addEventListener('pointerenter', move, options);
    viewport.addEventListener('pointermove', move, options);
    viewport.addEventListener('pointerleave', reset, options);
    viewport.addEventListener('pointercancel', reset, options);
    window.addEventListener('scroll', reset, options);
    window.addEventListener('resize', reset, options);
    window.addEventListener('blur', reset, options);
    document.addEventListener('visibilitychange', reset, options);
  }
  enabled.addEventListener('change', configure);
  configure();
})();
