const btn = document.querySelector('.btnIncio');
const personagem = document.getElementById('personagem-run');
const frameImg = document.getElementById('frame-personagem');

// Navbar sobreposta: fundo no scroll e menu mobile acessível.
const heroHeader = document.getElementById('hero-header');
const navToggle = document.querySelector('.nav-toggle');
const heroMenu = document.getElementById('hero-menu');

const updateNavbar = () => heroHeader?.classList.toggle('scrolled', window.scrollY > 24);
updateNavbar();
window.addEventListener('scroll', updateNavbar, { passive: true });

navToggle?.addEventListener('click', () => {
  const opening = navToggle.getAttribute('aria-expanded') !== 'true';
  navToggle.setAttribute('aria-expanded', String(opening));
  navToggle.setAttribute('aria-label', opening ? 'Fechar menu' : 'Abrir menu');
  heroMenu?.classList.toggle('open', opening);
});

heroMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navToggle?.setAttribute('aria-expanded', 'false');
  navToggle?.setAttribute('aria-label', 'Abrir menu');
  heroMenu.classList.remove('open');
}));

// Coloque aqui os nomes dos seus arquivos de frame
const frames = [
    'assets/img/freams/correndo1.png',
    'assets/img/freams/correndo2.png',
    'assets/img/freams/correndo3.png',
    'assets/img/freams/correndo4.png',
    'assets/img/freams/correndo5.png',
    'assets/img/freams/correndo6.png',
    'assets/img/freams/correndo7.png',
];

btn?.addEventListener('click', () => {
    // Reseta a animação
    personagem.classList.remove('ativo');
    void personagem.offsetWidth; // força o reflow

    // Inicia
    personagem.classList.add('ativo');

    // Troca os frames (velocidade do sprite)
    let i = 0;
    const intervalo = setInterval(() => {
        frameImg.src = frames[i % frames.length];
        i++;
    }, 100); // 100ms por frame = ~10fps

    // Para quando a animação terminar
    personagem.addEventListener('animationend', () => {
        clearInterval(intervalo);
        personagem.classList.remove('ativo');
    }, { once: true });
});

// ===== Salão dos Legados =====
const projetos = [
  {
    titulo: 'Infinity Control',
    categoria: 'sistemas',
    categoriaLabel: 'Plataforma de Controle',
    descricao: 'O Infinity Control permite administrar remotamente os computadores de uma instituição de ensino por meio de uma interface web ou pelo terminal.',
    techs: ['Front:','React', 'Node', 'Vite','Back:', 'Python','FastAPI','SQLAlchemy'],
    impacto: 'alto',
    nivel: '05',
    icone: '&#8734;'
  },
  {
    titulo: 'Oráculo IA',
    categoria: 'automacoes',
    categoriaLabel: 'Automação Inteligente',
    descricao: 'Sistema de automação com IA para atendimento e tomada de decisões.',
    techs: ['Python', 'GPT', 'Flask', 'Docker'],
    impacto: 'alto',
    nivel: '04',
    icone: '&#11041;'
  },
  {
    titulo: 'Forge System',
    categoria: 'automacoes',
    categoriaLabel: 'Automação Industrial',
    descricao: 'Sistema completo para gestão e automação de processos empresariais.',
    techs: ['Python', 'SQL', 'Django', 'Redis'],
    impacto: 'extremo',
    nivel: '05',
    icone: '&#9881;'
  },
  {
    titulo: 'Lumen Design',
    categoria: 'design',
    categoriaLabel: 'Experiência & UI/UX',
    descricao: 'Design de interfaces centradas em experiência, estética e performance.',
    techs: ['Figma', 'PS', 'AE', 'CSS'],
    impacto: 'alto',
    nivel: '04',
    icone: '&#10000;'
  },
  {
    titulo: 'DevWizard Portfolio',
    categoria: 'design',
    categoriaLabel: 'Portfolio Pessoal',
    descricao: 'Portfolio temático com animações, RPG-style e identidade visual única.',
    techs: ['HTML', 'CSS', 'JS', 'Bootstrap'],
    impacto: 'alto',
    nivel: '03',
    icone: '&#9670;'
  },
  {
    titulo: 'Connect CNX',
    categoria: 'estrategia',
    categoriaLabel: 'Marketing Digital',
    descricao: 'Estratégia de crescimento orgânico e SEO para empresa de tecnologia.',
    techs: ['SEO', 'Analytics', 'ADS', 'CRO'],
    impacto: 'alto',
    nivel: '04',
    icone: '&#9826;'
  },
];

