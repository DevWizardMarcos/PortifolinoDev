// Visual state only. Form values and request state stay owned by form.js.
export function setupContactScroll(section, scene) {
  const trigger = section.querySelector('.contact-open');
  const content = section.querySelector('#contact-content');
  const close = section.querySelector('.contact-close');
  const paper = section.querySelector('.contact-parchment');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let contactState = 'closed';
  let timer;
  const state = next => { contactState = next; section.dataset.contactState = next; };
  const after = (duration, callback) => {
    clearTimeout(timer);
    if (reduced.matches) callback();
    else timer = setTimeout(callback, duration);
  };
  function finishOpen() {
    state('open');
    content.inert = false;
    trigger.hidden = true;
    // Focus the paper, not an input: no surprise mobile keyboard or active feather.
    paper.focus({ preventScroll: true });
  }
  function finishClose() {
    content.hidden = true;
    state('closed');
    trigger.disabled = false;
    trigger.removeAttribute('aria-hidden');
    trigger.focus({ preventScroll: true });
  }
  trigger.disabled = false;
  trigger.addEventListener('click', () => {
    if (contactState !== 'closed') return;
    trigger.disabled = true;
    trigger.setAttribute('aria-expanded', 'true');
    content.hidden = false;
    scene.reset();
    state('opening');
    // Paper 0–400ms, fields 400ms, feather/ink 500ms; owl only after open.
    after(900, finishOpen);
  });
  close.addEventListener('click', () => {
    if (contactState !== 'open' || section.dataset.status === 'submitting') return;
    scene.focus(null);
    content.inert = true;
    trigger.hidden = false;
    trigger.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    state('closing');
    after(650, finishClose);
  });
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    clearTimeout(timer);
    if (contactState === 'opening') finishOpen();
    else if (contactState === 'closing') finishClose();
  });
}
