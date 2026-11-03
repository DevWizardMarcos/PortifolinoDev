// Memórias Interativas — modal imersivo com três abas (Memórias, Passeio pela escola [só desktop], Diário da Jornada).
// Recebe os dados de window.infinityMemories (ou de outro arquivo com a mesma estrutura) e expõe
// window.JourneyMemories para o capítulo que o abre. O estado (aba, foto e ponto) sobrevive ao
// fechamento, para que reabrir continue de onde o visitante parou.
(() => {
  if (!window.React || !window.ReactDOM) return;

  const h = window.React.createElement;
  const { useEffect, useRef, useState } = window.React;
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pad = number => String(number).padStart(2, '0');
  const TABS = [
    { id: 'memories', label: 'Memórias', icon: '', mobileOnly: true },
    { id: 'walk', label: 'Passeio pela escola', icon: '◎', desktopOnly: true },
    { id: 'diary', label: 'Diário da Jornada', icon: '❦' },
  ];
  const saved = {};

  // ---------- Memórias: galeria com pontos interativos ----------
  function MemoryGallery({ data, index, setIndex, hotspotId, setHotspotId, detailRef }) {
    const memory = data.memories[index];
    const total = data.memories.length;
    const hotspot = memory.hotspots.find(item => item.id === hotspotId) || null;
    const diaryById = Object.fromEntries(data.diary.map(entry => [entry.id, entry]));
    const related = (hotspot?.related || []).map(id => diaryById[id]).filter(Boolean);
    const thumbsRef = useRef(null);

    useEffect(() => {
      thumbsRef.current?.querySelector('[aria-current="true"]')
        ?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }, [index]);

    function go(step) {
      setIndex((index + step + total) % total);
    }

    return h('div', { className: 'journey-memories__gallery' },
      h('div', { className: 'journey-memories__viewer' },
        h('figure', { className: 'journey-memories__figure' },
          h('div', {
            className: 'journey-memories__stage',
            key: memory.id,
            style: { '--ratio': `${memory.width} / ${memory.height}`, '--ratio-num': memory.width / memory.height },
          },
            h('img', {
              src: memory.src,
              srcSet: memory.srcSmall ? `${memory.srcSmall} 800w, ${memory.src} ${memory.width}w` : undefined,
              sizes: memory.srcSmall ? '(max-width: 900px) 100vw, 70vw' : undefined,
              alt: memory.alt,
              width: memory.width,
              height: memory.height,
              decoding: 'async',
              draggable: false,
            }),
            memory.hotspots.map(item => h('button', {
              key: item.id,
              type: 'button',
              className: `journey-memories__hotspot${item.id === hotspotId ? ' is-active' : ''}`,
              style: { left: `${item.x}%`, top: `${item.y}%` },
              'aria-label': `Ponto de memória: ${item.title}`,
              'aria-expanded': item.id === hotspotId,
              'aria-controls': 'journey-memories-detail',
              onClick: () => setHotspotId(item.id === hotspotId ? null : item.id),
            }, h('span', { 'aria-hidden': 'true' })))
          ),
          h('figcaption', { className: 'journey-memories__caption' },
            h('span', null, `${pad(index + 1)} / ${pad(total)}`),
            h('strong', null, memory.title),
            h('em', null, memory.caption)
          )
        ),
        h('div', { className: 'journey-memories__arrows' },
          h('button', { type: 'button', onClick: () => go(-1), 'aria-label': 'Fotografia anterior' }, '←'),
          h('button', { type: 'button', onClick: () => go(1), 'aria-label': 'Próxima fotografia' }, '→')
        )
      ),
      h('aside', {
        className: 'journey-memories__detail',
        id: 'journey-memories-detail',
        'aria-live': 'polite',
      },
        hotspot
          ? h('div', { key: hotspot.id, className: 'journey-memories__detail-body' },
            h('span', { className: 'journey-memories__kicker' }, memory.title),
            h('h4', { ref: detailRef, tabIndex: -1 }, hotspot.title),
            h('p', null, hotspot.description),
            related.length > 0 && h('section', { className: 'journey-memories__related' },
              h('h5', null, 'Acontecimentos relacionados'),
              h('ul', null, related.map(entry => h('li', { key: entry.id },
                h('small', null, entry.period),
                h('strong', null, entry.title),
                h('p', null, entry.description)
              )))
            ),
            h('button', {
              type: 'button',
              className: 'is-quiet',
              onClick: event => {
                event.currentTarget.closest('.journey-memories__gallery')
                  ?.querySelector('.journey-memories__hotspot.is-active')?.focus({ preventScroll: true });
                setHotspotId(null);
              },
            }, 'Fechar ponto')
          )
          : h('div', { key: 'hint', className: 'journey-memories__detail-body is-hint' },
            h('span', { className: 'journey-memories__kicker' }, memory.title),
            h('p', null, memory.caption),
            h('p', { className: 'journey-memories__tip' },
              `Toque nos ${memory.hotspots.length} pontos luminosos da fotografia para revelar suas memórias. Use ← e → para trocar de fotografia.`)
          ),
        h('p', { className: 'journey-memories__credit' }, data.credit)
      ),
      h('ol', { className: 'journey-memories__thumbs', ref: thumbsRef, 'aria-label': 'Fotografias' },
        data.memories.map((item, itemIndex) => h('li', { key: item.id },
          h('button', {
            type: 'button',
            'aria-current': itemIndex === index ? 'true' : undefined,
            'aria-label': `${itemIndex + 1}. ${item.title}`,
            onClick: () => setIndex(itemIndex),
          }, h('img', { src: item.srcSmall || item.src, alt: '', loading: 'lazy', decoding: 'async', width: 120, height: 68 }))
        ))
      )
    );
  }

  // ---------- Tour 360° (Marzipano, carregado sob demanda) ----------
  let marzipanoPromise = null;
  function loadMarzipano(url) {
    if (window.Marzipano) return Promise.resolve(window.Marzipano);
    if (!marzipanoPromise) {
      marzipanoPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.onload = () => (window.Marzipano ? resolve(window.Marzipano) : reject(new Error('Marzipano indisponível')));
        script.onerror = () => { marzipanoPromise = null; reject(new Error('Falha ao carregar o Marzipano')); };
        document.head.appendChild(script);
      });
    }
    return marzipanoPromise;
  }

  function TourFallback({ tour, title, reason }) {
    return h('div', { className: 'journey-memories__tour-fallback', role: 'status' },
      h('span', { 'aria-hidden': 'true' }, '◎'),
      h('h4', null, reason === 'error' ? 'O panorama não pôde ser aberto aqui' : 'Os panoramas ainda estão sendo forjados'),
      h('p', null, reason === 'error'
        ? 'Este navegador não conseguiu carregar o visualizador 360°. O tour original continua disponível no Google Maps.'
        : `As imagens 360° da ${title} ainda não foram adicionadas a este grimório. Enquanto isso, você pode percorrer o tour original no Google Maps.`),
      h('a', { href: tour.googleMapsUrl, target: '_blank', rel: 'noopener noreferrer' },
        'Abrir o tour no Google Maps', h('span', { className: 'visually-hidden' }, ' (abre em nova aba)'))
    );
  }

  function MemoryTour({ tour, title, controlsRef }) {
    const panoramas = tour.panoramas || [];
    const viewerRef = useRef(null);
    const scenesRef = useRef({});
    const [status, setStatus] = useState(panoramas.length ? 'loading' : 'empty');
    const [current, setCurrent] = useState(panoramas[0]?.id);

    useEffect(() => {
      if (!panoramas.length) return undefined;
      let viewer = null;
      let cancelled = false;
      loadMarzipano(tour.library).then(Marzipano => {
        if (cancelled || !viewerRef.current) return;
        viewer = new Marzipano.Viewer(viewerRef.current, { controls: { mouseViewMode: 'drag' } });
        panoramas.forEach(pano => {
          const view = new Marzipano.RectilinearView(
            { yaw: pano.yaw || 0, pitch: pano.pitch || 0, fov: pano.fov || Math.PI / 2 },
            Marzipano.RectilinearView.limit.traditional(4096, (110 * Math.PI) / 180)
          );
          const scene = viewer.createScene({
            source: Marzipano.ImageUrlSource.fromString(pano.src),
            geometry: new Marzipano.EquirectGeometry([{ width: 4096 }]),
            view,
            pinFirstLevel: true,
          });
          (pano.links || []).forEach(link => {
            const target = panoramas.find(item => item.id === link.target);
            if (!target) return;
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'journey-memories__pano-link';
            button.setAttribute('aria-label', link.label || `Ir para ${target.title}`);
            button.innerHTML = '<span aria-hidden="true">➤</span>';
            button.addEventListener('click', () => setCurrent(target.id));
            scene.hotspotContainer().createHotspot(button, { yaw: link.yaw, pitch: link.pitch });
          });
          scenesRef.current[pano.id] = { scene, view };
        });
        setStatus('ready');
      }).catch(() => { if (!cancelled) setStatus('error'); });
      return () => {
        cancelled = true;
        scenesRef.current = {};
        viewer?.destroy();
      };
    }, []);

    useEffect(() => {
      if (status !== 'ready') return;
      scenesRef.current[current]?.scene.switchTo({ transitionDuration: prefersReducedMotion() ? 0 : 900 });
    }, [status, current]);

    function nudge({ yaw = 0, zoom = 1 }) {
      const view = scenesRef.current[current]?.view;
      if (!view) return;
      if (yaw) view.setYaw(view.yaw() + yaw);
      if (zoom !== 1) view.setFov(view.fov() * zoom);
    }

    // Teclado: as setas giram e +/- aproximam enquanto a aba está aberta.
    controlsRef.current = status === 'ready' ? nudge : null;

    if (status === 'empty' || status === 'error') return h(TourFallback, { tour, title, reason: status });

    return h('div', { className: 'journey-memories__tour' },
      h('div', {
        className: 'journey-memories__pano',
        ref: viewerRef,
        role: 'img',
        'aria-label': `Panorama 360° — ${panoramas.find(item => item.id === current)?.title || title}. Arraste para girar; use as setas e as teclas + e − para girar e aproximar.`,
      }),
      status === 'loading' && h('p', { className: 'journey-memories__tour-loading', role: 'status' }, 'Abrindo o panorama…'),
      h('div', { className: 'journey-memories__tour-controls', role: 'toolbar', 'aria-label': 'Controles do panorama' },
        h('button', { type: 'button', onClick: () => nudge({ yaw: -0.35 }), 'aria-label': 'Girar para a esquerda' }, '⟲'),
        h('button', { type: 'button', onClick: () => nudge({ yaw: 0.35 }), 'aria-label': 'Girar para a direita' }, '⟳'),
        h('button', { type: 'button', onClick: () => nudge({ zoom: 0.8 }), 'aria-label': 'Aproximar' }, '+'),
        h('button', { type: 'button', onClick: () => nudge({ zoom: 1.25 }), 'aria-label': 'Afastar' }, '−'),
        panoramas.length > 1 && h('label', null,
          h('span', { className: 'visually-hidden' }, 'Ambiente'),
          h('select', { value: current, onChange: event => setCurrent(event.target.value) },
            panoramas.map(pano => h('option', { key: pano.id, value: pano.id }, pano.title)))
        )
      )
    );
  }

  // ---------- Passeio pela escola (desktop): caminhar de foto em foto, estilo Street View ----------
  const DESKTOP_QUERY = '(min-width: 1025px) and (hover: hover) and (pointer: fine)';
  function useDesktop() {
    const [matches, setMatches] = useState(() => window.matchMedia(DESKTOP_QUERY).matches);
    useEffect(() => {
      const query = window.matchMedia(DESKTOP_QUERY);
      const update = () => setMatches(query.matches);
      query.addEventListener('change', update);
      return () => query.removeEventListener('change', update);
    }, []);
    return matches;
  }

  function MemoryWalk({ data, index, setIndex, controlsRef }) {
    const places = data.memories;
    const total = places.length;
    const place = places[index];
    const viewportRef = useRef(null);
    const panRef = useRef(null);
    const placeRef = useRef(place);
    const target = useRef({ x: 0, y: 0, z: 1 });
    const current = useRef({ x: 0, y: 0, z: 1 });
    const hover = useRef({ x: 0, y: 0 });
    const drag = useRef(null);
    const timer = useRef(null);
    const [leaving, setLeaving] = useState(null);
    const [spotId, setSpotId] = useState(null);
    const [hint, setHint] = useState(true);
    placeRef.current = place;
    const last = index === total - 1;
    const next = places[index + 1];

    // Largura da foto: cobre a janela, mas nunca é ampliada além de 1,5x o tamanho real (evita borrar).
    function geometry() {
      const el = viewportRef.current;
      const item = placeRef.current;
      const itemRatio = item.width / item.height;
      const vw = el ? el.clientWidth : 1;
      const vh = el ? el.clientHeight : 1;
      const width = Math.min(Math.max(vw, vh * itemRatio), item.width * 1.5);
      const zMax = Math.max(1, Math.min(3, (item.width * 2.2) / width));
      return { vw, vh, width, height: width / itemRatio, zMax };
    }
    const limit = (value, max) => Math.min(max, Math.max(-max, value));
    function bounds(z, g) {
      return { x: Math.max(0, (g.width * z - g.vw) / 2), y: Math.max(0, (g.height * z - g.vh) / 2) };
    }
    function aim(change) {
      const g = geometry();
      const t = { ...target.current, ...change };
      t.z = Math.min(g.zMax, Math.max(1, t.z));
      const b = bounds(t.z, g);
      t.x = limit(t.x, b.x);
      t.y = limit(t.y, b.y);
      target.current = t;
    }

    // Loop de animação: a câmera persegue o alvo com inércia (sem re-renderizar o React a cada quadro).
    useEffect(() => {
      let frame = 0;
      function tick() {
        const pan = panRef.current;
        if (pan) {
          const g = geometry();
          const t = target.current;
          const c = current.current;
          const b = bounds(t.z, g);
          const goalX = limit(t.x + hover.current.x * Math.min(b.x, 60), b.x);
          const goalY = limit(t.y + hover.current.y * Math.min(b.y, 30), b.y);
          c.x += (goalX - c.x) * 0.12;
          c.y += (goalY - c.y) * 0.12;
          c.z += (t.z - c.z) * 0.14;
          pan.style.width = `${g.width}px`;
          pan.style.setProperty('--x', `${c.x.toFixed(2)}px`);
          pan.style.setProperty('--y', `${c.y.toFixed(2)}px`);
          pan.style.setProperty('--z', c.z.toFixed(4));
        }
        frame = requestAnimationFrame(tick);
      }
      frame = requestAnimationFrame(tick);
      return () => { cancelAnimationFrame(frame); clearTimeout(timer.current); };
    }, []);

    useEffect(() => {
      target.current = { x: 0, y: 0, z: 1 };
      current.current = { x: 0, y: 0, z: 1 };
    }, [index]);

    useEffect(() => {
      [places[index + 1], places[index - 1]].filter(Boolean).forEach(item => {
        const image = new Image();
        image.decoding = 'async';
        image.src = item.src;
      });
    }, [index]);

    function travel(toIndex) {
      if (toIndex === index || toIndex < 0 || toIndex >= total) return;
      const step = toIndex > index ? 1 : -1;
      setLeaving({ place, step, width: panRef.current?.style.width, key: `${place.id}-${Date.now()}` });
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setLeaving(null), 900);
      setSpotId(null);
      setHint(false);
      setIndex(toIndex);
    }

    controlsRef.current = ({ pan = 0, step = 0, zoom = 1 }) => {
      setHint(false);
      if (step) travel(index + step);
      if (pan) aim({ x: target.current.x - pan * 160 });
      if (zoom !== 1) aim({ z: target.current.z * zoom });
    };

    function onPointerDown(event) {
      if (event.button !== 0 || event.target.closest('button')) return;
      drag.current = { x: event.clientX, y: event.clientY, tx: target.current.x, ty: target.current.y };
      event.currentTarget.setPointerCapture(event.pointerId);
      setHint(false);
    }
    function onPointerMove(event) {
      const rect = event.currentTarget.getBoundingClientRect();
      hover.current = { x: -((event.clientX - rect.left) / rect.width - 0.5) * 2, y: -((event.clientY - rect.top) / rect.height - 0.5) * 2 };
      const d = drag.current;
      if (d) aim({ x: d.tx + event.clientX - d.x, y: d.ty + event.clientY - d.y });
    }
    function onPointerUp() { drag.current = null; }
    function onPointerLeave() { hover.current = { x: 0, y: 0 }; }
    function onWheel(event) {
      setHint(false);
      aim({ z: target.current.z * (event.deltaY < 0 ? 1.15 : 1 / 1.15) });
    }

    const layerStyle = item => ({ '--ratio': `${item.width} / ${item.height}`, '--ratio-num': item.width / item.height });
    const direction = leaving ? (leaving.step > 0 ? 'forward' : 'back') : '';

    return h('div', { className: 'journey-memories__walk' },
      h('div', {
        className: 'journey-memories__walk-view',
        ref: viewportRef,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel: onPointerUp,
        onPointerLeave,
        onWheel,
        onDoubleClick: () => aim({ x: 0, y: 0, z: 1 }),
      },
        leaving && h('div', { key: leaving.key, className: `journey-memories__walk-layer is-leaving is-${direction}`, style: layerStyle(leaving.place), 'aria-hidden': 'true' },
          h('img', { className: 'journey-memories__walk-backdrop', src: leaving.place.src, alt: '', draggable: false }),
          h('div', { className: 'journey-memories__walk-pan', style: { width: leaving.width } },
            h('img', { src: leaving.place.src, alt: '', draggable: false }))
        ),
        h('div', { key: place.id, className: `journey-memories__walk-layer${direction ? ` is-entering is-${direction}` : ''}`, style: layerStyle(place) },
          h('img', { className: 'journey-memories__walk-backdrop', src: place.src, alt: '', draggable: false, 'aria-hidden': 'true' }),
          h('div', { className: 'journey-memories__walk-pan', ref: panRef },
            h('img', { src: place.src, alt: place.alt, width: place.width, height: place.height, decoding: 'async', draggable: false })
          )
        ),
        h('div', { className: 'journey-memories__walk-shade', 'aria-hidden': 'true' })
      ),
      h('div', { className: 'journey-memories__walk-info', key: `info-${place.id}` },
        h('span', null, `${pad(index + 1)} / ${pad(total)}`),
        h('strong', null, place.title),
        h('em', null, place.caption),
        h('small', null, data.period || '')
      ),
      h('ol', { className: 'journey-memories__walk-map', 'aria-label': 'Percurso pela escola' },
        places.map((item, itemIndex) => h('li', { key: item.id },
          h('button', {
            type: 'button',
            title: item.title,
            'aria-label': `${itemIndex + 1}. ${item.title}`,
            'aria-current': itemIndex === index ? 'true' : undefined,
            onClick: () => travel(itemIndex),
          })
        ))
      ),
      hint && h('p', { className: 'journey-memories__walk-hint', 'aria-hidden': 'true' },
        'Arraste para olhar ao redor · roda do mouse para aproximar · ▲ ou ↑ para avançar'),
      h('div', { className: 'journey-memories__walk-nav', role: 'group', 'aria-label': 'Caminhar' },
        h('button', { type: 'button', className: 'is-side', disabled: index === 0, onClick: () => travel(index - 1), 'aria-label': 'Voltar ao ambiente anterior' },
          h('span', { 'aria-hidden': 'true' }, '▼'), 'Voltar'),
        last
          ? h('button', { type: 'button', className: 'is-main', onClick: () => travel(0), 'aria-label': 'Recomeçar o passeio pela entrada' },
            h('span', { 'aria-hidden': 'true' }, '↺'), 'Recomeçar pela entrada')
          : h('button', { type: 'button', className: 'is-main', onClick: () => travel(index + 1), 'aria-label': `Avançar para ${next.title}` },
            h('span', { 'aria-hidden': 'true' }, '▲'), next.title),
        h('div', { className: 'is-zoom' },
          h('button', { type: 'button', onClick: () => aim({ z: target.current.z * 1.3 }), 'aria-label': 'Aproximar' }, '+'),
          h('button', { type: 'button', onClick: () => aim({ z: target.current.z / 1.3 }), 'aria-label': 'Afastar' }, '−'))
      )
    );
  }

  // ---------- Diário da Jornada ----------
  function MemoryDiary({ diary }) {
    return h('ol', { className: 'journey-memories__diary' },
      diary.map(entry => h('li', { key: entry.id },
        h('span', { className: 'journey-memories__diary-mark', 'aria-hidden': 'true' }),
        h('article', null,
          h('small', null, entry.period),
          h('h4', null, entry.title),
          h('p', null, entry.description)
        )
      ))
    );
  }

  // ---------- Modal ----------
  function JourneyMemories({ data, onClose, returnFocusRef }) {
    const key = data.title;
    const state = saved[key] || { tab: 'memories', index: 0, hotspot: null };
    const desktop = useDesktop();
    const [tabState, setTab] = useState(state.tab);
    // No desktop o Passeio substitui as Memórias; no celular/tablet só as Memórias existem.
    const tabs = TABS.filter(item => desktop ? !item.mobileOnly : !item.desktopOnly);
    const tab = tabs.some(item => item.id === tabState) ? tabState : tabs[0].id;
    const [index, setIndexState] = useState(state.index);
    const [hotspotId, setHotspotId] = useState(state.hotspot);
    const dialogRef = useRef(null);
    const closeRef = useRef(null);
    const detailRef = useRef(null);
    const walkControlsRef = useRef(null);
    const live = useRef({});
    live.current = { tab, index, hotspotId, onClose };
    saved[key] = { tab, index, hotspot: hotspotId };

    function setIndex(next) {
      setIndexState(next);
      setHotspotId(null);
    }

    function selectTab(id, focus) {
      setTab(id);
      if (focus) requestAnimationFrame(() => dialogRef.current?.querySelector(`#journey-memories-tab-${id}`)?.focus());
    }

    // Ao abrir um ponto, o foco vai para o título do detalhe (leitores de tela anunciam o conteúdo).
    useEffect(() => {
      if (!hotspotId || !detailRef.current) return;
      detailRef.current.focus({ preventScroll: true });
      // No mobile o detalhe fica abaixo da foto: traz o texto para a vista.
      if (window.matchMedia('(max-width: 900px)').matches) {
        detailRef.current.scrollIntoView({ block: 'nearest', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      }
    }, [hotspotId]);

    // Pré-carrega a fotografia seguinte para que a navegação seja imediata.
    useEffect(() => {
      const next = data.memories[(index + 1) % data.memories.length];
      const image = new Image();
      image.decoding = 'async';
      image.src = next.srcSmall && window.innerWidth <= 900 ? next.srcSmall : next.src;
    }, [index]);

    useEffect(() => {
      closeRef.current?.focus({ preventScroll: true });
      function handleKeydown(event) {
        const { tab: currentTab, index: currentIndex, hotspotId: currentHotspot } = live.current;
        if (event.key === 'Escape') {
          event.preventDefault();
          // Primeiro Escape fecha o ponto aberto e devolve o foco a ele; o segundo fecha o modal.
          if (currentTab === 'memories' && currentHotspot) {
            dialogRef.current?.querySelector('.journey-memories__hotspot.is-active')?.focus({ preventScroll: true });
            setHotspotId(null);
            return;
          }
          live.current.onClose();
          return;
        }
        const tag = event.target.tagName;
        const typing = tag === 'SELECT' || tag === 'INPUT' || tag === 'TEXTAREA';
        if (!typing && !event.altKey && !event.ctrlKey && !event.metaKey) {
          const arrow = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
          if (currentTab === 'memories' && arrow) {
            event.preventDefault();
            const total = data.memories.length;
            setIndexState((currentIndex + arrow + total) % total);
            setHotspotId(null);
            return;
          }
          if (currentTab === 'walk' && walkControlsRef.current) {
            const key = event.key;
            const action = key === 'ArrowLeft' ? { pan: -1 } : key === 'ArrowRight' ? { pan: 1 }
              : key === 'ArrowUp' ? { step: 1 } : key === 'ArrowDown' ? { step: -1 }
              : key === '+' || key === '=' ? { zoom: 1.15 } : key === '-' ? { zoom: 1 / 1.15 } : null;
            if (action) {
              event.preventDefault();
              walkControlsRef.current(action);
              return;
            }
          }
        }
        if (event.key !== 'Tab') return;
        const controls = [...dialogRef.current.querySelectorAll('button:not([disabled]), a[href], select, [tabindex="0"]')]
          .filter(element => element.offsetParent !== null && element.getAttribute('tabindex') !== '-1');
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
        requestAnimationFrame(() => returnFocusRef?.current?.focus({ preventScroll: true }));
      };
    }, []);

    // Setas dentro da lista de abas trocam de aba (padrão WAI-ARIA), sem trocar de fotografia.
    function handleTabsKeydown(event) {
      const position = tabs.findIndex(item => item.id === tab);
      let next = null;
      if (event.key === 'ArrowRight') next = (position + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (position - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === null) return;
      event.preventDefault();
      event.stopPropagation();
      selectTab(tabs[next].id, true);
    }

    // Renderizado no topo do diálogo do capítulo: o painel tem transform, que prenderia o `position: fixed`.
    const host = returnFocusRef?.current?.closest('.journey-cinematic') || document.body;
    return window.ReactDOM.createPortal(h('section', {
      className: 'journey-memories',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': 'journey-memories-title',
      ref: dialogRef,
    },
      h('div', { className: 'journey-memories__veil', 'aria-hidden': 'true' }),
      h('div', { className: 'journey-memories__portal', 'aria-hidden': 'true' }, h('i'), h('i')),
      h('div', { className: 'journey-memories__frame' },
        h('header', { className: 'journey-memories__header' },
          h('div', null,
            h('span', null, `Memórias Interativas · ${data.place}`),
            h('h3', { id: 'journey-memories-title' }, data.title)
          ),
          h('div', {
            className: 'journey-memories__tabs',
            role: 'tablist',
            'aria-label': 'Seções das memórias',
            onKeyDown: handleTabsKeydown,
          },
            tabs.map(item => h('button', {
              key: item.id,
              type: 'button',
              role: 'tab',
              id: `journey-memories-tab-${item.id}`,
              'aria-selected': tab === item.id,
              'aria-controls': 'journey-memories-panel',
              tabIndex: tab === item.id ? 0 : -1,
              onClick: () => selectTab(item.id),
            }, h('span', { 'aria-hidden': 'true' }, item.icon), item.label))
          ),
          h('button', {
            type: 'button',
            className: 'journey-memories__close',
            onClick: () => live.current.onClose(),
            ref: closeRef,
            'aria-label': 'Fechar memórias e voltar ao capítulo',
          }, '×')
        ),
        h('div', {
          className: `journey-memories__panel is-${tab}`,
          id: 'journey-memories-panel',
          role: 'tabpanel',
          'aria-labelledby': `journey-memories-tab-${tab}`,
        },
          tab === 'memories' && h(MemoryGallery, {
            data,
            index,
            setIndex,
            hotspotId,
            setHotspotId,
            detailRef,
          }),
          tab === 'walk' && h(MemoryWalk, { data, index, setIndex, controlsRef: walkControlsRef }),
          tab === 'diary' && h(MemoryDiary, { diary: data.diary })
        )
      )
    ), host);
  }

  window.JourneyMemories = JourneyMemories;
})();
