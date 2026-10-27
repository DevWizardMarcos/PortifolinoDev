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
      : chronicle.experience === 'hackathon-city' && window.HackathonCityScene
        ? h(window.HackathonCityScene, { onBack: onRegion })
      : chronicle.experience === 'living-board' && window.SanctuaryScene
        ? h(window.SanctuaryScene, { onBack: onRegion })
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

  function JourneyKnowledgeMap({ data, editorial = false }) {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef(null);
    const totalChronicles = data.regions.reduce((total, region) => total + region.chronicles.length, 0);
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
      editorial
        ? h('div', { className: 'legacy-editorial__action legacy-editorial__action--map' },
          h('figure', { className: 'legacy-editorial__preview' },
            h('img', { src: ATLAS_BACKGROUND, alt: 'Prévia do mapa das Crônicas do Conhecimento', width: 1440, height: 810, loading: 'lazy', decoding: 'async' }),
            h('button', { type: 'button', ref: triggerRef, onClick: () => setOpen(true), 'aria-haspopup': 'dialog', className: 'legacy-editorial__preview-button' }, 'Abrir o Atlas', h('span', { 'aria-hidden': 'true' }, '→')),
            h('figcaption', null, h('span', null, 'Atlas do Conhecimento'), h('small', null, `${data.regions.length} regiões · ${totalChronicles} crônicas`))
          )
        )
        : h('div', { className: 'atlas-invitation' },
          h('span', { 'aria-hidden': 'true' }, '⌖'),
          h('div', null, h('strong', null, 'Um mundo de conhecimento aguarda'), h('p', null, 'Atravesse seis regiões e descubra as crônicas preservadas em cada território.')),
          h('button', { type: 'button', ref: triggerRef, onClick: () => setOpen(true), 'aria-haspopup': 'dialog' }, 'Explorar o Mapa')
        ),
      open ? window.ReactDOM.createPortal(h(LeadershipAtlasModal, { data, onClose: close }), document.body) : null
    );
  }

  function BannerIcon({ type }) {
    const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.35, strokeLinecap: 'round', strokeLinejoin: 'round' };
    if (type === 'students') return h('svg', { viewBox: '0 0 48 48', 'aria-hidden': 'true' },
      h('path', { ...common, d: 'M7 12c7-2 12 0 17 4v24c-5-4-10-6-17-4V12Zm34 0c-7-2-12 0-17 4v24c5-4 10-6 17-4V12Z' }),
      h('path', { ...common, d: 'm31 7 8 8m-11 6L41 8l-1-3-3-1-13 13-2 6 6-2Z' })
    );
    if (type === 'team') return h('svg', { viewBox: '0 0 48 48', 'aria-hidden': 'true' },
      h('path', { ...common, d: 'M24 7 39 13v11c0 9-6 15-15 19C15 39 9 33 9 24V13L24 7Z' }),
      h('path', { ...common, d: 'm16 20 3-7 5 5 5-5 3 7m-15 0h14v6H17v-6Z' })
    );
    return null;
  }

  function JourneyBanner({ data, editorial = false, onExploreChronicles }) {
    const VX = window.VoiceExperience;
    const [open, setOpen] = useState(false); const [activeRecord, setActiveRecord] = useState(null); const triggerRef = useRef(null); const dialogRef = useRef(null);
    const { activeIndex, onTabKeyDown, setActiveIndex } = VX.useVoiceNavigation(data.categories.length);
    const backStackRef = useRef([]); const recordRef = useRef(null);
    recordRef.current = activeRecord;
    const openerRef = useRef(null);
    function openAt(index, opener) { openerRef.current = opener || triggerRef.current; setActiveIndex(index); setOpen(true); }
    function close() { setOpen(false); requestAnimationFrame(() => (openerRef.current || triggerRef.current)?.focus({ preventScroll: true })); }
    function exploreChronicles() { setOpen(false); requestAnimationFrame(() => onExploreChronicles?.()); }
    useEffect(() => {
      if (!open) return undefined;
      const oldOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => dialogRef.current?.querySelector('.journey-banner__close')?.focus());
      const onKey = event => {
        if (event.key === 'Escape') {
          event.preventDefault(); event.stopPropagation();
          if (recordRef.current) { setActiveRecord(null); return; }
          // Cada ambiente desfaz primeiro a própria camada (galeria, evento, livro) antes de fechar o modal.
          const stack = backStackRef.current;
          for (let at = stack.length - 1; at >= 0; at -= 1) if (stack[at].run()) return;
          close();
          return;
        }
        if (event.key !== 'Tab') return;
        const layers = dialogRef.current.querySelectorAll('[data-voice-layer]');
        const scope = layers.length ? layers[layers.length - 1] : dialogRef.current;
        const controls = [...scope.querySelectorAll('button:not([disabled]), a[href], video[controls], audio[controls], summary')];
        if (!controls.length) return;
        if (!scope.contains(document.activeElement)) { event.preventDefault(); controls[0].focus(); }
        else if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1).focus(); }
        else if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); controls[0].focus(); }
      };
      document.addEventListener('keydown', onKey, true);
      return () => { document.removeEventListener('keydown', onKey, true); document.body.style.overflow = oldOverflow; };
    }, [open]);
    const activeCategory = data.categories[activeIndex];
    const categoryTypes = VX.categoryTypes;
    const authorizedRecords = useMemo(() => window.VoiceArchive.select(VX.environments[categoryTypes[activeIndex]], activeCategory.testimonials), [activeIndex, activeCategory]);
    const modal = open && h('div', { className: 'journey-banner', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'journey-banner-title', ref: dialogRef },
      h('div', { className: 'journey-banner__veil', onClick: close, 'aria-hidden': 'true' }),
      h('section', { className: 'journey-banner__scroll', 'data-env': VX.environments[categoryTypes[activeIndex]] },
        h('div', { className: 'journey-banner__glow', 'aria-hidden': 'true' }),
        h('header', null,
          h('span', { className: 'journey-banner__crest', 'aria-hidden': 'true' }, '⚑'),
          h('div', null, h('p', null, 'Legados da Liderança'), h('h4', { id: 'journey-banner-title' }, 'O Estandarte das Vozes'), h('small', null, 'Histórias e registros da jornada compartilhados com autorização.')),
          h('button', { type: 'button', className: 'journey-banner__close', onClick: close, 'aria-label': 'Fechar o Estandarte' }, '×')
        ),
        h('nav', { className: 'journey-banner__hall', role: 'tablist', 'aria-label': 'Categorias do Arquivo das Vozes' },
          data.categories.map((category, index) => h('button', {
            key: category.id,
            type: 'button',
            role: 'tab',
            id: `banner-tab-${category.id}`,
            className: `journey-banner__standard journey-banner__standard--${categoryTypes[index]}${index === activeIndex ? ' is-active' : ''}`,
            'aria-selected': index === activeIndex,
            'aria-controls': 'journey-banner-archive',
            tabIndex: index === activeIndex ? 0 : -1,
            onClick: () => setActiveIndex(index),
            onKeyDown: event => onTabKeyDown(event, index),
          },
            h('span', { className: 'journey-banner__standard-rail', 'aria-hidden': 'true' }),
            h('span', { className: 'journey-banner__standard-cloth' },
              h(BannerIcon, { type: categoryTypes[index] }),
              h('strong', null, category.title),
              h('small', null, category.description)
            )
          ))
        ),
        h('section', { key: activeCategory.id, className: 'journey-banner__archive', id: 'journey-banner-archive', role: 'tabpanel', 'aria-labelledby': `banner-tab-${activeCategory.id}`, tabIndex: 0 },
          h(VX.Experience, { type: categoryTypes[activeIndex], records: authorizedRecords, onExploreChronicles: exploreChronicles, onOpenRecord: setActiveRecord, backRef: backStackRef })
        ),
        h('p', { className: 'journey-banner__note' }, 'Os registros serão apresentados com autoria, contexto e autorização — sem nomes, avaliações ou métricas inventadas.'),
        activeRecord && h(VX.RecordDialog, { record: activeRecord, onClose: () => setActiveRecord(null) })
      )
    );
    return h(window.React.Fragment, null,
      editorial
        ? h('div', { className: 'legacy-editorial__action legacy-editorial__action--voices' },
          window.LivingLionGuardian
            ? h(window.LivingLionGuardian, null)
            : h('div', { className: 'legacy-editorial__voices-preview', 'aria-hidden': 'true' },
              h('span', { className: 'legacy-editorial__quote-mark' }, '“'),
              h('div', { className: 'legacy-editorial__voices-copy' }, h('small', null, 'O Estandarte das Vozes'), h('strong', null, 'Vozes preservadas com contexto e autorização.')),
              h('div', { className: 'legacy-editorial__pennant' }, h('i', null, '⚑'), h('b', null))
            ),
          h('nav', { className: 'legacy-editorial__legacies', 'aria-label': 'Abrir um dos legados' },
            data.categories.map((category, index) => {
              const label = { alunos: 'Aprendizes', equipe: 'Guilda' }[category.id] || category.title;
              return h('button', { key: category.id, type: 'button', 'aria-haspopup': 'dialog', 'aria-label': `${label} — ${category.title}`, onClick: event => openAt(index, event.currentTarget) }, label);
            })
          ),
          h('button', { type: 'button', ref: triggerRef, onClick: event => openAt(activeIndex, event.currentTarget), 'aria-haspopup': 'dialog', className: 'legacy-editorial__cta' }, 'Explorar as Vozes', h('span', { 'aria-hidden': 'true' }, '→'))
        )
        : h('div', { className: 'journey-banner__invitation' }, h('span', { 'aria-hidden': 'true' }, '⚑'), h('div', null, h('strong', null, 'O Estandarte aguarda suas primeiras vozes'), h('p', null, 'A estrutura está pronta para receber apenas depoimentos reais e autorizados.')), h('button', { type: 'button', ref: triggerRef, onClick: () => setOpen(true) }, 'Explorar o Estandarte')),
      open ? window.ReactDOM.createPortal(modal, document.body) : null
    );
  }

  window.JourneyKnowledgeMap = JourneyKnowledgeMap;
  if (window.VoiceExperience && window.VoiceArchive) window.JourneyBanner = JourneyBanner;
})();
