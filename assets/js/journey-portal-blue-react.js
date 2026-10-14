(() => {
  const mounts = [...document.querySelectorAll('[data-portal-art]')];
  if (!mounts.length || !window.React || !window.ReactDOM) return;

  const h = window.React.createElement;
  const portalAssets = {
    azul: { frame: 'assets/img/Portais/moldura-azul.png.png', vortex: 'assets/img/Portais/vortice-azul.png.png', width: 1086, height: 1448 },
    laranja: { frame: 'assets/img/Portais/moldura-laranja.png', vortex: 'assets/img/Portais/vortice-laranja.png', width: 1086, height: 1448 },
    roxo: { frame: 'assets/img/Portais/moldura-roxo.png', vortex: 'assets/img/Portais/vortice-roxo.png', width: 384, height: 512 },
    vermelho: { frame: 'assets/img/Portais/moldura-vermelho.png', vortex: 'assets/img/Portais/vortice-vermelho.png', width: 384, height: 512 },
    dourado: { frame: 'assets/img/Portais/moldura-dourado.png', vortex: 'assets/img/Portais/vortice-dourado.png', width: 384, height: 512 },
  };
  const particles = [
    ['18%', '68%', '-0.4s'], ['29%', '34%', '-1.7s'], ['42%', '78%', '-2.6s'],
    ['55%', '25%', '-0.9s'], ['67%', '58%', '-2.1s'], ['79%', '42%', '-1.2s'], ['84%', '73%', '-3.1s'],
  ];

  function MagicPortal({ color }) {
    const asset = portalAssets[color];
    if (!asset) return null;

    return h(
      'span',
      { className: `journey-gate__arch journey-gate__arch--art journey-gate__arch--${color}` },
      h(
        'span',
        { className: 'journey-gate__opening journey-gate__opening--art' },
        h('img', {
          className: 'journey-gate__vortex journey-gate__vortex--art',
          src: asset.vortex,
          alt: '',
          width: asset.width,
          height: asset.height,
          draggable: false,
          decoding: 'async',
        }),
        h('span', { className: 'journey-gate__art-glow' }),
        h(
          'span',
          { className: 'journey-gate__art-particles' },
          particles.map(([x, y, delay], index) =>
            h('i', { key: index, style: { '--particle-x': x, '--particle-y': y, '--particle-delay': delay } })
          )
        )
      ),
      h('img', {
        className: 'journey-gate__art-frame',
        src: asset.frame,
        alt: '',
        width: asset.width,
        height: asset.height,
        draggable: false,
        decoding: 'async',
      })
    );
  }

  mounts.forEach(mount => {
    const color = mount.dataset.portalArt;
    if (!portalAssets[color]) return;
    window.ReactDOM.createRoot(mount).render(h(MagicPortal, { color }));
  });
})();
