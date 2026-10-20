// Atlas Imersivo e Estandarte do Capítulo IV.
(() => {
  if (!window.React || !window.ReactDOM) return;
  const h = window.React.createElement;
  const { useEffect, useLayoutEffect, useMemo, useRef, useState } = window.React;
  const JOURNEY_AVATAR = 'assets/img/Jornada/avatar de lado.png';
  const ATLAS_BACKGROUND = 'assets/img/Portais/Captulo IV/atlas-strategy-chamber-optimized.jpg';
  const ATLAS_OBSERVER = 'assets/img/Portais/Captulo IV/atlas-avatar-observer-v2-optimized.png';
  const REGION_PLACEMENT = [
    { x: 18, y: 25, size: 25 }, { x: 48, y: 19, size: 23 }, { x: 79, y: 25, size: 25 },
    { x: 29.5, y: 69, size: 22.5 }, { x: 54, y: 66, size: 27 }, { x: 83, y: 70, size: 23 },
  ];

  const safeLoad = key => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch (_) { return []; } };
  const safeSave = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* sessão continua sem persistência */ } };

  function ExplorerProgress({ visited, total }) {
    return h('div', { className: 'atlas-progress', role: 'status', 'aria-live': 'polite', title: `${visited} de ${total} crônicas exploradas` },
      h('span', { 'aria-hidden': 'true' }, '✦'),
      h('div', null, h('strong', null, `${visited}/${total}`), h('small', null, 'Diário do Explorador')),
      h('i', { 'aria-hidden': 'true' }, h('b', { style: { '--atlas-progress': `${total ? visited / total * 100 : 0}%` } }))
    );
  }

  function AtlasMapView({ data, visited, onSelect, selectedId, zooming = false }) {
    return h('section', { className: 'atlas-map-view', 'aria-labelledby': 'atlas-modal-title' },
      h('img', { className: 'atlas-atmosphere', src: ATLAS_BACKGROUND, alt: '', 'aria-hidden': 'true', decoding: 'async', fetchPriority: 'high' }),
      h('div', { className: 'atlas-map-view__topography', 'aria-hidden': 'true' }),
      h('div', { className: 'atlas-map-view__routes', 'aria-hidden': 'true' }, h('i'), h('i'), h('i'), h('i'), h('i')),
      h('div', { className: 'atlas-regions', role: 'list', 'aria-label': 'Seis regiões do atlas' },
        data.regions.map((region, index) => {
          const explored = region.chronicles.filter(item => visited.has(item.id)).length;
          const placement = REGION_PLACEMENT[index];
          return h('button', {
            key: region.id, type: 'button', role: 'listitem',
            className: `atlas-region${explored === region.chronicles.length ? ' is-explored' : ''}${selectedId === region.id ? ' is-selected' : ''}${zooming && selectedId !== region.id ? ' is-receding' : ''}`,
            style: { '--island-x': `${placement.x}%`, '--island-y': `${placement.y}%`, '--island-size': `${placement.size}%`, '--island-index': index },
            onClick: () => !zooming && onSelect(region.id), disabled: zooming,
            'aria-label': `${region.title}, ${region.subtitle}. ${explored} de ${region.chronicles.length} crônicas exploradas`,
          },
            h('span', { className: 'atlas-region__numeral', 'aria-hidden': 'true' }, region.numeral),
            h('span', { className: 'atlas-region__shade', 'aria-hidden': 'true' }),
            h('span', { className: 'atlas-region__tooltip' }, h('strong', null, region.title), h('small', null, region.subtitle))
          );
        })
      ),
      h('div', { className: 'atlas-observer', 'aria-hidden': 'true' },
        h('div', { className: 'atlas-observer__character' },
          h('img', { className: 'atlas-observer__body', src: ATLAS_OBSERVER, alt: '', decoding: 'async', fetchPriority: 'high' }),
          h('img', { className: 'atlas-observer__head', src: ATLAS_OBSERVER, alt: '', decoding: 'async' })
        ),
        h('span', null, 'O guia observa o mundo da jornada')
      ),
      h('p', { className: 'atlas-map-view__hint' }, zooming ? 'Atravessando o território…' : 'Escolha uma região para atravessar o mapa.')
    );
  }

  // A figura persiste entre crônicas: a arte anterior sai enquanto a nova entra, no sentido da navegação.
  // Com `morph`, uma segunda arte se revela sobre a primeira enquanto o mouse está em cima e volta em
  // seguida, em vaivém; um clique congela a transição e outro a retoma.
  function GalleryArt({ src, alt, caption, sceneKey, direction = 1, morph = null, sequence = null, presenter = false }) {
    const lastRef = useRef({ src, sceneKey });
    const [outgoing, setOutgoing] = useState(null);
    const [aspectRatio, setAspectRatio] = useState(null);
    const [morphPaused, setMorphPaused] = useState(false);
    useLayoutEffect(() => {
      const last = lastRef.current;
      if (last.sceneKey === sceneKey) return undefined;
      lastRef.current = { src, sceneKey };
      setAspectRatio(null);
      setMorphPaused(false);
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
      setOutgoing({ src: last.src, key: last.sceneKey });
      const timer = window.setTimeout(() => setOutgoing(null), 950);
      return () => window.clearTimeout(timer);
    }, [sceneKey]);
    return h('figure', { className: `atlas-gallery__art${outgoing ? ' is-turning' : ''}${morph ? ' has-morph' : ''}${sequence ? ' has-sequence' : ''}${morphPaused ? ' is-morph-paused' : ''}`, style: { '--atlas-dir': direction, aspectRatio: aspectRatio || '3 / 4' } },
      outgoing && h('img', { key: `out-${outgoing.key}`, className: 'atlas-gallery__leaving', src: outgoing.src, alt: '', 'aria-hidden': 'true' }),
      h('img', { key: sceneKey, className: 'atlas-gallery__entering', src, alt: sequence ? '' : alt, 'aria-hidden': sequence ? 'true' : undefined, decoding: 'async', onLoad: event => {
        const image = event.currentTarget;
        if (image.naturalWidth && image.naturalHeight) setAspectRatio(`${image.naturalWidth} / ${image.naturalHeight}`);
      } }),
      sequence && sequence.map((frame, frameIndex) => h('img', {
        key: `sequence-${sceneKey}-${frameIndex}`, className: `atlas-gallery__sequence-frame atlas-gallery__sequence-frame--${frameIndex}${frameIndex === 0 ? ' is-first' : ''}`,
        src: frame.src, alt: frameIndex === 0 ? alt : '', 'aria-hidden': frameIndex === 0 ? undefined : 'true',
        decoding: 'async', style: { '--atlas-frame': frameIndex },
      })),
      morph && h('img', { key: `morph-${sceneKey}`, className: 'atlas-gallery__morph', src: morph.src, alt: '', 'aria-hidden': 'true', decoding: 'async' }),
      morph && h('button', {
        key: `morph-toggle-${sceneKey}`, type: 'button', className: 'atlas-gallery__morph-toggle',
        'aria-pressed': morphPaused, onClick: () => setMorphPaused(paused => !paused),
        'aria-label': `${morphPaused ? 'Retomar' : 'Pausar'} a transição para a segunda arte: ${morph.alt}`,
      }, h('span', { 'aria-hidden': 'true' }, morphPaused ? '❚❚ Pausado · clique para retomar' : '✦ Passe o mouse · clique para pausar')),
      outgoing && h('span', { key: `sweep-${sceneKey}`, className: 'atlas-gallery__sweep', 'aria-hidden': 'true' }),
      h('span', { className: 'atlas-gallery__light', 'aria-hidden': 'true' }),
      presenter && h('img', { className: 'atlas-gallery__presenter', src: JOURNEY_AVATAR, alt: '', 'aria-hidden': 'true' }),
      h('figcaption', { key: `caption-${sceneKey}` }, caption)
    );
  }

  function RegionView({ region, visited, onChronicle, onAtlas }) {
    return h('section', { className: 'atlas-gallery atlas-gallery--region', 'aria-labelledby': 'atlas-region-title' },
      h(GalleryArt, { src: region.image, alt: region.imageAlt, caption: `${region.numeral}. ${region.title}`, sceneKey: region.id }),
      h('aside', { className: 'atlas-gallery__copy' },
        h('button', { type: 'button', className: 'atlas-back', onClick: onAtlas }, '← Voltar ao atlas'),
        h('p', { className: 'atlas-kicker' }, region.subtitle),
        h('h3', { id: 'atlas-region-title', tabIndex: -1 }, region.title),
        h('p', { className: 'atlas-gallery__description' }, `Explore as crônicas preservadas em ${region.title}.`),
        h('div', { className: 'atlas-chronicle-list', role: 'list', 'aria-label': `Crônicas de ${region.title}` },
          region.chronicles.map((item, index) => h('button', {
            key: item.id, type: 'button', role: 'listitem', className: visited.has(item.id) ? 'is-visited' : '', onClick: () => onChronicle(index),
          },
            h('span', { 'aria-hidden': 'true' }, visited.has(item.id) ? '✓' : '✦'),
            h('span', null, h('strong', null, item.title), h('small', null, visited.has(item.id) ? 'Explorada — abrir novamente' : 'Abrir crônica'))
          ))
        )
      )
    );
  }

  function ChronicleView({ region, index, onChange, onRegion, onAtlas }) {
    const chronicle = region.chronicles[index];
    // O sentido só muda quando a crônica muda, para não inverter a animação em re-renderizações.
    const navRef = useRef({ index, direction: 1 });
    if (navRef.current.index !== index) navRef.current = { index, direction: index < navRef.current.index ? -1 : 1 };
    const { direction } = navRef.current;
    const art = chronicle.experience === 'innovation-owl' && window.InnovationOwlScene
      ? h(window.InnovationOwlScene, { caption: 'O Despertar da Coruja Mecânica' })
      : h(GalleryArt, {
        src: chronicle.image || region.image, alt: chronicle.imageAlt || region.imageAlt,
        caption: chronicle.image ? chronicle.title : `${region.title} — arte da região`, sceneKey: chronicle.id, direction,
        morph: chronicle.imageAlternate ? { src: chronicle.imageAlternate, alt: chronicle.imageAlternateAlt || '' } : null,
        sequence: chronicle.imageSequence || null,
      });
    return h('section', { className: 'atlas-gallery atlas-gallery--chronicle', 'aria-labelledby': 'atlas-chronicle-title' },
      art,
      h('aside', { className: 'atlas-gallery__copy', key: chronicle.id, style: { '--atlas-dir': direction } },
        h('nav', { className: 'atlas-breadcrumb', 'aria-label': 'Retorno da crônica' },
          h('button', { type: 'button', onClick: onRegion }, '← Região'),
          h('button', { type: 'button', onClick: onAtlas }, 'Atlas')
        ),
        h('p', { className: 'atlas-kicker' }, `${region.subtitle} · Crônica ${index + 1} de ${region.chronicles.length}`),
        h('h3', { id: 'atlas-chronicle-title', tabIndex: -1 }, chronicle.title),
        h('p', { className: 'atlas-gallery__description' }, chronicle.description),
        chronicle.material
          ? h('div', { className: 'atlas-material-wrap' },
            h('a', { className: 'atlas-material', href: chronicle.material.href, target: '_blank', rel: 'noopener noreferrer' }, chronicle.material.label, h('span', { 'aria-hidden': 'true' }, ' ↗')),
            chronicle.material.review && h('p', { className: 'atlas-material__review' }, chronicle.material.review)
          )
          : h('p', { className: 'atlas-material__pending' }, 'Material original ainda não disponibilizado.'),
        h('nav', { className: 'atlas-sequence', 'aria-label': 'Navegação entre crônicas' },
          h('button', { type: 'button', disabled: index === 0, onClick: () => onChange(index - 1) }, '← Anterior'),
          h('span', null, `${index + 1} / ${region.chronicles.length}`),
          h('button', { type: 'button', disabled: index === region.chronicles.length - 1, onClick: () => onChange(index + 1) }, 'Próxima →')
        )
      )
    );
  }

  function LeadershipAtlasModal({ data, onClose }) {
    const [regionId, setRegionId] = useState(null);
    const [zoomRegionId, setZoomRegionId] = useState(null);
    const [chronicleIndex, setChronicleIndex] = useState(null);
    const [visited, setVisited] = useState(() => new Set(safeLoad(data.storageKey)));
    const [transitioning, setTransitioning] = useState(false);
    const rootRef = useRef(null);
    const focusRef = useRef('atlas-modal-title');
    const timerRef = useRef(0);
    const zoomTimerRef = useRef(0);
    const region = data.regions.find(item => item.id === regionId);
    const total = useMemo(() => data.regions.reduce((sum, item) => sum + item.chronicles.length, 0), [data]);

    function transition(update, focusId) {
      if (transitioning) return;
      setTransitioning(true); focusRef.current = focusId; update();
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setTransitioning(false), 430);
    }
    function showAtlas() { transition(() => { setChronicleIndex(null); setRegionId(null); }, 'atlas-modal-title'); }
    function showRegion(id = regionId) { transition(() => { setChronicleIndex(null); setRegionId(id); }, 'atlas-region-title'); }
    function showChronicle(index) {
      const id = region.chronicles[index].id;
      setVisited(current => { const next = new Set(current); next.add(id); safeSave(data.storageKey, [...next]); return next; });
      transition(() => setChronicleIndex(index), 'atlas-chronicle-title');
    }

    function enterRegion(id) {
      if (transitioning) return;
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (reduced) { setRegionId(id); focusRef.current = 'atlas-region-title'; return; }
      setTransitioning(true); setZoomRegionId(id);
      window.clearTimeout(zoomTimerRef.current);
      zoomTimerRef.current = window.setTimeout(() => {
        focusRef.current = 'atlas-region-title';
        setRegionId(id); setZoomRegionId(null); setTransitioning(false);
      }, 760);
    }

    useEffect(() => () => { window.clearTimeout(timerRef.current); window.clearTimeout(zoomTimerRef.current); }, []);
    useEffect(() => { requestAnimationFrame(() => document.getElementById(focusRef.current)?.focus({ preventScroll: true })); }, [regionId, chronicleIndex]);
    useEffect(() => {
      const root = rootRef.current;
      const finePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (!root || !finePointer || reduced) return undefined;
      let frame = 0;
      const apply = (x, y) => {
        root.style.setProperty('--atlas-px', `${x * 9}px`);
        root.style.setProperty('--atlas-py', `${y * 6}px`);
        root.style.setProperty('--atlas-bg-x', `${x * -3.8}px`);
        root.style.setProperty('--atlas-bg-y', `${y * -2.5}px`);
        root.style.setProperty('--atlas-lines-x', `${x * -1.1}px`);
        root.style.setProperty('--atlas-lines-y', `${y * -.7}px`);
        root.style.setProperty('--avatar-px', `${x * 15}px`);
        root.style.setProperty('--avatar-py', `${y * 8}px`);
        root.style.setProperty('--head-rx', `${y * -3.2}deg`);
        root.style.setProperty('--head-ry', `${x * 4.2}deg`);
      };
      const onMove = event => {
        const rect = root.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - .5) * 2));
        const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - .5) * 2));
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => apply(x, y));
      };
      const onLeave = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => apply(0, 0)); };
      root.addEventListener('pointermove', onMove, { passive: true });
      root.addEventListener('pointerleave', onLeave, { passive: true });
      return () => { root.removeEventListener('pointermove', onMove); root.removeEventListener('pointerleave', onLeave); cancelAnimationFrame(frame); };
    }, []);
    useEffect(() => {
      const oldOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const onKey = event => {
        if (event.key === 'Escape') {
          event.preventDefault(); event.stopPropagation();
          if (chronicleIndex != null) showRegion();
          else if (region) showAtlas();
          else if (zoomRegionId) { window.clearTimeout(zoomTimerRef.current); setZoomRegionId(null); setTransitioning(false); }
          else onClose();
          return;
        }
        if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && chronicleIndex != null) {
          event.preventDefault(); event.stopPropagation();
          const next = chronicleIndex + (event.key === 'ArrowRight' ? 1 : -1);
          if (next >= 0 && next < region.chronicles.length) showChronicle(next);
          return;
        }
        if (event.key !== 'Tab') return;
        const controls = [...rootRef.current.querySelectorAll('button:not([disabled]), a[href]')];
        if (!controls.length) return;
        if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1).focus(); }
        else if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); controls[0].focus(); }
      };
      document.addEventListener('keydown', onKey, true);
      return () => { document.removeEventListener('keydown', onKey, true); document.body.style.overflow = oldOverflow; };
    }, [regionId, chronicleIndex, zoomRegionId, transitioning]);

    const scene = chronicleIndex != null ? 'chronicle' : region ? 'region' : zoomRegionId ? 'zoom' : 'atlas';
    return h('div', { className: `leadership-atlas is-${scene}${transitioning ? ' is-transitioning' : ''}`, role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'atlas-modal-title', ref: rootRef },
      h('div', { className: 'leadership-atlas__veil', 'aria-hidden': 'true' }),
      h('div', { className: 'leadership-atlas__frame' },
        h('header', { className: 'leadership-atlas__header' },
          h('div', null, h('p', null, 'Legados da Liderança'), h('h2', { id: 'atlas-modal-title', tabIndex: -1 }, data.title)),
          h(ExplorerProgress, { visited: visited.size, total }),
          h('button', { type: 'button', className: 'leadership-atlas__close', onClick: onClose, 'aria-label': 'Fechar o Atlas e voltar ao capítulo' }, '×')
        ),
        h('div', { className: 'leadership-atlas__scene', role: 'main' },
          (scene === 'atlas' || scene === 'zoom') && h(AtlasMapView, { data, visited, onSelect: enterRegion, selectedId: zoomRegionId, zooming: scene === 'zoom' }),
          scene === 'region' && h(RegionView, { region, visited, onChronicle: showChronicle, onAtlas: showAtlas }),
          scene === 'chronicle' && h(ChronicleView, { region, index: chronicleIndex, onChange: showChronicle, onRegion: () => showRegion(), onAtlas: showAtlas })
        ),
        h('div', { className: 'atlas-rotate-notice', role: 'status' }, h('span', { 'aria-hidden': 'true' }, '↻'), h('strong', null, 'Gire o dispositivo'), h('p', null, 'Esta experiência é melhor explorada no modo horizontal.'))
      )
    );
  }

  function JourneyKnowledgeMap({ data }) {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef(null);
    useEffect(() => {
      const sources = [ATLAS_BACKGROUND, ATLAS_OBSERVER];
      sources.forEach(src => {
        const image = new Image();
        image.decoding = 'async';
        image.src = src;
        image.decode?.().catch(() => {});
      });
    }, [data]);
    function close() { setOpen(false); requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true })); }
    return h(window.React.Fragment, null,
      h('div', { className: 'atlas-invitation' },
        h('span', { 'aria-hidden': 'true' }, '⌖'),
        h('div', null, h('strong', null, 'Um mundo de conhecimento aguarda'), h('p', null, 'Atravesse seis regiões e descubra as crônicas preservadas em cada território.')),
        h('button', { type: 'button', ref: triggerRef, onClick: () => setOpen(true), 'aria-haspopup': 'dialog' }, 'Explorar o Mapa')
      ),
      open ? window.ReactDOM.createPortal(h(LeadershipAtlasModal, { data, onClose: close }), document.body) : null
    );
  }

  function JourneyBanner({ data }) {
    const [open, setOpen] = useState(false); const triggerRef = useRef(null); const dialogRef = useRef(null);
    function close() { setOpen(false); requestAnimationFrame(() => triggerRef.current?.focus()); }
    useEffect(() => { if (!open) return undefined; requestAnimationFrame(() => dialogRef.current?.querySelector('.journey-banner__close')?.focus()); const onKey = event => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); return; } if (event.key !== 'Tab') return; const controls = [...dialogRef.current.querySelectorAll('button:not([disabled]), a[href]')]; if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1).focus(); } else if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); controls[0].focus(); } }; document.addEventListener('keydown', onKey, true); return () => document.removeEventListener('keydown', onKey, true); }, [open]);
    const modal = open && h('div', { className: 'journey-banner', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'journey-banner-title', ref: dialogRef },
      h('div', { className: 'journey-banner__veil', onClick: close, 'aria-hidden': 'true' }),
      h('section', { className: 'journey-banner__scroll' },
        h('header', null, h('span', { 'aria-hidden': 'true' }, '⚑'), h('div', null, h('p', null, 'Legados da Liderança'), h('h4', { id: 'journey-banner-title' }, data.title), h('small', null, data.description)), h('button', { type: 'button', className: 'journey-banner__close', onClick: close, 'aria-label': 'Fechar o Estandarte' }, '×')),
        h('div', { className: 'journey-banner__categories' }, data.categories.map(category => h('article', { key: category.id }, h('span', { 'aria-hidden': 'true' }, category.id === 'alunos' ? '✦' : category.id === 'equipe' ? '♜' : '◇'), h('h5', null, category.title), h('p', null, category.description), h('div', { className: 'journey-banner__empty' }, h('strong', null, 'Nenhum depoimento publicado'), h('small', null, 'Este espaço receberá registros originais quando houver autorização.'))))),
        h('p', { className: 'journey-banner__note' }, 'Os depoimentos serão apresentados com autoria, relação profissional e contexto — sem nomes, avaliações ou métricas inventadas.')
      )
    );
    return h(window.React.Fragment, null,
      h('div', { className: 'journey-banner__invitation' }, h('span', { 'aria-hidden': 'true' }, '⚑'), h('div', null, h('strong', null, 'O Estandarte aguarda suas primeiras vozes'), h('p', null, 'A estrutura está pronta para receber apenas depoimentos reais e autorizados.')), h('button', { type: 'button', ref: triggerRef, onClick: () => setOpen(true) }, 'Explorar o Estandarte')),
      open ? window.ReactDOM.createPortal(modal, document.body) : null
    );
  }

  window.JourneyKnowledgeMap = JourneyKnowledgeMap;
  window.JourneyBanner = JourneyBanner;
})();
