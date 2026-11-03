// O Estandarte Vivo — Guardião Leão animado com GSAP + React.
// Sprites e coordenadas: window.lionManifest (scripts/prepare-lion-assets.py). Ajustes: window.lionConfig.
(() => {
  if (!window.React || !window.ReactDOM) return;
  const h = window.React.createElement;
  const { useEffect, useRef, useState } = window.React;

  const POSES = { closed34: 'closed-34', roar34: 'roar-34', closedFront: 'closed-front', roarFront: 'roar-front' };
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const rand = (min, max) => min + Math.random() * (max - min);

  function useReducedMotion() {
    const [reduced, setReduced] = useState(() => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
    useEffect(() => {
      const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
      if (!query) return undefined;
      const update = () => setReduced(query.matches);
      query.addEventListener?.('change', update);
      return () => query.removeEventListener?.('change', update);
    }, []);
    return reduced;
  }

  // Rugido com Web Audio. Só toca após clique do visitante; sem `src` configurado nada é baixado.
  class LionAudioManager {
    constructor(config) {
      this.config = config;
      this.available = !!config.src || !!config.synth;
      this.muted = false;
      this.ctx = null; this.gain = null; this.source = null; this.buffer = null; this.raw = null; this.loading = null;
      try { this.muted = localStorage.getItem(config.storageKey) === 'off'; } catch (_) { /* sem persistência */ }
    }
    prime() {
      if (!this.config.src || !this.available || this.loading) return;
      this.loading = fetch(this.config.src)
        .then(response => { if (!response.ok) throw new Error(String(response.status)); return response.arrayBuffer(); })
        // decodifica já no carregamento (contexto offline não exige gesto), para o clique só precisar tocar
        .then(data => { this.raw = data; return new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(2, 1, 44100).decodeAudioData(data.slice(0)); })
        .then(buffer => { this.buffer = buffer; })
        .catch(() => { this.config = { ...this.config, src: null }; this.available = !!this.config.synth; this.onChange?.(); });
    }
    setMuted(value) {
      this.muted = value;
      try { localStorage.setItem(this.config.storageKey, value ? 'off' : 'on'); } catch (_) { /* ignora */ }
      if (value) this.stop();
    }
    // Rugido sintetizado (sem arquivo): vozes graves em dente de serra com rosnado, formantes, sopro, sub-grave e reverberação.
    // Resposta ao impulso de um salão de pedra, gerada em código (reverberação curta).
    getImpulse() {
      const ctx = this.ctx;
      if (!this.impulse) {
        const length = Math.floor(ctx.sampleRate * 1.8);
        this.impulse = ctx.createBuffer(2, length, ctx.sampleRate);
        for (let channel = 0; channel < 2; channel += 1) {
          const samples = this.impulse.getChannelData(channel);
          for (let i = 0; i < length; i += 1) samples[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.6);
        }
      }
      return this.impulse;
    }
    // Toca o trecho configurado da gravação, com saída suave, normalização e um toque de reverberação de salão.
    playFile() {
      const ctx = this.ctx;
      const c = this.config;
      const t0 = ctx.currentTime + 0.02;
      const duration = Math.min(c.duration || this.buffer.duration, this.buffer.duration - (c.start || 0));
      const fade = Math.min(c.fadeOut || 0.6, duration);
      const source = ctx.createBufferSource(); source.buffer = this.buffer;
      const env = ctx.createGain();
      env.gain.setValueAtTime(c.gain || 1, t0);
      env.gain.setValueAtTime(c.gain || 1, t0 + duration - fade);
      env.gain.linearRampToValueAtTime(0, t0 + duration);
      source.connect(env); env.connect(this.gain);
      if (c.reverb > 0) {
        const reverb = ctx.createConvolver(); reverb.buffer = this.getImpulse();
        const wet = ctx.createGain(); wet.gain.value = c.reverb;
        env.connect(reverb); reverb.connect(wet); wet.connect(this.gain);
      }
      source.start(t0, c.start || 0, duration);
      this.source = source;
    }
    synthesize() {
      const ctx = this.ctx;
      const t0 = ctx.currentTime + 0.02;
      const dur = 2.7;
      const attack = this.config.attackAt;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, t0);
      master.gain.exponentialRampToValueAtTime(1, t0 + attack);          // o pico cai em `attackAt`
      master.gain.exponentialRampToValueAtTime(0.6, t0 + 1.1);
      master.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
      const sources = [];

      // corpo: três serras levemente desafinadas descendo de 150 Hz para 52 Hz, com rosnado (AM ~ 33 Hz)
      const voice = ctx.createGain();
      const growl = ctx.createGain(); growl.gain.value = 0.62;
      const lfo = ctx.createOscillator(); lfo.frequency.value = 33; sources.push(lfo);
      const lfoDepth = ctx.createGain(); lfoDepth.gain.value = 0.38;
      lfo.connect(lfoDepth); lfoDepth.connect(growl.gain);
      voice.connect(growl);
      [0, -17, 11].forEach((detune, index) => {
        const osc = ctx.createOscillator(); sources.push(osc);
        osc.type = 'sawtooth'; osc.detune.value = detune;
        osc.frequency.setValueAtTime(150 + index * 4, t0);
        osc.frequency.exponentialRampToValueAtTime(92, t0 + 0.45);
        osc.frequency.exponentialRampToValueAtTime(52, t0 + dur);
        const g = ctx.createGain(); g.gain.value = 0.34;
        osc.connect(g); g.connect(voice);
      });

      // formantes de uma boca aberta
      const formants = ctx.createGain();
      [[720, 380, 5, 0.9], [1250, 820, 7, 0.55], [2500, 1700, 8, 0.25]].forEach(([from, to, q, level]) => {
        const band = ctx.createBiquadFilter(); band.type = 'bandpass'; band.Q.value = q;
        band.frequency.setValueAtTime(from, t0); band.frequency.exponentialRampToValueAtTime(to, t0 + dur);
        const g = ctx.createGain(); g.gain.value = level;
        growl.connect(band); band.connect(g); g.connect(formants);
      });
      growl.connect(formants);

      // sopro (ar atravessando a garganta)
      const noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource(); noise.buffer = noiseBuffer; sources.push(noise);
      const noiseBand = ctx.createBiquadFilter(); noiseBand.type = 'bandpass'; noiseBand.frequency.value = 950; noiseBand.Q.value = 0.8;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.0001, t0);
      noiseGain.gain.exponentialRampToValueAtTime(0.5, t0 + attack);
      noiseGain.gain.exponentialRampToValueAtTime(0.0008, t0 + 1.5);
      noise.connect(noiseBand); noiseBand.connect(noiseGain); noiseGain.connect(formants);

      // impacto: sub-grave que cai
      const sub = ctx.createOscillator(); sub.type = 'sine'; sources.push(sub);
      sub.frequency.setValueAtTime(74, t0); sub.frequency.exponentialRampToValueAtTime(38, t0 + 0.9);
      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.0001, t0);
      subGain.gain.exponentialRampToValueAtTime(0.9, t0 + attack * 0.8);
      subGain.gain.exponentialRampToValueAtTime(0.0008, t0 + 1.0);
      sub.connect(subGain);

      // saturação suave + corte de agudos
      const shaper = ctx.createWaveShaper();
      const curve = new Float32Array(1024);
      for (let i = 0; i < curve.length; i += 1) { const x = (i / (curve.length - 1)) * 2 - 1; curve[i] = Math.tanh(x * 3.2); }
      shaper.curve = curve; shaper.oversample = '2x';
      const tone = ctx.createBiquadFilter(); tone.type = 'lowpass'; tone.frequency.value = 3800;
      formants.connect(shaper); subGain.connect(shaper); shaper.connect(tone); tone.connect(master);

      // reverberação curta de salão gótico (resposta ao impulso gerada em código)
      const reverb = ctx.createConvolver(); reverb.buffer = this.getImpulse();
      const wet = ctx.createGain(); wet.gain.value = 0.3;
      const dry = ctx.createGain(); dry.gain.value = 0.85;
      master.connect(dry); dry.connect(this.gain);
      master.connect(reverb); reverb.connect(wet); wet.connect(this.gain);

      const stopAt = t0 + dur + 0.1;
      sources.forEach(node => { node.start(t0); node.stop(stopAt); });
      this.source = {
        stop: () => {
          try {
            master.gain.cancelScheduledValues(ctx.currentTime);
            master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.05);
            sources.forEach(node => { try { node.stop(ctx.currentTime + 0.25); } catch (_) { /* já encerrado */ } });
          } catch (_) { /* ignora */ }
        },
      };
    }
    async play() {
      if (!this.available || this.muted) return false;
      try {
        if (!this.ctx) {
          this.ctx = new (window.AudioContext || window.webkitAudioContext)();
          this.gain = this.ctx.createGain();
          this.gain.gain.value = this.config.volume;
          const limiter = this.ctx.createDynamicsCompressor();
          limiter.threshold.value = -8; limiter.knee.value = 6; limiter.ratio.value = 14;
          limiter.attack.value = 0.003; limiter.release.value = 0.2;
          this.gain.connect(limiter); limiter.connect(this.ctx.destination);
        }
        if (this.ctx.state === 'suspended') await this.ctx.resume();
        if (!this.config.src) { this.stop(); this.synthesize(); return true; }
        if (!this.buffer) { await this.loading; if (!this.buffer) { if (this.config.synth) { this.stop(); this.synthesize(); return true; } return false; } }
        this.stop();
        this.playFile();
        return true;
      } catch (_) { return false; }
    }
    stop() { try { this.source?.stop(); } catch (_) { /* já parou */ } this.source = null; }
    dispose() { this.stop(); this.ctx?.close?.().catch(() => {}); this.ctx = null; }
  }

  function LivingLionGuardian({ shakeSelector = '.legacy-editorial__panel', className = '' }) {
    const manifest = window.lionManifest;
    const config = window.lionConfig;
    const reduced = useReducedMotion();
    const rootRef = useRef(null);
    const buttonRef = useRef(null);
    const audioRef = useRef(null);
    const [loaded, setLoaded] = useState(false);
    const [soundOn, setSoundOn] = useState(true);
    const [soundAvailable, setSoundAvailable] = useState(false);
    const [announce, setAnnounce] = useState('');
    const usable = !!(manifest && config);
    const base = config?.assetBase || '';
    const url = file => `${base}${file}`;

    // Carrega os sprites só quando o leão se aproxima da tela e decodifica antes de qualquer troca de pose.
    useEffect(() => {
      if (!usable || !rootRef.current) return undefined;
      const files = [...Object.values(manifest.poses).flatMap(pose => Object.values(pose)), ...Object.values(manifest.mane),
        ...Object.values(manifest.eyes).flatMap(eye => [eye.socket, eye.iris, eye.lid, eye.mask, eye.lidMask])];
      let cancelled = false;
      const observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        audioRef.current?.prime();
        Promise.all(files.map(file => { const image = new Image(); image.src = url(file); return image.decode?.().catch(() => {}); }))
          .then(() => { if (!cancelled) setLoaded(true); });
      }, { rootMargin: '300px' });
      observer.observe(rootRef.current);
      return () => { cancelled = true; observer.disconnect(); };
    }, [usable]);

    useEffect(() => {
      if (!usable) return undefined;
      const audio = new LionAudioManager(config.audio);
      audio.onChange = () => setSoundAvailable(audio.available);
      audioRef.current = audio;
      setSoundAvailable(audio.available);
      setSoundOn(!audio.muted);
      return () => { audio.dispose(); audioRef.current = null; };
    }, [usable]);

    // Toda a animação vive aqui; gsap.context garante que nenhuma timeline sobreviva à desmontagem.
    useEffect(() => {
      const gsap = window.gsap;
      const root = rootRef.current;
      if (!usable || !loaded || !gsap || !root) return undefined;
      const cfg = config.animation;
      const q = selector => root.querySelector(selector);
      const qa = selector => [...root.querySelectorAll(selector)];
      const el = {
        stage: q('.lion__stage'), breath: q('.lion__breath'), roarWrap: q('.lion__roar'), sway: q('.lion__sway'), head: q('.lion__head'),
        flash: q('.lion__flash'), aura: q('.lion__aura'), mane: qa('.lion__mane'), maneFollow: qa('.lion__mane-follow'), eyes: q('.lion__eyes'),
        iris: { l: q('[data-eye="l"] .lion__iris'), r: q('[data-eye="r"] .lion__iris') },
        lids: qa('.lion__lid-img'), poses: Object.fromEntries(qa('.lion__pose').map(node => [node.dataset.pose, node])),
      };
      const state = { name: 'idle', busy: false, unit: 1, look: { x: 0, y: 0 }, touchTimer: 0, blinkTimer: 0, rafId: 0, pointer: null, entered: false };
      const timers = new Set();
      const cleanups = [];
      let ctx = null;
      // callbacks tardios rodam dentro do contexto, para que as timelines criadas por eles sejam revertidas na desmontagem
      const later = (fn, seconds) => { const id = window.setTimeout(() => { timers.delete(id); ctx?.add(fn); }, seconds * 1000); timers.add(id); return id; };
      const setState = name => { state.name = name; el.stage.dataset.state = name; };
      const pivot = `${manifest.pivot.x}% ${manifest.pivot.y}%`;
      const canMove = !reduced;

      ctx = gsap.context(() => {
        gsap.set([el.head, el.sway, el.roarWrap], { transformOrigin: '50% 58%' });
        gsap.set(el.breath, { transformOrigin: '50% 72%' });
        gsap.set([...el.mane, ...el.maneFollow], { transformOrigin: pivot });
        gsap.set(el.lids, { yPercent: -100 });
        gsap.set(el.flash, { opacity: 0 });
        setState('idle');

        const idleTweens = [];
        const track = tween => { idleTweens.push(tween); return tween; };
        const updateUnit = () => { state.unit = el.stage.getBoundingClientRect().width / manifest.canvas; };
        updateUnit();
        const resizeObserver = new ResizeObserver(updateUnit);
        resizeObserver.observe(el.stage);

        // ---- Respiração, oscilação da cabeça e juba (autônomas) ----
        const startIdle = () => {
          if (!canMove) return;
          track(gsap.to(el.breath, { scale: cfg.breath.scale, y: -cfg.breath.lift * state.unit, duration: cfg.breath.duration, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
          const drift = () => {
            if (state.busy) return;
            const s = cfg.sway;
            track(gsap.to(el.sway, {
              rotationY: rand(-s.rotateY, s.rotateY), rotationX: rand(-s.rotateX, s.rotateX), rotation: rand(-s.rotateZ, s.rotateZ),
              x: rand(-s.x, s.x) * state.unit, y: rand(-s.y, s.y) * state.unit,
              duration: rand(s.min, s.max), ease: 'sine.inOut', onComplete: drift,
            }));
          };
          drift();
          el.mane.forEach((layer, index) => {
            const m = cfg.mane;
            const wave = () => {
              if (state.busy) return;
              track(gsap.to(layer, {
                rotation: rand(-m.rotation, m.rotation), x: rand(-m.x, m.x) * state.unit, y: rand(-m.y, m.y) * state.unit,
                duration: rand(m.min, m.max), ease: 'sine.inOut', onComplete: wave,
              }));
            };
            later(wave, index * 0.45); // atraso entre as mechas
          });
        };
        const stopIdle = () => {
          idleTweens.splice(0).forEach(tween => tween.kill());
          gsap.to([el.sway, el.breath], { rotationX: 0, rotationY: 0, rotation: 0, x: 0, y: 0, scale: 1, duration: 0.25, overwrite: true });
        };

        // ---- Olhar e cabeça acompanham o cursor (sem re-render do React) ----
        const lookTo = {
          irisLX: gsap.quickTo(el.iris.l, 'x', { duration: cfg.gaze.followDuration, ease: 'power3.out' }),
          irisLY: gsap.quickTo(el.iris.l, 'y', { duration: cfg.gaze.followDuration, ease: 'power3.out' }),
          irisRX: gsap.quickTo(el.iris.r, 'x', { duration: cfg.gaze.followDuration, ease: 'power3.out' }),
          irisRY: gsap.quickTo(el.iris.r, 'y', { duration: cfg.gaze.followDuration, ease: 'power3.out' }),
          headRY: gsap.quickTo(el.head, 'rotationY', { duration: cfg.head.followDuration, ease: 'power3.out' }),
          headRX: gsap.quickTo(el.head, 'rotationX', { duration: cfg.head.followDuration, ease: 'power3.out' }),
          headRZ: gsap.quickTo(el.head, 'rotation', { duration: cfg.head.followDuration, ease: 'power3.out' }),
          headX: gsap.quickTo(el.head, 'x', { duration: cfg.head.followDuration, ease: 'power3.out' }),
        };
        // a juba responde com atraso e em amplitude menor que a cabeça
        const maneFollow = el.maneFollow.map((layer, index) => ({
          rotation: gsap.quickTo(layer, 'rotation', { duration: cfg.mane.followDuration + index * 0.12, ease: 'power2.out' }),
        }));
        const applyLook = (nx, ny) => {
          const g = cfg.gaze.max * state.unit;
          lookTo.irisLX(nx * g); lookTo.irisLY(ny * g * 0.7);
          lookTo.irisRX(nx * g * 0.6); lookTo.irisRY(ny * g * 0.5);
          lookTo.headRY(nx * cfg.head.rotateY); lookTo.headRX(-ny * cfg.head.rotateX);
          lookTo.headRZ(nx * cfg.head.rotateZ); lookTo.headX(nx * cfg.head.shift * state.unit);
          maneFollow.forEach(entry => entry.rotation(-nx * cfg.mane.followRotation));
        };
        const onPointerMove = event => { state.pointer = event; if (!state.rafId) state.rafId = requestAnimationFrame(trackPointer); };
        const trackPointer = () => {
          state.rafId = 0;
          const event = state.pointer;
          if (!event || state.busy) return;
          const rect = el.stage.getBoundingClientRect();
          const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width * 0.5 * cfg.gaze.radius);
          const dy = (event.clientY - (rect.top + rect.height * 0.5)) / (rect.height * 0.5 * cfg.gaze.radius);
          const dist = Math.hypot(dx, dy);
          const inside = dist < 1;
          const fade = 1 - clamp((dist - 1) / 0.5, 0, 1); // fora do alcance o olhar volta ao centro gradualmente
          applyLook(clamp(dx, -1, 1) * fade, clamp(dy, -1, 1) * fade);
          if (state.name === 'idle' && inside) setState('observing');
          else if (state.name === 'observing' && !inside) setState('idle');
        };
        const finePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;
        if (canMove && finePointer) window.addEventListener('pointermove', onPointerMove, { passive: true });
        const glance = () => {
          if (!state.busy) { applyLook(rand(-0.8, 0.8), rand(-0.5, 0.5)); later(() => !state.busy && applyLook(0, 0), rand(1.1, 2)); }
          state.touchTimer = later(glance, rand(cfg.touchGlance.min, cfg.touchGlance.max));
        };
        if (canMove && !finePointer) state.touchTimer = later(glance, 2.2);

        // ---- Piscar (pálpebra de pelo sobre o olho; nunca comprime a imagem) ----
        const blink = () => {
          const b = cfg.blink;
          if (!state.busy && state.name !== 'roaring' && el.poses.closed34.style.opacity !== '0') {
            gsap.timeline().to(el.lids, { yPercent: 0, duration: b.close, ease: 'power2.in' })
              .to(el.lids, { yPercent: -100, duration: b.open, ease: 'power2.out' }, `+=${b.hold}`);
          }
          state.blinkTimer = later(blink, rand(b.min, b.max));
        };
        if (canMove && cfg.blink.enabled) state.blinkTimer = later(blink, rand(1.2, 3));

        // ---- Trocas de pose escondidas por um clarão curto (nunca crossfade entre rostos diferentes) ----
        const showPose = name => {
          Object.entries(el.poses).forEach(([key, node]) => { node.style.opacity = key === name ? '1' : '0'; });
          const idleFamily = name === 'closed34' || name === 'roar34';
          el.mane.forEach(layer => { layer.style.opacity = idleFamily ? '1' : '0'; });
          el.eyes.style.opacity = name === 'closed34' ? '1' : '0';
        };
        const cut = (name, strength = 1) => {
          showPose(name);
          if (canMove && cfg.roar.flash > 0) gsap.fromTo(el.flash, { opacity: cfg.roar.flash * strength }, { opacity: 0, duration: 0.2, ease: 'power2.out', overwrite: true });
        };

        // ---- Impacto: tremor curto e amortecido no palco e na moldura da seção ----
        const impact = () => {
          const panel = root.closest(shakeSelector);
          if (panel) { panel.classList.add('is-lion-impact'); later(() => panel.classList.remove('is-lion-impact'), 0.55); }
          if (!canMove) return;
          const shake = (target, amplitude) => {
            if (!target) return;
            const tl = gsap.timeline({ onComplete: () => gsap.set(target, { clearProps: 'x,y' }) });
            for (let i = 0; i < 7; i += 1) {
              const decay = 1 - i / 7;
              tl.to(target, { x: rand(-1, 1) * amplitude * decay, y: rand(-0.6, 0.6) * amplitude * decay, duration: cfg.impact.duration / 9, ease: 'none' });
            }
            tl.to(target, { x: 0, y: 0, duration: cfg.impact.duration / 4, ease: 'power2.out' });
          };
          shake(el.stage, cfg.impact.amplitude);
          shake(panel, cfg.impact.frameAmplitude);
          gsap.fromTo(el.aura, { opacity: 1, scale: 1.18 }, { opacity: 0.55, scale: 1, duration: 0.9, ease: 'power2.out', overwrite: true });
        };

        // ---- O grande rugido ----
        const finishRoar = () => {
          state.busy = false;
          buttonRef.current?.removeAttribute('aria-disabled');
          setState('idle');
          showPose('closed34');
          startIdle();
          if (canMove && finePointer && state.pointer) trackPointer();
        };
        const roar = ({ silent = false, entrance = false } = {}) => {
          if (state.busy) return;
          state.busy = true;
          buttonRef.current?.setAttribute('aria-disabled', 'true');
          setState('preparingRoar');
          stopIdle();
          lookTo.irisLX(0); lookTo.irisLY(0); lookTo.irisRX(0); lookTo.irisRY(0);
          if (!silent) setAnnounce('O guardião ruge.');
          const r = cfg.roar;
          const front = r.frontPose && !entrance;
          const peakPose = front ? 'roarFront' : 'roar34';

          if (!canMove) { // movimento reduzido: sem tremor nem deslocamento — só a pose de rugido e um brilho suave
            cut(peakPose, 0);
            setState('roaring');
            if (!silent) audioRef.current?.play();
            impact();
            later(() => { showPose('closed34'); setState('recovering'); later(finishRoar, 0.4); }, 1.4);
            return;
          }

          const tl = gsap.timeline({ onComplete: finishRoar });
          const T1 = entrance ? 0.18 : r.recoil;
          // 1. olha para o visitante e recua, juntando a juba
          lookTo.headRY(0); lookTo.headRX(3); lookTo.headRZ(0); lookTo.headX(0);
          maneFollow.forEach(entry => entry.rotation(0));
          tl.to(el.breath, { scale: 0.955, y: 12 * state.unit, duration: T1, ease: 'power2.out' }, 0)
            .to(el.mane, { scale: 0.985, rotation: 0, x: 0, y: 0, duration: T1, ease: 'power2.out' }, 0);
          let tAttack = T1;
          if (front) {
            tl.add(() => cut('closedFront', 0.7), T1);                       // vira de frente (corte sob o clarão)
            tAttack = T1 + r.stare;                                           // encara por um instante
          }
          // 2. avança com força e a boca abre
          tl.add(() => { setState('roaring'); cut(peakPose, 1); impact(); }, tAttack)
            .to(el.breath, { scale: front ? 1.1 : 1.06, y: -6 * state.unit, duration: 0.12, ease: 'power4.out' }, tAttack - 0.04);
          if (!silent) {
            const audioDelay = Math.max(0, tAttack - config.audio.attackAt);
            tl.add(() => { audioRef.current?.play(); }, audioDelay);          // o pico do áudio cai no instante em que a boca abre
          }
          // 3. rugido sustentado: vibração curta + a juba é lançada
          tl.to(el.roarWrap, { x: 3 * state.unit, y: -2 * state.unit, rotation: 0.6, duration: 0.045, repeat: Math.round(r.hold / 0.045), yoyo: true, ease: 'none' }, tAttack)
            .fromTo(el.mane, { scale: 1.03 }, { scale: 1.015, duration: r.hold, ease: 'sine.out', stagger: 0.03 }, tAttack);
          // 4. recuperação
          const tRecover = tAttack + r.hold;
          tl.add(() => setState('recovering'), tRecover)
            .to(el.roarWrap, { x: 0, y: 0, rotation: 0, duration: 0.35, ease: 'power2.out' }, tRecover)
            .to(el.breath, { scale: 1, y: 0, duration: r.recover * 0.55, ease: 'power2.out' }, tRecover)
            .add(() => {
              cut('closed34', 0.6);
              gsap.fromTo(el.mane, { scale: 1.035, rotation: i => [-1.4, 1.4, -0.9, 0.9][i % 4] }, { scale: 1, rotation: 0, duration: r.recover, ease: 'elastic.out(1,0.45)', stagger: 0.04 });
            }, tRecover + 0.3);
          tl.to({}, { duration: 0.2 }, tRecover + r.recover); // folga antes de liberar novo clique
        };
        const onClick = () => ctx.add(() => roar({ silent: false }));
        buttonRef.current?.addEventListener('click', onClick);

        // ---- Entrada: aparece com força e dá um rugido visual silencioso ----
        const entranceObserver = new IntersectionObserver(entries => {
          if (state.entered || !entries.some(entry => entry.isIntersecting)) return;
          state.entered = true;
          entranceObserver.disconnect();
          ctx.add(runEntrance);
        }, { threshold: 0.4 });
        const runEntrance = () => {
          showPose('closed34');
          if (!canMove) { gsap.set(el.stage, { opacity: 1 }); startIdle(); return; }
          gsap.fromTo(el.stage, { opacity: 0, scale: 0.84, y: 26 * state.unit }, {
            opacity: 1, scale: 1, y: 0, duration: cfg.entrance.duration, ease: 'power3.out',
            onComplete: () => { if (cfg.entrance.silentRoar) roar({ silent: true, entrance: true }); else startIdle(); },
          });
          gsap.fromTo(el.aura, { opacity: 0, scale: 0.7 }, { opacity: 0.55, scale: 1, duration: cfg.entrance.duration * 1.2, ease: 'power2.out' });
        };
        gsap.set(el.stage, { opacity: 0 });
        entranceObserver.observe(root);

        cleanups.push(() => {
          window.removeEventListener('pointermove', onPointerMove);
          buttonRef.current?.removeEventListener('click', onClick);
          cancelAnimationFrame(state.rafId);
          entranceObserver.disconnect();
          resizeObserver.disconnect();
        });
      }, root);

      return () => {
        timers.forEach(id => window.clearTimeout(id));
        timers.clear();
        cleanups.forEach(fn => fn());
        ctx.revert();
      };
    }, [usable, loaded, reduced]);

    if (!usable) return null;
    const eyeData = Object.entries(manifest.eyes);
    const eyeStyle = eye => ({ left: `${eye.box[0]}%`, top: `${eye.box[1]}%`, width: `${eye.box[2]}%`, height: `${eye.box[3]}%` });
    const maskStyle = file => ({ WebkitMaskImage: `url(${url(file)})`, maskImage: `url(${url(file)})` });
    const toggleSound = () => { const next = !soundOn; audioRef.current?.setMuted(!next); setSoundOn(next); };

    return h('div', { className: `lion ${className}`, ref: rootRef, 'data-ready': loaded ? 'true' : 'false' },
      h('div', { className: 'lion__aura', 'aria-hidden': 'true' }),
      h('button', { type: 'button', className: 'lion__button', ref: buttonRef, 'aria-label': 'Fazer o guardião rugir', 'aria-describedby': 'lion-hint' },
        h('div', { className: 'lion__stage', 'data-state': 'idle', 'aria-hidden': 'true' },
          h('div', { className: 'lion__breath' }, h('div', { className: 'lion__roar' }, h('div', { className: 'lion__sway' }, h('div', { className: 'lion__head' },
            loaded && Object.entries(POSES).map(([key, file]) => h('img', {
              key, className: 'lion__pose', 'data-pose': key, alt: '', draggable: false, decoding: 'async',
              src: url(key.endsWith('34') ? manifest.poses.threeQuarter[key === 'closed34' ? 'closed' : 'roar'] : manifest.poses.front[key === 'closedFront' ? 'closed' : 'roar']),
              style: { opacity: key === 'closed34' ? 1 : 0 },
            })),
            loaded && Object.entries(manifest.mane).map(([key, file]) => h('div', { key: `m-${key}`, className: 'lion__mane-follow' }, h('img', { className: 'lion__mane', alt: '', draggable: false, src: url(file) }))),
            loaded && h('div', { className: 'lion__eyes' }, eyeData.map(([side, eye]) => h('div', { key: side, className: 'lion__eye-wrap', style: eyeStyle(eye) },
              h('div', { className: 'lion__eye', 'data-eye': side, style: maskStyle(eye.mask) },
                h('img', { className: 'lion__socket', alt: '', draggable: false, src: url(eye.socket) }),
                h('img', { className: 'lion__iris', alt: '', draggable: false, src: url(eye.iris) })),
              h('div', { className: 'lion__lid', style: maskStyle(eye.lidMask) },
                h('img', { className: 'lion__lid-img', alt: '', draggable: false, src: url(eye.lid) })))))
          )))),
          h('div', { className: 'lion__flash' })
        )
      ),
      h('p', { id: 'lion-hint', className: 'lion__hint' }, 'Clique no guardião para despertá-lo'),
      soundAvailable && h('button', { type: 'button', className: 'lion__sound', 'aria-pressed': soundOn, onClick: toggleSound },
        h('span', { 'aria-hidden': 'true' }, soundOn ? '♪' : '✕'), soundOn ? 'Som do rugido: ligado' : 'Som do rugido: desligado'),
      h('p', { className: 'lion-sr', role: 'status', 'aria-live': 'polite' }, announce)
    );
  }

  window.LivingLionGuardian = LivingLionGuardian;
})();