// Metadados editoriais: fáceis de substituir quando screenshots e URLs reais estiverem disponíveis.
const projectProfiles = [
  { id: 'nexus-vision', category: 'full-stack', phase: 'Legado', featured: true, year: '2026', role: 'Desenvolvimento Full-Stack', image: null, demo: null, github: null },
  { id: 'oraculo-ia', category: 'back-end', phase: 'Descoberta', featured: true, year: '2026', role: 'Arquitetura e Desenvolvimento', image: null, demo: null, github: null },
  { id: 'forge-system', category: 'back-end', phase: 'Construção', featured: true, year: '2025', role: 'Desenvolvimento Back-End', image: null, demo: null, github: null },
  { id: 'lumen-design', category: 'front-end', phase: 'Descoberta', featured: false, year: '2025', role: 'UI/UX e Front-End', image: null, demo: null, github: null },
  { id: 'devwizard-portfolio', category: 'front-end', phase: 'Construção', featured: false, year: '2026', role: 'Design e Desenvolvimento', image: null, demo: null, github: 'https://github.com/DevWizardMarcos/PortifolinoDev' },
  { id: 'connect-cnx', category: 'outros', phase: 'Legado', featured: false, year: '2025', role: 'Estratégia e Tecnologia', image: null, demo: null, github: null }
];

