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
    titulo: 'Portifolio Alice',
    categoria: 'front',
    categoriaLabel: 'Experiência & UI/UX',
    descricao: 'Design de interfaces centradas em experiência, estética e performance.',
    techs: ['React', 'Vite', 'Node Js'],
    impacto: 'Medio',
    nivel: '03',
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
  {
    titulo: 'Starbucks',
    categoria: 'pessoal',
    categoriaLabel: 'Projeto Pessoal',
    descricao: 'Criando a Pagina do StartBucks',
    techs: ['Html', 'Css', 'JavaScript'],
    impacto: 'Medio',
    nivel: '03',
    icone: '&#9826;'
  },
  {
    titulo: 'Code Stone',
    categoria: 'pessoal',
    categoriaLabel: 'Projeto Pessoal',
    descricao: 'Criando a Pagina do StartBucks',
    techs: ['Html', 'Css', 'JavaScript'],
    impacto: 'Medio',
    nivel: '03',
    icone: '&#9826;'
  },
  {
    titulo: 'Deadpool',
    categoria: 'pessoal',
    categoriaLabel: 'Projeto Pessoal',
    descricao: 'Criando a Pagina do StartBucks',
    techs: ['Html', 'Css', 'JavaScript'],
    impacto: 'Medio',
    nivel: '03',
    icone: '&#9826;'
  },
  {
    titulo: 'Garimpo',
    categoria: 'pessoal',
    categoriaLabel: 'Projeto Pessoal',
    descricao: 'Criando a Pagina do StartBucks',
    techs: ['Html', 'Css', 'JavaScript'],
    impacto: 'Medio',
    nivel: '03',
    icone: '&#9826;'
  },
  {
    titulo: 'horizon',
    categoria: 'pessoal',
    categoriaLabel: 'Projeto Pessoal',
    descricao: 'Criando a Pagina do StartBucks',
    techs: ['Html', 'Css', 'JavaScript'],
    impacto: 'Medio',
    nivel: '03',
    icone: '&#9826;'
  },
  {
    titulo: 'infinity Open',
    categoria: 'pessoal',
    categoriaLabel: 'Projeto Pessoal',
    descricao: 'Criando a Pagina do StartBucks',
    techs: ['Html', 'Css', 'JavaScript'],
    impacto: 'Medio',
    nivel: '03',
    icone: '&#9826;'
  },
  {
    titulo: 'Porfilio Alice',
    categoria: 'pessoal',
    categoriaLabel: 'Projeto Pessoal',
    descricao: 'Criando a Pagina do StartBucks',
    techs: ['Html', 'Css', 'JavaScript'],
    impacto: 'Medio',
    nivel: '03',
    icone: '&#9826;'
  },
  {
    titulo: 'Porfilio Alice',
    categoria: 'pessoal',
    categoriaLabel: 'Projeto Pessoal',
    descricao: 'Criando a Pagina do StartBucks',
    techs: ['Html', 'Css', 'JavaScript'],
    impacto: 'Medio',
    nivel: '03',
    icone: '&#9826;'
  },
  {
    titulo: 'Wayne',
    categoria: 'pessoal',
    categoriaLabel: 'Projeto Pessoal',
    descricao: 'Criando a Pagina do StartBucks',
    techs: ['Html', 'Css', 'JavaScript'],
    impacto: 'Medio',
    nivel: '03',
    icone: '&#9826;'
  },
];

// Metadados editoriais: fáceis de substituir quando screenshots e URLs reais estiverem disponíveis.
const projectProfiles = [
  { id: 'savory', category: 'full-stack', phase: 'Legado', featured: true, year: '2026', role: 'Desenvolvimento Full-Stack', image: './assets/img/Projetos/Savory.png', demo: null, github: null },
  { id: 'behorner-control', category: 'full-stack', phase: 'Descoberta', featured: true, year: '2026', role: 'Arquitetura e Desenvolvimento', image: './assets/img/Projetos/BannerInfinityControl.png', demo: null, github: null },
  { id: 'Hacktohon', category: 'back-end', phase: 'Construção', featured: true, year: '2025', role: 'Desenvolvimento Back-End', image: './assets/img/Projetos/Hacktohon.png', demo: null, github: null },
  { id: 'Portifolio Alice', category: 'front-end', phase: 'Descoberta', featured: false, year: '2025', role: 'UI/UX e Front-End', image: './assets/img/Projetos/Portifolio_Alice.png', demo: null, github: null },
  { id: 'devwizard-portfolio', category: 'front-end', phase: 'Construção', featured: false, year: '2026', role: 'Design e Desenvolvimento', image: null, demo: null, github: 'https://github.com/DevWizardMarcos/PortifolinoDev' },
  { id: 'connect-cnx', category: 'outros', phase: 'Legado', featured: false, year: '2025', role: 'Estratégia e Tecnologia', image: null, demo: null, github: null },
  { id: 'starbucks', category: 'outros', phase: 'Legado', featured: false, year: '2025', role: 'Projeto Pessoal', image: './assets/img/Projetos/StartBucks.PNG', demo: null, github: null },
  { id: 'code-stone', category: 'front-end', phase: 'Construção', featured: false, year: '2025', role: 'Desenvolvimento Front-End', image: './assets/img/Projetos/CodeStone.png', demo: null, github: null },
  { id: 'deadpool', category: 'front-end', phase: 'Construção', featured: false, year: '2025', role: 'Desenvolvimento Front-End', image: './assets/img/Projetos/deadpoo.jpg', demo: null, github: null },
  { id: 'garimpo', category: 'front-end', phase: 'Construção', featured: false, year: '2025', role: 'Desenvolvimento Front-End', image: './assets/img/Projetos/garimpo.png', demo: null, github: null },
  { id: 'horizon', category: 'front-end', phase: 'Construção', featured: false, year: '2025', role: 'Desenvolvimento Front-End', image: './assets/img/Projetos/horizon.png', demo: null, github: null },
  { id: 'infinity-open', category: 'front-end', phase: 'Construção', featured: false, year: '2025', role: 'Desenvolvimento Front-End', image: './assets/img/Projetos/InfinityOpen.jpeg', demo: null, github: null },
  { id: 'wayne', category: 'front-end', phase: 'Construção', featured: false, year: '2025', role: 'Desenvolvimento Front-End', image: './assets/img/Projetos/wayne.png', demo: null, github: null }
];

