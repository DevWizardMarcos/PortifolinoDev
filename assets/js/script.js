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
    titulo: 'Nexus Vision',
    categoria: 'sistemas',
    categoriaLabel: 'Plataforma Analítica',
    descricao: 'Dashboard inteligente para visualização e análise de dados em tempo real.',
    techs: ['React', 'Node', 'Chart.js', 'MongoDB'],
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
  { id:'nexus-vision', title:'Nexus Vision', image:null, shortDescription:'Dashboard inteligente para visualização e análise de dados em tempo real.', description:'Dashboard inteligente para visualização e análise de dados em tempo real.', technologies:['React','Node','Chart.js','MongoDB'], category:'full-stack', categoryLabel:'Plataforma Analítica', phase:'Legado', year:2026, role:'Desenvolvimento Full-Stack', github:null, demo:null, featured:true, featuredOrder:1, icon:'&#8734;' },
  { id:'oraculo-ia', title:'Oráculo IA', image:null, shortDescription:'Automação com IA para atendimento e apoio à tomada de decisões.', description:'Sistema de automação com IA para atendimento e tomada de decisões.', technologies:['Python','GPT','Flask','Docker'], category:'back-end', categoryLabel:'Automação Inteligente', phase:'Descoberta', year:2026, role:'Arquitetura e Desenvolvimento', github:null, demo:null, featured:true, featuredOrder:2, icon:'&#11041;' },
  { id:'forge-system', title:'Forge System', image:null, shortDescription:'Gestão e automação de processos empresariais em uma única plataforma.', description:'Sistema completo para gestão e automação de processos empresariais.', technologies:['Python','SQL','Django','Redis'], category:'back-end', categoryLabel:'Automação Industrial', phase:'Construção', year:2025, role:'Desenvolvimento Back-End', github:null, demo:null, featured:true, featuredOrder:3, icon:'&#9881;' },
  { id:'lumen-design', title:'Lumen Design', image:null, shortDescription:'Interfaces centradas em experiência, estética e performance.', description:'Design de interfaces centradas em experiência, estética e performance.', technologies:['Figma','Photoshop','After Effects','CSS'], category:'front-end', categoryLabel:'Experiência & UI/UX', phase:'Descoberta', year:2025, role:'UI/UX e Front-End', github:null, demo:null, featured:false, featuredOrder:null, icon:'&#10000;' },
  { id:'devwizard-portfolio', title:'DevWizard Portfolio', image:null, shortDescription:'Portfólio dark fantasy com narrativa, acessibilidade e identidade própria.', description:'Portfólio temático com animações, narrativa RPG e identidade visual única.', technologies:['HTML','CSS','JavaScript','Bootstrap'], category:'front-end', categoryLabel:'Portfólio Pessoal', phase:'Construção', year:2026, role:'Design e Desenvolvimento', github:'https://github.com/DevWizardMarcos/PortifolinoDev', demo:null, featured:false, featuredOrder:null, icon:'&#9670;' },
  { id:'connect-cnx', title:'Connect CNX', image:null, shortDescription:'Estratégia digital focada em crescimento orgânico e presença online.', description:'Estratégia de crescimento orgânico e SEO para empresa de tecnologia.', technologies:['SEO','Analytics','Ads','CRO'], category:'outros', categoryLabel:'Marketing Digital', phase:'Legado', year:2025, role:'Estratégia e Tecnologia', github:null, demo:null, featured:false, featuredOrder:null, icon:'&#9826;' }
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
    <article class="display-relic ${project.featuredOrder === 1 ? 'primary-relic' : ''}">
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
}

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
  discoverButton.querySelector('span').textContent = opening ? 'Ocultar arquivo dos legados' : 'Descobrir todos os legados';
  if (opening) relicLibrary.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Painel nativo e acessível para detalhes das relíquias.
const relicDialog = document.getElementById('relic-dialog');
const dialogContent = document.getElementById('relic-dialog-content');

function openRelicDetails(projectId) {
  const project = reliquias.find(item => item.id === projectId);
  if (!project || !relicDialog || !dialogContent) return;
  dialogContent.innerHTML = `
    <span class="journey-phase">◇ Fase: ${project.phase}</span>
    <h3 id="dialog-title">${project.title}</h3>
    <div class="dialog-project-image">${projectImage(project)}</div>
    <div class="dialog-story"><div><h4>O desafio</h4><p>${project.description}</p></div><div><h4>A solução</h4><p>Uma experiência criada para unir clareza, desempenho e uma apresentação coerente com o objetivo do projeto.</p></div></div>
    <div class="dialog-role"><span>Meu papel</span><strong>${project.role}</strong></div>
    <div class="relic-techs">${project.technologies.map(tech => `<span>${tech}</span>`).join('')}</div>
    ${projectActions(project, true)}`;
  relicDialog.showModal();
}

document.getElementById('Salao')?.addEventListener('click', event => {
  const trigger = event.target.closest('.examine-relic');
  if (trigger) openRelicDetails(trigger.dataset.project);
});
document.querySelector('.dialog-close')?.addEventListener('click', () => relicDialog?.close());
relicDialog?.addEventListener('click', event => { if (event.target === relicDialog) relicDialog.close(); });
