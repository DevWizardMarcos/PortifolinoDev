const btn = document.querySelector('.btnIncio');
const personagem = document.getElementById('personagem-run');
const frameImg = document.getElementById('frame-personagem');

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

function renderCards(filtro) {
  const grade = document.getElementById('grade-projetos');
  if (!grade) return;

  const lista = filtro === 'todos' ? projetos : projetos.filter(p => p.categoria === filtro);

  grade.innerHTML = lista.map(p => `
    <div class="projeto-card" data-cat="${p.categoria}">
      <div class="card-thumb">
        <div class="card-thumb-overlay">
          <div class="card-icone">${p.icone}</div>
          <span class="card-titulo">${p.titulo}</span>
        </div>
      </div>
      <div class="card-body-legado">
        <span class="card-categoria">${p.categoriaLabel}</span>
        <p class="card-desc">${p.descricao}</p>
        <div class="card-techs">
          ${p.techs.map(t => `<span class="tech-badge">${t}</span>`).join('')}
        </div>
      </div>
      <div class="card-footer-legado">
        <span class="card-impacto impacto-${p.impacto}">IMPACTO ${p.impacto.toUpperCase()}</span>
        <span class="card-nivel">${p.nivel}</span>
      </div>
    </div>
  `).join('');
}

renderCards('todos');

document.getElementById('elementoSelecionar')?.addEventListener('click', (e) => {
  const btn = e.target.closest('.filtro-btn');
  if (!btn) return;
  document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('ativo'));
  btn.classList.add('ativo');
  renderCards(btn.dataset.filter);
});