// Fonte central de projetos. Novas relíquias exigem alteração apenas neste array.
const projects = [
  { id:'savory', title:'Savory', image:'./assets/img/Projetos/Savory.png', shortDescription:'Experiência gastronômica digital para descoberta e exploração de receitas.', challenge:'Organizar a descoberta de receitas em uma experiência visual clara, convidativa e fácil de explorar.', construction:'A interface foi construída com foco na apresentação do conteúdo gastronômico, na hierarquia visual e na navegação responsiva.', legacy:'O projeto consolidou uma experiência digital com identidade própria para apresentar e explorar conteúdo gastronômico.', technologies:['React','Node','Chart.js','MongoDB'], contributions:['Interface','Responsividade'], category:'full-stack', categoryLabel:'Full-Stack', chapter:'Capítulo IV', phase:'Legado', year:2026, role:'Desenvolvimento Full-Stack', roleDescription:'Atuação no desenvolvimento da interface e da estrutura da experiência web.', accentColor:'#c69645', status:'completed', github:null, demo:null, featured:true, featuredOrder:1, icon:'&#8734;' },
  { id:'behorner-control', title:'Behorner-Control', image:'./assets/img/Projetos/BannerInfinityControl.png', shortDescription:'Controle completo de laboratórios em uma única plataforma, conectando gestão, automação e gerenciamento remoto de computadores.', construction:'Criado a partir da necessidade de acompanhar e controlar o estado dos computadores da Infinity School de forma centralizada, reduzindo verificações manuais e facilitando a gestão dos laboratórios.', legacy:'Pensado para dar à Aline, nossa mascote, uma presença ativa no ecossistema da escola, permitindo que ela acompanhe e tenha controle sobre os computadores dos laboratórios de forma centralizada.', technologies:['Python','Fast API','SqlAlquemy','React','Vite','Node Js'], contributions:['Arquitetura da solução','Integração com IA'], category:'full-stack', categoryLabel:'Full-Stack', chapter:'Capítulo IV', phase:'Descoberta', year:2026, role:'Arquitetura e Desenvolvimento', roleDescription:'Responsável pela arquitetura da solução e pelo desenvolvimento de sua base técnica.', accentColor:'#a7333d', status:'development', guild:true, github:null, demo:null, featured:true, featuredOrder:2, icon:'&#11041;' },
  { id:'Hacktohon', title:'Hacktohon', image:'./assets/img/Projetos/Hacktohon.png', shortDescription:'Gestão e automação de processos empresariais em uma única plataforma.', challenge:'Reunir fluxos de gestão e automação empresarial em um ambiente único e mais fácil de acompanhar.', construction:'Os processos foram estruturados em uma aplicação Django, com persistência em SQL e suporte do Redis ao processamento.', legacy:'O projeto deixou uma base centralizada para organizar processos empresariais e permitir a evolução da automação.', technologies:['Python','SQL','Django','Redis'], contributions:['Lógica de servidor','Organização dos dados'], category:'back-end', categoryLabel:'Back-End', chapter:'Capítulo IV', phase:'Construção', year:2025, role:'Desenvolvimento Back-End', roleDescription:'Atuação na construção da lógica de servidor e na organização dos dados da plataforma.', accentColor:'#7254a8', status:'development', guild:true, github:null, demo:null, featured:true, featuredOrder:3, icon:'&#9881;' },
  { id:'Portifolio Alice', title:'Portifolio Alice', image:'./assets/img/Projetos/Portifolio_Alice.png', shortDescription:'Interfaces centradas em experiência, estética e performance.', challenge:'Equilibrar identidade visual, clareza de uso e desempenho em experiências digitais consistentes.', solution:'A abordagem reúne prototipação e implementação visual para criar interfaces coerentes em diferentes telas.', technologies:['React','Vite','Node Js'], technicalHighlights:['Prototipação de interface','Layout responsivo'], category:'front-end', categoryLabel:'Experiência & UI/UX', phase:'Descoberta', year:2025, role:'UI/UX e Front-End', roleDescription:'Responsável pela experiência visual e pela implementação das interfaces.', status:'coming-soon', github:null, demo:null, featured:false, featuredOrder:null, icon:'&#10000;' },
  { id:'devwizard-portfolio', title:'DevWizard Portfolio', image:null, shortDescription:'Portfólio dark fantasy com narrativa, acessibilidade e identidade própria.', challenge:'Apresentar trajetória e projetos de forma memorável sem comprometer clareza, navegação e acessibilidade.', solution:'O portfólio usa uma narrativa RPG como camada editorial sobre uma estrutura web responsiva e acessível.', technologies:['HTML','CSS','JavaScript','Bootstrap'], contributions:['Direção visual','Construção da interface','Responsividade','Acessibilidade'], technicalHighlights:['Componentes orientados por dados','Interações com JavaScript nativo'], category:'front-end', categoryLabel:'Portfólio Pessoal', phase:'Construção', year:2026, role:'Design e Desenvolvimento', roleDescription:'Responsável pela concepção visual, desenvolvimento front-end e experiência de navegação.', status:'development', github:'https://github.com/DevWizardMarcos/PortifolinoDev', demo:null, featured:false, featuredOrder:null, icon:'&#9670;' },
  { id:'connect-cnx', title:'Connect CNX', image:null, shortDescription:'Estratégia digital focada em crescimento orgânico e presença online.', challenge:'Fortalecer a presença digital da empresa e criar caminhos mensuráveis para o crescimento orgânico.', solution:'A estratégia integra SEO, análise de métricas e otimização de conversão para orientar as ações digitais.', technologies:['SEO','Analytics','Ads','CRO'], technicalHighlights:['Análise de métricas','Otimização de conversão'], category:'outros', categoryLabel:'Marketing Digital', phase:'Legado', year:2025, role:'Estratégia e Tecnologia', roleDescription:'Atuação na estratégia digital e no uso de tecnologia para acompanhar os resultados.', status:'completed', github:null, demo:null, featured:false, featuredOrder:null, icon:'&#9826;' },
  { id:'starbucks', title:'StarBucks', image:'./assets/img/Projetos/StartBucks.PNG', shortDescription:'Página temática inspirada na identidade visual da Starbucks.', challenge:'Reproduzir uma experiência de marca reconhecível usando uma interface responsiva e interativa.', solution:'A página foi construída com HTML, CSS e JavaScript, priorizando composição visual e adaptação a diferentes telas.', technologies:['HTML','CSS','JavaScript'], technicalHighlights:['Layout responsivo','Interações nativas'], category:'outros', categoryLabel:'Projeto Pessoal', phase:'Legado', year:2025, role:'Desenvolvimento Front-End', roleDescription:'Atuação na construção da interface e nas interações da página.', status:'completed', github:null, demo:null, featured:false, featuredOrder:null, icon:'&#9826;' },
  { id:'code-stone', title:'Code Stone', image:'./assets/img/Projetos/CodeStone.png', shortDescription:'Experiência visual para uma página pessoal com identidade própria.', challenge:'Criar uma interface marcante mantendo leitura clara e navegação simples.', solution:'A composição combina estrutura semântica, estilos responsivos e interações leves em JavaScript.', technologies:['HTML','CSS','JavaScript'], technicalHighlights:['Identidade visual','Layout responsivo'], category:'front-end', categoryLabel:'Projeto Pessoal', phase:'Construção', year:2025, role:'Desenvolvimento Front-End', roleDescription:'Atuação na implementação da interface e na adaptação responsiva.', status:'completed', github:null, demo:null, featured:false, featuredOrder:null, icon:'&#9826;' },
  { id:'deadpool', title:'Deadpool', image:'./assets/img/Projetos/deadpoo.jpg', shortDescription:'Página temática com direção visual inspirada no personagem Deadpool.', challenge:'Traduzir uma referência visual forte em uma experiência web funcional e responsiva.', solution:'A interface foi organizada em torno de contraste, hierarquia visual e componentes interativos.', technologies:['HTML','CSS','JavaScript'], technicalHighlights:['Página temática','Interações nativas'], category:'front-end', categoryLabel:'Projeto Pessoal', phase:'Construção', year:2025, role:'Desenvolvimento Front-End', roleDescription:'Atuação na criação da identidade visual e das interações da página.', status:'completed', github:null, demo:null, featured:false, featuredOrder:null, icon:'&#9826;' },
  { id:'garimpo', title:'Garimpo', image:'./assets/img/Projetos/garimpo.png', shortDescription:'Interface digital para descoberta e apresentação de produtos.', challenge:'Organizar uma experiência de descoberta com foco em clareza e apelo visual.', solution:'A página usa uma estrutura responsiva para destacar conteúdos e facilitar a exploração.', technologies:['HTML','CSS','JavaScript'], technicalHighlights:['Descoberta de conteúdo','Responsividade'], category:'front-end', categoryLabel:'Projeto Pessoal', phase:'Construção', year:2025, role:'Desenvolvimento Front-End', roleDescription:'Atuação na construção da interface e na organização da experiência visual.', status:'completed', github:null, demo:null, featured:false, featuredOrder:null, icon:'&#9826;' },
  { id:'horizon', title:'Horizon', image:'./assets/img/Projetos/horizon.png', shortDescription:'Experiência visual inspirada em exploração e novos horizontes.', challenge:'Construir uma página temática com presença visual sem perder usabilidade.', solution:'A interface combina seções bem definidas, imagens e comportamento responsivo.', technologies:['HTML','CSS','JavaScript'], technicalHighlights:['Direção visual','Layout adaptável'], category:'front-end', categoryLabel:'Projeto Pessoal', phase:'Construção', year:2025, role:'Desenvolvimento Front-End', roleDescription:'Atuação na estruturação da página e na implementação visual.', status:'completed', github:null, demo:null, featured:false, featuredOrder:null, icon:'&#9826;' },
  { id:'infinity-open', title:'Infinity Open', image:'./assets/img/Projetos/InfinityOpen.jpeg', shortDescription:'Página institucional com foco em tecnologia e abertura de possibilidades.', challenge:'Apresentar uma proposta tecnológica de forma acessível e visualmente consistente.', solution:'A solução organiza o conteúdo em uma página responsiva com hierarquia e navegação claras.', technologies:['HTML','CSS','JavaScript'], technicalHighlights:['Página institucional','Estrutura responsiva'], category:'front-end', categoryLabel:'Projeto Pessoal', phase:'Construção', year:2025, role:'Desenvolvimento Front-End', roleDescription:'Atuação na construção da interface e na apresentação do conteúdo.', status:'completed', github:null, demo:null, featured:false, featuredOrder:null, icon:'&#9826;' },
  { id:'wayne', title:'Wayne', image:'./assets/img/Projetos/wayne.png', shortDescription:'Página temática com estética inspirada no universo de Wayne.', challenge:'Criar uma experiência temática reconhecível com boa adaptação para diferentes telas.', solution:'O projeto utiliza composição visual, tipografia e interações simples para reforçar sua identidade.', technologies:['HTML','CSS','JavaScript'], technicalHighlights:['Página temática','Identidade visual'], category:'front-end', categoryLabel:'Projeto Pessoal', phase:'Construção', year:2025, role:'Desenvolvimento Front-End', roleDescription:'Atuação na criação da interface e na composição visual da experiência.', status:'completed', github:null, demo:null, featured:false, featuredOrder:null, icon:'&#9826;' }
];

