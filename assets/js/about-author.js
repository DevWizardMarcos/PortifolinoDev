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

// "O personagem percebe a presença do visitante": olhos acompanham o cursor
// (um pouco mais que a arte), com parallax microscópico. Um único loop de
// requestAnimationFrame interpola tudo; só mouse, só desktop, nunca em reduced-motion.
(() => {
  const viewport = document.querySelector('[data-author-parallax]');
  const motion = viewport?.querySelector('.author-art-motion');
  const life = viewport?.querySelector('.author-art-life');
  if (!viewport || !motion || !life) return;
  const enabled = window.matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');

  const ART = { x: 3, y: 2 };            // deslocamento máximo da arte (px)
  const EYE = { x: 3.5, y: 1.6 };        // deslocamento máximo da íris (px)
  const GAZE = { x: 0.443, y: 0.322 };   // ponto entre os olhos, em fração da arte
  const FOLLOW_TAU = 190;                // ms: constante de tempo ao acompanhar
  const RETURN_TAU = 240;                // ms: ao voltar ao olhar original (~700ms para assentar)

  const target = { ax: 0, ay: 0, ex: 0, ey: 0 };
  const current = { ax: 0, ay: 0, ex: 0, ey: 0 };
  let listeners;
  let bounds = null;
  let frame = 0;
  let lastTime = 0;
  let tracking = false;

  const clamp = value => Math.max(-1, Math.min(1, value));
  // Resposta suave: pequenos desvios perto do rosto quase não registram.
  const soften = value => Math.sign(value) * Math.pow(Math.abs(value), 1.35);

  function paint() {
    motion.style.setProperty('--parallax-x', `${(current.ax * ART.x).toFixed(2)}px`);
    motion.style.setProperty('--parallax-y', `${(current.ay * ART.y).toFixed(2)}px`);
    life.style.setProperty('--eye-x', `${(current.ex * EYE.x).toFixed(2)}px`);
    life.style.setProperty('--eye-y', `${(current.ey * EYE.y).toFixed(2)}px`);
  }

  function tick(now) {
    const dt = Math.min(64, now - (lastTime || now));
    lastTime = now;
    const tau = tracking ? FOLLOW_TAU : RETURN_TAU;
    const k = 1 - Math.exp(-dt / tau);
    let settled = true;
    for (const key of Object.keys(current)) {
      current[key] += (target[key] - current[key]) * k;
      if (Math.abs(target[key] - current[key]) > 0.002) settled = false;
      else current[key] = target[key];
    }
    paint();
    frame = settled ? 0 : requestAnimationFrame(tick);
    if (settled) lastTime = 0;
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(tick);
  }

  function release() {
    tracking = false;
    bounds = null;
    viewport.classList.remove('is-parallax-active');
    target.ax = target.ay = target.ex = target.ey = 0;
    schedule();
  }

  function clear() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    tracking = false;
    bounds = null;
    viewport.classList.remove('is-parallax-active');
    for (const key of Object.keys(current)) current[key] = target[key] = 0;
    for (const name of ['--parallax-x', '--parallax-y']) motion.style.removeProperty(name);
    for (const name of ['--eye-x', '--eye-y']) life.style.removeProperty(name);
  }

  function move(event) {
    if (event.pointerType !== 'mouse') return;
    bounds ||= viewport.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const px = event.clientX - bounds.left;
    const py = event.clientY - bounds.top;
    target.ax = clamp(px / bounds.width * 2 - 1);
    target.ay = clamp(py / bounds.height * 2 - 1);
    // Os olhos medem o cursor a partir do próprio rosto, não do centro da arte.
    target.ex = soften(clamp((px - bounds.width * GAZE.x) / (bounds.width * 0.5)));
    target.ey = soften(clamp((py - bounds.height * GAZE.y) / (bounds.height * 0.38)));
    tracking = true;
    viewport.classList.add('is-parallax-active');
    schedule();
  }

  function configure() {
    listeners?.abort();
    clear();
    if (!enabled.matches) return;
    listeners = new AbortController();
    const options = { signal: listeners.signal, passive: true };
    viewport.addEventListener('pointerenter', move, options);
    viewport.addEventListener('pointermove', move, options);
    viewport.addEventListener('pointerleave', release, options);
    viewport.addEventListener('pointercancel', release, options);
    window.addEventListener('scroll', () => { bounds = null; }, options);
    window.addEventListener('resize', release, options);
    window.addEventListener('blur', clear, options);
    document.addEventListener('visibilitychange', () => { if (document.hidden) clear(); }, options);
  }
  enabled.addEventListener('change', configure);
  configure();
})();
