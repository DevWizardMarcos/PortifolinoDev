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
  // Mirror field typography so the nib follows wrapped text and the caret.
  const mirror = document.createElement('div');
  mirror.setAttribute('aria-hidden', 'true');
  mirror.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;left:-10000px;top:0;';
  section.append(mirror);
  function caretPosition(target) {
    const style = getComputedStyle(target);
    for (const key of ['font', 'letterSpacing', 'lineHeight', 'paddingTop',
      'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopWidth',
      'borderLeftWidth', 'borderRightWidth', 'borderBottomWidth', 'boxSizing']) {
      mirror.style[key] = style[key];
    }
    mirror.style.width = target.getBoundingClientRect().width + 'px';
    mirror.style.borderStyle = 'solid';
    mirror.style.whiteSpace = target.tagName === 'TEXTAREA' ? 'pre-wrap' : 'pre';
    mirror.style.overflowWrap = 'break-word';
    mirror.textContent = target.value.slice(0, target.selectionStart ?? target.value.length);
    const marker = document.createElement('span');
    marker.textContent = '\u200b';
    mirror.append(marker);
    const bounds = mirror.getBoundingClientRect(), caret = marker.getBoundingClientRect();
    return {
      x: Math.max(4, Math.min(target.clientWidth - 4, caret.left - bounds.left - target.scrollLeft)),
      y: Math.max(8, Math.min(target.clientHeight - 4, caret.top - bounds.top + parseFloat(style.fontSize) - target.scrollTop)),
    };
  }
  function position() {
    const origin = desk.getBoundingClientRect();
    const jar = pot.getBoundingClientRect();
    const w = feather.offsetWidth, h = feather.offsetHeight;
    // Image tips: normal (8%, 97%); inked (10%, 98%). Align the TIP, not its box.
    const tipX = w * (inked ? .10 : .08);
    const tipY = h * .97;
    let x = jar.left - origin.left + jar.width + 22;
    let y = jar.top - origin.top + jar.height * .67;
    if (phase === 'approach' || phase === 'dip' || phase === 'lift') {
      x = jar.left - origin.left + jar.width * .42;
      y = jar.top - origin.top + jar.height * (phase === 'dip' ? .38 : .19);
    } else if (activeField && !reduced.matches) {
      const target = section.querySelector('[name="' + activeField + '"]');
      const rect = target.getBoundingClientRect();
      const caret = caretPosition(target);
      x = rect.left - origin.left + caret.x;
      y = rect.top - origin.top + caret.y;
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
    setPot('open');
    later(450, () => { phase = 'dip'; feather.dataset.phase = phase; position(); });
    later(850, () => { inked = true; setFeather('inked'); });
    later(1000, () => { phase = 'lift'; feather.dataset.phase = phase; position(); });
    later(1400, finishInk);
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
  section.querySelectorAll('[data-contact-field]').forEach(field => {
    for (const event of ['input', 'click', 'keyup', 'select', 'scroll']) {
      field.addEventListener(event, () => { if (activeField === field.name) position(); });
    }
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches && (phase === 'approach' || phase === 'dip' || phase === 'lift')) {
      timers.forEach(clearTimeout); timers = []; finishInk();
    }
    position();
  });
  return {
    reset,
    focus(field) {
      activeField = field;
      feather.dataset.writing = String(Boolean(field) && formStatus === 'typing');
      owlState();
      if (field && !inked && phase === 'rest') startInk();
      else if (phase !== 'approach' && phase !== 'dip' && phase !== 'lift') {
        setPot(field ? 'open' : 'closed'); position();
      }
    },
    refresh: position,
    state(status) {
      formStatus = status; section.dataset.status = status; owlState();
      feather.dataset.writing = String(Boolean(activeField) && status === 'typing');
      position();
    },
  };
}