const reliquias = projects;
const INITIAL_VISIBLE = 6;
const LOAD_MORE_AMOUNT = 6;
let activeRelicFilter = 'todos';
let visibleRelicCount = INITIAL_VISIBLE;
let activeProjectIndex = 0;

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

function projectGem(project) {
  const source = { 'front-end':'assets/img/Gemas/front.png', 'back-end':'assets/img/Gemas/back.png', 'full-stack':'assets/img/Gemas/fullstack.png' }[project.category];
  return source ? `<img class="project-gem" src="${source}" alt="Gema ${project.categoryLabel}">` : '<span class="project-gem project-gem--other" aria-hidden="true">◆</span>';
}

function renderShowcase() {
  const container = document.getElementById('relic-showcase');
  if (!container) return;
  const featuredProjects = reliquias.filter(project => project.featured).sort((a,b) => a.featuredOrder - b.featuredOrder).slice(0,3);
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
const legacyHall = document.getElementById('legados');
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

  const filteredProjects = reliquias.filter(project => filtro === 'todos' || project.category === filtro);
  const loadMoreButton = document.querySelector('.load-more-relics');
  const total = filteredProjects.length;
  if (total) activeProjectIndex = ((activeProjectIndex % total) + total) % total;

  const slots = total >= 5
    ? [['far-left', -2], ['near-left', -1], ['active', 0], ['near-right', 1], ['far-right', 2]]
    : total === 4
      ? [['near-left', -1], ['active', 0], ['near-right', 1], ['far-right', 2]]
      : total === 3
        ? [['near-left', -1], ['active', 0], ['near-right', 1]]
        : total === 2
          ? [['active', 0], ['near-right', 1]]
          : total === 1 ? [['active', 0]] : [];

  const visibleProjects = slots.map(([position, offset]) => ({
    position,
    offset,
    project: filteredProjects[(activeProjectIndex + offset + total) % total]
  }));

  grade.innerHTML = visibleProjects.length ? visibleProjects.map(({ project, position, offset }, index) => {
    const projectNumber = reliquias.findIndex(item => item.id === project.id) + 1;
    const categoryGem = { 'front-end':'#4f9ee8', 'back-end':'#c94e58', 'full-stack':'#9565d8', outros:'#c49a52' }[project.category] || '#c49a52';
    const active = position === 'active';
    const pedestalType = active ? 'noble' : position.startsWith('near') ? 'altar' : 'shadow';
    return `
    <article class="corridor-relic corridor-relic--${position}" data-category="${project.category}" data-project-id="${project.id}" data-corridor-offset="${offset}" style="--relic-accent:${project.accentColor || categoryGem};--category-gem:${categoryGem};--corridor-index:${index}">
      ${active ? `<button class="corridor-relic-frame corridor-active-trigger" type="button" data-project="${project.id}" aria-label="Examinar relíquia: ${project.title}">
        <header><span>Relíquia ${String(projectNumber).padStart(2,'0')}</span><small>${projectGem(project)}${project.categoryLabel}</small></header>
        <div class="corridor-relic-visual">${projectImage(project)}<span aria-hidden="true"></span></div>
        <div class="corridor-relic-copy">
          <h4>${project.title}</h4>
          <p>${project.shortDescription}</p>
          ${project.guild ? '<span class="guild-seal">Forjado em Guilda</span>' : ''}
          <div class="corridor-tags">${project.technologies.slice(0,3).map(tech => `<span>${tech}</span>`).join('')}</div>
          <small>${project.year} · ${project.phase}</small>
          <span class="corridor-examine">Examinar Relíquia <b aria-hidden="true">→</b></span>
        </div>
      </button>` : `<button class="corridor-relic-frame corridor-relic-back" type="button" data-corridor-offset="${offset}" aria-label="Selecionar relíquia ${project.title}">
        <img src="assets/img/card-back-dw-phoenix.png" alt="" draggable="false">
      </button>`}
      <div class="corridor-pedestal corridor-pedestal--${pedestalType}" aria-hidden="true">
        <i class="corridor-pedestal__top"></i>
        <i class="corridor-pedestal__base"></i>
        <i class="corridor-pedestal__ornament"></i>
      </div>
    </article>`;
  }).join('') : '<p class="empty-relics">Nenhuma relíquia encontrada nesta categoria.</p>';
  if (loadMoreButton) loadMoreButton.hidden = true;
  const navigationDisabled = total < 2;
  document.querySelectorAll('.corridor-arrow').forEach(button => { button.disabled = navigationDisabled; });
}

renderShowcase();
renderCards('todos');

