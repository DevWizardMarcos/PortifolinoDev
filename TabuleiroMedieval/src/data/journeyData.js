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
    beaconColor: 0x6a5cff, // farol azul/violeta
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
    beaconColor: 0xf0d999, // farol dourado
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
    beaconColor: 0xff4d4d, // farol vermelho
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
    beaconColor: 0xff4dc4, // farol magenta
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
    beaconColor: 0x7b2cff, // farol roxo/azul
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

// Posição [x, z] de último recurso do spawn do jogador no modo exploração,
// usada apenas se o world.glb não tiver um objeto GAME_PlayerSpawn/
// PLAYER_SPAWN (ver Experience.resolveSpawnPosition) — hoje o world.glb já
// tem esse objeto, então este fallback raramente entra em ação.
export const playerSpawnFallback = [0, hubPosition[1] + 3.6]

// Fragmentos de memória (POIs) — exemplo funcional único por enquanto.
// `posicao` aqui é só metadado de conteúdo; a posição real no mundo é
// escolhida pelo Experience perto de um ponto de interesse do world.glb.
// EDITE AQUI para adicionar mais fragmentos da sua trajetória.
export const memories = [
  {
    id: 'memory-origem',
    titulo: 'Fragmento de Memória',
    subtitulo: 'O início da jornada',
    descricao:
      'Antes dos reinos e castelos, havia só curiosidade: a primeira linha de código escrita sem saber exatamente o que ela faria. Esse mapa é a trajetória construída a partir dali.',
    tecnologias: [],
    links: [],
    posicao: [-4, 2.2],
  },
]
