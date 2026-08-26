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
    const mats = new Map();
    let meshCount = 0;
    let vertexColorCount = 0;
    scene.traverse((o) => {
      if (!o.isMesh) return;
      meshCount++;
      const geo = o.geometry;
      if (geo && geo.attributes && geo.attributes.color) vertexColorCount++;
      const m = o.material;
      const key = m.uuid;
      if (!mats.has(key)) {
        mats.set(key, {
          matType: m.type,
          color: m.color ? m.color.getHexString() : null,
          emissive: m.emissive ? m.emissive.getHexString() : null,
          emissiveIntensity: m.emissiveIntensity,
          vertexColors: m.vertexColors,
          map: !!m.map,
          count: 0,
          sampleNames: [],
        });
      }
      const entry = mats.get(key);
      entry.count++;
      if (entry.sampleNames.length < 3) entry.sampleNames.push(o.name);
    });

    return {
      meshCount,
      vertexColorCount,
      environment: !!scene.environment,
      materialCount: mats.size,
      materials: Array.from(mats.values()),
    };
  });

  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
