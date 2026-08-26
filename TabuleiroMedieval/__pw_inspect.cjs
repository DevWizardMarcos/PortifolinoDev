const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await page.goto('http://localhost:5173', { waitUntil: 'load' });
  await page.waitForSelector('.intro-screen__button:not([disabled])', { timeout: 30000 });
  await page.click('.intro-screen__button');
  await page.waitForTimeout(2500);

  const info = await page.evaluate(() => {
    const exp = window.__experience;
    const scene = exp.sceneManager.scene;
    const out = {
      background: scene.background ? scene.background.getHexString() : null,
      fog: scene.fog,
      toneMapping: exp.rendererManager.instance.toneMapping,
      exposure: exp.rendererManager.instance.toneMappingExposure,
      lights: [],
      sampleMaterials: [],
    };
    exp.lights.traverse((o) => {
      if (o.isLight) out.lights.push({ type: o.type, color: o.color.getHexString(), intensity: o.intensity });
    });
    let count = 0;
    scene.traverse((o) => {
      if (o.isMesh && count < 15) {
        const m = o.material;
        out.sampleMaterials.push({
          name: o.name,
          matType: m.type,
          color: m.color ? m.color.getHexString() : null,
          emissive: m.emissive ? m.emissive.getHexString() : null,
          emissiveIntensity: m.emissiveIntensity,
          roughness: m.roughness,
          metalness: m.metalness,
          toneMapped: m.toneMapped,
        });
        count++;
      }
    });
    return out;
  });

  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
