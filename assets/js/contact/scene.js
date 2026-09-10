import { contactConfig } from './config.js';

export function createContactScene(section) {
  const desk = section.querySelector('.contact-desk');
  const feather = section.querySelector('.contact-feather');
  const pot = section.querySelector('.contact-inkpot');
  const owl = section.querySelector('.contact-owl');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let activeField = null, formStatus = 'idle', inked = false;
  let phase = 'rest', timers = [];

  // Preload real variants as layered images: opacity crossfades never flash empty.
  function layers(host, variants, initial) {
    Object.entries(variants).forEach(([state, src]) => {
      const img = new Image();
      img.alt = '';
      img.src = src;
      img.dataset.variant = state;
      img.classList.toggle('is-active', state === initial);
      host.append(img);
    });
    return state => {
      host.dataset.state = state;
      host.querySelectorAll('img').forEach(img =>
        img.classList.toggle('is-active', img.dataset.variant === state));
    };
  }
  const setOwl = layers(owl, contactConfig.assets.owl, 'idle');
  const setPot = layers(pot, contactConfig.assets.inkwell, 'closed');
  const setFeather = layers(feather, {
    normal: contactConfig.assets.feather, inked: contactConfig.assets.featherInked,
  }, 'normal');

  function owlState() {
    setOwl({ submitting: 'sending', success: 'success' }[formStatus]
      || (activeField ? 'watching' : 'idle'));
  }
  function position() {
    const origin = desk.getBoundingClientRect();
    const jar = pot.getBoundingClientRect();
    const w = feather.offsetWidth, h = feather.offsetHeight;
    // Image tips: normal (8%, 97%); inked (10%, 98%). Align the TIP, not its box.
    const tipX = w * (inked ? .10 : .08);
    const tipY = h * .97;
    let x = jar.left - origin.left + jar.width * .78;
    let y = jar.top - origin.top + jar.height * .67;
    if (phase === 'approach' || phase === 'dip') {
      x = jar.left - origin.left + jar.width * .42;
      y = jar.top - origin.top + jar.height * (phase === 'dip' ? .35 : .23);
    } else if (activeField && !reduced.matches) {
      const target = section.querySelector('[name="' + activeField + '"]');
      const rect = target.getBoundingClientRect();
      const featherPositions = {
        name: { x: .65, y: .75 }, email: { x: .65, y: .75 },
        subject: { x: .8, y: .75 }, message: { x: .8, y: .28 },
      };
      const anchor = featherPositions[activeField];
      x = rect.left - origin.left + rect.width * anchor.x;
      y = rect.top - origin.top + rect.height * anchor.y;
    }
    feather.style.setProperty('--feather-x', Math.max(0, Math.min(x - tipX, origin.width - w)) + 'px');
    feather.style.setProperty('--feather-y', (y - tipY) + 'px');
  }
  const later = (ms, fn) => timers.push(setTimeout(fn, ms));
  function finishInk() {
    inked = true;
    setFeather('inked');
    phase = 'field';
    feather.dataset.phase = phase;
    setPot(activeField ? 'open' : 'closed');
    position();
  }
  function startInk() {
    if (reduced.matches) { finishInk(); return; }
    phase = 'approach'; feather.dataset.phase = phase; position();
    later(250, () => { setPot('open'); });
    later(350, () => { phase = 'dip'; feather.dataset.phase = phase; position(); });
    later(500, () => { inked = true; setFeather('inked'); });
    later(600, finishInk); // + 300ms CSS travel to the most recently focused field.
  }
  function reset() {
    timers.forEach(clearTimeout); timers = [];
    activeField = null; inked = false; phase = 'rest'; formStatus = 'idle';
    section.dataset.status = 'idle';
    feather.dataset.phase = phase;
    feather.dataset.writing = 'false';
    setFeather('normal'); setPot('closed'); setOwl('idle'); position();
  }
  new ResizeObserver(position).observe(desk);
  reduced.addEventListener('change', () => {
    if (reduced.matches && (phase === 'approach' || phase === 'dip')) {
      timers.forEach(clearTimeout); timers = []; finishInk();
    }
    position();
  });
  return {
    reset,
    focus(field) {
      activeField = field;
      feather.dataset.writing = String(Boolean(field));
      owlState();
      if (field && !inked && phase === 'rest') startInk();
      else if (phase !== 'approach' && phase !== 'dip') {
        setPot(field ? 'open' : 'closed'); position();
      }
    },
    refresh: position,
    state(status) {
      formStatus = status; section.dataset.status = status; owlState();
    },
  };
}
