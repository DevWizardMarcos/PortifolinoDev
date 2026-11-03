import { contactConfig } from './config.js';
import { createContactScene } from './scene.js';
import { setupContactForm } from './form.js';
import { setupContactScroll } from './scroll.js';

const section = document.querySelector('#contato');
if (section) {
  const links = section.querySelector('.contact-links');
  const github = document.querySelector('.social-links a[href*="github.com/"]');
  if (github) section.querySelector('[data-contact-github]').href = github.href;
  for (const [label, url] of [['LinkedIn', contactConfig.linkedin], ['Email', contactConfig.email && `mailto:${contactConfig.email}`]]) {
    if (!url) continue;
    const link = links.querySelector(`[data-contact-${label.toLowerCase()}]`) || document.createElement('a');
    link.textContent = label;
    link.href = url;
    links.append(link);
  }
  const scene = createContactScene(section);
  setupContactForm(section, scene);
  setupContactScroll(section, scene);
}