// Fonte central de projetos. Novas relíquias exigem alteração apenas neste array.
const projects = [
  { id:'savory', title:'Savory', image:'./assets/img/Projetos/Savory.png', shortDescription:'Experiência gastronômica digital para descoberta e exploração de receitas.', challenge:'Organizar a descoberta de receitas em uma experiência visual clara, convidativa e fácil de explorar.', construction:'A interface foi construída com foco na apresentação do conteúdo gastronômico, na hierarquia visual e na navegação responsiva.', legacy:'O projeto consolidou uma experiência digital com identidade própria para apresentar e explorar conteúdo gastronômico.', technologies:['React','Node','Chart.js','MongoDB'], contributions:['Interface','Responsividade'], category:'full-stack', categoryLabel:'Full-Stack', chapter:'Capítulo IV', phase:'Legado', year:2026, role:'Desenvolvimento Full-Stack', roleDescription:'Atuação no desenvolvimento da interface e da estrutura da experiência web.', accentColor:'#c69645', status:'completed', github:null, demo:null, featured:true, featuredOrder:1, icon:'&#8734;' },
  { id:'behorner-control', title:'Behorner-Control', image:'./assets/img/Projetos/BannerInfinityControl.png', shortDescription:'Automação com IA para atendimento e apoio à tomada de decisões.', challenge:'Centralizar o atendimento e transformar informações em apoio prático para decisões, sem tornar o fluxo mais complexo.', construction:'A solução combina uma aplicação web em Flask, recursos de IA e um ambiente conteinerizado para organizar o fluxo de atendimento.', legacy:'A estrutura criada estabelece uma base evolutiva para automatizar o atendimento e apoiar decisões com informações organizadas.', technologies:['Python','GPT','Flask','Docker'], contributions:['Arquitetura da solução','Integração com IA'], category:'back-end', categoryLabel:'Back-End', chapter:'Capítulo IV', phase:'Descoberta', year:2026, role:'Arquitetura e Desenvolvimento', roleDescription:'Responsável pela arquitetura da solução e pelo desenvolvimento de sua base técnica.', accentColor:'#a7333d', status:'development', github:null, demo:null, featured:true, featuredOrder:2, icon:'&#11041;' },
  { id:'forge-system', title:'Forge System', image:'./assets/img/Projetos/Hacktohon.png', shortDescription:'Gestão e automação de processos empresariais em uma única plataforma.', challenge:'Reunir fluxos de gestão e automação empresarial em um ambiente único e mais fácil de acompanhar.', construction:'Os processos foram estruturados em uma aplicação Django, com persistência em SQL e suporte do Redis ao processamento.', legacy:'O projeto deixou uma base centralizada para organizar processos empresariais e permitir a evolução da automação.', technologies:['Python','SQL','Django','Redis'], contributions:['Lógica de servidor','Organização dos dados'], category:'back-end', categoryLabel:'Back-End', chapter:'Capítulo IV', phase:'Construção', year:2025, role:'Desenvolvimento Back-End', roleDescription:'Atuação na construção da lógica de servidor e na organização dos dados da plataforma.', accentColor:'#7254a8', status:'development', github:null, demo:null, featured:true, featuredOrder:3, icon:'&#9881;' },
  { id:'lumen-design', title:'Lumen Design', image:null, shortDescription:'Interfaces centradas em experiência, estética e performance.', challenge:'Equilibrar identidade visual, clareza de uso e desempenho em experiências digitais consistentes.', solution:'A abordagem reúne prototipação e implementação visual para criar interfaces coerentes em diferentes telas.', technologies:['Figma','Photoshop','After Effects','CSS'], technicalHighlights:['Prototipação de interface','Layout responsivo'], category:'front-end', categoryLabel:'Experiência & UI/UX', phase:'Descoberta', year:2025, role:'UI/UX e Front-End', roleDescription:'Responsável pela experiência visual e pela implementação das interfaces.', status:'coming-soon', github:null, demo:null, featured:false, featuredOrder:null, icon:'&#10000;' },
  { id:'devwizard-portfolio', title:'DevWizard Portfolio', image:null, shortDescription:'Portfólio dark fantasy com narrativa, acessibilidade e identidade própria.', challenge:'Apresentar trajetória e projetos de forma memorável sem comprometer clareza, navegação e acessibilidade.', solution:'O portfólio usa uma narrativa RPG como camada editorial sobre uma estrutura web responsiva e acessível.', technologies:['HTML','CSS','JavaScript','Bootstrap'], contributions:['Direção visual','Construção da interface','Responsividade','Acessibilidade'], technicalHighlights:['Componentes orientados por dados','Interações com JavaScript nativo'], category:'front-end', categoryLabel:'Portfólio Pessoal', phase:'Construção', year:2026, role:'Design e Desenvolvimento', roleDescription:'Responsável pela concepção visual, desenvolvimento front-end e experiência de navegação.', status:'development', github:'https://github.com/DevWizardMarcos/PortifolinoDev', demo:null, featured:false, featuredOrder:null, icon:'&#9670;' },
  { id:'connect-cnx', title:'Connect CNX', image:null, shortDescription:'Estratégia digital focada em crescimento orgânico e presença online.', challenge:'Fortalecer a presença digital da empresa e criar caminhos mensuráveis para o crescimento orgânico.', solution:'A estratégia integra SEO, análise de métricas e otimização de conversão para orientar as ações digitais.', technologies:['SEO','Analytics','Ads','CRO'], technicalHighlights:['Análise de métricas','Otimização de conversão'], category:'outros', categoryLabel:'Marketing Digital', phase:'Legado', year:2025, role:'Estratégia e Tecnologia', roleDescription:'Atuação na estratégia digital e no uso de tecnologia para acompanhar os resultados.', status:'completed', github:null, demo:null, featured:false, featuredOrder:null, icon:'&#9826;' }
];

const reliquias = projects;
const INITIAL_VISIBLE = 6;
const LOAD_MORE_AMOUNT = 6;
let activeRelicFilter = 'todos';
let visibleRelicCount = INITIAL_VISIBLE;

function projectImage(project, featured = false) {
  if (project.image) {
    return `<img src="${project.image}" alt="Screenshot do projeto ${project.title}" loading="lazy">`;
  }
  return `<div class="relic-placeholder" role="img" aria-label="Screenshot de ${project.title} ainda não disponível">
    <span class="placeholder-symbol" aria-hidden="true">${project.icon}</span>
    <span>Imagem do projeto em preparação</span>
  </div>`;
}

