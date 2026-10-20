// Capítulos de "Minha Jornada — Os Portais do Tempo".
// Para editar o conteúdo, altere apenas este arquivo. Cada capítulo aceita:
//   id           — precisa casar com o portal: href="#capitulo-<id>" no index.html
//   year, title, subtitle (frase de abertura), summary (narrativa curta)
//   experiences  — lista de textos
//   achievements — lista opcional de conquistas
//   technologies — lista de tags; tagsTitle opcional troca o título do bloco
//   projects     — { name, description, live?, github? }
//   scene        — { variant, label, avatar, avatarAlt, image?, imageAlt?, imageFocus?, imageFit?, portal, memories? }
//                  memories: { source, label } — abre as Memórias Interativas com os dados de window[source]
//                  variant: library | forge | tower | council | horizon
//                  portal: cor do vórtice usado na travessia (azul, laranja, roxo, vermelho, dourado)
//   theme, themeRgb — cor do capítulo
//   story        — opcional: cenas sequenciais exibidas antes do resumo. Cada cena aceita:
//                  id, kicker, title, narrative,
//                  assets   { shot?, shotAlt?, shotFocus? } — ilustração em tela cheia (ex.: cena 2)
//                  lighting { moon, candle, monitor, blue, omen } — intensidades de 0 a 1
//                  avatar   { state: idle | focus | typing }
//                  screen   (dim | lesson | code | site), notebook (few | notes | wireframe)
//                  effects  [runes, interface, sweep]
//                  camera   { zoom, x, y } — x/y em %; transition: fade | shot
window.journeyChapters = (() => {
const AVATAR_FRONT = 'assets/img/Jornada/avatar de frente.png';
const AVATAR_SIDE = 'assets/img/Jornada/avatar de lado.png';

return [
  {
    id: '2020',
    year: '2020',
    title: 'O Despertar',
    subtitle: 'Toda jornada começa quando a curiosidade vence o medo do desconhecido.',
    summary: 'Início da formação em desenvolvimento web, com estudos orientados e projetos práticos. Essa etapa construiu a base para transformar conceitos de programação em interfaces funcionais.',
    experiences: [
      'Formação inicial em programação pela Danki Code, com foco nos fundamentos do desenvolvimento web.',
      'Aplicação prática do conteúdo na estruturação, estilização e publicação das primeiras páginas.',
      'Desenvolvimento de projetos próprios para consolidar aprendizado, autonomia e resolução de problemas.',
    ],
    technologies: ['HTML', 'CSS'],
    projects: [
      {
        name: 'StarBucks',
        description: 'Releitura de um dos primeiros projetos, reconstruída em 2025 para demonstrar a evolução técnica e visual desde o início da carreira.',
        live: 'https://devwizardmarcos.github.io/Projeto-StarBucks-Old/',
        github: 'https://github.com/DevWizardMarcos/Projeto-StarBucks-Old',
      },
    ],
    theme: '#6fbcff',
    themeRgb: '111, 188, 255',
    scene: {
      variant: 'library',
      label: 'O primeiro estudo',
      avatar: AVATAR_FRONT,
      avatarAlt: 'Avatar de Marcos estudando programação em um ambiente medieval',
      portal: 'azul',
    },
    story: [
      {
        id: 'curiosidade',
        kicker: 'A Curiosidade',
        title: 'Toda jornada começa com uma pergunta.',
        narrative: 'Em 2020, a programação ainda era um território desconhecido para mim. Mas a curiosidade começou a falar mais alto, e foi ela que abriu o primeiro portal da minha jornada.',
        assets: {
          shot: 'assets/img/Jornada/comecando-curiosidade.jpg',
          shotAlt: 'O avatar de Marcos, pensativo, diante do laptop em um quarto gótico à noite, com a lua na janela, velas acesas e um caderno de ideias aberto em 2020.',
          shotFocus: '45% 40%',
        },
        lighting: { moon: 1, candle: 1, monitor: 0.2, blue: 0.15, omen: 0 },
        avatar: { state: 'idle' },
        screen: 'dim',
        notebook: 'few',
        effects: [],
        camera: { zoom: 1, x: 0, y: 0 },
        transition: 'fade',
      },
      {
        id: 'primeiro-contato',
        kicker: 'O Primeiro Contato',
        title: 'Foi aqui que tudo começou.',
        narrative: 'Foi pela Danki Code que dei meus primeiros passos no universo da programação. A primeira aula não trouxe apenas conteúdo — ela marcou o instante em que esse caminho começou a fazer sentido.',
        assets: {
          shot: 'assets/img/Jornada/comecando-danki.jpg',
          shotAlt: 'O avatar de Marcos, de costas, assiste à primeira aula da Danki Code; no monitor, o slide “Bem-vindo! O que é este curso?”.',
          shotFocus: '30% 32%',
        },
        lighting: { moon: 0.8, candle: 0.8, monitor: 0.7, blue: 0.5, omen: 0 },
        avatar: { state: 'focus' },
        screen: 'lesson',
        notebook: 'few',
        effects: [],
        camera: { zoom: 1.05, x: -2, y: -1 },
        transition: 'shot',
      },
      {
        id: 'conhecimento',
        kicker: 'O Despertar do Conhecimento',
        title: 'Os primeiros símbolos ganharam significado.',
        narrative: 'HTML e CSS deixaram de parecer nomes distantes e começaram a se transformar em ferramentas de criação. Foi nesse momento que a teoria começou a ganhar forma dentro da prática.',
        assets: {
          shot: 'assets/img/Jornada/primeiro-projeto.jpg',
          shotAlt: 'O avatar de Marcos codando no laptop: o editor mostra index.html e style.css de uma landing page com formulário de contato, e o caderno ao lado traz o rascunho do layout e a checklist do projeto.',
          shotFocus: '35% 42%',
        },
        lighting: { moon: 0.65, candle: 0.8, monitor: 0.9, blue: 0.8, omen: 0 },
        avatar: { state: 'typing' },
        screen: 'code',
        notebook: 'notes',
        effects: ['runes'],
        camera: { zoom: 1.08, x: -3, y: -2 },
        transition: 'fade',
      },
      {
        id: 'primeiro-passo',
        kicker: 'O Primeiro Passo Real',
        title: 'A teoria começou a virar criação.',
        narrative: 'Os estudos deixaram de ser apenas observação e começaram a se transformar em prática. Foi assim que surgiram os primeiros projetos — pequenos no tamanho, mas enormes em importância para a jornada que estava nascendo.',
        assets: {
          shot: 'assets/img/Jornada/terminando-projeto.jpg',
          shotAlt: 'O avatar de Marcos, satisfeito, contempla o primeiro site concluído no monitor; no caderno, a checklist termina em “Projeto concluído!” e a frase “Eu consigo construir coisas reais!”.',
          shotFocus: '68% 45%',
        },
        lighting: { moon: 0.55, candle: 0.9, monitor: 1, blue: 1, omen: 1 },
        avatar: { state: 'typing' },
        screen: 'site',
        notebook: 'wireframe',
        effects: ['runes', 'interface', 'sweep'],
        camera: { zoom: 1.03, x: -1, y: -1 },
        transition: 'fade',
      },
    ],
  },
  {
    id: '2022',
    year: '2022',
    title: 'A Forja do Ofício',
    subtitle: 'O que era estudo ganhou peso de martelo: cada entrega passou a ter um cliente do outro lado.',
    summary: 'Transição do aprendizado para a atuação com clientes. Na MS Negócios, assumi o ciclo completo de criação de sites, do entendimento da necessidade à implantação da solução.',
    experiences: [
      'Fundação da MS Negócios para atender demandas de criação de sites e presença digital.',
      'Condução direta de briefing, planejamento visual, desenvolvimento, validação com o cliente e publicação.',
      'Ingresso no curso técnico da Infinity School, em Belo Horizonte, para ampliar a formação prática em desenvolvimento.',
    ],
    achievements: [
      'Primeira experiência empreendedora com responsabilidade integral pela comunicação com clientes e pelas entregas digitais.',
    ],
    tagsTitle: 'Frentes de atuação',
    technologies: ['Briefing com clientes', 'Design', 'Desenvolvimento web', 'Implantação'],
    projects: [],
    theme: '#ec9a4c',
    themeRgb: '236, 154, 76',
    scene: {
      variant: 'forge',
      label: 'A oficina do artesão',
      avatar: AVATAR_FRONT,
      avatarAlt: 'Avatar de Marcos trabalhando em uma forja medieval iluminada por brasas',
      image: 'assets/img/Jornada/Ms Negocios.png',
      imageAlt: 'Marcos desenvolvendo a identidade e o site da MS Negócios em uma oficina arcana',
      imageFocus: '50% 50%',
      portal: 'laranja',
    },
  },
  {
    id: '2024',
    year: '2024',
    title: 'A Torre do Saber',
    subtitle: 'Quem sobe a torre para aprender descobre, lá em cima, que também pode ensinar.',
    summary: 'Entrada na graduação e início da experiência profissional em educação tecnológica. Na Infinity School, passei a apoiar instrutores, orientar alunos e acompanhar projetos de desenvolvimento.',
    experiences: [
      'Monitor Estagiário Dev na Infinity School (nov. 2024 – abr. 2025), prestando suporte técnico e pedagógico a instrutores e alunos.',
      'Mentoria individual, orientação de projetos front-end e back-end e contribuição na melhoria dos conteúdos do curso.',
      'Graduação em Análise e Desenvolvimento de Sistemas na Descomplica Faculdade Digital, iniciada em 2024 e com conclusão prevista para 2027.',
    ],
    achievements: ['Promoção de aluno para monitor, assumindo responsabilidade direta pelo desenvolvimento técnico de outros estudantes.'],
    technologies: ['React 18', 'React Router', 'Vite', 'Node.js', 'JavaScript', 'Bootstrap 5.3', 'HTML5', 'CSS3'],
    projects: [
      {
        name: 'Savory',
        description: 'Aplicação de descoberta de receitas com consumo da API TheMealDB, navegação entre páginas e interface responsiva.',
        live: 'https://devwizardmarcos.github.io/ReactSavory-/',
        github: 'https://github.com/DevWizardMarcos/ReactSavory-',
      },
      {
        name: 'Deadpool',
        description: 'Experiência web temática com narrativa visual, organização de conteúdo e carrosséis interativos.',
        live: 'https://devwizardmarcos.github.io/Deadpool-Ultima-Aventura-O-Fim-do-Jogo/',
        github: 'https://github.com/DevWizardMarcos/Deadpool-Ultima-Aventura-O-Fim-do-Jogo',
      },
    ],
    theme: '#a985ff',
    themeRgb: '169, 133, 255',
    scene: {
      variant: 'tower',
      label: 'O alto da torre',
      avatar: AVATAR_SIDE,
      avatarAlt: 'Avatar de Marcos no alto de uma torre arcana cercado por livros flutuantes',
      image: 'assets/img/Jornada/entrando na infinity.png',
      imageAlt: 'Marcos entrando na Infinity School com uma mochila, em um ambiente iluminado por tons roxos e dourados',
      imageFocus: '50% 50%',
      imageFit: 'cover',
      hoverImage: 'assets/img/Jornada/saindo.png',
      hoverImageAlt: 'Marcos de frente ao entrar na Infinity School',
      memories: { source: 'infinityMemories', label: 'Memórias Interativas da Infinity School' },
      portal: 'roxo',
    },
  },
  {
    id: '2025',
    year: '2025–2026',
    title: 'O Chamado da Liderança',
    subtitle: 'Liderar é carregar a tocha à frente — e garantir que ninguém fique no escuro.',
    summary: 'Evolução da monitoria para posições de liderança técnica e pedagógica. A atuação reúne gestão de equipes, mentoria, organização de eventos educacionais e desenvolvimento de sistemas para operações reais.',
    experiences: [
      'Monitor PJ Líder / Sênior na Infinity School (abr. 2025 – presente), responsável pela coordenação do suporte técnico e pedagógico.',
      'Mentoria de alunos em projetos finais e apoio aos cursos Seja Full-Stack, Data Analytics, Data Science e AI / Automação do Zero.',
      'Desenvolvimento de sistemas web, APIs e automações para apoiar processos acadêmicos e operacionais.',
      'CEO da Connect CNX, com atuação em desenvolvimento Full-Stack, SEO e estratégia digital para projetos de clientes.',
    ],
    achievements: [
      'Mais de 100 alunos formados com acompanhamento direto.',
      'Mais de 20 workshops e 10 minicursos organizados por mês.',
      'Na Infinity School, a trajetória de aluno a monitor, professor de programação, líder de monitoria Dev, líder de projetos (incluindo Hackathons), líder de instrutores e líder de professores.',
    ],
    technologies: ['Python', 'FastAPI', 'Django', 'SQLAlchemy', 'SQL', 'Redis', 'React', 'Vite', 'Node.js', 'JavaScript', 'Bootstrap 5', 'SEO'],
    decisionPaths: [
      {
        id: 'mapa',
        symbol: '⌖',
        title: 'Mapa — Crônicas do Conhecimento',
        label: 'Palestras e encontros',
        question: 'Até onde a mensagem chegou?',
        description: 'Cada ponto registra uma palestra, workshop ou encontro em que uma experiência pessoal se transformou em direção para outras pessoas.',
        source: 'knowledgeMap',
      },
      {
        id: 'estandarte',
        symbol: '⚑',
        title: 'O Estandarte das Vozes',
        label: 'Feedbacks da jornada',
        question: 'Que marcas ficaram nas pessoas?',
        description: 'Relatos de alunos e de pessoas que dividiram projetos e responsabilidades mostram a liderança pelo olhar de quem viveu essa jornada.',
        source: 'banner',
        empty: {
          title: 'As primeiras vozes chegarão em breve',
          text: 'Este espaço está preparado para receber depoimentos autorizados de alunos, colegas, professores e parceiros.',
        },
      },
    ],
    projects: [
      { name: 'Behorner-Control', description: 'Sistema em desenvolvimento para centralizar o controle dos laboratórios da Infinity School.' },
      { name: 'Hackathon', description: 'Solução para gestão e automação de processos empresariais desenvolvida em contexto de Hackathon.' },
      {
        name: 'Infinity Open',
        description: 'Landing page de evento com apresentação da programação e fluxo direto de inscrição pelo WhatsApp.',
        live: 'https://devwizardmarcos.github.io/Infinity-Open-2026/',
        github: 'https://github.com/DevWizardMarcos/Infinity-Open-2026',
      },
      {
        name: 'Wayne',
        description: 'Aplicação temática com dashboard interativo e catálogo visual de Batmóveis.',
        live: 'https://devwizardmarcos.github.io/Projeto_Wayne/',
        github: 'https://github.com/DevWizardMarcos/Projeto_Wayne',
      },
    ],
    theme: '#f0607a',
    themeRgb: '240, 96, 122',
    scene: {
      variant: 'council',
      label: 'A mesa do conselho',
      avatar: AVATAR_SIDE,
      avatarAlt: 'Avatar de Marcos diante de uma mesa de conselho com estandartes e mapas',
      image: 'assets/img/Portais/Captulo IV/avatart capitulo IV.png',
      imageAlt: 'Marcos planejando aulas, projetos e mentorias em uma biblioteca arcana da Infinity School',
      imageFocus: '50% 50%',
      imageFit: 'cover',
      portal: 'vermelho',
    },
  },
  {
    id: '2026',
    year: '2026+',
    title: 'O Horizonte',
    subtitle: 'Este portal ainda está se formando — o próximo capítulo está sendo escrito.',
    summary: 'Próxima etapa da carreira: concluir a graduação, ampliar a entrega de sistemas reais e evoluir este portfólio como demonstração contínua de produto, código e experiência do usuário.',
    experiences: [
      'Graduação em Análise e Desenvolvimento de Sistemas em andamento, com conclusão prevista para 2027.',
      'Desenvolvimento contínuo do Behorner-Control para atender uma necessidade operacional real.',
      'Evolução do DevWizard Portfolio como projeto autoral de interface, narrativa e acessibilidade.',
    ],
    technologies: [],
    projects: [
      {
        name: 'DevWizard Portfolio',
        description: 'Portfólio autoral que combina narrativa RPG com uma experiência web responsiva e acessível.',
        github: 'https://github.com/DevWizardMarcos/PortifolinoDev',
      },
    ],
    invite: { text: 'Quer fazer parte do próximo capítulo?', href: '#contato', label: 'Enviar uma mensagem' },
    theme: '#e9c873',
    themeRgb: '233, 200, 115',
    scene: {
      variant: 'horizon',
      label: 'O amanhecer à frente',
      avatar: AVATAR_FRONT,
      avatarAlt: 'Avatar de Marcos sentado em uma muralha observando o horizonte dourado',
      portal: 'dourado',
    },
  },
];
})();