document.querySelector('.relic-filters')?.addEventListener('click', (e) => {
  const btn = e.target.closest('.relic-filter');
  if (!btn) return;
  activeRelicFilter = btn.dataset.filter;
  activeProjectIndex = 0;
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

// Ritual leve em quatro estados: idle, reação, ativação e recompensa.
const portalScene = document.querySelector('.archive-threshold');
const crystalKey = document.querySelector('.crystal-key');
const discoverButton = document.querySelector('.discover-legacies');
const relicLibrary = document.getElementById('reliquias');
const portalStatus = document.querySelector('.portal-status');
const portalSceneTitle = document.getElementById('portal-scene-title');
const portalLore = document.querySelector('.portal-lore');
const guardianPortrait = document.querySelector('.guardian-portraits');
const guardianImage = document.querySelector('.guardian-image');
const archiveGrid = document.getElementById('relic-grid');
const archiveDesktop = window.matchMedia('(min-width: 1024px)');
const legacyWorld = document.getElementById('legados');
const legacyHallPanel = legacyWorld?.querySelector('[data-legacy-panel="hall"]');
const legacyBackButton = legacyWorld?.querySelector('.legacy-back');
let legacyState = 'hall';
let stateBeforeProject = 'hall';
let isPortalOpened = false;
let guardianSwapTimer;
let portalTimer;
let archiveRevealTimer;
let archiveOpened = false;
let archiveScrollFrame = 0;
let archiveInteractionState = 'idle';
let selectedArchiveCard = null;
let archiveInteractionTimer = 0;

function setLegacyState(nextState) {
  legacyState = nextState;
  if (!legacyWorld) return;
  legacyWorld.dataset.legacyState = nextState;
  const archiveVisible = ['transitioning', 'archive', 'returning'].includes(nextState) || (nextState === 'project' && stateBeforeProject === 'archive');
  if (relicLibrary) {
    relicLibrary.toggleAttribute('hidden', !archiveVisible);
    relicLibrary.setAttribute('aria-hidden', String(!archiveVisible));
    relicLibrary.inert = nextState !== 'archive' && !(nextState === 'project' && stateBeforeProject === 'archive');
  }
  if (legacyHallPanel) {
    const hallHidden = nextState === 'archive' || (nextState === 'project' && stateBeforeProject === 'archive');
    legacyHallPanel.setAttribute('aria-hidden', String(hallHidden));
    legacyHallPanel.inert = hallHidden || nextState === 'transitioning';
  }
}

function setPortalState(state) {
  if (!portalScene) return;
  portalScene.dataset.portalState = state;
  if (state !== 'idle' && !['archive', 'project', 'transitioning', 'returning'].includes(legacyState)) setLegacyState('threshold');
  if (state === 'activating' || state === 'open') isPortalOpened = true;
  portalScene.dataset.portalAwakened = String(isPortalOpened);
  portalScene.classList.toggle('portal--opened', isPortalOpened);
  portalScene.classList.toggle('portal--dormant', !isPortalOpened);
  renderGuardian(isPortalOpened);
  if (portalSceneTitle) portalSceneTitle.textContent = state === 'open' ? 'O limiar foi aberto' : isPortalOpened ? 'O portal desperta' : 'O Arquivo está selado';
  if (portalLore) portalLore.textContent = state === 'open' ? 'O Guardião autorizou a passagem. O Arquivo dos Legados aguarda.' : isPortalOpened ? 'As duas forças convergem e o selo começa a ceder.' : 'O cristal guarda a centelha capaz de despertar o acervo.';
}

function renderGuardian(opened) {
  if (!guardianImage || !guardianPortrait) return;
  if (opened) guardianPortrait.classList.remove('guardian--hovered');
  const nextState = opened ? 'opened' : 'idle';
  if (guardianPortrait.dataset.guardianState === nextState) return;
  const nextSource = opened ? guardianImage.dataset.openSrc : guardianImage.dataset.idleSrc;
  window.clearTimeout(guardianSwapTimer);

  if (!guardianPortrait.dataset.guardianState) {
    guardianImage.src = nextSource;
    guardianPortrait.dataset.guardianState = nextState;
    guardianPortrait.classList.toggle('guardian--awakened', opened);
    guardianPortrait.classList.toggle('guardian--idle', !opened);
    return;
  }

  guardianPortrait.classList.add('is-transforming');
  guardianSwapTimer = window.setTimeout(() => {
    guardianImage.src = nextSource;
    guardianPortrait.dataset.guardianState = nextState;
    guardianPortrait.classList.toggle('guardian--awakened', opened);
    guardianPortrait.classList.toggle('guardian--idle', !opened);
    const revealGuardian = () => requestAnimationFrame(() => requestAnimationFrame(() => guardianPortrait.classList.remove('is-transforming')));
    if (guardianImage.complete) revealGuardian();
    else guardianImage.addEventListener('load', revealGuardian, { once: true });
  }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 20 : 260);
}

function previewGuardian(hovered) {
  if (!guardianImage || !guardianPortrait || isPortalOpened || guardianPortrait.classList.contains('is-transforming')) return;
  guardianImage.src = hovered ? guardianImage.dataset.hoverSrc : guardianImage.dataset.idleSrc;
  guardianPortrait.classList.toggle('guardian--hovered', hovered);
}

setPortalState(portalScene?.dataset.portalState || 'idle');

guardianPortrait?.addEventListener('pointerenter', () => previewGuardian(true));
guardianPortrait?.addEventListener('pointerleave', () => previewGuardian(false));
guardianPortrait?.addEventListener('focus', () => previewGuardian(true));
guardianPortrait?.addEventListener('blur', () => previewGuardian(false));

crystalKey?.addEventListener('pointerenter', () => {
  if (portalScene?.dataset.portalState === 'idle') setPortalState('aware');
});
crystalKey?.addEventListener('pointerleave', () => {
  if (portalScene?.dataset.portalState === 'aware') setPortalState('idle');
});
crystalKey?.addEventListener('focus', () => {
  if (portalScene?.dataset.portalState === 'idle') setPortalState('aware');
});
crystalKey?.addEventListener('blur', () => {
  if (portalScene?.dataset.portalState === 'aware') setPortalState('idle');
});
crystalKey?.addEventListener('click', () => {
  if (!portalScene || ['activating', 'open'].includes(portalScene.dataset.portalState)) return;
  window.clearTimeout(portalTimer);
  setPortalState('activating');
  crystalKey.disabled = true;
  if (portalStatus) portalStatus.textContent = 'O cristal despertou. A energia percorre o salão em direção ao portal.';
  portalTimer = window.setTimeout(() => {
    setPortalState('open');
    crystalKey.setAttribute('aria-expanded', 'true');
    if (portalStatus) portalStatus.textContent = 'O portal foi aberto. O Arquivo dos Legados está acessível.';
    discoverButton?.focus({ preventScroll: true });
  }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 80 : 1800);
});

function updateActiveArchiveCard(centerFirst = false) {
  if (!archiveGrid || !archiveDesktop.matches) return;
  const cards = [...archiveGrid.querySelectorAll('.relic-card')];
  if (!cards.length) return;
  if (centerFirst) cards[0].scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
  const center = archiveGrid.getBoundingClientRect().left + archiveGrid.clientWidth / 2;
  let active = cards[0];
  let nearest = Infinity;
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const distance = Math.abs(rect.left + rect.width / 2 - center);
    if (distance < nearest) { nearest = distance; active = card; }
  });
  cards.forEach(card => {
    const isCentered = card === active;
    const isRevealed = card === selectedArchiveCard && ['flipping', 'revealed', 'opening-modal', 'modal-open', 'closing-modal'].includes(archiveInteractionState);
    card.classList.toggle('is-centered', isCentered);
    card.classList.toggle('is-active', isRevealed);
    const front = card.querySelector('.relic-card-front');
    const back = card.querySelector('.relic-card-back');
    if (front) front.inert = !isRevealed;
    if (back) back.tabIndex = isRevealed ? -1 : 0;
  });
}

function moveArchive(direction) {
  if (!archiveGrid || archiveInteractionState !== 'idle') return;
  const active = archiveGrid.querySelector('.relic-card.is-centered');
  const cards = [...archiveGrid.querySelectorAll('.relic-card')];
  const index = Math.max(0, cards.indexOf(active));
  cards[Math.min(cards.length - 1, Math.max(0, index + direction))]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}

function navigateCorridor(step) {
  const filteredProjects = reliquias.filter(project => activeRelicFilter === 'todos' || project.category === activeRelicFilter);
  if (filteredProjects.length < 2) return;
  activeProjectIndex = (activeProjectIndex + step + filteredProjects.length) % filteredProjects.length;
  archiveGrid?.classList.remove('is-changing');
  void archiveGrid?.offsetWidth;
  archiveGrid?.classList.add('is-changing');
  renderCards(activeRelicFilter);
}

archiveGrid?.addEventListener('keydown', event => {
  if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  navigateCorridor(event.key === 'ArrowRight' ? 1 : -1);
});

archiveGrid?.addEventListener('click', event => {
  const activeTrigger = event.target.closest('.corridor-active-trigger');
  if (activeTrigger) {
    openRelicDetails(activeTrigger.dataset.project);
    return;
  }
  const sideCard = event.target.closest('.corridor-relic-back');
  if (sideCard) navigateCorridor(Number(sideCard.dataset.corridorOffset));
});

document.querySelector('.corridor-prev')?.addEventListener('click', () => navigateCorridor(-1));
document.querySelector('.corridor-next')?.addEventListener('click', () => navigateCorridor(1));

discoverButton?.addEventListener('click', () => {
  if (!relicLibrary || legacyState === 'transitioning') return;
  archiveOpened = true;
  setLegacyState('transitioning');
  relicLibrary.dataset.archiveState = 'revealing';
  discoverButton.disabled = true;
  discoverButton.setAttribute('aria-expanded', 'true');
  if (portalStatus) portalStatus.textContent = 'A passagem foi iniciada. O Arquivo dos Legados está surgindo.';
  window.clearTimeout(archiveRevealTimer);
  archiveRevealTimer = window.setTimeout(() => {
    setLegacyState('archive');
    relicLibrary.dataset.archiveState = 'open';
    discoverButton.disabled = false;
    if (portalStatus) portalStatus.textContent = 'O Arquivo dos Legados foi revelado. Explore as relíquias.';
    updateActiveArchiveCard(true);
    archiveGrid?.focus({ preventScroll: true });
  }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 100 : 1100);
});

legacyBackButton?.addEventListener('click', () => {
  if (!relicLibrary || legacyState !== 'archive') return;
  setLegacyState('returning');
  relicLibrary.dataset.archiveState = 'closing';
  window.clearTimeout(archiveRevealTimer);
  archiveRevealTimer = window.setTimeout(() => {
    setLegacyState('threshold');
    relicLibrary.dataset.archiveState = 'closed';
    discoverButton?.setAttribute('aria-expanded', 'false');
    legacyHallPanel?.removeAttribute('aria-hidden');
    discoverButton?.focus({ preventScroll: true });
  }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 100 : 700);
});