function projectActions(project, featured = false) {
  const demo = project.demo
    ? `<a href="${project.demo}" target="_blank" rel="noopener noreferrer">Explorar legado <span aria-hidden="true">→</span></a>`
    : `<span class="relic-action unavailable">Demonstração em breve</span>`;
  const github = project.github
    ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" aria-label="Ver código de ${project.title} no GitHub">GitHub <span aria-hidden="true">↗</span></a>`
    : '';
  return `<div class="relic-actions ${featured ? 'featured-actions' : ''}">${demo}${github}</div>`;
}

function renderShowcase() {
  const container = document.getElementById('relic-showcase');
  if (!container) return;
  const featuredProjects = reliquias.filter(project => project.featured).sort((a,b) => a.featuredOrder - b.featuredOrder).slice(0,5);
  container.dataset.count = String(featuredProjects.length);
  container.innerHTML = featuredProjects.map((project, index) => `
    <article class="display-relic ${project.featuredOrder === 1 ? 'primary-relic' : ''}" style="--artifact-accent:${project.accentColor || '#b9934c'}">
      <header><span>${project.featuredOrder === 1 ? 'Relíquia Principal' : `Relíquia ${String(project.featuredOrder).padStart(2,'0')}`}</span><h4>${project.title}</h4></header>
      <div class="artifact-wrap">
        <div class="artifact-image">${projectImage(project)}</div>
        <div class="artifact-details">
          <p>${project.shortDescription}</p>
          <div class="relic-techs">${project.technologies.map(tech => `<span>${tech}</span>`).join('')}</div>
          <button class="examine-relic" type="button" data-project="${project.id}">Examinar relíquia <span aria-hidden="true">→</span></button>
        </div>
      </div>
      <div class="relic-pedestal" aria-hidden="true"><i></i></div>
      <footer><span>${project.categoryLabel}</span><b>${project.year}</b></footer>
    </article>`).join('');
  observeHallRelics(container);
}

