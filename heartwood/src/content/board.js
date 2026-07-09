/**
 * O Tabuleiro Medieval — um mapa do reino em pedra.
 * Cada assento é um domínio real da carreira; cada um aponta para
 * o lugar do mundo onde a história continua.
 * x/y em % sobre o tabuleiro.
 */
export const boardSeats = [
  {
    id: 'torre',
    rune: '♖',
    name: 'Torre do Front-End',
    x: 50,
    y: 16,
    text: 'O posto mais alto do reino. React, JavaScript e a arte do CSS — onde a engenharia encontra os olhos das pessoas.',
    anchor: '#personagem',
    anchorLabel: 'Ver o Arsenal',
  },
  {
    id: 'forja',
    rune: '⚒',
    name: 'Forja do Back-End',
    x: 20,
    y: 42,
    text: 'Onde APIs são temperadas: Node.js, Python, Django e bancos de dados. Nada brilha na torre sem uma forja sólida embaixo.',
    anchor: '#personagem',
    anchorLabel: 'Ver o Arsenal',
  },
  {
    id: 'guilda',
    rune: '✒',
    name: 'Guilda dos Aprendizes',
    x: 80,
    y: 40,
    text: 'Aqui o DevWizard ensina: +100 alunos formados, workshops, minicursos e Hackathons — porque conhecimento guardado é conhecimento desperdiçado.',
    anchor: '#legados',
    anchorLabel: 'Ler as Crônicas',
  },
  {
    id: 'salao',
    rune: '◈',
    name: 'Salão das Relíquias',
    x: 32,
    y: 72,
    text: 'Os feitos que ficaram de pé: Nexus Vision, Forge System, Oráculo IA e os demais legados gravados na pedra.',
    anchor: '#projetos',
    anchorLabel: 'Visitar o Salão',
  },
  {
    id: 'camara',
    rune: '◉',
    name: 'Câmara da Estratégia',
    x: 58,
    y: 78,
    text: 'SEO, marketing digital e crescimento orgânico — a magia silenciosa que faz um produto ser encontrado. Domínio da Connect CNX.',
    anchor: '#projetos',
    anchorLabel: 'Ver as Relíquias',
  },
  {
    id: 'portoes',
    rune: '✶',
    name: 'Portões do Reino',
    x: 82,
    y: 74,
    text: 'Todo reino precisa de portões abertos. É por aqui que novas missões chegam — e a fênix parte com respostas.',
    anchor: '#contato',
    anchorLabel: 'Chamar a Fênix',
  },
]
