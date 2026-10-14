// Minha Jornada — capítulos cinematográficos 2.5D.
// Intercepta o clique nos portais que têm dados em window.journeyChapters e abre o capítulo em um
// diálogo de tela cheia. Portais sem dados continuam usando o palco inline de journey-portals.js.
// Capítulos com `story` exibem primeiro as cenas sequenciais e, ao final (ou ao pular), o resumo profissional.
(() => {
  const mount = document.querySelector('[data-journey-experience-root]');
  const chapters = window.journeyChapters;
  if (!mount || !window.React || !window.ReactDOM || !Array.isArray(chapters) || !chapters.length) return;

  const h = window.React.createElement;
  const { useEffect, useRef, useState } = window.React;

  const VORTEX = {
    azul: 'assets/img/Portais/vortice-azul.png.png',
    laranja: 'assets/img/Portais/vortice-laranja.png',
    roxo: 'assets/img/Portais/vortice-roxo.png',
    vermelho: 'assets/img/Portais/vortice-vermelho.png',
    dourado: 'assets/img/Portais/vortice-dourado.png',
  };
  const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  const CROSSING_MS = 180;
  // Tempo mínimo entre trocas de cena: evita animações sobrepostas por cliques repetidos.
  const SCENE_LOCK_MS = 380;
  const pad = number => String(number).padStart(2, '0');
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const chapterIndexForGate = gate => chapters.findIndex(chapter => gate.hash === `#capitulo-${chapter.id}`);

  // ---------- Travessia do portal ----------
  function JourneyPortalTransition({ crossing }) {
    if (!crossing) return null;
    return h('div', {
      className: 'journey-crossing is-crossing',
      'aria-hidden': 'true',
      style: { '--origin-x': `${crossing.x}px`, '--origin-y': `${crossing.y}px` },
    },
      VORTEX[crossing.portal] && h('img', { className: 'journey-crossing__vortex', src: VORTEX[crossing.portal], alt: '', draggable: false }),
      h('i'), h('i'), h('i')
    );
  }

  // ---------- Cenas: cada variante define as camadas de cenário e de objetos ----------
  const plane = (className, depth, ...children) => h('div', {
    className: `journey-scene__layer journey-scene__plane ${className}`,
    style: { '--depth': depth },
    'aria-hidden': 'true',
  }, ...children);

  const repeat = (count, render) => Array.from({ length: count }, (_, index) => render(index));
  const laptop = code => h('span', { className: 'journey-scene__laptop' }, h('i'), h('b', null, code));

  // Tela do laptop no modo história: os estados são trocados por data-screen na cena.
  const storyLaptop = () => h('span', { className: 'journey-scene__laptop' },
    h('span', { className: 'journey-screen journey-screen--dim' }, h('b', null, '_')),
    h('span', { className: 'journey-screen journey-screen--lesson' }),
    h('span', { className: 'journey-screen journey-screen--code' },
      h('code', null, '<h1>Olá, mundo!</h1>'),
      h('code', null, '<p>Meu primeiro site</p>'),
      h('code', { className: 'is-css' }, 'h1 { color: #6fbcff; }'),
      h('code', { className: 'is-css' }, 'p { font-size: 18px; }')
    ),
    h('span', { className: 'journey-screen journey-screen--site' }, h('i'), h('i'), h('i'), h('i'), h('i'))
  );

  const storyDeskItems = () => [
    h('span', { key: 'candles', className: 'journey-scene__candles' }, h('i'), h('i')),
    h('span', { key: 'notebook', className: 'journey-scene__notebook' },
      h('span', { className: 'nb-page nb-page--left' },
        h('i', { className: 'nb-few' }), h('i', { className: 'nb-few' }),
        h('i', { className: 'nb-notes' }), h('i', { className: 'nb-notes' }), h('i', { className: 'nb-notes' })
      ),
      h('span', { className: 'nb-page nb-page--right' },
        h('b', { className: 'nb-notes' }, '</>'),
        h('i', { className: 'nb-wire nb-wire--bar' }), h('i', { className: 'nb-wire nb-wire--hero' }),
        h('i', { className: 'nb-wire nb-wire--card' }), h('i', { className: 'nb-wire nb-wire--card' })
      )
    ),
    h('span', { key: 'runes', className: 'journey-scene__story-runes' }, ...['ᚺ', 'ᛏ', 'ᛗ', 'ᚲ', 'ᛋ'].map(rune => h('i', null, rune))),
    h('span', { key: 'ui', className: 'journey-scene__ui' }, h('i'), h('i'), h('i'), h('i')),
    h('span', { key: 'sweep', className: 'journey-scene__sweep' }),
  ];

  const SCENE_SETS = {
    // 2020 — biblioteca/estúdio gótico noturno (camadas originais).
    library: ({ story }) => [
      h('div', { key: 'bg', className: 'journey-scene__layer journey-scene__night', 'aria-hidden': 'true' }),
      h('div', { key: 'window', className: 'journey-scene__layer journey-scene__window', 'aria-hidden': 'true' }, h('i'), h('i')),
      h('div', { key: 'shelves', className: 'journey-scene__layer journey-scene__shelves', 'aria-hidden': 'true' }, ...repeat(5, () => h('i'))),
      h('div', { key: 'runes', className: 'journey-scene__layer journey-scene__runes', 'aria-hidden': 'true' }, 'ᚨ ᛗ ᚲ'),
      h('div', { key: 'desk', className: 'journey-scene__layer journey-scene__desk', 'aria-hidden': 'true' },
        h('span', { className: 'journey-scene__books' }, h('i'), h('i'), h('i')),
        !story && h('span', { className: 'journey-scene__scroll' }),
        story ? storyLaptop() : laptop('<html>'),
        ...(story ? storyDeskItems() : [])
      ),
    ],
    // 2022 — forja: parede de pedra, fornalha acesa, bigorna e bancada.
    forge: () => [
      h('div', { key: 'bg', className: 'journey-scene__layer journey-scene__bg', 'aria-hidden': 'true' }),
      plane('forge-wall', -6, h('span', { className: 'forge-furnace' }, h('i')), h('span', { className: 'forge-tools' }, h('i'), h('i'), h('i'))),
      plane('journey-scene__table', 8,
        h('span', { className: 'forge-anvil' }),
        h('span', { className: 'journey-scene__scroll' }),
        laptop('deploy()')
      ),
    ],
    // 2024 — torre: janela alta sob a lua, colunas, púlpito com orbe e livros flutuando.
    tower: () => [
      h('div', { key: 'bg', className: 'journey-scene__layer journey-scene__bg', 'aria-hidden': 'true' }),
      plane('tower-window', -9, h('i'), h('i')),
      plane('tower-columns', -5, h('i'), h('i')),
      plane('tower-books', 14, ...repeat(3, () => h('i'))),
      plane('journey-scene__table', 8,
        h('span', { className: 'tower-orb' }),
        h('span', { className: 'journey-scene__books' }, h('i'), h('i'), h('i')),
        laptop('<App />')
      ),
    ],
    // 2025–2026 — conselho: estandartes, tochas, mesa com mapa e painéis arcanos.
    council: () => [
      h('div', { key: 'bg', className: 'journey-scene__layer journey-scene__bg', 'aria-hidden': 'true' }),
      plane('council-banners', -7, h('i', null, '◇'), h('i', null, '◇')),
      plane('council-torches', -4, h('i'), h('i')),
      plane('council-holo', 12, ...repeat(3, () => h('i'))),
      plane('journey-scene__table', 8,
        h('span', { className: 'council-map' }),
        laptop('api.lead()')
      ),
    ],
    // 2026+ — horizonte: céu ao amanhecer, montanhas, castelo distante e muralha.
    horizon: () => [
      h('div', { key: 'bg', className: 'journey-scene__layer journey-scene__bg', 'aria-hidden': 'true' }, h('i')),
      plane('horizon-far', -10),
      plane('horizon-near', -5),
      plane('horizon-rays', -2),
      plane('journey-scene__table horizon-wall', 8, laptop('next()')),
    ],
  };

  // Converte a configuração da cena da história em atributos e variáveis CSS.
  function storySceneProps(scene) {
    if (!scene) return { className: '', style: {}, data: {} };
    const light = scene.lighting || {};
    const camera = scene.camera || {};
    return {
      className: [
        'is-story',
        scene.assets?.shot ? 'is-shot' : '',
        light.omen > 0 ? 'has-omen' : '',
        ...(scene.effects || []).map(effect => `fx-${effect}`),
      ].join(' '),
      style: {
        '--light-moon': light.moon ?? 1,
        '--light-candle': light.candle ?? 1,
        '--light-monitor': light.monitor ?? 0.5,
        '--light-blue': light.blue ?? 0.3,
        '--light-omen': light.omen ?? 0,
        '--cam-zoom': camera.zoom ?? 1,
        '--cam-x': `${camera.x ?? 0}%`,
        '--cam-y': `${camera.y ?? 0}%`,
      },
      data: {
        'data-screen': scene.screen,
        'data-notebook': scene.notebook,
        'data-avatar': scene.avatar?.state,
        'data-transition': scene.transition,
      },
    };
  }

  function JourneyChapterScene({ chapter, storyScene, shots, onSwipe, onOpenTour, tourTriggerRef }) {
    const sceneRef = useRef(null);
    const swipeRef = useRef(null);
    const variant = SCENE_SETS[chapter.scene.variant] ? chapter.scene.variant : 'library';
    const story = storySceneProps(storyScene);
    const activeShot = storyScene?.assets?.shot || chapter.scene.image;

    function moveScene(event) {
      if (prefersReducedMotion() || event.pointerType === 'touch') return;
      const rect = sceneRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      sceneRef.current.style.setProperty('--scene-x', x.toFixed(3));
      sceneRef.current.style.setProperty('--scene-y', y.toFixed(3));
    }

    function resetScene() {
      sceneRef.current?.style.setProperty('--scene-x', 0);
      sceneRef.current?.style.setProperty('--scene-y', 0);
    }

    // Deslizar no touch troca de cena.
    function startSwipe(event) {
      if (event.pointerType === 'touch') swipeRef.current = { x: event.clientX, y: event.clientY };
    }
    function endSwipe(event) {
      const start = swipeRef.current;
      swipeRef.current = null;
      if (!start || !onSwipe) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) onSwipe(dx < 0 ? 1 : -1);
    }

    return h('figure', {
      className: `journey-cinematic__scene journey-scene--${variant} ${story.className}${activeShot ? ' is-shot' : ''}`,
      ref: sceneRef,
      style: story.style,
      ...story.data,
      onPointerMove: moveScene,
      onPointerLeave: resetScene,
      onPointerDown: startSwipe,
      onPointerUp: endSwipe,
      onPointerCancel: () => { swipeRef.current = null; },
    },
      h('div', { className: 'journey-scene__camera' },
        ...SCENE_SETS[variant]({ story: Boolean(storyScene) }),
        // Portal do próximo capítulo, atrás do avatar, revelado pela luz de presságio.
        storyScene && h('i', { className: 'journey-scene__omen', 'aria-hidden': 'true' }),
        h('img', {
          className: 'journey-scene__avatar',
          src: chapter.scene.avatar,
          alt: activeShot ? '' : chapter.scene.avatarAlt,
          width: 1086,
          height: 1448,
          draggable: false,
          decoding: 'async',
        })
      ),
      storyScene && h('div', { className: 'journey-scene__lights', 'aria-hidden': 'true' },
        h('i', { className: 'journey-light journey-light--moon' }),
        h('i', { className: 'journey-light journey-light--blue' }),
        h('i', { className: 'journey-light journey-light--candle' }),
        h('i', { className: 'journey-light journey-light--omen' })
      ),
      // Ilustrações em tela cheia (ex.: a primeira aula da Danki Code). Montadas desde o início
      // para que a troca de cena seja um crossfade, sem esperar o download.
      shots.map(shot => h('div', {
        key: shot.src,
        className: `journey-scene__shot${shot.src === activeShot ? ' is-active' : ''}${shot.fit === 'cover' ? ' is-cover' : ''}`,
        style: { '--shot-focus': shot.focus || '50% 50%' },
        'aria-hidden': shot.src === activeShot ? undefined : 'true',
      },
        h('img', {
          className: 'journey-scene__shot-main',
          src: shot.src,
          alt: shot.alt || '',
          width: 1676,
          height: 939,
          decoding: 'async',
          style: {
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: shot.focus || '50% 50%',
          },
        })
      )),
      h('div', { className: 'journey-scene__glow', 'aria-hidden': 'true' }),
      h('figcaption', null, storyScene ? storyScene.kicker : chapter.scene.label),
      !storyScene && memoriesFor(chapter) && h('button', {
        type: 'button',
        className: 'journey-tour360__trigger',
        onClick: onOpenTour,
        ref: tourTriggerRef,
        'aria-haspopup': 'dialog',
      }, h('span', { 'aria-hidden': 'true' }, '◎'), memoriesFor(chapter).label)
    );
  }

  // ---------- Narrativa da história ----------
  function JourneyStoryNarrative({ scene, index, total, titleRef }) {
    return h('section', { className: 'journey-story', 'aria-live': 'polite', 'aria-atomic': 'true' },
      h('div', { className: 'journey-story__beat', key: scene.id },
        h('p', { className: 'journey-story__step' }, `Cena ${index + 1} de ${total} · ${scene.kicker}`),
        h('h3', { className: 'journey-story__title', ref: titleRef, tabIndex: -1 }, scene.title),
        h('p', { className: 'journey-story__narrative' }, scene.narrative)
      ),
      h('ol', { className: 'journey-story__dots', 'aria-hidden': 'true' },
        repeat(total, dot => h('li', { key: dot, className: dot === index ? 'is-current' : dot < index ? 'is-done' : '' }))
      )
    );
  }

  function JourneyStoryNavigation({ index, total, nextChapter, onPrev, onNext, onSkip, onSummary, onNextChapter, onBack }) {
    const last = index >= total - 1;
    return h('nav', { className: 'journey-cinematic__navigation journey-story__navigation', 'aria-label': 'Navegação entre cenas' },
      h('div', { className: 'journey-story__primary' },
        h('button', { type: 'button', onClick: onPrev, disabled: index === 0, 'aria-label': 'Cena anterior' },
          h('span', { 'aria-hidden': 'true' }, '← '), 'Anterior'),
        last
          ? h(window.React.Fragment, null,
            h('button', { type: 'button', onClick: onSummary }, 'Ver resumo'),
            nextChapter && h('button', { type: 'button', className: 'is-primary is-next-portal', onClick: onNextChapter },
              `Próximo capítulo — ${nextChapter.title}`, h('span', { 'aria-hidden': 'true' }, ' →'))
          )
          : h('button', { type: 'button', className: 'is-primary', onClick: onNext, 'aria-label': `Próxima cena (${index + 2} de ${total})` },
            'Próxima cena', h('span', { 'aria-hidden': 'true' }, ' →'))
      ),
      h('div', { className: 'journey-story__secondary' },
        !last && h('button', { type: 'button', className: 'is-quiet', onClick: onSkip }, 'Pular história'),
        h('button', { type: 'button', className: 'is-quiet', onClick: onBack }, 'Voltar aos portais')
      )
    );
  }

  // ---------- Memórias Interativas (assets/js/journey-memories-react.js) ----------
  const memoriesFor = chapter => {
    const config = chapter.scene.memories;
    const data = config && window[config.source];
    return data && window.JourneyMemories ? { ...config, data } : null;
  };

  // ---------- Resumo profissional ----------
  function ListBlock({ title, items, tags }) {
    if (!items?.length) return null;
    return h('section', { className: 'journey-cinematic__block' },
      h('h3', null, title),
      h('ul', { className: tags ? 'journey-cinematic__tags' : undefined }, items.map(item => h('li', { key: item }, item)))
    );
  }

  function JourneyChapterContent({ chapter, onInvite, onReplay, summaryRef }) {
    return h('div', { className: 'journey-cinematic__content' },
      onReplay && h('div', { className: 'journey-cinematic__summary-head' },
        h('h3', { ref: summaryRef, tabIndex: -1 }, 'Resumo do capítulo'),
        h('button', { type: 'button', className: 'is-quiet', onClick: onReplay }, '↺ Rever a história')
      ),
      h('p', { className: 'journey-cinematic__opening' }, `“${chapter.subtitle}”`),
      h('p', { className: 'journey-cinematic__summary' }, chapter.summary),
      h(ListBlock, { title: 'Experiências', items: chapter.experiences }),
      h(ListBlock, { title: 'Conquistas', items: chapter.achievements }),
      h(ListBlock, { title: chapter.tagsTitle || 'Tecnologias', items: chapter.technologies, tags: true }),
      chapter.projects?.length > 0 && h('section', { className: 'journey-cinematic__block' },
        h('h3', null, chapter.projects.length > 1 ? 'Projetos relacionados' : 'Projeto relacionado'),
        chapter.projects.map(project => h('article', { className: 'journey-cinematic__project', key: project.name },
          h('div', null, h('h4', null, project.name), h('p', null, project.description)),
          (project.live || project.github) && h('nav', { 'aria-label': `Links do projeto ${project.name}` },
            project.live && h('a', { href: project.live, target: '_blank', rel: 'noopener noreferrer' }, 'Ver projeto'),
            project.github && h('a', { href: project.github, target: '_blank', rel: 'noopener noreferrer' }, 'GitHub')
          )
        ))
      ),
      chapter.invite && h('section', { className: 'journey-cinematic__block journey-cinematic__invite' },
        h('p', null, chapter.invite.text),
        h('a', { href: chapter.invite.href, onClick: event => onInvite(event, chapter.invite.href) },
          chapter.invite.label, h('span', { 'aria-hidden': 'true' }, ' →'))
      )
    );
  }

  // ---------- Navegação entre capítulos ----------
  function JourneyChapterNavigation({ index, onPrev, onNext, onBack }) {
    const prev = chapters[index - 1];
    const next = chapters[index + 1];
    return h('nav', { className: 'journey-cinematic__navigation', 'aria-label': 'Navegação entre capítulos' },
      h('button', { type: 'button', onClick: onPrev, disabled: !prev, 'aria-label': prev ? `Capítulo anterior: ${prev.title}` : 'Capítulo anterior' },
        h('span', { 'aria-hidden': 'true' }, '← '), 'Anterior'),
      h('button', { type: 'button', onClick: onBack }, 'Voltar aos portais'),
      h('button', {
        type: 'button',
        className: 'is-primary',
        onClick: onNext,
        disabled: !next,
        'aria-label': next ? `Próximo capítulo: ${next.title}` : 'Próximo capítulo',
      }, 'Próximo capítulo', h('span', { 'aria-hidden': 'true' }, ' →'))
    );
  }

  // ---------- Capítulo (painel remontado a cada troca, para reanimar a entrada) ----------
  function JourneyChapterPanel({ chapter, index, total, arrowRef, onPrev, onNext, onClose, onBack, onInvite }) {
    const scenes = chapter.story || [];
    const hasStory = scenes.length > 0;
    const [mode, setMode] = useState(hasStory ? 'story' : 'summary');
    const [sceneIndex, setSceneIndex] = useState(0);
    const titleRef = useRef(null);
    const storyTitleRef = useRef(null);
    const summaryRef = useRef(null);
    const storyRef = useRef(null);
    const lockRef = useRef(0);
    const focusAfterRef = useRef(null);
    const sceneIndexRef = useRef(0);
    const tourTriggerRef = useRef(null);
    const [tourOpen, setTourOpen] = useState(false);
    sceneIndexRef.current = sceneIndex;

    const storyShots = scenes
      .filter(scene => scene.assets?.shot)
      .map(scene => ({ src: scene.assets.shot, alt: scene.assets.shotAlt, focus: scene.assets.shotFocus }));
    const shots = chapter.scene.image
      ? [{ src: chapter.scene.image, alt: chapter.scene.imageAlt, focus: chapter.scene.imageFocus, fit: chapter.scene.imageFit }, ...storyShots]
      : storyShots;

    useEffect(() => { titleRef.current?.focus({ preventScroll: true }); }, []);

    // Depois de trocar de cena/modo, o foco vai para onde faz sentido se o botão clicado sumiu.
    useEffect(() => {
      const target = focusAfterRef.current;
      focusAfterRef.current = null;
      storyRef.current?.scrollTo?.({ top: 0 });
      if (!target) return;
      const panel = storyRef.current?.closest('.journey-cinematic__panel');
      if (target === 'summary') summaryRef.current?.focus({ preventScroll: true });
      else if (!panel?.contains(document.activeElement) || document.activeElement === document.body) {
        storyTitleRef.current?.focus({ preventScroll: true });
      }
    }, [sceneIndex, mode]);

    function goScene(step) {
      const target = sceneIndexRef.current + step;
      if (target < 0 || target >= scenes.length) return false;
      const now = performance.now();
      if (!prefersReducedMotion() && now - lockRef.current < SCENE_LOCK_MS) return true;
      lockRef.current = now;
      sceneIndexRef.current = target;
      focusAfterRef.current = 'story';
      setSceneIndex(target);
      return true;
    }

    function showSummary() {
      focusAfterRef.current = 'summary';
      setMode('summary');
    }

    function replayStory() {
      lockRef.current = 0;
      sceneIndexRef.current = 0;
      focusAfterRef.current = 'story';
      setSceneIndex(0);
      setMode('story');
    }

    // As setas do teclado navegam pelas cenas enquanto a história está ativa.
    arrowRef.current = mode === 'story'
      ? direction => goScene(direction) || true
      : null;

    const inStory = mode === 'story';
    const progressValue = inStory ? (sceneIndex + 1) / scenes.length : (index + 1) / total;
    const progressText = inStory ? `${pad(sceneIndex + 1)} / ${pad(scenes.length)}` : `${pad(index + 1)} / ${pad(total)}`;
    const progressLabel = inStory ? `Cena ${sceneIndex + 1} de ${scenes.length}` : `Capítulo ${index + 1} de ${total}`;

    return h('article', { className: `journey-cinematic__panel${inStory ? ' is-story' : ''}` },
      h('header', { className: 'journey-cinematic__header' },
        h('div', null,
          h('span', { className: 'journey-cinematic__eyebrow' }, `Capítulo ${ROMAN[index] || index + 1} · ${chapter.year}`),
          h('h2', { id: 'journey-cinematic-title', ref: titleRef, tabIndex: -1 }, chapter.title)
        ),
        h('div', { className: 'journey-cinematic__header-actions' },
          h('span', { className: 'journey-cinematic__progress', role: 'img', 'aria-label': progressLabel },
            inStory && h('small', null, 'Cena '), progressText),
          !inStory && h('button', { type: 'button', className: 'journey-cinematic__next', onClick: onNext, disabled: index >= total - 1 }, 'Próximo'),
          h('button', { type: 'button', className: 'journey-cinematic__close', onClick: onClose, 'aria-label': 'Fechar capítulo' }, '×')
        ),
        h('span', { className: 'journey-cinematic__progressbar', 'aria-hidden': 'true', style: { '--progress': progressValue } })
      ),
      h('div', { className: 'journey-cinematic__body' },
        h(JourneyChapterScene, {
          chapter,
          storyScene: hasStory ? scenes[sceneIndex] : null,
          shots,
          onSwipe: inStory ? goScene : null,
          onOpenTour: () => setTourOpen(true),
          tourTriggerRef,
        }),
        h('div', { className: 'journey-cinematic__story', ref: storyRef },
          inStory
            ? h(window.React.Fragment, null,
              h(JourneyStoryNarrative, { scene: scenes[sceneIndex], index: sceneIndex, total: scenes.length, titleRef: storyTitleRef }),
              h(JourneyStoryNavigation, {
                index: sceneIndex,
                total: scenes.length,
                nextChapter: chapters[index + 1],
                onPrev: () => goScene(-1),
                onNext: () => goScene(1),
                onSkip: showSummary,
                onSummary: showSummary,
                onNextChapter: onNext,
                onBack,
              })
            )
            : h(window.React.Fragment, null,
              h(JourneyChapterContent, { chapter, onInvite, onReplay: hasStory ? replayStory : null, summaryRef }),
              h(JourneyChapterNavigation, { index, onPrev, onNext, onBack })
            )
        )
      ),
      tourOpen && memoriesFor(chapter) && h(window.JourneyMemories, {
        data: memoriesFor(chapter).data,
        onClose: () => setTourOpen(false),
        returnFocusRef: tourTriggerRef,
      })
    );
  }

  function JourneyChapter({ index, crossing, actions }) {
    const dialogRef = useRef(null);
    const arrowRef = useRef(null);
    const chapter = chapters[index];
    const actionsRef = useRef(actions);
    actionsRef.current = actions;

    useEffect(() => {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      // Desempenho: a página atrás do diálogo (coberta pelo fundo opaco) deixa de pintar e animar.
      const root = document.documentElement;
      requestAnimationFrame(() => root.classList.add('journey-modal-open'));

      function handleKeydown(event) {
        // Com as Memórias Interativas abertas, o teclado (Escape, setas, Tab) pertence a elas.
        if (dialogRef.current?.querySelector('.journey-memories')) return;
        if (event.key === 'Escape') {
          event.preventDefault();
          actionsRef.current.onClose();
          return;
        }
        if ((event.key === 'ArrowRight' || event.key === 'ArrowLeft') && !event.altKey && !event.ctrlKey && !event.metaKey) {
          event.preventDefault();
          const direction = event.key === 'ArrowRight' ? 1 : -1;
          if (arrowRef.current?.(direction)) return;
          actionsRef.current[direction > 0 ? 'onNext' : 'onPrev']();
          return;
        }
        if (event.key !== 'Tab') return;
        const controls = [...dialogRef.current.querySelectorAll('button:not([disabled]), a[href]')];
        if (!controls.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        const outside = !dialogRef.current.contains(document.activeElement);
        if (event.shiftKey && (document.activeElement === first || outside)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || outside)) {
          event.preventDefault();
          first.focus();
        }
      }

      document.addEventListener('keydown', handleKeydown);
      return () => {
        document.removeEventListener('keydown', handleKeydown);
        root.classList.remove('journey-modal-open');
        document.body.style.overflow = previousOverflow;
      };
    }, []);

    return h('div', {
      className: 'journey-cinematic',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': 'journey-cinematic-title',
      ref: dialogRef,
      style: { '--chapter-color': chapter.theme, '--chapter-rgb': chapter.themeRgb },
    },
      h('div', { className: 'journey-cinematic__backdrop', 'aria-hidden': 'true' }),
      h(JourneyChapterPanel, { key: chapter.id, chapter, index, total: chapters.length, arrowRef, ...actions }),
      h(JourneyPortalTransition, { key: crossing?.run, crossing })
    );
  }

  // ---------- Orquestração ----------
  function JourneyExperience() {
    const [activeIndex, setActiveIndex] = useState(null);
    const [crossing, setCrossing] = useState(null);
    const crossingTimer = useRef(0);
    const openerRef = useRef(null);
    const indexRef = useRef(null);
    indexRef.current = activeIndex;

    function cross(index, origin) {
      window.clearTimeout(crossingTimer.current);
      if (prefersReducedMotion()) { setCrossing(null); return; }
      const point = origin || { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      setCrossing(current => ({ run: (current?.run || 0) + 1, portal: chapters[index].scene.portal, ...point }));
      crossingTimer.current = window.setTimeout(() => setCrossing(null), CROSSING_MS);
    }

    function gateFor(index) {
      return [...document.querySelectorAll('#jornada [data-journey-gate]')].find(gate => chapterIndexForGate(gate) === index);
    }

    function openChapter(index, gate) {
      const opening = gate.querySelector('.journey-gate__opening') || gate;
      const rect = opening.getBoundingClientRect();
      openerRef.current = gate;
      gate.setAttribute('aria-expanded', 'true');
      cross(index, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      setActiveIndex(index);
    }

    function goTo(index) {
      if (index < 0 || index >= chapters.length || index === indexRef.current) return;
      openerRef.current?.setAttribute('aria-expanded', 'false');
      openerRef.current = gateFor(index) || openerRef.current;
      openerRef.current?.setAttribute('aria-expanded', 'true');
      cross(index);
      indexRef.current = index;
      setActiveIndex(index);
    }

    function closeChapter({ restoreFocus = true, scrollToGates = false } = {}) {
      window.clearTimeout(crossingTimer.current);
      setCrossing(null);
      setActiveIndex(null);
      const gate = openerRef.current;
      gate?.setAttribute('aria-expanded', 'false');
      requestAnimationFrame(() => {
        if (scrollToGates) {
          document.querySelector('#jornada .journey-gates')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
        }
        if (restoreFocus) gate?.focus({ preventScroll: scrollToGates });
      });
    }

    function followInvite(event, href) {
      event.preventDefault();
      closeChapter({ restoreFocus: false });
      requestAnimationFrame(() => {
        const target = document.querySelector(href);
        target?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      });
    }

    useEffect(() => {
      const section = document.getElementById('jornada');
      if (!section) return undefined;
      section.querySelectorAll('[data-journey-gate]').forEach(gate => {
        if (chapterIndexForGate(gate) >= 0) gate.setAttribute('aria-haspopup', 'dialog');
      });

      // Fase de captura: o capítulo cinematográfico tem prioridade sobre o palco inline.
      function interceptGate(event) {
        const gate = event.target.closest('[data-journey-gate]');
        if (!gate) return;
        const index = chapterIndexForGate(gate);
        if (index < 0) return;
        event.preventDefault();
        event.stopPropagation();
        openChapter(index, gate);
      }

      section.addEventListener('click', interceptGate, true);

      // Pré-decodifica, com a página ociosa, as imagens do primeiro capítulo com história,
      // para que abrir o diálogo não pague o custo de download/decodificação no clique.
      const idle = window.requestIdleCallback || (callback => window.setTimeout(callback, 1500));
      idle(() => {
        const storyChapter = chapters.find(chapter => chapter.story?.length);
        if (!storyChapter) return;
        const sources = [storyChapter.scene.avatar, ...storyChapter.story.map(scene => scene.assets?.shot).filter(Boolean)];
        sources.forEach(src => {
          const image = new Image();
          image.decoding = 'async';
          image.src = src;
          image.decode?.().catch(() => {});
        });
      });

      return () => {
        section.removeEventListener('click', interceptGate, true);
        window.clearTimeout(crossingTimer.current);
      };
    }, []);

    if (activeIndex === null) return null;
    return h(JourneyChapter, {
      index: activeIndex,
      crossing,
      actions: {
        onPrev: () => goTo(indexRef.current - 1),
        onNext: () => goTo(indexRef.current + 1),
        onClose: () => closeChapter(),
        onBack: () => closeChapter({ scrollToGates: true }),
        onInvite: followInvite,
      },
    });
  }

  // O #jornada usa `isolation: isolate`; montado dentro dele, o diálogo fixo ficaria preso nesse
  // contexto de empilhamento e as seções seguintes seriam pintadas por cima. Por isso ele vive no <body>.
  document.body.appendChild(mount);
  window.ReactDOM.createRoot(mount).render(h(JourneyExperience));
})();