function observeHallRelics(container) {
  const relics = container.querySelectorAll('.display-relic');
  if (!('IntersectionObserver' in window)) {
    relics.forEach(relic => relic.classList.add('is-revealed'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: .22, rootMargin: '0px 0px -8% 0px' });
  relics.forEach(relic => observer.observe(relic));
}

// Profundidade progressiva do Salão, sem parallax pesado ou dependências.
const legacyHall = document.getElementById('Salao');
const legacyApproach = document.getElementById('exposicao-legados');
let hallFramePending = false;

function updateHallDepth() {
  hallFramePending = false;
  if (!legacyHall || !legacyApproach) return;
  const viewport = window.innerHeight || 1;
  const hallRect = legacyHall.getBoundingClientRect();
  const approachRect = legacyApproach.getBoundingClientRect();
  const entryProgress = Math.min(1, Math.max(0, -hallRect.top / viewport));
  const approachRange = Math.max(viewport, approachRect.height - viewport * .45);
  const approachProgress = Math.min(1, Math.max(0, (viewport * .72 - approachRect.top) / approachRange));
  legacyHall.style.setProperty('--entry-progress', entryProgress.toFixed(3));
  legacyHall.style.setProperty('--approach-progress', approachProgress.toFixed(3));
}

function requestHallDepthUpdate() {
  if (hallFramePending) return;
  hallFramePending = true;
  requestAnimationFrame(updateHallDepth);
}

window.addEventListener('scroll', requestHallDepthUpdate, { passive: true });
window.addEventListener('resize', requestHallDepthUpdate, { passive: true });
requestHallDepthUpdate();

function renderCards(filtro) {
  const grade = document.getElementById('relic-grid');
  if (!grade) return;

  const filteredProjects = reliquias.filter(project => !project.featured && (filtro === 'todos' || project.category === filtro));
  const visibleProjects = filteredProjects.slice(0, visibleRelicCount);
  const loadMoreButton = document.querySelector('.load-more-relics');

  grade.innerHTML = visibleProjects.length ? visibleProjects.map(project => `
    <article class="relic-card" data-category="${project.category}">
      <div class="relic-visual">${projectImage(project)}</div>
      <div class="relic-content">
        <span class="journey-phase">◇ Fase: ${project.phase}</span>
        <h4>${project.title}</h4>
        <span class="relic-category">${project.categoryLabel}</span>
        <p>${project.shortDescription}</p>
        <div class="relic-techs">${project.technologies.map(tech => `<span>${tech}</span>`).join('')}</div>
        <button class="examine-relic archive-examine" type="button" data-project="${project.id}">Examinar <span aria-hidden="true">→</span></button>
      </div>
    </article>
  `).join('') : '<p class="empty-relics">Nenhuma relíquia encontrada nesta categoria.</p>';
  if (loadMoreButton) {
    const hasMore = visibleRelicCount < filteredProjects.length;
    loadMoreButton.hidden = !hasMore;
    loadMoreButton.setAttribute('aria-label', `Mostrar mais ${Math.min(LOAD_MORE_AMOUNT, filteredProjects.length - visibleRelicCount)} projetos`);
  }
}

renderShowcase();
renderCards('todos');

document.querySelector('.relic-filters')?.addEventListener('click', (e) => {
  const btn = e.target.closest('.relic-filter');
  if (!btn) return;
  activeRelicFilter = btn.dataset.filter;
  visibleRelicCount = INITIAL_VISIBLE;
  document.querySelectorAll('.relic-filter').forEach(button => {
    const active = button === btn;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  renderCards(btn.dataset.filter);
});

document.querySelector('.load-more-relics')?.addEventListener('click', () => {
  visibleRelicCount += LOAD_MORE_AMOUNT;
  renderCards(activeRelicFilter);
});

// Revelação progressiva do arquivo completo.
const discoverButton = document.querySelector('.discover-legacies');
const relicLibrary = document.getElementById('reliquias');
discoverButton?.addEventListener('click', () => {
  const opening = relicLibrary?.hasAttribute('hidden');
  if (!relicLibrary) return;
  relicLibrary.toggleAttribute('hidden', !opening);
  discoverButton.setAttribute('aria-expanded', String(opening));
  const portalAction = discoverButton.querySelector('small');
  if (portalAction) portalAction.textContent = opening ? 'Fechar o arquivo' : 'Atravessar o portal';
  if (opening) relicLibrary.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Painel nativo e acessível para detalhes das relíquias.
const relicDialog = document.getElementById('relic-dialog');
const dialogContent = document.getElementById('relic-dialog-content');
let relicDialogTrigger = null;

const projectStatus = {
  development: 'Em desenvolvimento',
  completed: 'Projeto concluído',
  'coming-soon': 'Demonstração em preparação'
};

function renderList(items, className) {
  if (!items?.length) return '';
  return `<ul class="${className}">${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
}

function closeRelicDetails() {
  if (!relicDialog?.open || relicDialog.classList.contains('is-closing')) return;
  relicDialog.classList.add('is-closing');
  window.setTimeout(() => relicDialog.close(), 220);
}

function openRelicDetails(projectId) {
  const project = reliquias.find(item => item.id === projectId);
  if (!project || !relicDialog || !dialogContent) return;
  const relicNumber = project.featuredOrder || reliquias.findIndex(item => item.id === project.id) + 1;
  const statusLabel = projectStatus[project.status] || project.status;
  const fragments = [
    project.challenge && { id:'challenge', label:'Desafio', content:project.challenge },
    (project.construction || project.solution) && { id:'construction', label:'Construção', content:project.construction || project.solution },
    project.legacy && { id:'legacy', label:'Legado', content:project.legacy }
  ].filter(Boolean);
  const fragmentTabs = fragments.map((fragment, index) => `<button id="fragment-tab-${fragment.id}" class="fragment-tab" type="button" role="tab" aria-selected="${index === 0}" aria-controls="fragment-panel" tabindex="${index === 0 ? '0' : '-1'}" data-fragment="${fragment.id}"><span aria-hidden="true">${index === 0 ? '◆' : '◇'}</span>${fragment.label}</button>`).join('');
  const fragmentData = Object.fromEntries(fragments.map(fragment => [fragment.id, fragment.content]));
  const actions = [
    project.demo ? `<a class="dialog-action primary" href="${project.demo}" target="_blank" rel="noopener noreferrer" aria-label="Abrir demonstração do projeto ${project.title}">Acessar relíquia <span aria-hidden="true">↗</span></a>` : '',
    project.github ? `<a class="dialog-action secondary" href="${project.github}" target="_blank" rel="noopener noreferrer" aria-label="Ver código do projeto ${project.title} no GitHub">Consultar código <span aria-hidden="true">↗</span></a>` : ''
  ].filter(Boolean).join('');

  relicDialog.style.setProperty('--relic-accent', project.accentColor || '#b9934c');
  dialogContent.innerHTML = `
    <header class="dialog-header relic-examination-header">
      <span class="dialog-eyebrow">Relíquia ${String(relicNumber).padStart(2,'0')} <i>·</i> ${project.chapter || 'Capítulo IV'} <i>·</i> ${project.year}</span>
      <h3 id="dialog-title">${project.title}</h3>
      <p>${project.shortDescription}</p>
      <div class="dialog-meta"><span>◆ ${project.categoryLabel}</span><i>·</i><span>${statusLabel}</span></div>
    </header>
    <figure class="dialog-project-image">${projectImage(project)}</figure>
    <div class="relic-seal" aria-hidden="true"><span>◆</span><small>Selo da relíquia</small></div>
    ${fragments.length ? `<section class="relic-fragments" data-fragments='${JSON.stringify(fragmentData)}'><h4>Examinar a relíquia</h4><div class="fragment-tabs" role="tablist" aria-label="Fragmentos da jornada">${fragmentTabs}</div><div id="fragment-panel" class="fragment-panel" role="tabpanel" tabindex="0" aria-labelledby="fragment-tab-${fragments[0].id}"><p>${fragments[0].content}</p></div></section>` : ''}
    <div class="dialog-mission">
      <section class="dialog-role"><h4>Papel na missão</h4><strong>${project.role}</strong>${project.roleDescription ? `<p>${project.roleDescription}</p>` : ''}${project.contributions?.length ? renderList(project.contributions, 'dialog-list') : ''}</section>
      ${project.technologies?.length ? `<section class="dialog-technologies"><h4>Artefatos utilizados</h4><div class="relic-techs">${project.technologies.map(tech => `<span>${tech}</span>`).join('')}</div></section>` : ''}
    </div>
    ${actions ? `<nav class="dialog-actions" aria-label="Ações do projeto">${actions}</nav>` : ''}
    <footer class="dialog-footer"><span>Registro da jornada</span></footer>`;
  relicDialogTrigger = document.activeElement;
  relicDialog.showModal();
  relicDialog.scrollTop = 0;
  relicDialog.focus();
}

dialogContent?.addEventListener('click', event => {
  const tab = event.target.closest('.fragment-tab');
  if (!tab) return;
  activateFragment(tab);
});

dialogContent?.addEventListener('keydown', event => {
  const tab = event.target.closest('.fragment-tab');
  if (!tab || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
  const tabs = [...dialogContent.querySelectorAll('.fragment-tab')];
  const current = tabs.indexOf(tab);
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  event.preventDefault();
  tabs[next].focus();
  activateFragment(tabs[next]);
});

function activateFragment(tab) {
  const section = tab.closest('.relic-fragments');
  const panel = section?.querySelector('.fragment-panel');
  if (!panel) return;
  const fragments = JSON.parse(section.dataset.fragments);
  section.querySelectorAll('.fragment-tab').forEach(item => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
    item.querySelector('span').textContent = active ? '◆' : '◇';
  });
  panel.classList.remove('is-changing');
  void panel.offsetWidth;
  panel.innerHTML = `<p>${fragments[tab.dataset.fragment]}</p>`;
  panel.setAttribute('aria-labelledby', tab.id);
  panel.classList.add('is-changing');
}

document.getElementById('Salao')?.addEventListener('click', event => {
  const trigger = event.target.closest('.examine-relic');
  if (trigger) openRelicDetails(trigger.dataset.project);
});
document.querySelector('.dialog-close')?.addEventListener('click', closeRelicDetails);
relicDialog?.addEventListener('click', event => { if (event.target === relicDialog) closeRelicDetails(); });
relicDialog?.addEventListener('cancel', event => { event.preventDefault(); closeRelicDetails(); });
relicDialog?.addEventListener('close', () => {
  relicDialog.classList.remove('is-closing');
  relicDialogTrigger?.focus();
  relicDialogTrigger = null;
});
