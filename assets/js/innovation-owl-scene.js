// O Despertar da Coruja Mecânica — cena exclusiva da crônica de interfaces com IA.
(() => {
  if (!window.React) return;
  const h = window.React.createElement;
  const { useCallback, useEffect, useRef, useState } = window.React;
  const ROOT = 'assets/img/Portais/Captulo IV/';
  const ART = {
    workshop: `${ROOT}Imagem do ChatGPT 19 de out. de 2026, 21_19_23-1.png`,
    avatarTyping: `${ROOT}Imagem do ChatGPT 19 de out. de 2026, 21_19_24-2.png`,
    avatarReacting: `${ROOT}Imagem do ChatGPT 19 de out. de 2026, 21_19_26-3.png`,
    gnomeBuilding: `${ROOT}Imagem do ChatGPT 19 de out. de 2026, 21_19_27-4.png`,
    gnomeProud: `${ROOT}Imagem do ChatGPT 19 de out. de 2026, 21_19_29-5.png`,
    owlFlying: `${ROOT}Imagem do ChatGPT 19 de out. de 2026, 21_19_30-6.png`,
    owlPerched: `${ROOT}Imagem do ChatGPT 19 de out. de 2026, 21_19_31-7.png`,
  };

  function useOwlAnimation(refs) {
    const animations = useRef([]);
    const autoPaused = useRef(false);
    const [state, setState] = useState('playing');
    const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const clear = useCallback(() => {
      animations.current.forEach(animation => animation.cancel());
      animations.current = [];
    }, []);
    const animate = useCallback((element, frames, options) => {
      if (!element) return null;
      const animation = element.animate(frames, { fill: 'forwards', easing: 'ease-in-out', ...options });
      animations.current.push(animation);
      return animation;
    }, []);
    const skipToEnd = useCallback(() => {
      animations.current.forEach(animation => animation.finish());
      setState('complete');
    }, []);
    const play = useCallback(() => {
      clear();
      const { scene, avatarTyping, avatarReacting, gnomeBuilding, gnomeProud, activation, owlFlying, owlPerched } = refs.current;
      if (!scene) return;
      if (reduced()) {
        [avatarReacting, gnomeBuilding, activation, owlFlying].forEach(element => { if (element) element.style.opacity = '0'; });
        [avatarTyping, gnomeProud, owlPerched].forEach(element => { if (element) element.style.opacity = '1'; });
        setState('complete');
        return;
      }
      [avatarTyping, gnomeBuilding].forEach(element => { if (element) element.style.opacity = '1'; });
      [avatarReacting, gnomeProud, activation, owlFlying, owlPerched].forEach(element => { if (element) element.style.opacity = '0'; });
      setState('playing');

      animate(avatarTyping, [
        { transform: 'translateY(0)' }, { transform: 'translateY(2px)', offset: .22 },
        { transform: 'translateY(0)', offset: .45 }, { transform: 'translateY(1px)', offset: .72 }, { transform: 'translateY(0)' },
      ], { duration: 8000 });
      animate(gnomeBuilding, [
        { opacity: 1, transform: 'translateY(0) rotate(0deg)' },
        { opacity: 1, transform: 'translateY(-2px) rotate(-.35deg)', offset: .22 },
        { opacity: 1, transform: 'translateY(1px) rotate(.2deg)', offset: .35 },
        { opacity: 0, transform: 'translateY(3px) rotate(0deg)', offset: .43 }, { opacity: 0 },
      ], { duration: 10000 });
      animate(activation, [
        { opacity: 0, transform: 'scale(.45)' }, { opacity: 0, transform: 'scale(.45)', offset: .24 },
        { opacity: .95, transform: 'scale(1)', offset: .34 }, { opacity: 0, transform: 'scale(1.35)', offset: .46 }, { opacity: 0 },
      ], { duration: 10000 });
      animate(gnomeProud, [
        { opacity: 0, transform: 'translateX(8px)' }, { opacity: 0, offset: .34 },
        { opacity: 1, transform: 'translateX(0)', offset: .45 }, { opacity: 1 },
      ], { duration: 10000 });

      const sceneBox = scene.getBoundingClientRect();
      const flyingBox = owlFlying.getBoundingClientRect();
      const perchBox = owlPerched.getBoundingClientRect();
      const endX = perchBox.left + perchBox.width * .5 - (flyingBox.left + flyingBox.width * .5);
      const endY = perchBox.top + perchBox.height * .4 - (flyingBox.top + flyingBox.height * .5);
      const path = Array.from({ length: 13 }, (_, index) => {
        const t = index / 12;
        const inv = 1 - t;
        const x = inv ** 3 * 0 + 3 * inv ** 2 * t * (-sceneBox.width * .18) + 3 * inv * t ** 2 * (endX + sceneBox.width * .18) + t ** 3 * endX;
        const y = inv ** 3 * 0 + 3 * inv ** 2 * t * (-sceneBox.height * .42) + 3 * inv * t ** 2 * (endY - sceneBox.height * .22) + t ** 3 * endY;
        const lift = Math.sin(t * Math.PI * 6) * (1 - t) * 5;
        return { opacity: index === 0 || index === 12 ? 0 : 1, transform: `translate3d(${x}px,${y + lift}px,0) rotate(${(-10 + t * 18).toFixed(2)}deg) scale(${(.88 + t * .12).toFixed(3)})`, offset: t };
      });
      animate(owlFlying, path, { duration: 4000, delay: 4000, easing: 'cubic-bezier(.3,.05,.2,1)' });
      const landing = animate(owlPerched, [
        { opacity: 0, transform: 'translateY(-10px) scale(.92)' }, { opacity: 0, offset: .72 },
        { opacity: 1, transform: 'translateY(2px) scale(1.02)', offset: .82 },
        { opacity: 1, transform: 'translateY(0) scale(1)' },
      ], { duration: 10000 });
      animate(avatarReacting, [
        { opacity: 0 }, { opacity: 0, offset: .78 }, { opacity: 1, offset: .84 },
        { opacity: 1, offset: .91 }, { opacity: 0, offset: .98 }, { opacity: 0 },
      ], { duration: 10000 });
      landing.onfinish = () => setState('complete');
    }, [animate, clear, refs]);
    const pause = useCallback(() => { animations.current.forEach(animation => animation.pause()); setState('paused'); }, []);
    const resume = useCallback(() => { animations.current.forEach(animation => animation.play()); setState('playing'); }, []);

    useEffect(() => {
      const frame = requestAnimationFrame(play);
      return () => { cancelAnimationFrame(frame); clear(); };
    }, [clear, play]);
    useEffect(() => {
      const scene = refs.current.scene;
      if (!scene || !window.IntersectionObserver) return undefined;
      const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting && state === 'playing') { autoPaused.current = true; animations.current.forEach(a => a.pause()); }
        else if (entry.isIntersecting && autoPaused.current) { autoPaused.current = false; animations.current.forEach(a => a.play()); }
      }, { threshold: .12 });
      observer.observe(scene);
      return () => observer.disconnect();
    }, [refs, state]);
    return { state, play, pause, resume, restart: play, skipToEnd };
  }

  function InnovationOwlScene({ caption = 'O Despertar da Coruja Mecânica' }) {
    const refs = useRef({});
    const timeline = useOwlAnimation(refs);
    const setRef = key => element => { refs.current[key] = element; };
    const reactOwl = () => {
      if (timeline.state !== 'complete') return;
      refs.current.owlPerched?.animate([
        { transform: 'rotate(0)' }, { transform: 'rotate(-5deg) translateY(-2px)' },
        { transform: 'rotate(4deg)' }, { transform: 'rotate(0)' },
      ], { duration: 700, easing: 'ease-in-out' });
    };
    const toggle = timeline.state === 'paused' ? timeline.resume : timeline.pause;
    return h('figure', { className: `innovation-owl${timeline.state === 'complete' ? ' is-complete' : ''}`, ref: setRef('scene'), 'aria-label': 'Cena animada: um gnomo ativa uma coruja mecânica, que voa e pousa no ombro do desenvolvedor' },
      h('img', { className: 'innovation-owl__background', src: ART.workshop, alt: '', 'aria-hidden': 'true', decoding: 'async' }),
      h('div', { className: 'innovation-owl__avatar' },
        h('img', { ref: setRef('avatarTyping'), src: ART.avatarTyping, alt: 'Desenvolvedor de moletom preto programando no notebook', decoding: 'async' }),
        h('img', { ref: setRef('avatarReacting'), className: 'innovation-owl__avatar-reaction', src: ART.avatarReacting, alt: '', 'aria-hidden': 'true', decoding: 'async' }),
        h('button', { ref: setRef('owlPerched'), className: 'innovation-owl__perched', type: 'button', onClick: reactOwl, disabled: timeline.state !== 'complete', 'aria-label': 'Coruja mecânica pousada — fazê-la reagir' },
          h('img', { src: ART.owlPerched, alt: '', 'aria-hidden': 'true', decoding: 'async' })
        )
      ),
      h('img', { ref: setRef('gnomeBuilding'), className: 'innovation-owl__gnome innovation-owl__gnome--building', src: ART.gnomeBuilding, alt: 'Gnomo inventor ajustando a coruja mecânica', decoding: 'async' }),
      h('img', { ref: setRef('gnomeProud'), className: 'innovation-owl__gnome innovation-owl__gnome--proud', src: ART.gnomeProud, alt: '', 'aria-hidden': 'true', decoding: 'async' }),
      h('span', { ref: setRef('activation'), className: 'innovation-owl__activation', 'aria-hidden': 'true' }),
      h('img', { ref: setRef('owlFlying'), className: 'innovation-owl__flying', src: ART.owlFlying, alt: '', 'aria-hidden': 'true', decoding: 'async' }),
      h('div', { className: 'innovation-owl__controls' },
        timeline.state !== 'complete' && h('button', { type: 'button', onClick: toggle }, timeline.state === 'paused' ? '▶ Continuar' : '❚❚ Pausar'),
        timeline.state !== 'complete' && h('button', { type: 'button', onClick: timeline.skipToEnd }, 'Pular animação'),
        timeline.state === 'complete' && h('button', { type: 'button', onClick: timeline.restart }, '↻ Assistir novamente')
      ),
      h('figcaption', null, caption)
    );
  }

  window.InnovationOwlScene = InnovationOwlScene;
})();
