// O Conselho dos Oito — avatares, modal individual, faixa mobile e depuração.
// Configuração: window.councilConfig (assets/js/data/councilMembers.js). Camada de cena e hotspots: voice-experiences.js.
(() => {
  const VX = window.VoiceExperience;
  if (!window.React || !VX?.utils || !window.councilConfig) return;
  const h = window.React.createElement;
  const { useEffect, useLayoutEffect, useRef, useState } = window.React;
  const { useLayerFocus, useBackHandler, reducedMotion } = VX.utils;
  const config = window.councilConfig;
  const rand = (min, max) => min + Math.random() * (max - min);
  const asset = file => `${config.assetBase}${file}`;
  const isReady = member => member.status === 'ready' && !!member.avatar?.art;                            // abre modal
  const hasScene = member => isReady(member) && !!member.avatar.scene && !!member.placement;            // senta na cadeira

  // ---------------------------------------------------------------------------------------------
  // Símbolos (SVG inline, um por conselheiro; `currentColor` recebe a cor do tema)
  // ---------------------------------------------------------------------------------------------
  const SYMBOLS = {
    'wizard-code': ['M24 6 14 26l-6 3v4h32v-4l-6-3L24 6Z', 'm19 38-4 4 4 4m10-8 4 4-4 4m-3-10-4 12'],
    'book-quill': ['M8 12c6-2 11 0 16 4v22c-5-4-10-6-16-4V12Zm32 0c-6-2-11 0-16 4v22c5-4 10-6 16-4V12Z', 'm30 8 9 9m-12 5L41 8'],
    gear: ['M24 17a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z', 'M24 6v6m0 24v6M6 24h6m24 0h6M11 11l4 4m18 18 4 4m0-26-4 4M15 33l-4 4'],
    flame: ['M24 6c2 8 11 12 11 22a11 11 0 0 1-22 0c0-5 3-8 5-11 1 4 3 5 4 5 1-5 0-10 2-16Z'],
    flask: ['M19 6h10m-8 0v12L9 38a3 3 0 0 0 3 5h24a3 3 0 0 0 3-5L27 18V6', 'M14 32h20'],
    shield: ['M24 6 39 12v11c0 9-6 15-15 19C15 38 9 32 9 23V12L24 6Z'],
    scroll: ['M12 8h24v28a4 4 0 0 1-8 0H12V8Z', 'M18 16h12m-12 6h12'],
    leaf: ['M10 38C10 20 22 8 40 8c0 18-12 30-30 30Z', 'M10 38 26 22'],
  };
  function MemberSymbol({ type, className = '' }) {
    const paths = SYMBOLS[type] || SYMBOLS.shield;
    return h('svg', { className: `council-symbol ${className}`, viewBox: '0 0 48 48', 'aria-hidden': 'true', focusable: 'false', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' },
      paths.map((d, index) => h('path', { key: index, d })));
  }

  // ---------------------------------------------------------------------------------------------
  // Cena: avatar sentado + camada de primeiro plano que o cobre onde a cadeira/mesa passa na frente
  // ---------------------------------------------------------------------------------------------
  function CouncilAvatar({ member, placement, hovered, selected, dimmed }) {
    const sprite = asset(member.avatar.scene);
    const style = {
      '--ax': `${placement.x}%`, '--ay': `${placement.y}%`, '--aw': `${placement.width}%`, '--az': (placement.zIndex || 1) * 10,
      '--glow': member.theme.glow, '--origin': placement.transformOrigin || '50% 100%',
    };
    return h('div', {
      className: `voice-council__avatar${hovered ? ' is-hover' : ''}${selected ? ' is-selected' : ''}${dimmed ? ' is-dim' : ''}`,
      'data-member': member.id, style,
    }, h('div', { className: 'voice-council__avatar-reveal' }, h('div', { className: 'voice-council__avatar-hover' }, h('div', { className: 'voice-council__avatar-idle' },
      h('img', { src: sprite, alt: '', draggable: false, decoding: 'async' })))));
  }

  // O mesmo cenário, recortado pelo polígono do braço da cadeira (ou da mesa), por cima do avatar.
  function CouncilForeground({ member, placement, scene }) {
    if (!placement.occlusion?.length) return null;
    const clip = `polygon(${placement.occlusion.map(([x, y]) => `${x}% ${y}%`).join(',')})`;
    return h('img', { className: 'voice-council__foreground-piece', src: scene, alt: '', draggable: false, 'data-member': member.id, style: { clipPath: clip, WebkitClipPath: clip, zIndex: (placement.zIndex || 1) * 10 + 1 } });
  }

  // Respiração e oscilação mínimas; só transform. Nada comprime a imagem para simular expressão facial.
  function useCouncilAvatarAnimation(rootRef, signature) {
    useEffect(() => {
      const gsap = window.gsap;
      const root = rootRef.current;
      if (!gsap || !root || reducedMotion()) return undefined;
      const { breath, sway, stagger } = config.animation;
      const context = gsap.context(() => {
        root.querySelectorAll('.voice-council__avatar').forEach((avatar, index) => {
          const member = config.members.find(item => item.id === avatar.dataset.member);
          const idle = avatar.querySelector('.voice-council__avatar-idle');
          if (!member?.animations?.enabled || !idle) return;
          gsap.set(idle, { transformOrigin: '50% 100%' });
          if (member.animations.breathing) {
            gsap.to(idle, { scale: breath.scale, yPercent: -breath.lift, duration: breath.duration, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: index * stagger });
          }
          if (member.animations.sway) {
            const drift = () => gsap.to(idle, { rotation: rand(-sway.rotation, sway.rotation), xPercent: rand(-sway.shift, sway.shift), duration: rand(sway.min, sway.max), ease: 'sine.inOut', onComplete: drift });
            gsap.delayedCall(index * stagger, drift);
          }
        });
      }, root);
      return () => context.revert();
    }, [signature]);
  }

  // ---------------------------------------------------------------------------------------------
  // Faixa de conselheiros (celular): retratos acessíveis por toque, no lugar dos hotspots pequenos
  // ---------------------------------------------------------------------------------------------
  function CouncilRoster({ onSelect, selectedId }) {
    const ready = config.members.filter(isReady);
    const pending = config.members.length - ready.length;
    return h('nav', { className: 'council-roster', 'aria-label': 'Conselheiros disponíveis' },
      h('ul', null, ready.map(member => h('li', { key: member.id },
        h('button', { type: 'button', className: selectedId === member.id ? 'is-active' : '', style: { '--glow': member.theme.glow, '--accent': member.theme.accent }, onClick: () => onSelect(member.id), 'aria-haspopup': 'dialog' },
          h('img', { src: asset(member.avatar.portrait), alt: '', width: 64, height: 64, loading: 'lazy' }),
          h('span', null, member.name))))),
      pending > 0 && h('p', null, `${pending} cadeira${pending === 1 ? '' : 's'} aguarda${pending === 1 ? '' : 'm'} os próximos conselheiros.`)
    );
  }

  // ---------------------------------------------------------------------------------------------
  // Modal individual (um componente para os oito; todo o conteúdo vem de councilMembers.js)
  // ---------------------------------------------------------------------------------------------
  function CouncilMemberHeader({ member, onClose }) {
    return h('header', { className: 'council-modal__header council-modal__reveal' },
      h('span', { className: `council-modal__symbol${member.symbolImage ? ' has-image' : ''}` },
        member.symbolImage
          ? h('img', { src: member.symbolImage, alt: '', width: 256, height: 278, decoding: 'async' })
          : h(MemberSymbol, { type: member.symbol })),
      h('div', null,
        h('p', { className: 'council-modal__species' }, member.species),
        h('h5', { id: 'council-modal-title' }, member.name),
        h('p', { className: 'council-modal__title' }, member.title)),
      h('button', { type: 'button', className: 'council-modal__close', onClick: onClose, 'aria-label': `Fechar ${member.name} e voltar ao conselho` }, '×'));
  }

  function CouncilMemberBiography({ member }) {
    return h('section', { className: 'council-modal__section council-modal__reveal', 'aria-labelledby': 'council-bio-title' },
      h('h6', { id: 'council-bio-title' }, 'História do Conselheiro'),
      h('p', { className: 'council-modal__story' }, member.description),
      h('dl', { className: 'council-modal__facts' },
        h('div', null, h('dt', null, 'Papel na guilda'), h('dd', null, member.role)),
        member.specialty && h('div', null, h('dt', null, 'Especialidade'), h('dd', null, member.specialty))));
  }

  function CouncilMemberSkills({ member }) {
    if (!member.skills?.length) return null;
    return h('section', { className: 'council-modal__section council-modal__reveal', 'aria-labelledby': 'council-skills-title' },
      h('h6', { id: 'council-skills-title' }, 'Habilidades'),
      h('ul', { className: 'council-modal__seals' }, member.skills.map(skill => h('li', { key: skill }, h('span', { 'aria-hidden': 'true' }, '✦'), skill))));
  }

  function CouncilMemberRecords({ member, records, onOpenRecord }) {
    const own = records.filter(record => member.records.includes(record.id));
    return h('section', { className: 'council-modal__section council-modal__reveal', 'aria-labelledby': 'council-records-title' },
      h('h6', { id: 'council-records-title' }, 'Registros da Guilda'),
      own.length
        ? h('ul', { className: 'council-modal__records' }, own.map(record => h('li', { key: record.id },
          h('strong', null, record.title), record.description && h('p', null, record.description),
          h('button', { type: 'button', onClick: () => onOpenRecord(record) }, 'Ler o registro'))))
        : h('p', { className: 'council-modal__empty' }, 'Os registros profissionais e depoimentos autorizados deste conselheiro serão guardados aqui. Nenhum relato foi inventado para preencher este espaço.'));
  }

  function CouncilMemberModal({ member, records, onClose, onOpenRecord, backRef }) {
    const ref = useRef(null);
    useLayerFocus(ref, '.council-modal__close');
    useBackHandler(backRef, () => { onClose(); return true; });
    useLayoutEffect(() => {
      const gsap = window.gsap;
      const root = ref.current;
      if (!gsap || !root || reducedMotion()) return undefined;
      const { duration, text } = config.animation.modal;
      const context = gsap.context(() => {
        const tl = gsap.timeline();
        tl.from(root, { opacity: 0, duration: duration * 0.45, ease: 'power1.out' }, 0)
          .from('.council-modal__panel', { opacity: 0, scale: 0.96, y: 14, duration, ease: 'power3.out' }, 0.04)
          .from('.council-modal__figure', { opacity: 0, x: -20, duration, ease: 'power3.out' }, 0.1)
          .from('.council-modal__reveal', { opacity: 0, y: 10, duration: duration * 0.7, stagger: text, ease: 'power2.out' }, 0.16);
      }, root);
      return () => context.revert();
    }, []);
    const theme = member.theme;
    // portal no diálogo principal: um ancestral animado vira o contêiner do position:fixed e prenderia o modal à cena
    const host = document.querySelector('.journey-banner');
    const node = h('div', {
      className: 'council-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'council-modal-title', 'data-voice-layer': true, ref,
      style: { '--accent': theme.accent, '--secondary': theme.secondary, '--glow': theme.glow, '--paper': theme.paper },
    },
      h('div', { className: 'council-modal__backdrop', onClick: onClose, 'aria-hidden': 'true' }),
      h('article', { className: 'council-modal__panel' },
        h(CouncilMemberHeader, { member, onClose }),
        h('div', { className: 'council-modal__body' },
          h('figure', { className: 'council-modal__figure' },
            h('div', { className: 'council-modal__light', 'aria-hidden': 'true' }),
            h('img', { src: asset(member.avatar.art), alt: `Arte oficial: ${member.name}, ${member.title}`, draggable: false, decoding: 'async' })),
          h('div', { className: 'council-modal__content' },
            h(CouncilMemberBiography, { member }),
            h(CouncilMemberSkills, { member }),
            h(CouncilMemberRecords, { member, records, onOpenRecord }),
            h('button', { type: 'button', className: 'council-modal__back council-modal__reveal', onClick: onClose }, '← Voltar ao Conselho'))))
    );
    return host ? window.ReactDOM.createPortal(node, host) : node;
  }

  // ---------------------------------------------------------------------------------------------
  // Depuração (?councilDebug): ajuste x/y/largura ao vivo e copie o JSON para councilMembers.js
  // ---------------------------------------------------------------------------------------------
  function CouncilDebugPanel({ overrides, setOverride }) {
    const ready = config.members.filter(hasScene);
    const [copied, setCopied] = useState(false);
    const json = JSON.stringify(Object.fromEntries(ready.map(member => [member.id, { ...member.placement, ...(overrides[member.id] || {}), occlusion: undefined }])), null, 2);
    return h('aside', { className: 'council-debug', 'aria-label': 'Depuração do posicionamento' },
      h('strong', null, 'Posicionamento (% do cenário)'),
      ready.map(member => {
        const value = { ...member.placement, ...(overrides[member.id] || {}) };
        return h('fieldset', { key: member.id },
          h('legend', null, member.name),
          ['x', 'y', 'width'].map(key => h('label', { key }, key,
            h('input', { type: 'number', step: 0.1, value: value[key], onChange: event => setOverride(member.id, { [key]: Number(event.target.value) }) }))));
      }),
      h('button', { type: 'button', onClick: () => { navigator.clipboard?.writeText(json).then(() => setCopied(true)).catch(() => {}); } }, copied ? 'Copiado' : 'Copiar JSON'),
      h('pre', null, json));
  }

  window.CouncilMembers = {
    Avatar: CouncilAvatar, Foreground: CouncilForeground, Roster: CouncilRoster, MemberModal: CouncilMemberModal,
    DebugPanel: CouncilDebugPanel, useAvatarAnimation: useCouncilAvatarAnimation, isReady, hasScene,
  };
})();
