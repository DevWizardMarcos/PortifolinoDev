// Mapa — Crônicas do Conhecimento.
// Conteúdo e artes ficam separados da navegação para permitir novas evidências sem alterar o componente.
(() => {
  const ROOT = 'assets/img/Portais/Captulo IV/';
  const REGIONS = `${ROOT}Regioes/`;
  const gamma = href => ({ label: 'Abrir material original', href });
  window.journeyKnowledgeMap = {
    title: 'Mapa — Crônicas do Conhecimento',
    description: 'Territórios onde experiências se transformaram em conhecimento compartilhado.',
    storageKey: 'devwizard:journey:knowledge-map:v1',
    regions: [
      {
        id: 'reino-oportunidades', numeral: 'I', title: 'Reino das Oportunidades', subtitle: 'Carreira e posicionamento',
        thumbnail: `${REGIONS}01_reino_das_oportunidades-atlas.png`, image: `${REGIONS}Imagem do ChatGPT 15 de out. de 2026, 22_48_08.png`,
        imageAlt: 'Reino medieval entre montanhas, com um palácio iluminado e uma estátua dourada',
        chronicles: [
          { id: 'dominando-linkedin', title: 'Dominando LinkedIn', description: 'Encontro dedicado ao uso estratégico do LinkedIn para apresentar experiências, competências e objetivos profissionais.', image: `${ROOT}Dominando LinkedIn na Infinity School.png`, imageAlt: 'Registro de Dominando LinkedIn na Infinity School', position: { x: 31, y: 58 } },
          { id: 'curriculo-era-digital', title: 'Currículo Eficaz na Era Digital', description: 'Conteúdo sobre como organizar e comunicar experiências profissionais em um currículo adequado aos processos digitais.', image: `${ROOT}Curriculo Eficaz na Era Digital.png`, imageAlt: 'Aula Currículo Eficaz na Era Digital em uma sala da Infinity School', position: { x: 69, y: 48 }, material: gamma('https://gamma.app/docs/Curriculo-Eficaz-na-Era-Digital-7lnmqzji7g4805n?mode=doc') },
        ],
      },
      {
        id: 'guilda-desenvolvedores', numeral: 'II', title: 'Guilda dos Desenvolvedores', subtitle: 'Git e GitHub',
        thumbnail: `${REGIONS}02_guilda_dos_desenvolvedores.png`, image: `${REGIONS}02_guilda_dos_desenvolvedores-capa.jpg`,
        imageAlt: 'Desenvolvedor de capuz com o símbolo do mago programando à luz de velas, com um grafo de branches do Git na tela, em um salão gótico com fênix, cães e um gato',
        chronicles: [
          { id: 'primeiros-passos-github', title: 'Primeiros Passos no GitHub', description: 'Introdução ao GitHub e aos primeiros passos para organizar e compartilhar projetos.', image: `${ROOT}Primeiros Passos no GitHub.png`, imageAlt: 'Aula Primeiros Passos no GitHub em uma sala da Infinity School', position: { x: 34, y: 58 }, material: gamma('https://gamma.app/docs/Primeiros-Passos-no-GitHub-t830vbcwlqj1935?mode=doc') },
          { id: 'dominando-git-github', title: 'Dominando Git e GitHub', description: 'Conteúdo sobre versionamento, colaboração e organização de projetos com Git e GitHub.', image: `${ROOT}Dominando Git e GitHub.png`, imageAlt: 'Árvore fantástica representando branches e fluxos de trabalho com Git e GitHub', position: { x: 68, y: 43 } },
        ],
      },
      {
        id: 'floresta-fundamentos', numeral: 'III', title: 'Floresta dos Fundamentos', subtitle: 'JavaScript e CSS',
        thumbnail: `${REGIONS}03_floresta_dos_fundamentos.png`, image: `${ROOT}Floresta dos Fundamentos - capa.png`,
        imageAlt: 'Desenvolvedor estudando em um espaço de trabalho construído dentro de uma árvore fantástica',
        chronicles: [
          { id: 'javascript-descomplicado', title: 'JavaScript Descomplicado', description: 'Aula voltada a tornar os fundamentos de JavaScript mais claros e aplicáveis.', image: `${ROOT}javascript descomplicado.png`, imageAlt: 'Arte de JavaScript Descomplicado', position: { x: 25, y: 58 }, material: gamma('https://gamma.app/docs/JavaScript-Descomplicado-ivk0b6xpxvf97m6?mode=doc') },
          { id: 'reforco-javascript', title: 'Reforço em JavaScript: Descomplicando o Essencial', description: 'Revisão dos conceitos essenciais de JavaScript para consolidar a base de programação.', image: `${ROOT}reforco-javascript-labirinto.jpg`, imageAlt: 'Desenvolvedor de capuz caminhando em direção a um labirinto iluminado por velas, guardado por uma grande esfinge alada', imageAlternate: `${ROOT}reforco-javascript-portal.jpg`, imageAlternateAlt: 'o desenvolvedor diante do portal do labirinto, com a esfinge alada logo acima do arco', position: { x: 43, y: 37 }, material: gamma('https://gamma.app/docs/Reforco-em-JavaScript-Descomplicando-o-Essencial-nvzqa1p58atk5mm?mode=doc') },
          { id: 'desvendando-css', title: 'Desvendando o CSS', description: 'Conteúdo sobre fundamentos de CSS e construção visual de interfaces web.', image: `${ROOT}Desvendando o CSS.png`, imageAlt: 'Desenvolvedor diante de uma hidra cercada por exemplos visuais de CSS', position: { x: 63, y: 59 }, material: gamma('https://gamma.app/docs/Desvendando-o-CSS-rrswde7zwvgjp4w?mode=doc') },
          { id: 'desvendando-css-2', title: 'Desvendando o CSS — Parte II', description: 'Continuação do conteúdo de CSS. O endereço do material ainda precisa ser confirmado.', image: `${ROOT}Desvendando o CSS - Parte II.png`, imageAlt: 'Desenvolvedor e hidra representando gradientes, animações, hover, layout e transformações em CSS', position: { x: 78, y: 36 }, material: { ...gamma('https://gamma.app/docs/Desvendando-o-CSS-rrswde7zwvgjp4w?mode=doc'), review: 'Link repetido da Parte I — associação pendente de revisão.' } },
        ],
      },
      {
        id: 'torre-inovacao', numeral: 'IV', title: 'Torre da Inovação', subtitle: 'Inteligência Artificial',
        thumbnail: `${REGIONS}04_torre_da_inovacao.png`, image: `${ROOT}Torre da Inovação.png`,
        imageAlt: 'Desenvolvedor de capuz projetando invenções em uma oficina arcana iluminada por cristais',
        chronicles: [
          {
            id: 'chatgpt-programacao', title: 'ChatGPT na Programação',
            description: 'Conteúdo sobre o uso eficiente e criativo do ChatGPT como apoio à programação.',
            image: `${ROOT}primeira fase Dragon.png`,
            imageAlt: 'Desenvolvedor e inventor goblin planejando a criação de um dragão mecânico em uma oficina arcana',
            imageSequence: [
              { src: `${ROOT}primeira fase Dragon.png`, alt: 'Projeto inicial do dragão mecânico sobre a bancada' },
              { src: `${ROOT}segunda fase Dragon.png`, alt: 'Protótipo do dragão mecânico sendo programado e ajustado' },
              { src: `${ROOT}terceira fase dragon.png`, alt: 'Dragão mecânico completo recebendo os últimos ajustes' },
            ],
            position: { x: 34, y: 55 },
            material: gamma('https://gamma.app/docs/Como-Utilizar-o-ChatGPT-na-Programacao-de-Forma-Eficiente-e-Criat-du7raremhgwdk5r?mode=doc'),
          },
          { id: 'ia-interfaces-modernas', title: 'Integração de Inteligência Artificial em Interfaces Web Modernas', description: 'Conteúdo sobre possibilidades de integração de inteligência artificial em experiências web.', experience: 'innovation-owl', position: { x: 67, y: 42 }, material: gamma('https://gamma.app/docs/Integracao-de-Inteligencia-Artificial-em-Interfaces-Web-Modernas-lawunp6xb0kcmr0?mode=doc') },
        ],
      },
      {
        id: 'santuario-conquista', numeral: 'V', title: 'Santuário da Conquista', subtitle: 'React',
        thumbnail: `${REGIONS}05_santuario_da_conquista.png`, image: `${REGIONS}Imagem do ChatGPT 15 de out. de 2026, 22_48_42.png`,
        imageAlt: 'Santuário fantástico dedicado à conclusão de uma jornada de aprendizado',
        chronicles: [{ id: 'modulo-finalizado-react', title: 'O Módulo Finalizado — React', description: 'Registro da conclusão do módulo dedicado a React.', position: { x: 51, y: 49 } }],
      },
      {
        id: 'arena-comunidade', numeral: 'VI', title: 'Arena da Comunidade', subtitle: 'Eventos e colaboração',
        thumbnail: `${REGIONS}06_arena_da_comunidade.png`, image: `${REGIONS}Imagem do ChatGPT 15 de out. de 2026, 22_48_52.png`,
        imageAlt: 'Arena medieval preparada para encontros e atividades em comunidade',
        chronicles: [
          { id: 'hackathon', title: 'Hackathon', description: 'Registro de uma experiência de colaboração em evento.', position: { x: 24, y: 58 } },
          { id: 'hallowinit', title: 'HallowInit', description: 'Registro de participação em um encontro da comunidade.', position: { x: 42, y: 38 } },
          { id: 'infinity-open', title: 'Infinity Open', description: 'Registro de participação no Infinity Open.', position: { x: 61, y: 58 } },
          { id: 'vivver-sistemas', title: 'Evento da Vivver Sistemas', description: 'Registro de um evento relacionado à Vivver Sistemas.', position: { x: 78, y: 38 }, material: { label: 'Conhecer a Vivver Sistemas', href: 'https://www.linkedin.com/company/vivver-sistemas/' } },
        ],
      },
    ],
  };

  window.journeyBannerData = {
    title: 'O Estandarte — Resultados',
    description: 'Vozes e registros autorizados sobre o impacto humano desta jornada.',
    categories: [
      { id: 'alunos', title: 'Vozes dos Alunos', description: 'Feedbacks sobre aulas, mentorias, explicações e acompanhamento.', testimonials: [] },
      { id: 'equipe', title: 'Vozes da Equipe', description: 'Feedbacks de instrutores, colegas e pessoas que trabalharam diretamente comigo.', testimonials: [] },
      { id: 'eventos', title: 'Ecos dos Eventos', description: 'Comentários de participantes de palestras, workshops e eventos.', testimonials: [] },
    ],
  };
})();
