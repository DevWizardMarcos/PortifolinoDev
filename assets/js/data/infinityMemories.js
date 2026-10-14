// Memórias Interativas — Infinity School (capítulo "A Torre do Saber").
// Para editar o conteúdo, altere apenas este arquivo. Estrutura:
//   diary     — registros da trajetória, em ordem cronológica: { id, period, title, description }
//   memories  — fotografias reais: { id, title, caption, src, srcSmall?, width, height, alt, hotspots }
//               hotspots: { id, x, y (em % da imagem), title, description, related: [ids do diário] }
//   tour      — Tour 360° com Marzipano (gratuito, sem chave de API):
//               panoramas: { id, title, src (imagem equiretangular local), yaw?, pitch?, fov?,
//                            links: [{ target, yaw, pitch, label? }] } — yaw/pitch em radianos.
//               Enquanto `panoramas` estiver vazio, o modal mostra o link do tour original no Google Maps.
// As fotografias são capturas do tour virtual público da Infinity School no Google Maps
// e a foto da entrada; os textos descrevem apenas o que aparece em cada imagem.
window.infinityMemories = (() => {
const DIR = 'assets/img/Jornada/infinity/';
const photo = (name, width, height) => ({
  src: `${DIR}${name}.webp`,
  srcSmall: `${DIR}${name}-800.webp`,
  width,
  height,
});

return {
  title: 'Infinity School',
  place: 'Belo Horizonte',
  credit: 'Fotografias: tour virtual público da Infinity School no Google Maps.',

  diary: [
    {
      id: 'aluno',
      period: '2022',
      title: 'O ingresso como aluno',
      description: 'Início do curso técnico da Infinity School, em Belo Horizonte, enquanto a MS Negócios dava os primeiros passos.',
    },
    {
      id: 'monitor-estagiario',
      period: 'nov. 2024 – abr. 2025',
      title: 'Monitor Estagiário Dev',
      description: 'Suporte aos instrutores, mentoria personalizada a alunos, contribuição no currículo e orientação em projetos front-end e back-end.',
    },
    {
      id: 'monitor-lider',
      period: 'abr. 2025 – presente',
      title: 'Monitor PJ Líder / Sênior',
      description: 'Liderança do suporte técnico e pedagógico, desenvolvimento de sistemas web, APIs e automações e mentoria de alunos em projetos finais. Suporte integral aos cursos Seja Full-Stack, Data Analytics, Data Science e AI / Automação do Zero.',
    },
    {
      id: 'formacao',
      period: '2025 – 2026',
      title: 'Formar pessoas',
      description: 'Mais de 100 alunos formados com acompanhamento direto e mais de 20 workshops e 10 minicursos organizados por mês.',
    },
    {
      id: 'lideranca',
      period: '2025 – 2026',
      title: 'A trilha da liderança',
      description: 'De aluno a monitor, professor de programação, líder de monitoria Dev, líder de projetos (incluindo Hackathons), líder de instrutores e líder de professores.',
    },
    {
      id: 'sistemas',
      period: '2025 – 2026',
      title: 'Sistemas para a escola',
      description: 'Behorner-Control, para o controle centralizado dos laboratórios (em desenvolvimento), e a landing page do evento Infinity Open, com programação e inscrição via WhatsApp.',
    },
  ],

  memories: [
    {
      id: 'entrada',
      title: 'A entrada',
      caption: 'O primeiro portal: a fachada de vidro vista da calçada.',
      src: `${DIR}entrada.webp`,
      width: 287,
      height: 510,
      alt: 'Entrada da Infinity School vista da calçada: portas de vidro emolduradas por lanternas, com o interior iluminado em roxo e trilhas de luz no piso.',
      hotspots: [
        { id: 'portas', x: 50, y: 52, title: 'As portas de vidro', description: 'Do lado de fora já se vê o interior em roxo e as trilhas de luz no piso que conduzem para dentro.', related: ['aluno'] },
        { id: 'lanternas', x: 89, y: 39, title: 'Lanternas na fachada', description: 'Lanternas acesas ladeiam a entrada, no mesmo estilo das que iluminam os corredores.', related: [] },
      ],
    },
    {
      id: 'hall',
      title: 'O hall',
      caption: 'Do lado de dentro, olhando de volta para a rua.',
      ...photo('hall', 1600, 602),
      alt: 'Hall de entrada visto de dentro: portas de vidro voltadas para a rua, duas lanternas em postes, uma poltrona azul e pôsteres da Infinity School.',
      hotspots: [
        { id: 'postes', x: 40, y: 45, title: 'Os postes de lanterna', description: 'Dois postes de lanterna guardam as portas de vidro, como sentinelas na passagem entre a rua e a escola.', related: ['aluno'] },
        { id: 'posteres', x: 94, y: 35, title: 'Pôsteres da Infinity School', description: 'Pôsteres com a marca da escola recebem quem chega.', related: [] },
      ],
    },
    {
      id: 'recepcao',
      title: 'A recepção',
      caption: 'O balcão iluminado sob o letreiro da escola.',
      ...photo('recepcao', 1600, 597),
      alt: 'Recepção da Infinity School: balcão com acabamento metálico iluminado por baixo, letreiro Infinity School na parede e pôsteres da escola ao lado.',
      hotspots: [
        { id: 'letreiro', x: 84, y: 30, title: 'O letreiro', description: 'O nome Infinity School em destaque acima do balcão.', related: ['aluno'] },
        { id: 'balcao', x: 60, y: 70, title: 'O balcão', description: 'Balcão com acabamento metálico e luz âmbar, logo após o hall.', related: [] },
      ],
    },
    {
      id: 'corredor',
      title: 'O corredor principal',
      caption: 'Mesas compartilhadas e trilhas de luz pelo piso.',
      ...photo('corredor', 1600, 589),
      alt: 'Corredor principal: recepção com o logotipo à esquerda, mesas de madeira com cadeiras à direita e linhas de luz âmbar no piso em direção ao fundo.',
      hotspots: [
        { id: 'mesas', x: 70, y: 72, title: 'As mesas compartilhadas', description: 'Mesas de madeira ao longo da parede de tijolos, sob as lanternas.', related: [] },
        { id: 'trilha', x: 47, y: 62, title: 'A trilha de luz', description: 'Linhas âmbar no piso desenham o caminho até as áreas internas.', related: [] },
      ],
    },
    {
      id: 'cafe',
      title: 'O balcão de convivência',
      caption: 'Luz quente, vitrine e um teto de madeira.',
      ...photo('cafe', 1600, 604),
      alt: 'Balcão de convivência com teto de ripas de madeira, luzes alaranjadas, letreiros em neon e uma vitrine de vidro iluminada.',
      hotspots: [
        { id: 'balcao', x: 30, y: 80, title: 'O balcão iluminado', description: 'O balcão de base alaranjada e o teto de madeira dão a esta área um tom mais quente que o restante do espaço.', related: [] },
        { id: 'vitrine', x: 75, y: 60, title: 'A vitrine', description: 'Vitrine de vidro iluminada ao lado do balcão.', related: [] },
      ],
    },
    {
      id: 'bancada',
      title: 'A bancada',
      caption: 'Bancos altos junto à parede iluminada.',
      ...photo('bancada', 1600, 601),
      alt: 'Bancada longa junto a uma parede de tijolos com faixa de luz amarela, com bancos altos de assento amarelo e tomadas na parede.',
      hotspots: [
        { id: 'bancos', x: 33, y: 78, title: 'Os bancos altos', description: 'Bancos de assento amarelo enfileirados ao longo da bancada.', related: [] },
        { id: 'parede', x: 35, y: 25, title: 'A parede iluminada', description: 'Uma faixa de luz amarela percorre a parede de tijolos sobre a bancada.', related: [] },
      ],
    },
    {
      id: 'corredor-lanternas',
      title: 'O corredor das lanternas',
      caption: 'A passagem que leva aos laboratórios.',
      ...photo('corredor-lanternas', 1600, 607),
      alt: 'Corredor estreito de tijolos escuros com lanternas acesas nas paredes, levando a portas de vidro com uma sala de computadores ao fundo.',
      hotspots: [
        { id: 'passagem', x: 50, y: 45, title: 'A passagem', description: 'Ao fundo do corredor, através das portas de vidro, já aparecem as estações de um laboratório.', related: [] },
        { id: 'lanterna', x: 84, y: 30, title: 'A lanterna', description: 'Lanternas de ferro iluminam o caminho, repetindo o estilo da fachada.', related: [] },
      ],
    },
    {
      id: 'lab-vitrais',
      title: 'O laboratório dos vitrais',
      caption: 'Janelas em arco e monitores com anéis de luz laranja.',
      ...photo('lab-vitrais', 1600, 601),
      alt: 'Laboratório com janelas em arco no estilo de vitrais, luminárias pendentes, fileiras curvas de computadores com anéis de luz laranja e uma mesa à frente da sala.',
      hotspots: [
        { id: 'vitrais', x: 74, y: 30, title: 'As janelas em arco', description: 'Janelas em arco contornadas por luz, no estilo de vitrais.', related: [] },
        { id: 'estacoes', x: 45, y: 62, title: 'As estações', description: 'Fileiras curvas de computadores voltadas para a frente da sala.', related: ['monitor-estagiario', 'monitor-lider'] },
        { id: 'mesa', x: 86, y: 44, title: 'A mesa à frente', description: 'Uma mesa com computador posicionada à frente das fileiras.', related: ['formacao'] },
      ],
    },
    {
      id: 'lab-azul',
      title: 'O laboratório das telas azuis',
      caption: 'Estações lado a lado sob os vitrais.',
      ...photo('lab-azul', 1600, 604),
      alt: 'Laboratório com fileiras de monitores de tela azul, teclados iluminados e um telão com o logotipo da Infinity School no alto da parede.',
      hotspots: [
        { id: 'estacoes', x: 55, y: 55, title: 'As estações', description: 'Monitores lado a lado, com teclados iluminados, em bancadas contínuas.', related: ['monitor-lider', 'sistemas'] },
        { id: 'telao', x: 91, y: 7, title: 'O telão', description: 'Um telão com o logotipo da Infinity School no alto da parede.', related: [] },
      ],
    },
    {
      id: 'lab-pedra',
      title: 'O laboratório da parede de pedra',
      caption: 'A sala mais ampla, com paredes esculpidas.',
      ...photo('lab-pedra', 1600, 597),
      alt: 'Laboratório amplo com dezenas de computadores de tela azul em fileiras, paredes com textura de pedra esculpida e iluminação em tons de azul.',
      hotspots: [
        { id: 'fileiras', x: 50, y: 45, title: 'As fileiras', description: 'Dezenas de estações enfileiradas até o fundo da sala.', related: ['formacao', 'sistemas'] },
        { id: 'parede', x: 6, y: 22, title: 'A parede esculpida', description: 'Paredes com textura de pedra esculpida emolduram a sala.', related: [] },
      ],
    },
    {
      id: 'lab-telao',
      title: 'O laboratório do telão',
      caption: 'Estações em ilhas diante do telão da escola.',
      ...photo('lab-telao', 1600, 605),
      alt: 'Laboratório com ilhas de computadores de tela azul, um telão com o logotipo da Infinity School e quadros com ilustrações nas paredes.',
      hotspots: [
        { id: 'telao', x: 35, y: 10, title: 'O telão', description: 'O telão com o logotipo da Infinity School no centro da parede.', related: ['formacao'] },
        { id: 'quadros', x: 91, y: 18, title: 'Os quadros', description: 'Quadros com ilustrações decoram as paredes escuras da sala.', related: [] },
      ],
    },
    {
      id: 'estudio',
      title: 'A sala de gravação',
      caption: 'Parede clara, tripé e iluminação.',
      ...photo('estudio', 1600, 601),
      alt: 'Sala com parede branca ao fundo com o logotipo da Infinity School, tripé, luzes de estúdio e cadeiras dobráveis de madeira dispostas à frente.',
      hotspots: [
        { id: 'equipamento', x: 49, y: 40, title: 'Tripé e luzes', description: 'Tripé, softbox e luz em anel montados diante da parede clara com o logotipo da escola.', related: [] },
        { id: 'cadeiras', x: 45, y: 78, title: 'As cadeiras', description: 'Cadeiras dobráveis de madeira dispostas em fileiras.', related: [] },
      ],
    },
  ],

  tour: {
    // Marzipano (Apache-2.0), carregado sob demanda somente quando existir um panorama.
    library: 'https://cdn.jsdelivr.net/npm/marzipano@0.10.2/dist/marzipano.js',
    googleMapsUrl: 'https://www.google.com/local/place/fid/0xa699dc3b0a592d:0x72478ef5ed116c38/photosphere?iu=https://lh3.googleusercontent.com/gps-cs-s/ANWiy9SQv-2cCgfV3e9sdrpBk4SUx_BiXyY5nMovWlVSaXsL_ABKrVV9iO2LQRxLjkplbi9Yc9smkF3HoLu8j__7HwDBqH-E_KSDNtKjJqtXb0UAKUkyK4nPwEgX73Y8IGZ4BDOi1SvX%3Dw160-h106-k-no-pi-10-ya272-ro0-fo100&ik=CAoSFkNJSE0wb2dLRUlDQWdJQzU2WWFXVmc%3D',
    // Exemplo (adicione as imagens em assets/img/Jornada/infinity/360/):
    // { id: 'hall', title: 'Hall', src: 'assets/img/Jornada/infinity/360/hall.jpg', yaw: 0, pitch: 0,
    //   links: [{ target: 'corredor', yaw: 1.2, pitch: 0.1, label: 'Ir para o corredor' }] },
    panoramas: [],
  },
};
})();
