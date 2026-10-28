// Estandarte das Vozes — dois ambientes interativos: Biblioteca dos Aprendizes e Conselho da Guilda.
// Os dados vêm de window.VoiceArchive (assets/js/data/voiceRecords.js); aqui só há apresentação e interação.
(() => {
  if (!window.React || !window.ReactDOM) return;
  const h = window.React.createElement;
  const { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } = window.React;

  const CATEGORY_TYPES = ['students', 'team'];
  const ENVIRONMENTS = { students: 'library', team: 'council' };
  const COUNCIL = window.councilConfig || { scene: '', seats: [], members: [] }; // assets/js/data/councilMembers.js
  const COUNCIL_SCENE = COUNCIL.scene;
  const COUNCIL_DEBUG = new URLSearchParams(window.location.search).has('councilDebug');
  const COUNCIL_SEATS = COUNCIL.seats;
  const COUNCIL_MEMBERS = COUNCIL.members;
  const INDEX_SLOTS = 9; // espaços do índice na arte do livro (assets/img/legados/livro-aberto-indice.webp)
  const KINDS = {
    project: { label: 'Projeto', glyph: '◆' },
    experience: { label: 'Experiência', glyph: '●' },
    responsibility: { label: 'Responsabilidade', glyph: '■' },
    collaboration: { label: 'Colaboração', glyph: '▲' },
  };

  const reducedMotion = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const formatDate = value => window.VoiceArchive?.formatDate(value) || '';
  const attribution = record => record.author
    ? [record.author, record.authorRole].filter(Boolean).join(' — ')
    : record.isAnonymous ? 'Relato anônimo, publicado com autorização' : '';
  const truncate = (text, size) => (text.length > size ? `${text.slice(0, size - 1)}…` : text);
  const paragraphs = text => String(text || '').split(/\n{2,}/).filter(Boolean);

  // ---------------------------------------------------------------------------------------------
  // Hooks
  // ---------------------------------------------------------------------------------------------

  // Pilha de "voltar": o Escape do modal desfaz primeiro a camada mais interna (galeria, evento, livro).
  function useBackHandler(stackRef, handler) {
    const latest = useRef(handler);
    latest.current = handler;
    useEffect(() => {
      const stack = stackRef?.current;
      if (!stack) return undefined;
      const entry = { run: () => latest.current() };
      stack.push(entry);
      return () => { const at = stack.indexOf(entry); if (at >= 0) stack.splice(at, 1); };
    }, [stackRef]);
  }

  function useVoiceNavigation(count) {
    const [activeIndex, setActiveIndex] = useState(0);
    const onTabKeyDown = useCallback((event, index) => {
      const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
      if (!step && event.key !== 'Home' && event.key !== 'End') return;
      event.preventDefault();
      event.stopPropagation();
      const target = event.key === 'Home' ? 0 : event.key === 'End' ? count - 1 : (index + step + count) % count;
      setActiveIndex(target);
      event.currentTarget.parentElement?.querySelectorAll('[role="tab"]')[target]?.focus();
    }, [count]);
    return { activeIndex, setActiveIndex, onTabKeyDown };
  }

  function useBookNavigation(records) {
    const [open, setOpen] = useState(false);
    const [topic, setTopic] = useState('all');
    const [pageIndex, setPageIndex] = useState(0);
    const [flip, setFlip] = useState(null);
    const timer = useRef(0);
    useEffect(() => () => window.clearTimeout(timer.current), []);
    const filtered = useMemo(() => (topic === 'all' ? records : records.filter(record => (record.topics || []).includes(topic))), [records, topic]);
    const indexPages = useMemo(() => {
      const chunks = [];
      for (let start = 0; start < filtered.length; start += INDEX_SLOTS) chunks.push(filtered.slice(start, start + INDEX_SLOTS));
      return (chunks.length ? chunks : [[]]).map((chunk, number, all) => ({ id: `index-${number}`, intro: true, number, total: all.length, start: number * INDEX_SLOTS, chunk }));
    }, [filtered]);
    const indexCount = indexPages.length;
    const pages = useMemo(() => [...indexPages, ...filtered], [indexPages, filtered]);
    const index = Math.min(pageIndex, pages.length - 1);
    const goTo = useCallback((next, direction) => {
      const target = Math.max(0, Math.min(pages.length - 1, next));
      if (target === index) return;
      setPageIndex(target);
      if (reducedMotion()) return;
      setFlip({ dir: direction || (target > index ? 1 : -1), key: `${target}-${Date.now()}` });
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setFlip(null), 640);
    }, [pages.length, index]);
    return {
      open, setOpen, topic, pages, index, page: pages[index], filtered, flip, indexCount,
      filterBy(next) { setTopic(next); setPageIndex(0); },
      turn: direction => goTo(index + direction, direction),
      goTo,
      goToIndex: () => goTo(0, -1),
      jumpToRecord(record) {
        const inView = filtered.indexOf(record);
        if (inView >= 0) { goTo(inView + indexCount); return; }
        setTopic('all'); setPageIndex(Math.ceil(records.length / INDEX_SLOTS) + records.indexOf(record));
      },
    };
  }

  function useCouncilInteraction(records) {
    const [selectedSeatId, setSelectedSeatId] = useState(null);
    const [openMemberId, setOpenMemberId] = useState(null);
    const [revealedIds, setRevealedIds] = useState([]);
    const openTimer = useRef(0);
    useEffect(() => () => window.clearTimeout(openTimer.current), []);
    const [view, setView] = useState('table');
    const [seal, setSeal] = useState('all');
    const seatedRecords = records.slice(0, COUNCIL_SEATS.length);
    const selectedSeat = COUNCIL_SEATS.find(seat => seat.id === selectedSeatId) || null;
    const selectedIndex = selectedSeat ? COUNCIL_SEATS.indexOf(selectedSeat) : -1;
    const selected = selectedIndex >= 0 ? seatedRecords[selectedIndex] || null : null;
    const memberAt = seatId => COUNCIL_MEMBERS.find(member => member.seatId === seatId) || null;
    const openable = member => !!member && member.status === 'ready' && !!member.avatar?.art; // só quem tem arte oficial abre modal
    const openMember = COUNCIL_MEMBERS.find(member => member.id === openMemberId) || null;
    const reveal = (COUNCIL.animation && COUNCIL.animation.reveal) || { onClick: false, persist: true, modalDelay: 0 };
    function revealAndOpen(member) {
      window.clearTimeout(openTimer.current);
      if (!openable(member)) { setOpenMemberId(null); return; }
      const sits = !!member.avatar?.scene && !!member.placement; // sem sprite de cena, não há o que revelar na cadeira
      const alreadyThere = revealedIds.includes(member.id) || !reveal.onClick || !sits;
      setRevealedIds(current => (current.includes(member.id) ? current : [...current, member.id]));
      if (alreadyThere || reducedMotion()) { setOpenMemberId(member.id); return; }
      openTimer.current = window.setTimeout(() => setOpenMemberId(member.id), reveal.modalDelay * 1000);
    }
    return {
      selected, selectedSeat, selectedSeatId, view, seal, seatedRecords, seats: COUNCIL_SEATS, openMember, memberAt, openable,
      revealedIds,
      // O conselheiro aparece na cadeira ao clicar; o modal abre logo depois da entrada do avatar (ou na hora, se já estava lá).
      selectSeat: id => { const member = memberAt(id); setSelectedSeatId(id); setView('table'); revealAndOpen(member); },
      selectMember: id => { const member = COUNCIL_MEMBERS.find(item => item.id === id); if (!openable(member)) return; setSelectedSeatId(member.seatId); setView('table'); revealAndOpen(member); },
      select: recordId => { const index = seatedRecords.findIndex(record => record.id === recordId); if (index >= 0) setSelectedSeatId(COUNCIL_SEATS[index].id); setOpenMemberId(null); setView('table'); },
      clear: () => { window.clearTimeout(openTimer.current); setSelectedSeatId(null); setOpenMemberId(null); if (reveal.persist === false) setRevealedIds([]); },
      showView: next => setView(next),
      filterSeal: next => setSeal(next),
    };
  }

  // ---------------------------------------------------------------------------------------------
  // Peças compartilhadas
  // ---------------------------------------------------------------------------------------------

  function EmptyArchiveState({ kicker, title, text, note, children, className = '' }) {
    return h('div', { className: `voice-empty ${className}` },
      h('span', { className: 'voice-empty__seal', 'aria-hidden': 'true' }, '◇'),
      kicker && h('p', { className: 'voice-empty__kicker' }, kicker),
      h('h6', null, title),
      text && h('p', null, text),
      note && h('small', null, note),
      children
    );
  }

  function EnvironmentIntro({ kicker, title, text }) {
    return h('div', { className: 'voice-environment__intro' },
      h('p', null, kicker), h('h6', null, title), text && h('span', null, text));
  }

  function Chips({ label, items, value, onChange, allLabel = 'Todos' }) {
    return h('div', { className: 'voice-chips', role: 'group', 'aria-label': label },
      h('button', { type: 'button', className: value === 'all' ? 'is-active' : '', 'aria-pressed': value === 'all', onClick: () => onChange('all') }, allLabel),
      items.map(item => h('button', { key: item, type: 'button', className: value === item ? 'is-active' : '', 'aria-pressed': value === item, onClick: () => onChange(item) }, item))
    );
  }

  // Camada sobreposta (registro completo, galeria): captura o foco e o devolve a quem abriu.
  function useLayerFocus(layerRef, focusSelector) {
    useLayoutEffect(() => {
      const opener = document.activeElement;
      layerRef.current?.querySelector(focusSelector)?.focus({ preventScroll: true });
      return () => { if (opener && document.contains(opener)) opener.focus({ preventScroll: true }); };
    }, []);
  }

  function VoiceRecordDialog({ record, onClose }) {
    const ref = useRef(null);
    useLayerFocus(ref, '.voice-dialog__close');
    return h('div', { className: 'journey-banner__record-dialog voice-dialog', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'voice-dialog-title', 'data-voice-layer': true, ref },
      h('article', null,
        h('button', { type: 'button', className: 'voice-dialog__close', onClick: onClose, 'aria-label': 'Fechar registro completo' }, '×'),
        h('p', { className: 'voice-dialog__kicker' }, [record.category, record.type].filter(Boolean)[0] || 'Registro autorizado'),
        h('h5', { id: 'voice-dialog-title' }, record.title || 'Registro autorizado'),
        paragraphs(record.content || record.description).map((text, index) => h('p', { key: index, className: 'voice-dialog__text' }, text)),
        record.evolution && h(EvolutionTrail, { evolution: record.evolution }),
        record.participants?.length > 0 && h('p', { className: 'voice-dialog__meta' }, h('strong', null, 'Participantes: '), record.participants.join(', ')),
        record.evidence?.length > 0 && h('ul', { className: 'voice-dialog__links' }, record.evidence.map((item, index) => h('li', { key: index }, item.href ? h('a', { href: item.href, target: '_blank', rel: 'noopener noreferrer' }, item.label || 'Evidência') : item.label))),
        h('p', { className: 'voice-dialog__meta' },
          [attribution(record), record.context, record.period || formatDate(record.date)].filter(Boolean).join(' · ')),
        record.seals?.length > 0 && h('p', { className: 'voice-dialog__seals', 'aria-label': 'Selos de colaboração' }, record.seals.map(seal => h('span', { key: seal }, seal))),
        record.source?.href && h('a', { className: 'voice-dialog__source', href: record.source.href, target: '_blank', rel: 'noopener noreferrer' }, record.source.label || 'Consultar fonte publicável')
      )
    );
  }

  function EvolutionTrail({ evolution }) {
    const steps = [['Desafio inicial', evolution.challenge], ['Experiência de aprendizado', evolution.experience], ['Resultado alcançado', evolution.result]].filter(([, text]) => text);
    if (!steps.length) return null;
    return h('ol', { className: 'voice-evolution', 'aria-label': 'Evolução do aprendizado' },
      steps.map(([label, text]) => h('li', { key: label }, h('strong', null, label), h('span', null, text))));
  }

  // ---------------------------------------------------------------------------------------------
  // Biblioteca dos Aprendizes
  // ---------------------------------------------------------------------------------------------

  // Cada entrada ocupa um dos 9 espaços desenhados na arte do livro (posições em CSS: .voice-slot).
  function BookIndex({ book, page, records }) {
    if (!records.length) {
      return h(EmptyArchiveState, { className: 'voice-empty--parchment', title: 'Índice dos Aprendizados', text: 'Os temas e os relatos aparecerão aqui quando os primeiros registros autorizados forem publicados.' });
    }
    return h('ol', { className: 'voice-index__slots', 'aria-label': 'Índice dos Aprendizados' },
      page.chunk.map((record, slot) => h('li', { key: record.id, className: 'voice-slot', style: { '--slot': slot } },
        h('button', { type: 'button', onClick: () => book.goTo(book.indexCount + page.start + slot) },
          h('span', { className: 'voice-slot__title' }, record.title),
          h('small', null, [record.category, formatDate(record.date)].filter(Boolean).join(' · ') || record.context)
        )))
    );
  }

  function BookPageLeft({ page, records, book }) {
    if (page.intro) {
      const topics = window.VoiceArchive.topicsOf(records);
      return h('div', { className: 'voice-page__body' },
        h('p', { className: 'voice-page__kicker' }, page.number ? `Índice dos Aprendizados — ${page.number + 1} de ${page.total}` : 'Índice dos Aprendizados'),
        h('h6', { className: 'voice-page__title' }, 'O Livro dos Aprendizados'),
        h('p', { className: 'voice-page__text voice-page__text--quote' }, 'Cada jornada de aprendizado carrega desafios, descobertas e experiências que merecem ser preservadas.'),
        !records.length && h('p', { className: 'voice-page__pending' }, 'Os primeiros registros ainda estão sendo reunidos.'),
        topics.length > 0 && h(Chips, { label: 'Filtrar por assunto', items: topics, value: book.topic, onChange: book.filterBy, allLabel: 'Todos os assuntos' })
      );
    }
    const by = attribution(page);
    return h('div', { className: 'voice-page__body' },
      h('p', { className: 'voice-page__kicker' }, page.category || 'Registro de aprendizado'),
      page.topics?.length > 0 && h('p', { className: 'voice-page__topics' }, page.topics.map(topic => h('span', { key: topic }, topic))),
      page.context && h('p', { className: 'voice-page__meta' }, page.context),
      formatDate(page.date) && h('p', { className: 'voice-page__meta' }, h('time', { dateTime: page.date }, formatDate(page.date))),
      by && h('p', { className: 'voice-page__author' }, by),
      page.source?.href && h('a', { className: 'voice-page__source', href: page.source.href, target: '_blank', rel: 'noopener noreferrer' }, page.source.label || 'Ver referência original')
    );
  }

  function BookPageRight({ page, book, records }) {
    if (page.intro) return h(BookIndex, { book, page, records });
    const related = records.filter(record => record !== page && (record.topics || []).some(topic => (page.topics || []).includes(topic))).slice(0, 4);
    return h('div', { className: 'voice-page__body' },
      h('h6', { className: 'voice-page__title' }, page.title),
      paragraphs(page.content || page.description).map((text, index) => h('p', { key: index, className: 'voice-page__text' }, text)),
      page.evolution && h(EvolutionTrail, { evolution: page.evolution }),
      related.length > 0 && h('div', { className: 'voice-markers' },
        h('p', null, 'Marcadores de jornada'),
        h('ul', null, related.map(record => h('li', { key: record.id }, h('button', { type: 'button', onClick: () => book.jumpToRecord(record) }, record.title))))
      )
    );
  }

  function ApprenticeLibrary({ records, onExploreChronicles, backRef }) {
    const book = useBookNavigation(records);
    const bookRef = useRef(null);
    const coverRef = useRef(null);
    useBackHandler(backRef, () => { if (!book.open) return false; book.setOpen(false); return true; });
    useEffect(() => { if (book.open) bookRef.current?.focus({ preventScroll: true }); else if (document.activeElement === document.body) coverRef.current?.focus({ preventScroll: true }); }, [book.open]);
    function onKeyDown(event) {
      if (!book.open || event.target.closest?.('input, textarea')) return;
      if (event.key === 'ArrowRight') { event.preventDefault(); book.turn(1); }
      else if (event.key === 'ArrowLeft') { event.preventDefault(); book.turn(-1); }
      else if (event.key === 'Home') { event.preventDefault(); book.goToIndex(); }
    }
    const last = book.index === book.pages.length - 1;
    const status = book.page.intro ? 'Índice dos Aprendizados' : `Registro: ${book.page.title}`;
    return h('div', { className: `voice-env voice-env--library voice-library${book.open ? ' is-open' : ''}`, onKeyDown },
      h(EnvironmentIntro, { kicker: 'Biblioteca dos Aprendizes', title: 'Cada aluno deixou uma página nesta história.', text: 'Abra o livro para folhear os registros de aprendizado publicados com autorização.' }),
      h('div', { className: 'voice-library__scene' },
        h('div', { className: 'voice-library__shelves', 'aria-hidden': 'true' }),
        h('div', { className: 'voice-library__glow', 'aria-hidden': 'true' }),
        !book.open
          ? h('button', { type: 'button', ref: coverRef, className: 'voice-book-closed', onClick: () => book.setOpen(true), 'aria-label': 'Abrir O Livro dos Aprendizados' },
            h('img', { className: 'voice-book-closed__art', src: 'assets/img/legados/livro-aprendizados-fechado.webp', alt: '', 'aria-hidden': 'true', decoding: 'async' }),
            h('span', { className: 'voice-book-closed__label' },
              h('span', { className: 'voice-book-closed__sigil', 'aria-hidden': 'true' }, h('img', { src: 'assets/img/legados/simbolo-backend-chapeu.webp', alt: '', decoding: 'async' })),
              h('strong', null, 'O Livro dos Aprendizados'),
              h('small', null, 'Clique para abrir')
            )
          )
          : h('section', { className: 'voice-book', ref: bookRef, tabIndex: -1, 'aria-label': 'O Livro dos Aprendizados' },
            h('div', { className: 'voice-book__spread', 'data-art': book.page.intro && records.length ? 'index' : 'page' },
              h('article', { key: `l-${book.page.id}`, className: 'voice-page voice-page--left' }, h(BookPageLeft, { page: book.page, records, book })),
              h('article', { key: `r-${book.page.id}`, className: `voice-page voice-page--right${book.page.intro && records.length ? ' is-index' : ''}` }, h(BookPageRight, { page: book.page, book, records })),
              book.flip && h('span', { key: book.flip.key, className: `voice-book__leaf voice-book__leaf--${book.flip.dir > 0 ? 'next' : 'prev'}`, 'aria-hidden': 'true' })
            ),
            h('footer', { className: 'voice-book__controls' },
              h('button', { type: 'button', onClick: () => book.turn(-1), disabled: book.index === 0, 'aria-label': 'Página anterior' }, '← Anterior'),
              h('span', { className: 'voice-book__counter' }, `Página ${book.index + 1} de ${book.pages.length}`),
              h('button', { type: 'button', onClick: () => book.turn(1), disabled: last, 'aria-label': 'Próxima página' }, 'Próxima →')
            ),
            h('div', { className: 'voice-book__actions' },
              h('button', { type: 'button', onClick: book.goToIndex, disabled: book.index === 0 }, 'Voltar ao índice'),
              h('button', { type: 'button', onClick: () => book.setOpen(false) }, 'Fechar o livro')
            ),
            h('p', { className: 'voice-sr', role: 'status', 'aria-live': 'polite' }, `Página ${book.index + 1} de ${book.pages.length}. ${status}`)
          )
      ),
      !records.length && h('button', { type: 'button', className: 'voice-environment__chronicles', onClick: onExploreChronicles }, 'Explorar as Crônicas')
    );
  }

  // ---------------------------------------------------------------------------------------------
  // Conselho da Guilda
  // ---------------------------------------------------------------------------------------------

  function CouncilLetter({ record, seat, seatEl, onOpen, onBack, reserved }) {
    const ref = useRef(null);
    // A carta parte do assento escolhido e pousa no centro da mesa.
    useLayoutEffect(() => {
      const letter = ref.current;
      if (!seat || !letter || !seatEl || reducedMotion() || !letter.animate) return undefined;
      const from = seatEl.getBoundingClientRect();
      const to = letter.getBoundingClientRect();
      const dx = from.left + from.width / 2 - (to.left + to.width / 2);
      const dy = from.top + from.height / 2 - (to.top + to.height / 2);
      const animation = letter.animate([
        { transform: `translate(${dx}px, ${dy}px) scale(.2) rotate(-14deg)`, opacity: 0 },
        { opacity: 1, offset: .35 },
        { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
      ], { duration: 560, easing: 'cubic-bezier(.2,.75,.2,1)' });
      return () => animation.cancel();
    }, [record?.id, seat?.id]);
    if (!record) {
      return h('article', { className: `voice-council__letter${seat ? ' is-awaiting' : ''}`, ref, 'aria-live': 'polite' },
        h('span', { className: 'voice-council__wax', 'aria-hidden': 'true' }, '◇'),
        seat && h('p', { className: 'voice-council__kind' }, seat.label),
        h('h6', null, seat ? (reserved ? `Cadeira reservada ao ${reserved.name}` : 'Este assento aguarda uma história.') : 'O Conselho dos Oito'),
        h('p', null, seat ? (reserved ? 'A arte oficial deste conselheiro ainda está sendo preparada. A cadeira permanece vazia até lá.' : 'Os registros autorizados desta colaboração serão apresentados aqui.') : 'Colaboração, responsabilidade e confiança são construídas nas experiências compartilhadas.'),
        h('small', null, seat ? (reserved ? reserved.role : 'Nenhuma pessoa foi atribuída a esta cadeira.') : 'Escolha um dos oito assentos para consultar sua carta.'),
        seat && h('button', { type: 'button', className: 'voice-council__letter-back', onClick: onBack }, 'Voltar ao salão')
      );
    }
    return h('article', { className: 'voice-council__letter has-record', ref, 'aria-live': 'polite' },
      h('span', { className: 'voice-council__wax', 'aria-hidden': 'true' }, '◆'),
      h('p', { className: 'voice-council__kind' }, [record.category, record.period || formatDate(record.date)].filter(Boolean).join(' · ') || 'Ata da Guilda'),
      h('h6', null, record.title),
      h('p', { className: 'voice-council__excerpt' }, record.description || record.content),
      record.seals?.length > 0 && h('p', { className: 'voice-council__seals' }, record.seals.map(seal => h('span', { key: seal }, seal))),
      h('div', { className: 'voice-council__actions' },
        h('button', { type: 'button', onClick: () => onOpen(record) }, 'Ler a ata completa'),
        h('button', { type: 'button', onClick: onBack }, 'Voltar à mesa')
      )
    );
  }

  function CouncilTable({ council, records, onOpenRecord, backRef }) {
    const CM = window.CouncilMembers;
    const seatRefs = useRef({});
    const sceneRef = useRef(null);
    const [hoverSeatId, setHoverSeatId] = useState(null);
    const [overrides, setOverrides] = useState({});
    const { seats, seatedRecords, selected, selectedSeat, selectedSeatId, openMember } = council;
    const ready = CM ? COUNCIL_MEMBERS.filter(CM.hasScene) : [];
    const revealOnClick = !!(COUNCIL.animation && COUNCIL.animation.reveal && COUNCIL.animation.reveal.onClick);
    // cadeiras vazias até o clique; no modo de depuração todos aparecem para ajustar a posição
    const visible = COUNCIL_DEBUG ? ready : (revealOnClick ? ready.filter(member => council.revealedIds.includes(member.id)) : []);
    const placementOf = member => ({ ...member.placement, ...(overrides[member.id] || {}) });
    CM?.useAvatarAnimation(sceneRef, visible.map(member => member.id).join());
    // o mouse não "sai" do assento quando o modal o cobre: sem isto o rótulo e o realce ficavam presos ao voltar
    useEffect(() => { setHoverSeatId(null); }, [openMember ? openMember.id : null]);
    useLayoutEffect(() => {
      const root = sceneRef.current; const gsap = window.gsap;
      if (!root || !gsap || reducedMotion()) return undefined;
      const context = gsap.context(() => { gsap.fromTo(root, { opacity: 0, scale: .985 }, { opacity: 1, scale: 1, duration: .48, ease: 'power2.out' }); }, root);
      return () => context.revert();
    }, []);
    return h('div', { className: 'voice-council__stage' },
      h('div', { className: `voice-council__board${COUNCIL_DEBUG ? ' is-debug' : ''}${selectedSeat ? ' has-selection' : ''}`, ref: sceneRef },
        h('img', { className: 'voice-council__background', src: COUNCIL_SCENE, width: 1536, height: 1024, alt: 'Salão gótico do Conselho dos Oito com mesa circular e cadeiras', decoding: 'async' }),
        // avatar + primeiro plano de cada um na mesma pilha: o braço da cadeira fica acima do dono e abaixo de quem está mais perto
        h('div', { className: 'voice-council__avatars', 'aria-hidden': 'true' }, CM && visible.flatMap(member => [
          h(CM.Avatar, { key: member.id, member, placement: placementOf(member), hovered: hoverSeatId === member.seatId, selected: selectedSeatId === member.seatId, dimmed: !!selectedSeatId && selectedSeatId !== member.seatId }),
          h(CM.Foreground, { key: `${member.id}-fg`, member, placement: placementOf(member), scene: COUNCIL_SCENE }),
        ])),
        h('div', { className: 'voice-council__atmosphere', 'aria-hidden': 'true' }),
        h('div', { className: 'voice-council__hotspots' }, seats.map((seat, index) => {
          if (seat.hasChair === false) return null; // a arte do cenário não tem cadeira neste lugar
          const member = council.memberAt(seat.id);
          const record = seatedRecords[index];
          const live = !!CM && council.openable(member);
          return h('button', {
            key: seat.id, type: 'button', ref: node => { seatRefs.current[seat.id] = node; },
            className: `voice-council__hotspot${selectedSeatId === seat.id ? ' is-active' : ''}${live ? ' has-member' : ''}${visible.some(item => item.seatId === seat.id) ? ' is-revealed' : ''}`,
            style: { '--seat-x': `${seat.x}%`, '--seat-y': `${seat.y}%`, '--seat-w': `${seat.width}%`, '--seat-h': `${seat.height}%`, '--seat-z': seat.zIndex },
            'aria-pressed': selectedSeatId === seat.id,
            'aria-haspopup': live ? 'dialog' : undefined,
            'aria-label': live ? `${member.name}, ${member.title}. Abrir os detalhes` : record ? `${seat.label}: ata “${record.title}”` : `${seat.label}: cadeira aguardando um conselheiro`,
            onClick: () => (selectedSeatId === seat.id ? council.clear() : council.selectSeat(seat.id)),
            onMouseEnter: () => setHoverSeatId(seat.id), onMouseLeave: () => setHoverSeatId(null),
            onFocus: event => { if (event.currentTarget.matches(':focus-visible')) setHoverSeatId(seat.id); }, onBlur: () => setHoverSeatId(null),
          }, h('span', { 'aria-hidden': 'true' }, live ? '✦' : index + 1), h('small', null, live ? member.name : (record?.title || 'Aguarda um conselheiro')));
        })),
        selectedSeat && !openMember && h(CouncilLetter, { key: selectedSeatId, record: selected, seat: selectedSeat, reserved: council.memberAt(selectedSeat.id), seatEl: seatRefs.current[selectedSeat.id], onOpen: onOpenRecord, onBack: council.clear }),
        COUNCIL_DEBUG && CM && h(CM.DebugPanel, { overrides, setOverride: (id, patch) => setOverrides(current => ({ ...current, [id]: { ...(current[id] || {}), ...patch } })) })
      ),
      CM && h(CM.Roster, { onSelect: council.selectMember, selectedId: openMember?.id }),
      !selectedSeat && h('p', { className: 'voice-council__hint' }, 'Clique em uma cadeira para ver quem a ocupa e conhecer sua história.'),
      openMember && CM && h(CM.MemberModal, { key: openMember.id, member: openMember, records, onClose: council.closeMember || council.clear, onOpenRecord, backRef })
    );
  }

  function GuildRecord({ record, onOpen, onSeat, seated }) {
    return h('article', { className: 'voice-minute' },
      h('p', { className: 'voice-minute__kind' }, [record.category, record.period || formatDate(record.date)].filter(Boolean).join(' · ') || 'Ata'),
      h('h6', null, record.title),
      record.context && h('p', { className: 'voice-minute__context' }, record.context),
      h('p', null, record.description || record.content),
      record.participants?.length > 0 && h('p', { className: 'voice-minute__people' }, `Participantes: ${record.participants.join(', ')}`),
      record.seals?.length > 0 && h('p', { className: 'voice-council__seals' }, record.seals.map(seal => h('span', { key: seal }, seal))),
      h('div', { className: 'voice-council__actions' },
        h('button', { type: 'button', onClick: () => onOpen(record) }, 'Abrir a ata'),
        seated && h('button', { type: 'button', onClick: () => onSeat(record.id) }, 'Ver na mesa')
      )
    );
  }

  function CouncilMinutes({ records, council, onOpenRecord }) {
    if (!records.length) {
      return h(EmptyArchiveState, { kicker: 'Atas da Guilda', title: 'O arquivo ainda está vazio', text: 'Nenhuma ata será inventada para preencher a sala.', note: 'As atas de colaboração aparecerão aqui assim que houver registros autorizados.' });
    }
    const seals = window.VoiceArchive.sealsOf(records);
    const visible = council.seal === 'all' ? records : records.filter(record => (record.seals || []).includes(council.seal));
    return h('div', { className: 'voice-minutes' },
      seals.length > 0 && h('div', { className: 'voice-minutes__seals' },
        h('p', null, 'Selos de Colaboração — filtros editoriais, não premiações.'),
        h(Chips, { label: 'Filtrar atas por selo', items: seals, value: council.seal, onChange: council.filterSeal, allLabel: 'Todas as atas' })),
      h('div', { className: 'voice-minutes__list' },
        visible.map(record => h(GuildRecord, { key: record.id, record, onOpen: onOpenRecord, onSeat: council.select, seated: council.seatedRecords.includes(record) })))
    );
  }

  // Cada elo vem de `links` de um registro real; nada é desenhado sem esse vínculo.
  function buildConnections(records) {
    const nodes = new Map();
    records.forEach(record => (record.links || []).forEach(link => {
      const label = String(link?.label || '').trim();
      if (!label) return;
      const kind = KINDS[link.kind] ? link.kind : 'collaboration';
      const id = `${kind}:${label.toLowerCase()}`;
      if (!nodes.has(id)) nodes.set(id, { id, kind, label, records: [] });
      const node = nodes.get(id);
      if (!node.records.includes(record)) node.records.push(record);
    }));
    const list = [...nodes.values()];
    const connected = [...new Set(list.flatMap(node => node.records))];
    const edges = list.reduce((sum, node) => sum + node.records.length, 0);
    return { nodes: list, connected, enough: connected.length >= 2 && edges >= 2 };
  }

  function ConnectionMap({ records, onOpenRecord }) {
    const graph = useMemo(() => buildConnections(records), [records]);
    const [focus, setFocus] = useState(null);
    if (!graph.enough) {
      return h(EmptyArchiveState, { kicker: 'Mapa das Conexões', title: 'Ainda não há conexões documentadas', text: 'O mapa liga projetos, experiências, responsabilidades e colaborações somente quando registros reais as descrevem.', note: 'Nenhuma ligação é desenhada sem documentação.' });
    }
    const rows = Math.max(graph.connected.length, graph.nodes.length);
    const height = Math.max(220, rows * 58 + 40);
    const place = (count, index) => (count === 1 ? height / 2 : 34 + index * ((height - 68) / (count - 1)));
    const recordY = new Map(graph.connected.map((record, index) => [record.id, place(graph.connected.length, index)]));
    const nodeY = new Map(graph.nodes.map((node, index) => [node.id, place(graph.nodes.length, index)]));
    const active = (record, node) => !focus || focus === record.id || focus === node.id;
    return h('div', { className: 'voice-map' },
      h('svg', { className: 'voice-map__svg', viewBox: `0 0 680 ${height}`, 'aria-hidden': 'true', focusable: 'false' },
        graph.nodes.flatMap(node => node.records.map(record => h('path', {
          key: `${node.id}-${record.id}`, className: `voice-map__edge${active(record, node) ? '' : ' is-dim'}`,
          d: `M190 ${recordY.get(record.id)} C 330 ${recordY.get(record.id)}, 360 ${nodeY.get(node.id)}, 490 ${nodeY.get(node.id)}`,
        }))),
        graph.connected.map(record => h('g', { key: record.id, className: `voice-map__node${focus && focus !== record.id ? ' is-dim' : ''}`, onClick: () => setFocus(current => (current === record.id ? null : record.id)) },
          h('rect', { x: 10, y: recordY.get(record.id) - 17, width: 180, height: 34, rx: 3 }),
          h('text', { x: 100, y: recordY.get(record.id) + 4, textAnchor: 'middle' }, truncate(record.title, 24)))),
        graph.nodes.map(node => h('g', { key: node.id, className: `voice-map__node voice-map__node--link${focus && focus !== node.id ? ' is-dim' : ''}`, onClick: () => setFocus(current => (current === node.id ? null : node.id)) },
          h('rect', { x: 490, y: nodeY.get(node.id) - 17, width: 180, height: 34, rx: 3 }),
          h('text', { x: 580, y: nodeY.get(node.id) + 4, textAnchor: 'middle' }, `${KINDS[node.kind].glyph} ${truncate(node.label, 22)}`)))
      ),
      h('div', { className: 'voice-map__reading' },
        h('h6', null, 'Leitura das conexões'),
        h('ul', null, graph.nodes.map(node => h('li', { key: node.id, className: focus && focus !== node.id && !node.records.some(record => record.id === focus) ? 'is-dim' : '' },
          h('button', { type: 'button', className: 'voice-map__link', 'aria-pressed': focus === node.id, onClick: () => setFocus(current => (current === node.id ? null : node.id)) },
            h('span', { 'aria-hidden': 'true' }, KINDS[node.kind].glyph), ` ${KINDS[node.kind].label}: ${node.label}`),
          h('span', { className: 'voice-map__joins' }, ' conecta '),
          node.records.map(record => h('button', { key: record.id, type: 'button', className: 'voice-map__record', onClick: () => onOpenRecord(record) }, record.title))
        )))
      )
    );
  }

  function GuildCouncil({ records, onOpenRecord, backRef }) {
    const council = useCouncilInteraction(records);
    return h('div', { className: 'voice-env voice-env--council voice-council' },
      h(EnvironmentIntro, { kicker: 'Conselho da Guilda', title: 'Nenhuma grande conquista se constrói sozinho.', text: 'A mesa recebe somente registros de colaboração publicados com autorização.' }),
      // Atas da Guilda e Mapa das Conexões estão fora da navegação; CouncilMinutes e ConnectionMap seguem no arquivo para reativar.
      h('div', { className: 'voice-council__view' }, h(CouncilTable, { council, records, onOpenRecord, backRef }))
    );
  }

  // ---------------------------------------------------------------------------------------------
  // Despachante
  // ---------------------------------------------------------------------------------------------

  function VoiceExperience({ type, records, onExploreChronicles, onOpenRecord, backRef }) {
    if (type === 'students') return h(ApprenticeLibrary, { records, onExploreChronicles, backRef });
    return h(GuildCouncil, { records, onOpenRecord, backRef });
  }

  window.VoiceExperience = {
    Experience: VoiceExperience, RecordDialog: VoiceRecordDialog, useVoiceNavigation,
    categoryTypes: CATEGORY_TYPES, environments: ENVIRONMENTS,
    council: { scene: COUNCIL_SCENE, seats: COUNCIL_SEATS, members: COUNCIL_MEMBERS, debug: COUNCIL_DEBUG },
    utils: { useLayerFocus, useBackHandler, reducedMotion, formatDate },
  };
})();
