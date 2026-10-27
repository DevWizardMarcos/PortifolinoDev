// Hackathon City — O Confronto das Lendas. Cena cinematográfica em camadas, animada por código (GSAP + canvas).
// Configuração e assets: window.hackathonCityConfig (assets/js/data/hackathonCityConfig.js). Documentação: docs/hackathon-city-assets.md.
(() => {
  if (!window.React) return;
  const h = window.React.createElement;
  const { useEffect, useRef, useState } = window.React;
  const rand = (min, max) => min + Math.random() * (max - min);

  const reducedMotion = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const ACTS = ['Ato I — A cidade desperta', 'Ato II — O primeiro ataque', 'Ato III — O confronto', 'Ato IV — O legado'];

  // ---------------------------------------------------------------------------------------------
  // Áudio: só toca sinais com arquivo configurado, e só depois de uma interação do visitante.
  // ---------------------------------------------------------------------------------------------
  class CueAudio {
    constructor(config) {
      this.config = config; this.muted = false; this.volume = config.volume; this.playing = new Set(); this.loops = new Map();
      this.available = Object.values(config.cues).some(cue => cue.src);
      try { this.muted = localStorage.getItem(config.storageKey) === 'off'; } catch (_) { /* sem persistência */ }
    }
    play(name) {
      const cue = this.config.cues[name];
      if (!cue?.src || this.muted) return;
      const audio = this.loops.get(name) || new Audio(cue.src);
      audio.loop = !!cue.loop; audio.volume = Math.min(1, this.volume * (cue.gain ?? 1));
      if (cue.loop) this.loops.set(name, audio);
      this.playing.add(audio);
      audio.addEventListener('ended', () => this.playing.delete(audio), { once: true });
      audio.play().catch(() => { /* bloqueado pelo navegador: a cena segue em silêncio */ });
    }
    setVolume(value) { this.volume = value; this.playing.forEach(audio => { audio.volume = Math.min(1, value); }); this.loops.forEach((audio, name) => { audio.volume = Math.min(1, value * (this.config.cues[name].gain ?? 1)); }); }
    setMuted(value) { this.muted = value; try { localStorage.setItem(this.config.storageKey, value ? 'off' : 'on'); } catch (_) { /* ignora */ } if (value) this.stopAll(); }
    stopAll() { this.playing.forEach(audio => audio.pause()); this.playing.clear(); this.loops.forEach(audio => audio.pause()); }
    pauseAll() { this.playing.forEach(audio => audio.pause()); this.loops.forEach(audio => audio.pause()); }
    resumeAll() { if (!this.muted) { this.playing.forEach(audio => audio.play().catch(() => {})); this.loops.forEach(audio => audio.play().catch(() => {})); } }
  }

  // ---------------------------------------------------------------------------------------------
  // Efeitos: partículas no canvas (rajadas, brasas, faíscas). Um laço só, que dorme quando não há nada a desenhar.
  // ---------------------------------------------------------------------------------------------
  function createEffects(canvas, stageSize) {
    const ctx = canvas.getContext('2d');
    const particles = [];
    let scale = 1; let frozen = false; let ambient = 0; let visible = true;
    const torches = window.hackathonCityConfig.anchors.torches;
    const COLORS = { cold: [150, 200, 255], white: [235, 245, 255], fire: [255, 140, 50], gold: [255, 205, 110], ember: [255, 110, 40] };

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = canvas.clientWidth; const height = canvas.clientHeight;
      if (!width) return;
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      scale = canvas.width / stageSize.width;
    }
    const add = (x, y, vx, vy, life, size, color) => { if (particles.length < 900) particles.push({ x, y, vx, vy, life, max: life, size, color }); };
    const bezier = (a, c, b, t) => { const u = 1 - t; return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]; };

    function tick(dt) {
      if (frozen || !visible) return;
      if (ambient > 0) {
        for (let i = 0; i < torches.length; i += 1) if (Math.random() < ambient * 0.05) add(torches[i][0] + rand(-4, 4), torches[i][1] - 6, rand(-8, 8), rand(-38, -16), rand(1.1, 2.2), rand(1.4, 2.6), COLORS.ember);
      }
      if (!particles.length) { if (canvas.dataset.clear !== '1') { ctx.clearRect(0, 0, canvas.width, canvas.height); canvas.dataset.clear = '1'; } return; }
      canvas.dataset.clear = '0';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.life -= dt;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        p.x += p.vx * dt; p.y += p.vy * dt; p.vy -= 6 * dt;
        const a = Math.max(0, p.life / p.max);
        const r = p.size * (0.5 + a) * scale * 2.2;
        const g = ctx.createRadialGradient(p.x * scale, p.y * scale, 0, p.x * scale, p.y * scale, r);
        g.addColorStop(0, `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${0.85 * a})`);
        g.addColorStop(1, `rgba(${p.color[0]},${p.color[1]},${p.color[2]},0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x * scale, p.y * scale, r, 0, Math.PI * 2); ctx.fill();
      }
    }

    return {
      resize, tick,
      setAmbient: value => { ambient = value; },
      freeze: value => { frozen = value; },
      setVisible: value => { visible = value; },
      // cabeça de fogo que percorre a curva e deixa um rastro de partículas
      stream(from, control, to, { cold = true, duration = 0.9, density = 7 } = {}) {
        const head = { t: 0 }; const palette = cold ? [COLORS.cold, COLORS.white] : [COLORS.fire, COLORS.gold];
        return window.gsap.to(head, {
          t: 1, duration, ease: 'power1.in',
          onUpdate() {
            const [x, y] = bezier(from, control, to, head.t);
            for (let i = 0; i < density; i += 1) add(x + rand(-5, 5), y + rand(-5, 5), rand(-30, 30), rand(-30, 30), rand(0.35, 0.8), rand(2, 4.2), palette[i % 2]);
          },
        });
      },
      // fogo jorrando da boca: partículas nascem dentro da abertura e saem na direção do sopro, durante `duration` segundos
      pour(from, toward, { cold = true, duration = 1.6 } = {}) {
        const dx = toward[0] - from[0]; const dy = toward[1] - from[1]; const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len; const uy = dy / len; const palette = cold ? [COLORS.white, COLORS.cold] : [COLORS.gold, COLORS.fire];
        const state = { t: 0 };
        return window.gsap.to(state, {
          t: 1, duration, ease: 'none',
          onUpdate() {
            const fade = Math.sin(Math.min(1, state.t) * Math.PI) ** 0.6; // abre e fecha o jorro com suavidade
            const n = Math.round(6 * fade);
            for (let i = 0; i < n; i += 1) {
              const v = rand(120, 260);
              add(from[0] + rand(-3, 3), from[1] + rand(-3, 3), ux * v + rand(-22, 22), uy * v + rand(-22, 22), rand(0.22, 0.55), rand(2.2, 4.8), palette[i % 2]);
            }
          },
        });
      },
      burst(at, { count = 90, cold = false, speed = 160 } = {}) {
        for (let i = 0; i < count; i += 1) {
          const angle = rand(0, Math.PI * 2); const v = rand(speed * 0.3, speed);
          add(at[0], at[1], Math.cos(angle) * v, Math.sin(angle) * v - 20, rand(0.5, 1.4), rand(1.6, 4), [COLORS.cold, COLORS.white, COLORS.fire, COLORS.gold][cold ? i % 2 : 2 + (i % 2)]);
        }
      },
      clear: () => { particles.length = 0; },
      get active() { return particles.length > 0 || ambient > 0; },
    };
  }

  // ---------------------------------------------------------------------------------------------
  // Atores (dragão e fênix). Sem sprite configurado o ator é só a âncora e o ponto de interação:
  // nada é recortado nem movido da arte composta.
  // ---------------------------------------------------------------------------------------------
  function Actor({ id, config, sprites, onInspect }) {
    const [x, y, x2, y2] = config.box;
    const sprite = sprites && Object.values(sprites).find(Boolean);
    return h('div', { className: `hc__actor hc__actor--${id}`, 'data-actor': id, 'data-state': 'idleFlight', style: { left: `${x}%`, top: `${y}%`, width: `${x2 - x}%`, height: `${y2 - y}%` } },
      sprite && h('img', { className: 'hc__actor-sprite', src: sprite, alt: '', draggable: false }),
      h('button', { type: 'button', className: 'hc__actor-hit', 'aria-label': `Conhecer o símbolo: ${config.label}`, onClick: () => onInspect(id) }));
  }
  const DragonActor = props => h(Actor, { id: 'dragon', ...props });
  const PhoenixActor = props => h(Actor, { id: 'phoenix', ...props });

  // ---------------------------------------------------------------------------------------------
  // Cena
  // ---------------------------------------------------------------------------------------------
  function HackathonCityScene({ onBack }) {
    const config = window.hackathonCityConfig;
    const gsapOk = !!window.gsap;
    const rootRef = useRef(null);
    const apiRef = useRef(null);
    const audioRef = useRef(null);
    const [phase, setPhase] = useState('idle'); // idle | playing | paused | done
    const [actIndex, setActIndex] = useState(-1);
    const [inspect, setInspect] = useState(null);
    const [soundOn, setSoundOn] = useState(true);
    const [volume, setVolume] = useState(config.audio.volume);
    const [ready, setReady] = useState(false);
    const { stage, anchors, assets } = config;
    const pct = ([x, y]) => ({ left: `${x / stage.width * 100}%`, top: `${y / stage.height * 100}%` });
    const polygon = anchors.avatarPolygon.map(([x, y]) => `${x / stage.width * 100}% ${y / stage.height * 100}%`).join(',');

    useEffect(() => {
      const image = new Image();
      image.onload = image.onerror = () => setReady(true);
      image.src = assets.composite;
      const audio = new CueAudio(config.audio);
      audioRef.current = audio;
      setSoundOn(!audio.muted);
      return () => audio.stopAll();
    }, []);

    // Toda a animação vive aqui; gsap.context + cleanup garantem que nada sobrevive à desmontagem.
    useEffect(() => {
      const gsap = window.gsap;
      const root = rootRef.current;
      if (!gsap || !root || !ready) return undefined;
      const q = selector => root.querySelector(selector);
      const qa = selector => [...root.querySelectorAll(selector)];
      const el = {
        camera: q('.hc__camera'), parallax: q('.hc__parallax'), stage: q('.hc__stage'), canvas: q('.hc__fx'), dark: q('.hc__dark'),
        torches: qa('.hc__torch'), mist: qa('.hc__mist'), arena: q('.hc__arena-glow'), moon: q('.hc__moon-glow'),
        breath: q('.hc__breath-light'), fire: q('.hc__fire-light'), mouth: q('.hc__mouth-glow'), beak: q('.hc__beak-glow'),
        flash: q('.hc__flash'), rings: qa('.hc__ring'), avatar: q('.hc__avatar-light'), caption: q('.hc__caption'),
        dragon: q('[data-actor="dragon"]'), phoenix: q('[data-actor="phoenix"]'),
      };
      const canMove = !reducedMotion();
      const finePointer = !!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;
      const T = config.timeline;
      const audio = audioRef.current;
      const fx = createEffects(el.canvas, stage);
      let onScreen = true;
      const unit = () => el.stage.getBoundingClientRect().width / stage.width;
      const stageW = () => el.stage.getBoundingClientRect().width;
      const stageH = () => el.stage.getBoundingClientRect().height;
      // câmera: dá zoom mantendo o ponto de foco no lugar (sem tela vazia nas bordas)
      const gentle = root.clientWidth < 600 ? 0.55 : 1; // celular: aproximação menor, para não revelar baixa resolução
      const cam = ([fx0, fy0], s0) => { const s = 1 + (s0 - 1) * gentle; return { scale: s, x: () => (0.5 - fx0 / stage.width) * stageW() * (s - 1), y: () => (0.5 - fy0 / stage.height) * stageH() * (s - 1) }; };
      const setState = (actor, state) => { actor.dataset.state = state; };
      let tl = null; let ticker = null; let cleanup = () => {}; const timers = new Set();
      const later = (fn, seconds) => { const id = window.setTimeout(() => { timers.delete(id); fn(); }, seconds * 1000); timers.add(id); };

      const ctx = gsap.context(() => {
        fx.resize();
        const resizeObserver = new ResizeObserver(() => fx.resize());
        resizeObserver.observe(el.canvas);
        const visibility = new IntersectionObserver(entries => { onScreen = entries.some(entry => entry.isIntersecting); fx.setVisible(onScreen); }, { threshold: 0.05 });
        visibility.observe(root);
        ticker = (time, deltaMs) => fx.tick(Math.min(deltaMs, 50) / 1000);
        gsap.ticker.add(ticker);

        gsap.set(el.torches, { opacity: 0.55, scale: 1 });
        gsap.set([el.breath, el.fire, el.mouth, el.beak, el.flash, ...el.rings, el.avatar], { opacity: 0 });
        gsap.set(el.dark, { opacity: 0 });
        gsap.set(el.caption, { opacity: 0, y: 8 });

        // ---- ambiente contínuo: tochas, névoa e lua (só transform e opacidade; sem timeline, para sobreviver ao pause) ----
        const ambientTweens = [];
        if (canMove) {
          el.torches.forEach((torch, index) => {
            const flicker = () => ambientTweens.push(gsap.to(torch, { opacity: rand(0.62, 0.98), scale: rand(0.92, 1.12), duration: rand(0.12, 0.34), ease: 'sine.inOut', onComplete: flicker }));
            gsap.delayedCall(index * 0.07, flicker);
          });
          el.mist.forEach((layer, index) => ambientTweens.push(gsap.to(layer, { xPercent: index ? -6 : 6, duration: 26 + index * 9, ease: 'sine.inOut', yoyo: true, repeat: -1 })));
          ambientTweens.push(gsap.to(el.moon, { opacity: 0.8, scale: 1.06, duration: 5, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
          ambientTweens.push(gsap.to(el.arena, { opacity: 0.85, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
          fx.setAmbient(0.55);
        } else {
          gsap.set(el.torches, { opacity: 0.8 });
          gsap.set(el.arena, { opacity: 0.6 });
        }

        // ---- parallax sutil do ponteiro (só com mouse, desligado em movimento reduzido) ----
        let moveX = null; let moveY = null; let onMove = null;
        if (canMove && finePointer) {
          moveX = gsap.quickTo(el.parallax, 'x', { duration: 1.1, ease: 'power3.out' });
          moveY = gsap.quickTo(el.parallax, 'y', { duration: 1.1, ease: 'power3.out' });
          onMove = event => {
            if (!onScreen) return;
            const r = root.getBoundingClientRect();
            const nx = Math.max(-1, Math.min(1, ((event.clientX - r.left) / r.width - 0.5) * 2));
            const ny = Math.max(-1, Math.min(1, ((event.clientY - r.top) / r.height - 0.5) * 2));
            moveX(nx * -7); moveY(ny * -4);
          };
          window.addEventListener('pointermove', onMove, { passive: true });
        }

        // ---- timeline cinematográfica ----
        const cue = name => () => audio.play(name);
        const label = index => () => { setActIndex(index); };
        const shake = () => {
          if (!canMove) return;
          const s = T.shake; const t = gsap.timeline();
          for (let i = 0; i < 8; i += 1) { const decay = 1 - i / 8; t.to(el.camera, { x: `+=${rand(-1, 1) * s.amplitude * decay}`, y: `+=${rand(-0.6, 0.6) * s.amplitude * decay}`, duration: s.duration / 10, ease: 'none' }); }
          return t;
        };

        const build = () => {
          const t = gsap.timeline({ paused: true, onComplete: () => { setPhase('done'); setActIndex(3); } });
          const a1 = T.act1; const a2 = T.act2; const a3 = T.act3; const a4 = T.act4;
          const b2 = a1; const b3 = a1 + a2; const b4 = a1 + a2 + a3;
          const [mx, my] = anchors.dragonMouth; const [bx, by] = anchors.phoenixBeak; const col = anchors.collision;

          // ATO I — a cidade desperta: as luzes acendem e a câmera se aproxima a partir do avatar
          t.add(label(0), 0).add(cue('ambience'), 0).add(cue('wings'), 0.8)
            .fromTo(el.dark, { opacity: canMove ? 0.6 : 0 }, { opacity: 0, duration: a1 * 0.6, ease: 'power1.out' }, 0)
            .to(el.torches, { opacity: 0.95, duration: a1 * 0.5, stagger: 0.12, ease: 'power1.out' }, 0.2)
            .fromTo(el.camera, { scale: 1, x: 0, y: 0 }, { ...cam(anchors.focus.avatar, 1.05), duration: a1, ease: 'sine.inOut' }, 0)
            .to(el.caption, { opacity: 1, y: 0, duration: 0.5 }, 0.3).to(el.caption, { opacity: 0, duration: 0.5 }, a1 - 0.7);

          // ATO II — o primeiro ataque: antecipação (luz fria na boca), rajada e reação do ambiente
          t.add(label(1), b2).add(() => setState(el.dragon, 'preparingAttack'), b2)
            .to(el.camera, { ...cam(anchors.focus.arena, 1.04), duration: a2 * 0.6, ease: 'sine.inOut' }, b2)
            .to(el.mouth, { opacity: 1, scale: 1.6, duration: 1.2, ease: 'power2.in' }, b2 + 0.4)
            .to(el.breath, { opacity: 0.38, duration: 1.0, ease: 'sine.in' }, b2 + 0.9)
            .add(() => { setState(el.dragon, 'fireBreath'); setState(el.phoenix, 'evasive'); audio.play('dragonRoar'); audio.play('fire'); }, b2 + 1.5)
            .add(() => { fx.pour([mx, my], anchors.dragonBreathControl, { cold: true, duration: 1.7 }); fx.stream([mx, my], anchors.dragonBreathControl, col, { cold: true, duration: 0.9, density: 9 }); }, b2 + 1.55)
            .to(el.avatar, { opacity: 0.8, duration: 0.25, yoyo: true, repeat: 1, ease: 'sine.inOut' }, b2 + 2.2)
            .add(() => { fx.burst(col, { count: 50, cold: true, speed: 120 }); audio.play('phoenixCry'); setState(el.phoenix, 'flare'); }, b2 + 2.45)
            .to(el.beak, { opacity: 1, scale: 1.5, duration: 0.7, ease: 'power2.out' }, b2 + 2.7)
            .to(el.fire, { opacity: 0.3, duration: 0.8, ease: 'sine.inOut' }, b2 + 2.7)
            .to([el.mouth, el.breath], { opacity: 0, duration: 1.0, ease: 'sine.out' }, b2 + 3.4);

          // ATO III — o confronto: golpes alternados, convergência e a colisão luminosa
          t.add(label(2), b3).add(() => { setState(el.dragon, 'banking'); setState(el.phoenix, 'counterAttack'); }, b3)
            .to(el.camera, { ...cam(anchors.focus.battle, 1.06), duration: a3 * 0.55, ease: 'sine.inOut' }, b3)
            .add(() => { fx.pour([bx, by], anchors.phoenixFireControl, { cold: false, duration: 1.5 }); fx.stream([bx, by], anchors.phoenixFireControl, col, { cold: false, duration: 0.8, density: 9 }); }, b3 + 0.4)
            .add(() => { fx.pour([mx, my], anchors.dragonBreathControl, { cold: true, duration: 1.5 }); fx.stream([mx, my], anchors.dragonBreathControl, col, { cold: true, duration: 0.8, density: 9 }); }, b3 + 1.1)
            .to([el.mouth, el.beak], { opacity: 1, duration: 0.5 }, b3 + 1.0)
            .add(() => { setState(el.dragon, 'fireBreath'); audio.play('fire'); }, b3 + 1.1)
            .to([el.breath, el.fire], { opacity: 0.34, duration: 1.2, ease: 'sine.in' }, b3 + 1.1)
            .add(() => { fx.pour([bx, by], anchors.phoenixFireControl, { cold: false, duration: 1.1 }); fx.stream([bx, by], anchors.phoenixFireControl, col, { cold: false, duration: 0.7, density: 10 }); }, b3 + 2.4)
            .add(() => { fx.pour([mx, my], anchors.dragonBreathControl, { cold: true, duration: 1.1 }); fx.stream([mx, my], anchors.dragonBreathControl, col, { cold: true, duration: 0.7, density: 10 }); }, b3 + 2.4)
            // colisão: um único clarão suave (abaixo do limite configurado), ondas de choque, brasas e tremor amortecido
            .add(() => { audio.play('impact'); fx.burst(col, { count: 140, cold: false, speed: 220 }); fx.burst(col, { count: 70, cold: true, speed: 180 }); setState(el.dragon, 'recovery'); setState(el.phoenix, 'recovery'); }, b3 + 3.1)
            .fromTo(el.flash, { opacity: T.maxFlashOpacity }, { opacity: 0, duration: 0.7, ease: 'power2.out' }, b3 + 3.1)
            .fromTo(el.rings, { scale: 0.15, opacity: 0.7 }, { scale: 3.4, opacity: 0, duration: 1.3, ease: 'power2.out', stagger: 0.18 }, b3 + 3.1)
            .to(el.avatar, { opacity: 0.8, duration: 0.2, yoyo: true, repeat: 1 }, b3 + 3.15)
            .fromTo(el.arena, { opacity: 1 }, { opacity: 0.7, duration: 1.4 }, b3 + 3.1)
            .add(shake, b3 + 3.1)
            .to([el.mouth, el.beak, el.breath, el.fire], { opacity: 0, duration: 1.4, ease: 'sine.out' }, b3 + 3.4);

          // ATO IV — o legado: a intensidade cai, a câmera volta a mostrar a arena inteira
          t.add(label(3), b4).add(() => { setState(el.dragon, 'retreat'); setState(el.phoenix, 'retreat'); }, b4)
            .to(el.camera, { scale: 1, x: 0, y: 0, duration: a4 * 0.85, ease: 'power2.inOut' }, b4)
            .to(el.torches, { opacity: 0.8, duration: a4 }, b4)
            .to(el.caption, { opacity: 1, y: 0, duration: 0.6 }, b4 + 0.6);
          return t;
        };
        // movimento reduzido: sem partículas, tremor ou zoom — só uma variação suave de luz
        const buildReduced = () => {
          const t = gsap.timeline({ paused: true, onComplete: () => { setPhase('done'); setActIndex(3); } });
          t.add(label(1), 0).to(el.breath, { opacity: 0.3, duration: 1 }, 0).to(el.fire, { opacity: 0.3, duration: 1 }, 0.4)
            .to([el.breath, el.fire], { opacity: 0, duration: 1.2 }, 2).add(label(3), 3.2).to(el.caption, { opacity: 1, y: 0, duration: 0.5 }, 3.2);
          return t;
        };

        const resetScene = () => {
          fx.clear(); audio.stopAll();
          gsap.set(el.camera, { scale: 1, x: 0, y: 0 });
          gsap.set([el.breath, el.fire, el.mouth, el.beak, el.flash, ...el.rings, el.avatar, el.dark], { opacity: 0 });
          gsap.set([el.mouth, el.beak], { scale: 1 });
          gsap.set(el.caption, { opacity: 0, y: 8 });
          setState(el.dragon, 'idleFlight'); setState(el.phoenix, 'idleFlight');
        };

        apiRef.current = {
          start() { tl?.kill(); resetScene(); tl = canMove ? build() : buildReduced(); setPhase('playing'); setActIndex(0); tl.play(0); },
          pause() { tl?.pause(); fx.freeze(true); audio.pauseAll(); setPhase('paused'); },
          resume() { tl?.resume(); fx.freeze(false); audio.resumeAll(); setPhase('playing'); },
          skip() {
            if (!tl) { tl = canMove ? build() : buildReduced(); }
            tl.pause(); fx.clear(); audio.stopAll(); fx.freeze(false);
            tl.seek(tl.duration() - 0.001, true); tl.progress(1, true); // estado final, sem disparar sons nem rajadas
            gsap.set([el.breath, el.fire, el.mouth, el.beak, el.flash, ...el.rings, el.avatar], { opacity: 0 });
            setState(el.dragon, 'retreat'); setState(el.phoenix, 'retreat');
            setPhase('done'); setActIndex(3);
          },
        };

        cleanup = () => {
          window.removeEventListener('pointermove', onMove);
          resizeObserver.disconnect(); visibility.disconnect();
          ambientTweens.forEach(tween => tween.kill());
        };
      }, root);

      return () => {
        timers.forEach(id => window.clearTimeout(id)); timers.clear();
        cleanup();
        if (ticker) gsap.ticker.remove(ticker);
        tl?.kill(); apiRef.current = null;
        ctx.revert();
      };
    }, [ready]);

    useEffect(() => { audioRef.current?.setVolume(volume); }, [volume]);

    const api = () => apiRef.current;
    const running = phase === 'playing';
    const startOrReplay = () => api()?.start();
    const toggleSound = () => { const next = !soundOn; audioRef.current?.setMuted(!next); setSoundOn(next); };
    const actors = config.actors;
    const inspected = inspect && actors[inspect];

    return h('div', { className: 'hc', ref: rootRef, 'data-phase': phase },
      h('div', { className: 'hc__viewport' },
        h('div', { className: 'hc__parallax' }, h('div', { className: 'hc__camera' },
          h('div', { className: 'hc__stage', style: { aspectRatio: `${stage.width} / ${stage.height}` } },
            // Layer 0–6: ambiente (a arte composta enquanto não houver camadas separadas)
            h('img', { className: 'hc__composite', src: assets.composite, alt: 'Um desenvolvedor de capuz observa, de uma varanda, uma arena gótica onde um dragão branco e uma fênix de fogo se enfrentam no céu', draggable: false, decoding: 'async' }),
            h('div', { className: 'hc__mist hc__mist--a', 'aria-hidden': 'true' }), h('div', { className: 'hc__mist hc__mist--b', 'aria-hidden': 'true' }),
            h('div', { className: 'hc__moon-glow', style: pct(anchors.moon), 'aria-hidden': 'true' }),
            h('div', { className: 'hc__arena-glow', style: pct(anchors.arena), 'aria-hidden': 'true' }),
            anchors.torches.map((point, index) => h('i', { key: index, className: 'hc__torch', style: pct(point), 'aria-hidden': 'true' })),
            // Layer 3–4: criaturas
            h(DragonActor, { config: actors.dragon, sprites: assets.actors.dragon, onInspect: setInspect }),
            h(PhoenixActor, { config: actors.phoenix, sprites: assets.actors.phoenix, onInspect: setInspect }),
            // Layer 5: efeitos de fogo e colisão
            h('div', { className: 'hc__breath-light', 'aria-hidden': 'true' }), h('div', { className: 'hc__fire-light', 'aria-hidden': 'true' }),
            h('i', { className: 'hc__mouth-glow', style: pct(anchors.dragonMouth), 'aria-hidden': 'true' }), h('i', { className: 'hc__beak-glow', style: pct(anchors.phoenixBeak), 'aria-hidden': 'true' }),
            h('canvas', { className: 'hc__fx', 'aria-hidden': 'true' }),
            h('i', { className: 'hc__ring', style: pct(anchors.collision), 'aria-hidden': 'true' }), h('i', { className: 'hc__ring', style: pct(anchors.collision), 'aria-hidden': 'true' }),
            h('div', { className: 'hc__flash', style: pct(anchors.collision), 'aria-hidden': 'true' }),
            // Layer 7–8: varanda e avatar (só recebe luz refletida; o desenho original não é movido nem deformado)
            h('div', { className: 'hc__avatar-light', style: { clipPath: `polygon(${polygon})`, WebkitClipPath: `polygon(${polygon})` }, 'aria-hidden': 'true' }),
            h('div', { className: 'hc__dark', 'aria-hidden': 'true' })
          ))),
        h('p', { className: 'hc__caption', 'aria-hidden': 'true' }, actIndex >= 0 ? ACTS[actIndex] : ''),
        h('p', { className: 'hc-sr', role: 'status', 'aria-live': 'polite' }, actIndex >= 0 ? ACTS[actIndex] : ''),
        inspected && h('aside', { className: 'hc__inspect', role: 'dialog', 'aria-label': inspected.label },
          h('strong', null, inspected.label), h('p', null, inspected.meaning),
          inspected.team && h('p', null, `Associado à ${inspected.team}.`),
          h('button', { type: 'button', onClick: () => setInspect(null) }, 'Fechar'))
      ),
      h('div', { className: 'hc__controls', role: 'group', 'aria-label': 'Controles da cena' },
        !gsapOk && h('p', { className: 'hc__warn' }, 'A animação não pôde ser carregada; o conteúdo continua disponível.'),
        h('div', { className: 'hc__buttons' },
          phase === 'idle' && h('button', { type: 'button', className: 'is-primary', onClick: startOrReplay, disabled: !gsapOk || !ready }, '▶ Iniciar a experiência'),
          running && h('button', { type: 'button', onClick: () => api()?.pause() }, '❚❚ Pausar'),
          phase === 'paused' && h('button', { type: 'button', className: 'is-primary', onClick: () => api()?.resume() }, '▶ Retomar'),
          (running || phase === 'paused') && h('button', { type: 'button', onClick: () => api()?.skip() }, '⏭ Pular animação'),
          phase === 'done' && h('button', { type: 'button', onClick: startOrReplay, disabled: !gsapOk }, '↻ Reproduzir novamente'),
          h('a', { className: `hc__link${phase === 'done' ? ' is-primary' : ''}`, href: config.story.linkedin.href, target: '_blank', rel: 'noopener noreferrer' }, config.story.linkedin.label, h('span', { 'aria-hidden': 'true' }, ' ↗')),
          onBack && h('button', { type: 'button', className: 'is-quiet', onClick: onBack }, '← Região')),
        h('p', { className: 'hc__note' }, config.story.disclaimer),
        audioRef.current?.available && h('div', { className: 'hc__sound' },
          h('button', { type: 'button', 'aria-pressed': soundOn, onClick: toggleSound }, soundOn ? '♪ Som ligado' : '✕ Som desligado'),
          h('label', null, h('span', { className: 'hc-sr' }, 'Volume'), h('input', { type: 'range', min: 0, max: 1, step: 0.05, value: volume, onChange: event => setVolume(Number(event.target.value)), 'aria-label': 'Volume dos sons da cena' }))))
    );
  }

  window.HackathonCityScene = HackathonCityScene;
  window.HackathonCityParts = { DragonActor, PhoenixActor, CueAudio, createEffects };
})();
