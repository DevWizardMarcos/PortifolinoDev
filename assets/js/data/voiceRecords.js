// Acervo do Estandarte das Vozes — fonte única dos três ambientes.
//
// COMO CADASTRAR UM REGISTRO
// Acrescente um objeto em `window.voiceRecords` abaixo. O campo `environment` define onde ele aparece:
//   'library'       → Biblioteca dos Aprendizes (Vozes dos Alunos)
//   'council'       → Conselho da Guilda (Vozes da Equipe)
//
// Um registro só é exibido quando `published === true` E a autorização está documentada:
//   authorization: {
//     granted: true,          // consentimento para publicar o texto
//     reference: 'TCLE-001',  // onde o consentimento está arquivado (obrigatório)
//     name: true,             // autoriza exibir o nome do autor
//     anonymize: true,        // força anonimização mesmo com `name: true`
//   }
// Rascunhos (`published: false`) e registros sem autorização nunca chegam à interface.
//
// CAMPOS (todos opcionais, exceto id, environment, title e authorization)
//   id, environment, type, category, title, description (resumo curto), content (texto autorizado, fiel ao original),
//   author, authorRole, context, date (ISO: 2026-03-14), period, topics: [], seals: [], source: { href, label },
//   Biblioteca:  evolution: { challenge, experience, result }
//   Conselho:    participants: [], evidence: [{ label, href }], links: [{ kind, label }]
//                kind ∈ 'project' | 'experience' | 'responsibility' | 'collaboration'
//
// Exemplo (copie, preencha com dados reais e remova os comentários):
// {
//   id: 'aluno-git-001', environment: 'library', category: 'Mentoria', title: 'Título do relato',
//   content: 'Texto exatamente como autorizado.', author: 'Nome', authorRole: 'Aluno(a) — turma X',
//   topics: ['Git e GitHub'], date: '2026-03-14', published: true,
//   authorization: { granted: true, reference: 'TCLE-001', name: true },
// },
(() => {
  // Avaliações anônimas de alunos (Infinity School), transcritas das planilhas em assets/img/Portais/feadbacks/
  // (as mesmas imagens publicadas pelo próprio Marcos no LinkedIn). Sem nome de autor; textos fiéis ao original,
  // sem os comentários vazios, repetidos ou apenas pontuação. Formato: [título, texto, contexto, assunto].
  const COURSES = 'Avaliação de aluno — cursos FLEX';
  const MONITORING = 'Avaliação de aula de monitoria';
  const STUDENT_REVIEWS = [
    ['Muito atencioso', 'Muito atencioso', `${COURSES}: Programação Full-Stack IA`, 'Cursos'],
    ['Um professor muito bom, paciente', 'Um professor muito bom, paciente', `${COURSES}: Programação Full-Stack IA`, 'Cursos'],
    ['Nota 1000, excelente', 'Nota 1000, excelente', `${COURSES}: Programação Full-Stack IA`, 'Cursos'],
    ['Monitor muito didático', 'Monitor sabe o conteúdo é muito didático. Parabéns.', MONITORING, 'Monitoria'],
    ['Aula muito boa', 'aula muito boa', MONITORING, 'Monitoria'],
    ['Conteúdo prático e conectado', 'Foi ótimo e muito prático, o conteúdo passado nos 5 primeiros minutos de aula, foi usado de forma conectada pra resolver os trabalhos proposto. Muito interessante mesmo.', MONITORING, 'Monitoria'],
    ['Professor 1000!', 'Professor 1000!', MONITORING, 'Monitoria'],
    ['Boa explicação', 'Boa Explicação.', MONITORING, 'Monitoria'],
    ['Professor muito bom', 'Professor muito bom', MONITORING, 'Monitoria'],
    ['Esclarecendo as dúvidas', 'Prof atencioso em esclarecer as dúvidas.', MONITORING, 'Monitoria'],
    ['Ótimo monitor', 'Ótimo monitor, top!!', MONITORING, 'Monitoria'],
    ['Domínio do conteúdo', 'Monitor tem domínio do conteúdo e sabe explicar', MONITORING, 'Monitoria'],
    ['Ótima aula', 'Otima aula', MONITORING, 'Monitoria'],
    ['Muito atencioso, obrigada', 'O Marcos foi muito atencioso, obrigada.', MONITORING, 'Monitoria'],
    ['Excelente monitor', 'Amei a aula, excelente monitor.', MONITORING, 'Monitoria'],
    ['Monitor incrível', 'Monitor incrível, super atencioso me deu auxílio em todas as minhas dúvida, já marquei até mais aula, indico muito.', MONITORING, 'Monitoria'],
    ['Ideias para os meus projetos', 'Só agradecer pelas ideias que ele me deu e me ajudou muito com os meu projetos', MONITORING, 'Monitoria'],
    ['Bom e criativo', 'Professor muito bom e criativo!', MONITORING, 'Monitoria'],
    ['Paciência e presteza', 'Gostaria de agradecer a paciência e presteza do monitor Marcos durante a aula de reposição. Além de abordar o conteúdo previsto, compartilhou dicas valiosas e conhecimentos extras, demonstrou grande empatia com meu conhecimento ainda limitado em programação. Teve o cuidado de adaptar as explicações e exemplos. Excelente monitor!', 'Avaliação de aula de reposição', 'Monitoria'],
    ['Uma didática excelente', 'O Professor Marcos é sensacional deveria ser professor das classes tem uma didática excelente', MONITORING, 'Monitoria'],
    ['Didática muito boa', 'Didática muito boa', MONITORING, 'Monitoria'],
    ['Aula muito produtiva', 'Aula muito produtiva', MONITORING, 'Monitoria'],
    ['Aulas fáceis de entender', 'Marcos você é um monitor incrível suas aulas são super interessantes e fáceis de entender você explica de um jeito que faz a gente aprender sem dificuldade muito obrigado por todo apoio e paciência', MONITORING, 'Monitoria'],
    ['A pessoa que não me fez desistir', 'Marcos é meu monitor durante as aulas presenciais e comentei com ele que estava desistindo do curso, sem pensar ele falou que era para fazer a aula com ele. De fato ele está sendo a pessoa que não me fez desistir. Conduziu a aula incrivelmente, foi bem didático, me deu exemplos práticos, tirou minhas dúvidas. Fiquei muito satisfeita e feliz em conseguir aprender o conteúdo. Marcos arrasou!', 'Avaliação de aula de monitoria presencial', 'Monitoria'],
    ['O cara é fera', 'O cara é fera, ótimo aula 💜', MONITORING, 'Monitoria'],
    ['Monitor atencioso', 'Monitor atencioso!', MONITORING, 'Monitoria'],
  ];
  window.voiceRecords = STUDENT_REVIEWS.map(([title, content, context, topic], index) => ({
    id: `avaliacao-aluno-${String(index + 1).padStart(2, '0')}`, environment: 'library', category: 'Avaliação de aluno',
    title, content, context, topics: [topic], published: true,
    source: { href: 'https://www.linkedin.com/in/marcos-simoes-ms/', label: 'Ver no LinkedIn' },
    authorization: { granted: true, reference: 'Avaliações anônimas da Infinity School, publicadas pelo próprio Marcos no LinkedIn', name: false },
  }));

  const hasText = value => typeof value === 'string' && value.trim().length > 0;
  const documented = auth => !!auth && auth.granted === true && hasText(auth.reference);

  // Aplica as regras de privacidade e devolve uma cópia segura para a interface (ou null).
  function publicRecord(record) {
    if (!record || record.published !== true || !documented(record.authorization)) return null;
    const auth = record.authorization;
    const showName = auth.name === true && auth.anonymize !== true;
    const media = record.media ? { ...record.media } : null;
    if (media) {
      if (auth.image !== true) delete media.images;
      if (auth.media !== true) { delete media.video; delete media.audio; delete media.presentation; delete media.links; }
    }
    const echoes = (record.echoes || []).filter(echo => echo && hasText(echo.text) && documented(echo.authorization)).map(echo => {
      const echoName = echo.authorization.name === true && echo.authorization.anonymize !== true;
      return { ...echo, author: echoName ? echo.author : null, authorRole: echoName || echo.anonymizedRole ? echo.authorRole || echo.anonymizedRole : null, authorization: undefined };
    });
    return {
      ...record,
      author: showName ? record.author : null,
      authorRole: showName || record.anonymizedRole ? record.authorRole || record.anonymizedRole : null,
      participants: auth.anonymize === true ? undefined : record.participants,
      media, echoes, authorization: undefined, isAnonymous: !showName,
    };
  }

  window.VoiceArchive = {
    // Registros públicos de um ambiente, já sanitizados e ordenados do mais recente para o mais antigo.
    select(environment, extra = []) {
      return [...window.voiceRecords, ...extra]
        .filter(record => record && record.environment === environment)
        .map(publicRecord).filter(Boolean)
        .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
    },
    topicsOf: records => [...new Set(records.flatMap(record => record.topics || []).filter(hasText))],
    sealsOf: records => [...new Set(records.flatMap(record => record.seals || []).filter(hasText))],
    formatDate(value) {
      if (!hasText(value)) return '';
      const date = new Date(`${value}T12:00:00`);
      return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    },
    publicRecord,
  };
})();
