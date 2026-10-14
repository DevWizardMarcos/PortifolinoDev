// Memórias Interativas — modal imersivo com três abas (Memórias, Tour 360°, Diário da Jornada).
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
    { id: 'memories', label: 'Memórias', icon: '✦' },
    { id: 'tour', label: 'Tour 360°', icon: '◎' },
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
    const [tab, setTab] = useState(state.tab);
    const [index, setIndexState] = useState(state.index);
    const [hotspotId, setHotspotId] = useState(state.hotspot);
    const dialogRef = useRef(null);
    const closeRef = useRef(null);
    const detailRef = useRef(null);
    const tourControlsRef = useRef(null);
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
          if (currentTab === 'tour' && tourControlsRef.current) {
            const zoom = event.key === '+' || event.key === '=' ? 0.85 : event.key === '-' ? 1.18 : 1;
            if (arrow || zoom !== 1) {
              event.preventDefault();
              tourControlsRef.current({ yaw: arrow * 0.2, zoom });
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
      const position = TABS.findIndex(item => item.id === tab);
      let next = null;
      if (event.key === 'ArrowRight') next = (position + 1) % TABS.length;
      if (event.key === 'ArrowLeft') next = (position - 1 + TABS.length) % TABS.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = TABS.length - 1;
      if (next === null) return;
      event.preventDefault();
      event.stopPropagation();
      selectTab(TABS[next].id, true);
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
            TABS.map(item => h('button', {
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
          tab === 'tour' && h(MemoryTour, { tour: data.tour, title: data.title, controlsRef: tourControlsRef }),
          tab === 'diary' && h(MemoryDiary, { diary: data.diary })
        )
      )
    ), host);
  }

  window.JourneyMemories = JourneyMemories;
})();
