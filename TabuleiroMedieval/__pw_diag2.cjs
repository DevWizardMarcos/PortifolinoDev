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
    const allLights = [];
    scene.traverse((o) => {
      if (o.isLight) {
        allLights.push({
          type: o.type,
          name: o.name,
          color: o.color ? o.color.getHexString() : null,
          intensity: o.intensity,
          parent: o.parent ? o.parent.name || o.parent.type : null,
          inCustomLightsGroup: exp.lights.getObjectById(o.id) != null,
        });
      }
    });

    const renderer = exp.rendererManager.instance;
    const gl = renderer.getContext();

    return {
      allLightsCount: allLights.length,
      allLights,
      contextLost: gl.isContextLost(),
      rendererInfo: {
        programs: renderer.info.programs ? renderer.info.programs.length : null,
        geometries: renderer.info.memory.geometries,
        textures: renderer.info.memory.textures,
      },
      cameraPos: exp.cameraManager.instance.position.toArray(),
      cameraNear: exp.cameraManager.instance.near,
      cameraFar: exp.cameraManager.instance.far,
    };
  });

  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
