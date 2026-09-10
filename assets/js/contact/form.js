// TEMPORÁRIO: demonstração da UX, sem rede, armazenamento ou envio de email.
// TODO: conectar backend real aqui. Substitua esta função pelo seu envio futuro.
export async function simulateContactSubmit() {
  await new Promise(resolve => setTimeout(resolve, 1800));
}

export function setupContactForm(section, scene) {
  const form = section.querySelector('form');
  const button = form.querySelector('button[type="submit"]');
  const buttonLabel = button.querySelector('[data-submit-label]');
  const close = section.querySelector('.contact-close');
  const feedback = section.querySelector('.contact-feedback');
  const fields = [...form.querySelectorAll('[data-contact-field]')];
  let status = 'idle', typingTimer, resetTimer;
  const setStatus = value => { status = value; scene.state(value); };
  function validate(field) {
    const value = field.value.trim();
    let error = '';
    if (field.name === 'name' && value.length < 2) error = 'Digite seu nome (pelo menos 2 caracteres).';
    if (field.name === 'email' && (!value || field.validity.typeMismatch)) error = 'Informe um email válido.';
    if (field.name === 'message' && value.length < 10) error = 'Escreva uma mensagem com pelo menos 10 caracteres.';
    if (field.maxLength > 0 && value.length > field.maxLength) error = `Use até ${field.maxLength} caracteres.`;
    field.setAttribute('aria-invalid', String(Boolean(error)));
    section.querySelector(`#${field.id}-error`).textContent = error;
    return !error;
  }
  fields.forEach(field => {
    field.addEventListener('focus', () => {
      if (status !== 'submitting') { clearTimeout(resetTimer); setStatus('idle'); }
      scene.focus(field.name);
      if (status === 'idle' || status === 'typing') scene.state(status);
    });
    field.addEventListener('blur', () => { validate(field); scene.focus(null); if (status === 'idle') scene.state(status); });
    field.addEventListener('input', () => {
      clearTimeout(resetTimer);
      clearTimeout(typingTimer);
      feedback.textContent = '';
      if (field.getAttribute('aria-invalid') === 'true') validate(field);
      setStatus('typing');
      typingTimer = setTimeout(() => setStatus('idle'), 650);
    });
  });
  form.noValidate = true;
  button.disabled = false;
  async function handleSubmit(event) {
    event.preventDefault();
    if (status === 'submitting') return;
    clearTimeout(typingTimer);
    clearTimeout(resetTimer);
    const valid = fields.map(validate).every(Boolean);
    if (!valid) { setStatus('error'); fields.find(field => field.getAttribute('aria-invalid') === 'true').focus(); return; }
    const payload = Object.fromEntries(new FormData(form));
    Object.keys(payload).forEach(key => payload[key] = payload[key].trim());
    setStatus('submitting');
    scene.focus(null);
    close.disabled = true;
    form.setAttribute('aria-busy', 'true');
    fields.forEach(field => field.readOnly = true);
    button.disabled = true;
    buttonLabel.textContent = 'Selando o pergaminho...';
    feedback.textContent = 'Preparando a carta…';
    try {
      await simulateContactSubmit(payload);
      scene.focus(null);
      setStatus('success');
      feedback.replaceChildren();
      const main = document.createElement('strong');
      main.textContent = 'Mensagem preparada com sucesso.';
      const detail = document.createElement('small');
      detail.textContent = 'A coruja está pronta para levá-la.';
      feedback.append(main, detail);
      resetTimer = setTimeout(() => { setStatus('idle'); feedback.textContent = ''; }, 7000);
    } catch {
      setStatus('error');
      feedback.textContent = 'Não foi possível preparar a carta. Tente novamente.';
    } finally {
      fields.forEach(field => field.readOnly = false);
      form.setAttribute('aria-busy', 'false');
      button.disabled = false;
      close.disabled = false;
      buttonLabel.textContent = 'Selar e enviar';
    }
  }
  form.addEventListener('submit', handleSubmit);
  section.querySelector('.contact-open').addEventListener('click', () => {
    clearTimeout(typingTimer); clearTimeout(resetTimer);
    status = 'idle'; feedback.textContent = '';
  });
}
