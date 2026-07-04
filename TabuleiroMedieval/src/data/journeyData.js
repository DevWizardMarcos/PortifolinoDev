// =============================================================
// journeyData.js
// -------------------------------------------------------------
// Fonte única de conteúdo do "Mapa da Jornada".
// EDITE AQUI para trocar textos, posições dos reinos, cores e links.
// Nada de Three.js/DOM aqui — é só dado puro consumido pelo resto do app.
// =============================================================

// Posição [x, z] de cada reino sobre o terreno (y é calculado à parte).
// O terreno tem ~40 (x) por ~22 (z), então mantenha as posições dentro
// dessa faixa (aprox. -18..18 em x e -9..9 em z) para não "cair fora do mapa".
export const journeyPoints = [
  {
    id: 'danki-code',
    order: 0,
    nome: 'Danki Code',
    sigla: 'DC', // texto curto exibido no emblema/logo flutuante do castelo
    variante: 'pequeno', // composição do castelo — ver world/Markers.js
    subtitulo: 'Onde a jornada começou',
    descricao:
      'O primeiro reino da jornada: os fundamentos de programação, lógica e as primeiras batalhas contra bugs.',
    tecnologias: ['JavaScript', 'HTML', 'CSS', 'Lógica de Programação'],
    links: [{ label: 'Ver projeto', url: '#' }],
    posicao: [-14, 5],
    cor: 0x9b5de5, // roxo de destaque do reino — troque para diferenciar cada reino
  },
  {
    id: 'ms-negocios',
    order: 1,
    nome: 'MS Negócios',
    sigla: 'MS',
    variante: 'vila',
    subtitulo: 'O reino da estratégia',
    descricao:
      'Onde código encontrou negócio: entender processos, pessoas e como a tecnologia resolve problemas reais.',
    tecnologias: ['Gestão de Projetos', 'Processos', 'Análise de Negócio'],
    links: [{ label: 'Ver projeto', url: '#' }],
    posicao: [-7, -5.5],
    cor: 0x7b2cbf,
  },
  {
    id: 'infinity-school',
    order: 2,
    nome: 'Infinity School',
    sigla: 'IS',
    variante: 'grande',
    subtitulo: 'A torre do conhecimento',
    descricao:
      'Aprofundamento técnico: estruturas de dados, arquitetura de software e o hábito de aprender sem parar.',
    tecnologias: ['Node.js', 'Bancos de Dados', 'Arquitetura de Software'],
    links: [{ label: 'Ver projeto', url: '#' }],
    posicao: [0, 6],
    cor: 0xc77dff,
  },
  {
    id: 'dreams',
    order: 3,
    nome: 'Dreams',
    sigla: 'DR',
    variante: 'artistica',
    subtitulo: 'O vale da criação',
    descricao:
      'Projetos autorais e experimentação criativa — o espaço onde ideias viram produtos.',
    tecnologias: ['React', 'UI/UX', 'Produto'],
    links: [{ label: 'Ver projeto', url: '#' }],
    posicao: [7, -5.5],
    cor: 0x9d4edd,
  },
  {
    id: 'cnx',
    order: 4,
    nome: 'CNX',
    sigla: 'CNX',
    variante: 'tecnologica',
    subtitulo: 'O castelo atual',
    descricao:
      'O reino mais recente da jornada: sistemas robustos, times e desafios em maior escala.',
    tecnologias: ['Three.js', 'Vite', 'Sistemas Distribuídos'],
    links: [{ label: 'Ver projeto', url: '#' }],
    posicao: [14, 5],
    cor: 0x5a189a,
  },
]

// Conteúdo estático usado pelos itens de menu que não são reinos do mapa.
// EDITE AQUI os textos de "Sobre Mim" e "Contato".
export const siteInfo = {
  sobre: {
    titulo: 'Sobre Mim',
    subtitulo: 'O viajante por trás do mapa',
    descricao:
      'Desenvolvedor apaixonado por transformar conhecimento em criação. Este mapa representa reinos, batalhas e conquistas da minha trajetória profissional.',
    tecnologias: [],
    links: [{ label: 'LinkedIn', url: '#' }, { label: 'GitHub', url: '#' }],
  },
  contato: {
    titulo: 'Contato',
    subtitulo: 'Envie um corvo mensageiro',
    descricao: 'Vamos construir o próximo reino juntos? Fale comigo pelos canais abaixo.',
    tecnologias: [],
    links: [
      { label: 'E-mail', url: 'mailto:contato@devwizard.dev' },
      { label: 'WhatsApp', url: '#' },
    ],
  },
  projetos: {
    titulo: 'Projetos',
    subtitulo: 'Os reinos da jornada',
    descricao:
      'Cada reino no mapa representa um projeto ou fase da minha trajetória. Clique nos cristais roxos espalhados pelo mapa para explorar cada um.',
    tecnologias: [],
    links: [],
  },
}

// Cor base das estradas douradas que conectam os reinos.
export const roadColor = 0xd9c07c

// Cor do brilho/partículas mágicas (glow roxo do mapa).
export const magicGlowColor = 0x9b5de5

// Posição [x, z] da Árvore Central ("Núcleo da Criação") — o hub de onde
// todas as estradas partem em direção a cada reino.
export const hubPosition = [0, 0.4]
