// O Conselho dos Oito — configuração central: cenário, assentos, conselheiros e animação.
// Os componentes (voice-experiences.js e council-members.js) só leem este arquivo; nada de posição ou texto fica espalhado.
//
// COMO ATIVAR UM NOVO CONSELHEIRO (ex.: o Gnomo Engenheiro)
//   1. Coloque a arte oficial em assets/img/Portais/avatares/ e inclua-a em scripts/prepare-council-avatars.py (ART):
//      desenhe o polígono da silhueta (sem trono nem objetos de mesa) e rode `python scripts/prepare-council-avatars.py --preview`.
//      Isso gera, em assets/img/conselho/: <id>-cena.webp, <id>-arte.webp e <id>-retrato.webp.
//   2. Aqui, no membro correspondente: troque `status` para 'ready' e preencha `avatar` (scene, art, portrait) e `placement`
//      (x, y, width, occlusion). Use `?councilDebug` na URL para ajustar x/y/width ao vivo e copiar o JSON.
//   3. Pronto: o avatar, o hover, o modal individual e o retrato da faixa mobile passam a existir. Nenhum componente muda.
//
// COORDENADAS: tudo em % do cenário (1536x1024), nunca em pixels da tela, então acompanham o redimensionamento.
//   placement.x / placement.y  ponto de ancoragem = centro da BASE do recorte (onde o personagem "senta" na cadeira)
//   placement.width            largura do recorte, em % da largura do cenário
//   placement.occlusion        polígono [[x,y],...] em % do cenário: reaparece por cima do personagem (braço da cadeira, quina
//                              da mesa), para ele não parecer flutuando. Sem polígono, nada cobre o personagem.
//   placement.zIndex           ordem entre personagens (cadeiras mais próximas da câmera = maior)
//
// STATUS: 'ready' = tem arte oficial (avatar.art + avatar.portrait): abre modal e aparece na faixa de retratos. Se também tiver
//   avatar.scene + placement, senta na cadeira do cenário ao clicar. 'awaiting-art' = cadeira vazia, sem modal e sem imagem.
//
// Os textos dos conselheiros são narrativa da guilda (ficção editorial), não depoimentos. Depoimentos reais ficam em
// voiceRecords.js (environment 'council') e são ligados ao conselheiro por `records: [ids]`.
(() => {
  const px = (x, y) => [+(x / 1536 * 100).toFixed(2), +(y / 1024 * 100).toFixed(2)];
  const poly = points => points.map(([x, y]) => px(x, y));

  // Assentos: hotspots sobre as cadeiras do cenário. `hasChair: false` = a arte não tem cadeira nesse lugar (ver LEIA-ME).
  const seats = [
    { id: 'seat-01', label: 'Assento oeste superior', x: 21.2, y: 36.6, width: 16, height: 26, zIndex: 4, hasChair: true },
    { id: 'seat-02', label: 'Assento noroeste', x: 37.6, y: 26.9, width: 11, height: 18, zIndex: 3, hasChair: true },
    { id: 'seat-03', label: 'Assento norte', x: 50, y: 27, width: 9, height: 18, zIndex: 2, hasChair: false },
    { id: 'seat-04', label: 'Assento nordeste', x: 63.6, y: 26.2, width: 10, height: 15, zIndex: 3, hasChair: true },
    { id: 'seat-05', label: 'Assento leste superior', x: 79.6, y: 38.2, width: 14, height: 25, zIndex: 4, hasChair: true },
    { id: 'seat-06', label: 'Assento leste frontal', x: 81.4, y: 63.7, width: 22, height: 38, zIndex: 6, hasChair: true },
    { id: 'seat-07', label: 'Assento do guardião', x: 50.1, y: 74, width: 17.5, height: 36, zIndex: 8, hasChair: true },
    { id: 'seat-08', label: 'Assento oeste frontal', x: 17.7, y: 60.3, width: 20.5, height: 38.5, zIndex: 6, hasChair: true },
  ];

  // zIndex = profundidade (cadeiras mais próximas da câmera = maior): decide quem fica na frente de quem.
  const members = [
    {
      id: 'mestre', seatId: 'seat-08', status: 'ready',
      name: 'Mestre da Guilda', title: 'Líder e integrador do conselho', species: 'Humano',
      role: 'Liderança e integração',
      description: 'Na história desta guilda, o Mestre é quem reúne as vozes do conselho. Ele aprendeu ensinando, passou a orientar quem ensina e hoje cuida para que tecnologia, pessoas e responsabilidade caminhem na mesma direção.',
      specialty: 'Liderança técnica e pedagógica, mentoria e integração entre equipes.',
      skills: ['Liderança', 'Mentoria', 'Integração de equipes', 'Visão de produto'],
      symbol: 'wizard-code',
      theme: { accent: '#c14fd6', secondary: '#7a2fa8', glow: 'rgba(201,79,214,.45)', paper: '#1d0f26' },
      avatar: { scene: 'mestre-cena.webp', art: 'mestre-arte.webp', portrait: 'mestre-retrato.webp' },
      placement: {
        x: 19.6, y: 65.2, width: 13.4, zIndex: 6, transformOrigin: '50% 100%',
        occlusion: poly([[298, 650], [318, 626], [395, 620], [432, 634], [442, 662], [442, 705], [298, 705]]),
      },
      animations: { enabled: true, breathing: true, sway: true, blink: false, headMovement: false },
      records: [],
    },
    {
      id: 'coruja', seatId: 'seat-06', status: 'ready',
      name: 'Coruja Arquivista', title: 'Guardiã do Conhecimento', species: 'Coruja antropomórfica',
      role: 'Ensino, conhecimento e documentação',
      description: 'Nada se perde sob o olhar da Coruja. Ela lê o que a guilda aprende, transforma em lições claras e guarda cada descoberta em livros, para que o próximo aprendiz encontre o caminho já iluminado.',
      specialty: 'Didática, documentação técnica e curadoria do que a guilda aprende.',
      skills: ['Ensino', 'Documentação', 'Pesquisa', 'Curadoria do conhecimento'],
      symbol: 'book-quill',
      theme: { accent: '#e3a548', secondary: '#4b4fc4', glow: 'rgba(227,165,72,.42)', paper: '#14142b' },
      avatar: { scene: 'coruja-cena.webp', art: 'coruja-arte.webp', portrait: 'coruja-retrato.webp' },
      placement: {
        x: 82, y: 68.6, width: 18.5, zIndex: 6, transformOrigin: '50% 100%',
        occlusion: poly([[1095, 690], [1105, 655], [1140, 648], [1200, 650], [1228, 668], [1234, 705], [1095, 708]]),
      },
      animations: { enabled: true, breathing: true, sway: true, blink: false, headMovement: false },
      records: [],
    },
    {
      id: 'gnomo', seatId: 'seat-01', status: 'ready',
      name: 'Gnomo Engenheiro', title: 'Inventor da guilda', species: 'Gnomo inventor',
      role: 'Engenharia e automação',
      description: 'Constrói as engrenagens que mantêm a guilda funcionando. Onde outros veem tarefa repetitiva, o Gnomo vê um mecanismo esperando para ser inventado.',
      specialty: 'Engenharia de software, automação e ferramentas que poupam trabalho repetitivo.',
      skills: ['Engenharia', 'Automação', 'Ferramentas', 'Resolução de problemas'],
      symbol: 'gear',
      theme: { accent: '#d8a050', secondary: '#7a5230', glow: 'rgba(216,160,80,.42)', paper: '#1e150b' },
      avatar: { scene: 'gnomo-cena.webp', art: 'gnomo-arte.webp', portrait: 'gnomo-retrato.webp' },
      placement: {
        x: 19.4, y: 43.4, width: 12, zIndex: 4, transformOrigin: '50% 100%',
        occlusion: poly([[240, 442], [255, 415], [300, 405], [325, 418], [335, 445], [335, 485], [245, 485]]),
      },
      animations: { enabled: true, breathing: true, sway: true, blink: false, headMovement: false },
      records: [],
    },
    {
      id: 'draconata', seatId: 'seat-02', status: 'ready',
      name: 'Draconata Estrategista', title: 'Estrategista do conselho', species: 'Criatura dracônica',
      role: 'Estratégia e arquitetura',
      description: 'Enxerga o tabuleiro inteiro antes do primeiro movimento. A Draconata desenha a arquitetura por trás de cada decisão e pensa sempre alguns passos além do presente.',
      specialty: 'Arquitetura de sistemas, planejamento e decisões de longo prazo.',
      skills: ['Estratégia', 'Arquitetura', 'Planejamento'],
      symbol: 'flame',
      theme: { accent: '#d85a8a', secondary: '#6a1f4a', glow: 'rgba(216,90,138,.42)', paper: '#240d1a' },
      avatar: { scene: 'draconata-cena.webp', art: 'draconata-arte.webp', portrait: 'draconata-retrato.webp' },
      placement: {
        x: 37.6, y: 36.2, width: 11, zIndex: 2, transformOrigin: '50% 100%',
        occlusion: poly([[500, 352], [560, 345], [620, 340], [660, 350], [660, 400], [500, 400]]),
      },
      animations: { enabled: true, breathing: true, sway: true, blink: false, headMovement: false },
      records: [],
    },
    {
      id: 'goblin', seatId: 'seat-04', status: 'ready',
      name: 'Goblin Inventor', title: 'Experimentador da guilda', species: 'Goblin',
      role: 'Prototipagem e experimentação',
      description: 'Testa o impossível em oficinas improvisadas e traz de volta o que funciona. Para o Goblin, todo erro é só um protótipo que ainda não encontrou seu lugar.',
      specialty: 'Protótipos rápidos, testes de ideias e soluções criativas fora do padrão.',
      skills: ['Prototipagem', 'Experimentação', 'Criatividade'],
      symbol: 'flask',
      theme: { accent: '#8fd46a', secondary: '#3a6a2a', glow: 'rgba(143,212,106,.42)', paper: '#0f1d0e' },
      avatar: { scene: 'goblin-cena.webp', art: 'goblin-arte.webp', portrait: 'goblin-retrato.webp' },
      placement: {
        x: 64, y: 35.4, width: 10.8, zIndex: 2, transformOrigin: '50% 100%',
        occlusion: poly([[890, 346], [960, 340], [1040, 344], [1060, 352], [1060, 400], [890, 400]]),
      },
      animations: { enabled: true, breathing: true, sway: true, blink: false, headMovement: false },
      records: [],
    },
    {
      id: 'lobo', seatId: 'seat-05', status: 'ready',
      name: 'Lobo Guardião', title: 'Protetor do conselho', species: 'Lobo antropomórfico',
      role: 'Proteção e confiabilidade',
      description: 'Vigia as fronteiras da guilda com escudo e paciência. Nada frágil chega à mesa sem passar pelo olhar do Lobo.',
      specialty: 'Segurança, confiabilidade e proteção do que a equipe constrói.',
      skills: ['Segurança', 'Confiabilidade', 'Revisão de código'],
      symbol: 'shield',
      theme: { accent: '#8fa6d8', secondary: '#3a4a78', glow: 'rgba(143,166,216,.42)', paper: '#10152a' },
      avatar: { scene: 'lobo-cena.webp', art: 'lobo-arte.webp', portrait: 'lobo-retrato.webp' },
      placement: {
        x: 80.4, y: 44.4, width: 12.4, zIndex: 4, transformOrigin: '50% 100%',
        occlusion: poly([[1198, 458], [1215, 440], [1280, 438], [1295, 452], [1290, 500], [1200, 500]]),
      },
      animations: { enabled: true, breathing: true, sway: true, blink: false, headMovement: false },
      records: [],
    },
    // ---- com arte oficial, mas sem cadeira de frente no cenário: aparecem pelo modal e pela faixa de retratos ----
    // (a cadeira do guardião mostra só o encosto; não há cadeira norte). Para sentá-los, o cenário precisa de cadeiras viradas
    // para a câmera; depois basta incluir `scene` e `placement` aqui, sem tocar em componente.
    {
      id: 'raposa', seatId: 'seat-07', status: 'ready',
      name: 'Raposa Emissária', title: 'Mensageira da guilda', species: 'Raposa antropomórfica',
      role: 'Comunicação e conexões',
      description: 'Leva as mensagens entre salões e cria as pontes que ligam pessoas e ideias. Quando duas partes da guilda precisam se entender, é a Raposa quem entrega a carta certa.',
      specialty: 'Comunicação entre equipes, alinhamento e apresentação de ideias.',
      skills: ['Comunicação', 'Conexões', 'Apresentação'],
      symbol: 'scroll',
      theme: { accent: '#e8824a', secondary: '#7a3a1a', glow: 'rgba(232,130,74,.42)', paper: '#241208' },
      avatar: { art: 'raposa-arte.webp', portrait: 'raposa-retrato.webp' },
      placement: null, animations: { enabled: false }, records: [],
    },
    {
      id: 'ent', seatId: 'seat-03', status: 'ready',
      name: 'Ent Explorador', title: 'Explorador ancestral', species: 'Criatura vegetal ancestral',
      role: 'Exploração e crescimento',
      description: 'Guarda a memória das raízes da guilda e explora o que ainda está por crescer. O Ent caminha devagar, mas chega onde ninguém chegou.',
      specialty: 'Aprendizado contínuo, exploração de novas tecnologias e crescimento sustentável.',
      skills: ['Exploração', 'Aprendizado contínuo', 'Crescimento'],
      symbol: 'leaf',
      theme: { accent: '#6fd48a', secondary: '#2a6a3a', glow: 'rgba(111,212,138,.42)', paper: '#0d1d14' },
      avatar: { art: 'ent-arte.webp', portrait: 'ent-retrato.webp' },
      placement: null, animations: { enabled: false }, records: [],
    },
  ];

  window.councilConfig = {
    scene: 'assets/img/conselho/camara-conselho.webp',
    assetBase: 'assets/img/conselho/',
    seats,
    members,
    // Movimento discreto: só transform; nunca comprime a imagem para simular expressão.
    animation: {
      breath: { scale: 1.006, lift: 0.35, duration: 3.4 },      // lift em % da altura do recorte
      sway: { rotation: 0.35, shift: 0.25, min: 3.6, max: 6.2 }, // shift em % da largura do recorte
      hover: { lift: 1.4, duration: 0.25 },                      // % da altura do recorte
      stagger: 0.7,                                              // atraso entre personagens, em segundos
      modal: { duration: 0.55, text: 0.07 },                     // abertura do modal individual
      // As cadeiras começam vazias: o conselheiro aparece ao clicar no assento. `persist: false` o faz sumir de novo ao fechar.
      reveal: { onClick: false, persist: false, modalDelay: 0.65 }, // modalDelay: espera a entrada do avatar antes de abrir o modal
    },
    // Recursos futuros, só ativados quando houver sprites: avatar.blink / avatar.speaking / avatar.alternate.
  };
})();
