/**
 * Fonte única de verdade da identidade.
 * Conteúdo real do DevWizardMarcos — edite aqui, nunca nos componentes.
 */
export const profile = {
  name: 'Marcos Paulo Simões',
  handle: 'DevWizardMarcos',
  brand: { dev: 'Dev', wizard: 'Wizard', marcos: 'Marcos' },
  role: 'Full-Stack Developer • Professor • Líder Técnico',
  tagline: 'Transformando conhecimento em experiências digitais.',
  email: 'mp718887@gmail.com',
  location: 'Belo Horizonte, Brasil',
  links: {
    github: 'https://github.com/DevWizardMarcos',
    linkedin: 'https://www.linkedin.com/in/devwizardmarcos',
  },
  game: { level: 26, xp: 70 },
  about: {
    classe: 'Full-Stack Developer • Especialista Front-End • Mentor Técnico',
    historia: [
      'Olá, me chamo Marcos Paulo Simões — desenvolvedor Full-Stack com afinidade em Front-End e apaixonado por tecnologia desde 2020, quando dei meus primeiros passos na programação pela Danki Code. Desde então, nunca parei de estudar.',
      'Em 2022 fiz a transição de aluno para empreendedor, fundando a MS Negócios, minha própria empresa de criação de sites. Em paralelo, ingressei no curso técnico da Infinity School, em Belo Horizonte — onde vivi uma das jornadas mais épicas da minha vida: passei de aluno a monitor, de monitor a professor de programação, depois a líder de monitoria Dev, líder de projetos (incluindo Hackathons), líder de instrutores e, por fim, líder de professores. Ao longo de inúmeros workshops, super módulos e minicursos, fui acumulando experiência sem jamais abandonar a postura de aluno — sempre ansioso para aprender algo novo.',
      'Também fundei a Dreams, marca de blusas focada no universo geek, e a Connect CNX, empresa de tecnologia da qual sou CEO, atuando como desenvolvedor Full-Stack e estrategista de marketing digital.',
      'O nome DevWizard nasceu da minha paixão pelo mundo geek: a ideia de misturar criatividade, magia e código para criar experiências imersivas — e compartilhar esse conhecimento com quem está na mesma jornada de aprendizado. Como diria um amigo meu: Excelsior!',
    ],
    guilda: [
      {
        role: 'Monitor PJ Líder / Sênior',
        org: 'Infinity School',
        period: 'Abril 2025 – Presente',
        text: 'Responsável por formar mais de +100 alunos e auxiliar os demais instrutores, liderando suporte técnico e pedagógico ao longo de todo o processo de aprendizagem. Conduzo o desenvolvimento de sistemas web, APIs e automações, organizo +20 workshops e +10 minicursos mensais e mentoro alunos em projetos finais. Dou suporte integral durante os cursos Seja Full-Stack, Data Analytics, Data Science e AI / Automação do Zero.',
      },
      {
        role: 'Monitor Estagiário Dev',
        org: 'Infinity School',
        period: 'Nov 2024 – Abr 2025',
        text: 'Suporte estratégico aos instrutores, mentoria personalizada a alunos, contribuição no currículo e orientação em projetos front-end e back-end.',
      },
      {
        role: 'CEO & Desenvolvedor Full-Stack',
        org: 'MS Negócios',
        period: 'Fundador',
        text: 'Empresa própria de criação de sites e soluções digitais. Responsável por todo o ciclo de desenvolvimento, desde o briefing com o cliente até a entrega final, atuando em design, desenvolvimento e implantação.',
      },
      {
        role: 'Full-Stack Developer & SEO Specialist',
        org: 'Connect CNX',
        period: 'Atual',
        text: 'Atuação como programador Full-Stack aliada à aplicação de estratégias de SEO e marketing digital, entregando soluções que unem performance técnica e visibilidade orgânica.',
      },
    ],
    formacao: [
      {
        course: 'Análise e Desenvolvimento de Sistemas — 3º Período',
        org: 'Descomplica Faculdade Digital',
        period: '2024 – 2027',
        text: 'Construindo uma base sólida em desenvolvimento de software, design de sistemas e gerenciamento de projetos de TI, com foco em habilidades práticas e tecnologias modernas.',
      },
    ],
  },
}

/** Os lugares do reino, na ordem em que a jornada os atravessa. */
export const navSections = [
  { id: 'personagem', label: 'Personagem' },
  { id: 'tabuleiro', label: 'Tabuleiro' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'legados', label: 'Legados' },
  { id: 'oraculo', label: 'Oráculo' },
  { id: 'contato', label: 'Contato' },
]

/** Waypoints do Fio Dourado — a trilha que costura o mundo inteiro. */
export const waypoints = [
  { id: 'inicio', rune: '✦', label: 'O Limiar' },
  { id: 'personagem', rune: '☽', label: 'O Personagem' },
  { id: 'portal', rune: '◇', label: 'O Portal' },
  { id: 'tabuleiro', rune: '♜', label: 'O Tabuleiro' },
  { id: 'projetos', rune: '◈', label: 'Salão dos Legados' },
  { id: 'legados', rune: '⸙', label: 'Crônicas da Guilda' },
  { id: 'oraculo', rune: '☉', label: 'O Oráculo' },
  { id: 'contato', rune: '✶', label: 'A Fênix' },
]