archiveDesktop.addEventListener('change', () => {
  renderCards(activeRelicFilter);
  if (relicLibrary && legacyState === 'archive') relicLibrary.dataset.archiveState = 'open';
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
  stateBeforeProject = legacyState === 'archive' ? 'archive' : legacyState === 'threshold' ? 'threshold' : 'hall';
  const relicNumber = project.featuredOrder || reliquias.findIndex(item => item.id === project.id) + 1;
  const statusLabel = projectStatus[project.status] || project.status;
  const dialogGem = { 'front-end':'#4f9ee8', 'back-end':'#d44e59', 'full-stack':'#9565d8', outros:'#c49a52' }[project.category] || '#c49a52';
  const dialogGemImage = { 'front-end':'assets/img/Gemas/front.png', 'back-end':'assets/img/Gemas/back.png', 'full-stack':'assets/img/Gemas/fullstack.png' }[project.category];
  const dialogGemMeaning = { 'front-end':'Interfaces & Experiência', 'back-end':'Lógica & Estrutura', 'full-stack':'Integração Completa', outros:'Especialidade Arcana' }[project.category];
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
  relicDialog.style.setProperty('--dialog-gem', dialogGem);
  relicDialog.dataset.category = project.category;
  dialogContent.innerHTML = `
    <header class="dialog-header relic-examination-header">
      <span class="dialog-eyebrow">Relíquia ${String(relicNumber).padStart(2,'0')} <i>·</i> ${project.chapter || 'Capítulo IV'} <i>·</i> ${project.year}</span>
      <div class="dialog-classification" aria-label="Classificação ${project.categoryLabel}: ${dialogGemMeaning}">
        <span class="dialog-gem-crest">${dialogGemImage ? `<img class="dialog-gem-image" src="${dialogGemImage}" alt="" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><i class="dialog-header-gem" hidden></i>` : '<i class="dialog-header-gem"></i>'}</span>
        <span class="dialog-gem-meaning"><b>${project.categoryLabel}</b><small>${dialogGemMeaning}</small></span>
      </div>
      <h3 id="dialog-title">${project.title}</h3>
      <p>${project.shortDescription}</p>
      <div class="dialog-meta"><span><i class="dialog-category-mark" aria-hidden="true">◆</i>${project.categoryLabel}</span><i>·</i><span>${statusLabel}</span></div>
    </header>
    <div class="dialog-project-frame">
      <figure class="dialog-project-image">${projectImage(project)}</figure>
    </div>
    <div class="relic-seal" aria-hidden="true"><span>◆</span><small>Selo da relíquia</small></div>
    ${fragments.length ? `<section class="relic-fragments" data-fragments='${JSON.stringify(fragmentData)}'><h4>Examinar a relíquia</h4><div class="fragment-tabs" role="tablist" aria-label="Fragmentos da jornada">${fragmentTabs}</div><div id="fragment-panel" class="fragment-panel" role="tabpanel" tabindex="0" aria-labelledby="fragment-tab-${fragments[0].id}"><p>${fragments[0].content}</p></div></section>` : ''}
    <div class="dialog-mission">
      <section class="dialog-role"><h4>Papel na missão</h4><strong>${project.role}</strong>${project.roleDescription ? `<p>${project.roleDescription}</p>` : ''}${project.contributions?.length ? renderList(project.contributions, 'dialog-list') : ''}</section>
      ${project.technologies?.length ? `<section class="dialog-technologies"><h4>Artefatos utilizados</h4><div class="relic-techs">${project.technologies.map(tech => `<span>${tech}</span>`).join('')}</div></section>` : ''}
    </div>
    ${actions ? `<nav class="dialog-actions" aria-label="Ações do projeto">${actions}</nav>` : ''}
    <footer class="dialog-footer"><span>Registro da jornada</span></footer>`;
  relicDialogTrigger = document.activeElement;
  setLegacyState('project');
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

document.getElementById('legados')?.addEventListener('click', event => {
  const trigger = event.target.closest('.examine-relic');
  if (trigger) openRelicDetails(trigger.dataset.project);
});
document.querySelector('.dialog-close')?.addEventListener('click', closeRelicDetails);
relicDialog?.addEventListener('click', event => { if (event.target === relicDialog) closeRelicDetails(); });
relicDialog?.addEventListener('cancel', event => { event.preventDefault(); closeRelicDetails(); });
relicDialog?.addEventListener('close', () => {
  relicDialog.classList.remove('is-closing');
  setLegacyState(stateBeforeProject);
  relicDialogTrigger?.focus();
  relicDialogTrigger = null;
  if (archiveDesktop.matches && selectedArchiveCard && archiveInteractionState === 'modal-open') {
    archiveInteractionState = 'closing-modal';
    window.clearTimeout(archiveInteractionTimer);
    archiveInteractionTimer = window.setTimeout(() => {
      archiveInteractionState = 'returning';
      selectedArchiveCard.classList.remove('is-active');
      selectedArchiveCard.querySelector('.relic-card-front')?.setAttribute('inert', '');
      const back = selectedArchiveCard.querySelector('.relic-card-back');
      if (back) back.tabIndex = 0;
      archiveInteractionTimer = window.setTimeout(() => {
        selectedArchiveCard = null;
        archiveInteractionState = 'idle';
        archiveGrid?.classList.remove('is-interacting');
        updateActiveArchiveCard();
      }, 520);
    }, 150);
  }
});

// Biblioteca de Feitiços — domínios técnicos apresentados como grimórios.
const spellDomains = [
  {
    id: 'front-end', title: 'Front-End', rune: '◇', accent: '#579cda', description: 'Interfaces, sistemas visuais e experiências digitais responsivas.',
    technologies: [
      { name: 'React', rank: 'Domínio principal', description: 'Interfaces componentizadas, gerenciamento de estado e experiências interativas.', projects: ['Savory', 'Behorner-Control', 'Portfólio Alice'] },
      { name: 'JavaScript', rank: 'Domínio principal', description: 'Lógica de interface, DOM, consumo de APIs e interações nativas.', projects: ['DevWizard Portfolio', 'Code Stone', 'Infinity Open'] },
      { name: 'HTML & CSS', rank: 'Domínio principal', description: 'Estrutura semântica, layouts responsivos, animações e sistemas visuais.', projects: ['DevWizard Portfolio', 'Garimpo', 'Horizon'] },
      { name: 'Vite & SASS', rank: 'Experiência sólida', description: 'Fluxos modernos de desenvolvimento, organização de estilos e build otimizado.', projects: ['Portfólio Alice', 'Behorner-Control'] }
    ]
  },
  {
    id: 'back-end', title: 'Back-End', rune: 'ᚱ', accent: '#c75661', description: 'Serviços, regras de negócio, automações e integrações robustas.',
    technologies: [
      { name: 'Python', rank: 'Domínio principal', description: 'Serviços, automações, regras de negócio e aplicações orientadas a dados.', projects: ['Behorner-Control', 'Hacktohon'] },
      { name: 'FastAPI', rank: 'Experiência sólida', description: 'APIs tipadas, documentação automática e integrações de alta clareza.', projects: ['Behorner-Control'] },
      { name: 'Django & Flask', rank: 'Aplicação prática', description: 'Aplicações web, rotas, persistência e organização de serviços.', projects: ['Hacktohon', 'Projetos educacionais'] },
      { name: 'Node.js', rank: 'Experiência sólida', description: 'Serviços JavaScript, integrações e suporte a aplicações full-stack.', projects: ['Savory', 'Portfólio Alice'] }
    ]
  },
  {
    id: 'data', title: 'Dados', rune: 'ᛟ', accent: '#b99b62', description: 'Modelagem, persistência e organização estratégica da informação.',
    technologies: [
      { name: 'SQL', rank: 'Experiência sólida', description: 'Modelagem relacional, consultas e organização consistente de informações.', projects: ['Hacktohon', 'Behorner-Control'] },
      { name: 'MySQL', rank: 'Aplicação prática', description: 'Persistência para sistemas web e estruturas relacionais de negócio.', projects: ['Sistemas acadêmicos', 'APIs próprias'] },
      { name: 'SQLite', rank: 'Aplicação prática', description: 'Persistência leve para protótipos, ferramentas e aplicações locais.', projects: ['Automações Python', 'Protótipos de APIs'] },
      { name: 'MongoDB', rank: 'Em evolução', description: 'Estruturas documentais e dados flexíveis em experiências full-stack.', projects: ['Savory'] }
    ]
  },
  {
    id: 'tools', title: 'Ferramentas', rune: '⚒', accent: '#c59a52', description: 'Instrumentos que sustentam criação, colaboração e entrega técnica.',
    technologies: [
      { name: 'Git & GitHub', rank: 'Domínio principal', description: 'Versionamento, colaboração, revisão e manutenção da jornada do código.', projects: ['Todos os projetos principais'] },
      { name: 'Figma', rank: 'Experiência sólida', description: 'Prototipação, direção visual e tradução de ideias em interfaces.', projects: ['Portfólio Alice', 'DevWizard Portfolio'] },
      { name: 'Vite', rank: 'Experiência sólida', description: 'Ambientes front-end rápidos, builds modernos e organização de projetos.', projects: ['Savory', 'Behorner-Control'] },
      { name: 'Notion', rank: 'Aplicação prática', description: 'Documentação, planejamento de entregas e organização do conhecimento.', projects: ['Gestão de projetos', 'Mentorias'] }
    ]
  },
  {
    id: 'full-stack', title: 'Full-Stack', rune: '∞', accent: '#9565d8', description: 'Visão completa do produto, da interface à arquitetura dos serviços.',
    technologies: [
      { name: 'Arquitetura Web', rank: 'Domínio principal', description: 'Integração entre interface, serviços, persistência e experiência final.', projects: ['Savory', 'Behorner-Control'] },
      { name: 'APIs & Integrações', rank: 'Experiência sólida', description: 'Contratos de dados, comunicação entre camadas e serviços externos.', projects: ['Behorner-Control', 'Hacktohon'] },
      { name: 'UX Responsiva', rank: 'Domínio principal', description: 'Experiências consistentes, acessíveis e adaptadas a diferentes telas.', projects: ['DevWizard Portfolio', 'Portfólio Alice'] },
      { name: 'Deploy & Evolução', rank: 'Em evolução', description: 'Preparação de builds, publicação e manutenção incremental de produtos.', projects: ['Projetos autorais', 'Soluções para clientes'] }
    ]
  }
];

// Cada entrada descreve uma tecnologia sem acoplar o conteúdo ao HTML do livro.
// Para usar um avatar definitivo, basta preencher `avatar` com o caminho da imagem.
const grimoireEntries = {
  React: {
    school: 'Artes da Interface', volume: 'I', record: '04', avatar: null, sigil: 'R',
    anatomy: [
      { term: 'Componentes', note: 'Partes reutilizáveis da interface.' },
      { term: 'Estado', note: 'Dados que conduzem cada mudança visual.' },
      { term: 'Props', note: 'Contratos entre entidades da árvore.' },
      { term: 'Contexto', note: 'Conhecimento partilhado sem prop drilling.' }
    ],
    concepts: ['Componentes', 'Estado', 'Props', 'Context API', 'Rotas'],
    fieldNotes: {
      Savory: 'Componentização, rotas e consumo de uma fonte externa de receitas.',
      'Behorner-Control': 'Interfaces de controle conectadas aos serviços da plataforma.',
      'Portfólio Alice': 'Composição responsiva e organização da experiência em componentes.'
    },
    archivistNote: 'React se tornou uma das ferramentas centrais na construção das minhas interfaces.'
  },
  JavaScript: {
    school: 'Artes da Interface', volume: 'I', record: '07', avatar: null, sigil: 'JS',
    anatomy: [
      { term: 'Eventos', note: 'Sinais que despertam uma interação.' },
      { term: 'DOM', note: 'A árvore viva da página.' },
      { term: 'Funções', note: 'Rituais pequenos, nomeados e reutilizáveis.' },
      { term: 'Promises', note: 'Pactos com operações assíncronas.' }
    ],
    concepts: ['DOM', 'Eventos', 'Funções', 'APIs', 'Assincronicidade'],
    fieldNotes: {
      'DevWizard Portfolio': 'Interações narrativas, navegação e componentes orientados por dados.',
      'Code Stone': 'Comportamentos nativos aplicados a uma página temática.',
      'Infinity Open': 'Controle da experiência responsiva sem dependências pesadas.'
    },
    archivistNote: 'É a linguagem que conecta estrutura, movimento e resposta nas experiências que construo.'
  },
  'HTML & CSS': {
    school: 'Artes da Interface', volume: 'I', record: '09', avatar: null, sigil: '</>',
    anatomy: [
      { term: 'Semântica', note: 'A estrutura que dá significado ao conteúdo.' },
      { term: 'Cascata', note: 'Regras visuais organizadas por contexto.' },
      { term: 'Layout', note: 'Grids e fluxos que sustentam a composição.' },
      { term: 'Acessibilidade', note: 'Caminhos claros para diferentes formas de uso.' }
    ],
    concepts: ['Semântica', 'Grid', 'Flexbox', 'Responsividade', 'Acessibilidade'],
    archivistNote: 'A base de cada interface: sólida o bastante para sustentar identidade e interação.'
  },
  'Vite & SASS': {
    school: 'Artes da Interface', volume: 'I', record: '12', avatar: null, sigil: 'V',
    anatomy: [
      { term: 'Build', note: 'Transforma as fontes em artefatos de entrega.' },
      { term: 'Módulos', note: 'Separa responsabilidades e dependências.' },
      { term: 'Tokens', note: 'Valores que mantêm o sistema visual coeso.' }
    ],
    concepts: ['Build', 'Módulos', 'Variáveis', 'Mixins', 'Otimização'],
    archivistNote: 'Ferramentas que tornam a oficina front-end mais rápida, previsível e organizada.'
  },
  Python: {
    school: 'Ofícios do Servidor', volume: 'II', record: '03', avatar: null, sigil: 'Py',
    anatomy: [
      { term: 'Módulos', note: 'Conhecimento separado por responsabilidade.' },
      { term: 'Objetos', note: 'Estado e comportamento reunidos.' },
      { term: 'Tipagem', note: 'Pistas que tornam contratos mais claros.' },
      { term: 'Automação', note: 'Tarefas repetidas transformadas em processos.' }
    ],
    concepts: ['Funções', 'Objetos', 'Módulos', 'Tipagem', 'Automação'],
    fieldNotes: {
      'Behorner-Control': 'Base de serviços, automações e regras para controle dos laboratórios.',
      Hacktohon: 'Lógica de servidor e processamento dos fluxos da plataforma.'
    },
    archivistNote: 'Python passou de linguagem de estudo a instrumento recorrente para serviços e automação.'
  },
  FastAPI: {
    school: 'Ofícios do Servidor', volume: 'II', record: '06', avatar: null, sigil: 'API',
    anatomy: [
      { term: 'Rotas', note: 'Portais nomeados para cada recurso.' },
      { term: 'Schemas', note: 'Contratos que validam toda mensagem.' },
      { term: 'Dependências', note: 'Recursos compartilhados sob controle.' },
      { term: 'OpenAPI', note: 'Mapa vivo dos caminhos disponíveis.' }
    ],
    concepts: ['Rotas', 'Pydantic', 'Dependências', 'OpenAPI', 'Async'],
    fieldNotes: {
      'Behorner-Control': 'API tipada para integrar gestão, agentes e controle remoto.'
    },
    archivistNote: 'FastAPI trouxe clareza aos contratos e velocidade à construção dos meus serviços.'
  },
  'Django & Flask': {
    school: 'Ofícios do Servidor', volume: 'II', record: '08', avatar: null, sigil: 'DF',
    anatomy: [
      { term: 'Rotas', note: 'Direcionam cada requisição ao seu destino.' },
      { term: 'Modelos', note: 'Representam as regras e os registros do domínio.' },
      { term: 'Views', note: 'Orquestram entrada, decisão e resposta.' }
    ],
    concepts: ['MVC', 'ORM', 'Templates', 'Rotas', 'Autenticação'],
    archivistNote: 'Dois caminhos para transformar regras de negócio em aplicações web consistentes.'
  },
  'Node.js': {
    school: 'Ofícios do Servidor', volume: 'II', record: '11', avatar: null, sigil: 'N',
    anatomy: [
      { term: 'Runtime', note: 'JavaScript operando além do navegador.' },
      { term: 'Event loop', note: 'Coordena tarefas sem bloquear o fluxo.' },
      { term: 'Pacotes', note: 'Artefatos compartilhados pelo ecossistema.' }
    ],
    concepts: ['Runtime', 'Event loop', 'Módulos', 'APIs', 'NPM'],
    archivistNote: 'A ponte que mantém a mesma linguagem entre interface, ferramentas e serviços.'
  },
  SQL: {
    school: 'Escola dos Dados', volume: 'III', record: '02', avatar: null, sigil: 'SQL',
    anatomy: [
      { term: 'Tabelas', note: 'Coleções estruturadas de registros.' },
      { term: 'Chaves', note: 'Identificam e conectam entidades.' },
      { term: 'Consultas', note: 'Perguntas precisas feitas ao arquivo.' },
      { term: 'Relações', note: 'Vínculos que preservam o contexto.' }
    ],
    concepts: ['Tabelas', 'Colunas', 'Registros', 'Chaves', 'Relações'],
    fieldNotes: {
      Hacktohon: 'Consultas e estrutura relacional para os processos empresariais.',
      'Behorner-Control': 'Modelagem dos equipamentos, laboratórios e eventos do sistema.'
    },
    archivistNote: 'SQL deixou de ser apenas consulta e passou a fazer parte da arquitetura dos meus sistemas.'
  },
  MySQL: {
    school: 'Escola dos Dados', volume: 'III', record: '05', avatar: null, sigil: 'MY',
    anatomy: [
      { term: 'Schema', note: 'O mapa formal do domínio persistido.' },
      { term: 'Índices', note: 'Atalhos para localizar registros.' },
      { term: 'Transações', note: 'Mudanças tratadas como uma unidade segura.' }
    ],
    concepts: ['Schemas', 'Índices', 'Joins', 'Transações', 'Constraints'],
    archivistNote: 'Um arquivo relacional confiável para transformar regras de negócio em dados duráveis.'
  },
  SQLite: {
    school: 'Escola dos Dados', volume: 'III', record: '07', avatar: null, sigil: 'SQ',
    anatomy: [
      { term: 'Arquivo único', note: 'Toda a base preservada num artefato portátil.' },
      { term: 'Consultas', note: 'A linguagem relacional sem um servidor dedicado.' },
      { term: 'Transações', note: 'Consistência mesmo em estruturas leves.' }
    ],
    concepts: ['Portabilidade', 'SQL', 'Transações', 'Protótipos', 'Persistência local'],
    archivistNote: 'Minha escolha para protótipos e ferramentas que pedem persistência simples e confiável.'
  },
  MongoDB: {
    school: 'Escola dos Dados', volume: 'III', record: '10', avatar: null, sigil: 'M',
    anatomy: [
      { term: 'Documentos', note: 'Registros flexíveis agrupados por contexto.' },
      { term: 'Coleções', note: 'Conjuntos de documentos relacionados.' },
      { term: 'Agregações', note: 'Etapas que transformam e resumem informação.' }
    ],
    concepts: ['Documentos', 'Coleções', 'Índices', 'Agregações', 'Schemas flexíveis'],
    archivistNote: 'Uma alternativa documental para domínios que evoluem com estruturas menos rígidas.'
  },
  'Git & GitHub': {
    school: 'Instrumentos do Ofício', volume: 'IV', record: '01', avatar: null, sigil: 'G',
    anatomy: [
      { term: 'Commit', note: 'Um ponto preservado na história.' },
      { term: 'Branch', note: 'Um caminho paralelo de experimentação.' },
      { term: 'Merge', note: 'A reunião consciente de duas jornadas.' },
      { term: 'Review', note: 'Leitura crítica antes da integração.' }
    ],
    concepts: ['Commit', 'Branch', 'Merge', 'Pull Request', 'Histórico'],
    archivistNote: 'Git é o registro de decisões que torna cada projeto rastreável e colaborativo.'
  },
  Figma: {
    school: 'Instrumentos do Ofício', volume: 'IV', record: '04', avatar: null, sigil: 'F',
    anatomy: [
      { term: 'Frames', note: 'Territórios onde a interface toma forma.' },
      { term: 'Componentes', note: 'Padrões visuais reutilizáveis.' },
      { term: 'Auto layout', note: 'Regras que preservam ritmo e adaptação.' },
      { term: 'Protótipo', note: 'Uma simulação do caminho do usuário.' }
    ],
    concepts: ['Frames', 'Componentes', 'Auto layout', 'Variantes', 'Protótipos'],
    archivistNote: 'O espaço onde composição, sistema visual e fluxo são testados antes da construção.'
  },
  Vite: {
    school: 'Instrumentos do Ofício', volume: 'IV', record: '07', avatar: null, sigil: 'V',
    anatomy: [
      { term: 'Dev server', note: 'Oficina rápida para ciclos de criação.' },
      { term: 'HMR', note: 'Atualiza módulos sem interromper o trabalho.' },
      { term: 'Bundle', note: 'Prepara os artefatos para entrega.' }
    ],
    concepts: ['Dev server', 'HMR', 'Módulos', 'Build', 'Plugins'],
    archivistNote: 'Reduz o intervalo entre uma decisão de interface e sua validação no navegador.'
  },
  Notion: {
    school: 'Instrumentos do Ofício', volume: 'IV', record: '09', avatar: null, sigil: 'N',
    anatomy: [
      { term: 'Páginas', note: 'Unidades de conhecimento conectadas.' },
      { term: 'Bases', note: 'Registros organizados por propriedades.' },
      { term: 'Visões', note: 'Leituras diferentes da mesma informação.' }
    ],
    concepts: ['Documentação', 'Bases', 'Planejamento', 'Registros', 'Colaboração'],
    archivistNote: 'Meu arquivo de apoio para preservar contexto, decisões e próximos passos.'
  },
  'Arquitetura Web': {
    school: 'Convergência Full-Stack', volume: 'V', record: '01', avatar: null, sigil: '∞',
    anatomy: [
      { term: 'Interface', note: 'A superfície onde a solução encontra pessoas.' },
      { term: 'Serviços', note: 'Regras e operações que sustentam o produto.' },
      { term: 'Dados', note: 'A memória persistente do sistema.' },
      { term: 'Contratos', note: 'Acordos claros entre cada camada.' }
    ],
    concepts: ['Camadas', 'Contratos', 'Serviços', 'Persistência', 'Observabilidade'],
    fieldNotes: {
      Savory: 'Integração entre descoberta de conteúdo, interface e persistência.',
      'Behorner-Control': 'Arquitetura que une agentes, API, banco e painel de operação.'
    },
    archivistNote: 'A visão do sistema inteiro orienta minhas decisões mesmo quando atuo em uma única camada.'
  },
  'APIs & Integrações': {
    school: 'Convergência Full-Stack', volume: 'V', record: '04', avatar: null, sigil: 'API',
    anatomy: [
      { term: 'Contrato', note: 'Define a forma de cada mensagem.' },
      { term: 'Recurso', note: 'Entidade exposta por uma rota.' },
      { term: 'Autorização', note: 'Controla quem atravessa cada portal.' },
      { term: 'Resposta', note: 'Retorno previsível para cada solicitação.' }
    ],
    concepts: ['REST', 'JSON', 'Autenticação', 'Validação', 'Tratamento de erros'],
    archivistNote: 'Integrações bem definidas mantêm sistemas diferentes trabalhando como uma única solução.'
  },
  'UX Responsiva': {
    school: 'Convergência Full-Stack', volume: 'V', record: '07', avatar: null, sigil: 'UX',
    anatomy: [
      { term: 'Fluxo', note: 'O caminho necessário para cumprir uma tarefa.' },
      { term: 'Hierarquia', note: 'Orienta o olhar e reduz dúvida.' },
      { term: 'Adaptação', note: 'Preserva a experiência em diferentes telas.' }
    ],
    concepts: ['Fluxos', 'Hierarquia', 'Breakpoints', 'Acessibilidade', 'Feedback'],
    archivistNote: 'Responsividade é preservar intenção e legibilidade, não apenas reduzir dimensões.'
  },
  'Deploy & Evolução': {
    school: 'Convergência Full-Stack', volume: 'V', record: '10', avatar: null, sigil: '↑',
    anatomy: [
      { term: 'Build', note: 'Consolida a versão pronta para entrega.' },
      { term: 'Ambiente', note: 'Configura o contexto de execução.' },
      { term: 'Versão', note: 'Marca um estado verificável do produto.' }
    ],
    concepts: ['Build', 'Ambientes', 'Versionamento', 'Entrega', 'Manutenção'],
    archivistNote: 'Publicar é apenas o começo de um ciclo contínuo de observação e melhoria.'
  }
};

const spellLibrary = document.querySelector('.spell-library');
const spellShelf = document.getElementById('spell-book-shelf');
const spellGrimoire = document.getElementById('spell-grimoire');
const spellInvocation = document.getElementById('spell-invocation');
let activeBook = null;
let activeSpellPage = 0;
let spellOpeningTimer;

function renderSpellShelf() {
  if (!spellShelf) return;
  const coverByDomain = { 'front-end': 'front', 'back-end': 'back', data: 'dados', tools: 'ferramentas' };
  // A ordem da estante é independente dos dados: Full-Stack permanece no trono central.
  const shelfDomains = ['front-end', 'back-end', 'full-stack', 'data', 'tools']
    .map(id => spellDomains.find(domain => domain.id === id));
  spellShelf.innerHTML = shelfDomains.map((domain, index) => `
    <button class="spell-book spell-book--${domain.id}${activeBook?.id === domain.id ? ' spell-book--active' : ''}" type="button" data-spell-book="${domain.id}" style="--book-accent:${domain.accent};--book-order:${index}" aria-label="Consultar grimório de ${domain.title}">
      ${coverByDomain[domain.id]
        ? `<img src="./assets/img/arcenal/${coverByDomain[domain.id]}.png" alt="Capa do grimório ${domain.title}" draggable="false">`
        : `<span class="spell-book__cover" aria-hidden="true"><i>${domain.rune}</i><strong>${domain.title}</strong><small>Volume 05</small></span>`}
      <span class="spell-book__label" aria-hidden="true">${domain.title}<small>Volume ${String(spellDomains.indexOf(domain) + 1).padStart(2, '0')}</small></span>
    </button>`).join('');
}

function normalizeGrimoireLabel(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/gi, '')
    .toLowerCase();
}

function findGrimoireProject(projectName) {
  const normalizedName = normalizeGrimoireLabel(projectName);
  return projects.find(project => {
    const normalizedTitle = normalizeGrimoireLabel(project.title);
    return normalizedTitle === normalizedName || normalizedTitle.includes(normalizedName) || normalizedName.includes(normalizedTitle);
  });
}

function getGrimoireEntry(technology, domain, index) {
  const customEntry = grimoireEntries[technology.name] || {};
  return {
    name: technology.name,
    school: customEntry.school || `Escola de ${domain.title}`,
    volume: customEntry.volume || String(spellDomains.indexOf(domain) + 1),
    record: customEntry.record || String(index + 1).padStart(2, '0'),
    avatar: customEntry.avatar || null,
    sigil: customEntry.sigil || domain.rune,
    level: technology.rank,
    description: technology.description,
    anatomy: customEntry.anatomy || [
      { term: 'Fundamento', note: technology.description },
      { term: 'Aplicação', note: 'Conhecimento aplicado em experiências e sistemas reais.' }
    ],
    concepts: customEntry.concepts || [technology.name, domain.title, 'Prática', 'Evolução'],
    fieldNotes: customEntry.fieldNotes || {},
    projectNames: technology.projects || [],
    archivistNote: customEntry.archivistNote || `${technology.name} permanece em estudo contínuo dentro da escola de ${domain.title}.`
  };
}

function renderGrimoireProject(projectName, entry, index) {
  const project = findGrimoireProject(projectName);
  const note = project?.shortDescription || entry.fieldNotes[projectName] || entry.description;
  const observation = entry.fieldNotes[projectName] || `Aplicação de ${entry.name} em contexto prático.`;
  return `
    <li class="grimoire__project-entry">
      <div class="grimoire__project-copy">
        <span class="grimoire__project-number">Registro ${String(index + 1).padStart(2, '0')}</span>
        <h4>${project?.title || projectName}</h4>
        <p>${note}</p>
        <q>${observation}</q>
      </div>
      <figure class="grimoire__project-sketch${project?.image ? ' has-image' : ''}" aria-label="Espaço para gravura do projeto ${project?.title || projectName}">
        ${project?.image
          ? `<img src="${project.image}" alt="Registro visual do projeto ${project.title}" loading="lazy">`
          : `<span aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>`}
      </figure>
    </li>`;
}

function renderSpellGrimoire(focusControl = false) {
  if (!spellGrimoire || !activeBook) return;
  const pageCount = activeBook.technologies.length;
  const technology = activeBook.technologies[activeSpellPage];
  const entry = getGrimoireEntry(technology, activeBook, activeSpellPage);
  const anatomy = entry.anatomy.slice(0, 4);
  const projectsToRender = entry.projectNames.slice(0, 4);
  spellGrimoire.style.setProperty('--book-accent', activeBook.accent);
  spellGrimoire.classList.add('grimoire');
  spellGrimoire.innerHTML = `
    <button class="spell-grimoire__close grimoire__close" type="button" aria-label="Fechar grimório">
      <span aria-hidden="true">✦</span>
    </button>
    <div class="spell-grimoire__spread grimoire__spread">
      <article class="spell-grimoire__page grimoire__page grimoire__page--left">
        <header class="grimoire__page-header">
          <span class="grimoire__folio">Bestiário ${String(activeSpellPage + 1).padStart(2, '0')}</span>
          <h3 class="grimoire__technology-title">${entry.name}</h3>
          <p class="grimoire__school">${entry.school}</p>
          <small>Volume ${entry.volume} · Registro ${entry.record}</small>
        </header>

        <section class="grimoire__study" aria-label="Anatomia de ${entry.name}">
          <figure class="grimoire__avatar${entry.avatar ? ' has-image' : ''}">
            ${entry.avatar
              ? `<img src="${entry.avatar}" alt="Entidade visual de ${entry.name}">`
              : `<span class="grimoire__avatar-sigil" aria-hidden="true">${entry.sigil}</span><figcaption>Retrato em catalogação</figcaption>`}
          </figure>
          <div class="grimoire__anatomy">
            ${anatomy.map((item, index) => `<div class="grimoire__anatomy-note" style="--note-index:${index}">
              <strong>${item.term}</strong><span>${item.note}</span>
            </div>`).join('')}
          </div>
          <div class="grimoire__diagram" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
        </section>

        <div class="grimoire__left-footer">
          <section class="grimoire__concepts">
            <h4>Princípios catalogados</h4>
            <ul>${entry.concepts.slice(0, 5).map(concept => `<li>${concept}</li>`).join('')}</ul>
          </section>
          <div class="grimoire__seal" aria-label="Selo do domínio ${activeBook.title}">
            <span aria-hidden="true">${activeBook.rune}</span>
            <small>${activeBook.title}</small>
          </div>
        </div>
      </article>

      <article class="spell-grimoire__page grimoire__page grimoire__page--right">
        <header class="grimoire__field-header">
          <span>Caderno do arquivista</span>
          <h3>Registro de Campo</h3>
          <p>Onde este conhecimento foi colocado à prova.</p>
        </header>
        <ol class="grimoire__field-log">
          ${projectsToRender.map((projectName, index) => renderGrimoireProject(projectName, entry, index)).join('')}
        </ol>
        <aside class="grimoire__archivist-note">
          <span>Nota do arquivista</span>
          <p>“${entry.archivistNote}”</p>
        </aside>
      </article>
    </div>
    <nav class="spell-grimoire__navigation grimoire__navigation" aria-label="Tecnologias do grimório">
      <button type="button" data-spell-page="prev" ${activeSpellPage === 0 ? 'disabled' : ''}>‹ registro anterior</button>
      <span>${activeSpellPage + 1} / ${pageCount}</span>
      <button type="button" data-spell-page="next" ${activeSpellPage >= pageCount - 1 ? 'disabled' : ''}>próximo registro ›</button>
    </nav>`;
  spellGrimoire.hidden = false;
  if (focusControl) spellGrimoire.querySelector('.spell-grimoire__close')?.focus();
}

function openSpellBook(bookId) {
  const selected = spellDomains.find(domain => domain.id === bookId);
  if (!selected || !spellLibrary) return;
  window.clearTimeout(spellOpeningTimer);
  activeBook = selected;
  activeSpellPage = 0;
  spellLibrary.dataset.libraryState = 'selecting';
  renderSpellShelf();
  if (spellInvocation) {
    spellInvocation.style.setProperty('--book-accent', selected.accent);
    spellInvocation.innerHTML = `<span></span><i>${selected.rune}</i><strong>${selected.title}</strong><small>Volume ${String(spellDomains.indexOf(selected) + 1).padStart(2, '0')}</small>`;
    spellInvocation.hidden = false;
  }
  spellOpeningTimer = window.setTimeout(() => {
    spellLibrary.dataset.libraryState = 'opening';
    spellOpeningTimer = window.setTimeout(() => {
      if (spellInvocation) spellInvocation.hidden = true;
      renderSpellGrimoire(true);
      spellLibrary.dataset.libraryState = 'open';
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 20 : 420);
  }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 20 : 520);
}

function closeSpellBook() {
  if (!spellLibrary || !activeBook) return;
  const returnId = activeBook.id;
  spellLibrary.dataset.libraryState = 'closing';
  if (spellInvocation) {
    spellInvocation.innerHTML = `<span></span><i>${activeBook.rune}</i><strong>${activeBook.title}</strong><small>Retornando</small>`;
    spellInvocation.style.setProperty('--book-accent', activeBook.accent);
    spellInvocation.hidden = false;
  }
  spellGrimoire.hidden = true;
  window.setTimeout(() => {
    activeBook = null;
    activeSpellPage = 0;
    spellLibrary.dataset.libraryState = 'idle';
    renderSpellShelf();
    if (spellInvocation) spellInvocation.hidden = true;
    spellShelf?.querySelector(`[data-spell-book="${returnId}"]`)?.focus();
  }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 30 : 280);
}

spellShelf?.addEventListener('click', event => {
  const book = event.target.closest('[data-spell-book]');
  if (book) openSpellBook(book.dataset.spellBook);
});

spellGrimoire?.addEventListener('click', event => {
  if (event.target.closest('.spell-grimoire__close')) return closeSpellBook();
  const pageButton = event.target.closest('[data-spell-page]');
  if (!pageButton || !activeBook) return;
  const pageCount = activeBook.technologies.length;
  activeSpellPage = Math.max(0, Math.min(pageCount - 1, activeSpellPage + (pageButton.dataset.spellPage === 'next' ? 1 : -1)));
  spellGrimoire.classList.remove('is-turning');
  void spellGrimoire.offsetWidth;
  spellGrimoire.classList.add('is-turning');
  renderSpellGrimoire();
});

spellLibrary?.addEventListener('keydown', event => {
  if (event.key === 'Escape' && activeBook && spellLibrary.dataset.libraryState === 'open') {
    event.preventDefault();
    closeSpellBook();
  }
});

renderSpellShelf();
