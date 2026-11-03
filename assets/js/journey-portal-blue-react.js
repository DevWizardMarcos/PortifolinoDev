(() => {
  const mounts = [...document.querySelectorAll('[data-portal-art]')];
  if (!mounts.length || !window.React || !window.ReactDOM) return;

  const h = window.React.createElement;
  const portalAssets = {
    azul: { frame: 'assets/img/Portais/moldura-azul.png.webp', vortex: 'assets/img/Portais/vortice-azul.png.webp', width: 1086, height: 1448 },
    laranja: { frame: 'assets/img/Portais/moldura-laranja.webp', vortex: 'assets/img/Portais/vortice-laranja.webp', width: 1086, height: 1448 },
    roxo: { frame: 'assets/img/Portais/moldura-roxo.webp', vortex: 'assets/img/Portais/vortice-roxo.webp', width: 384, height: 512 },
    vermelho: { frame: 'assets/img/Portais/moldura-vermelho.webp', vortex: 'assets/img/Portais/vortice-vermelho.webp', width: 384, height: 512 },
    dourado: { frame: 'assets/img/Portais/moldura-dourado.webp', vortex: 'assets/img/Portais/vortice-dourado.webp', width: 384, height: 512 },
  };
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
        h('span', { className: 'journey-gate__art-glow' })
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
