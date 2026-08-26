const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await page.goto('http://localhost:5173', { waitUntil: 'load' });
  await page.waitForSelector('.intro-screen__button:not([disabled])', { timeout: 30000 });
  await page.click('.intro-screen__button');
  await page.waitForTimeout(2500);

  // Test 1: NoToneMapping
  await page.evaluate(() => {
    const exp = window.__experience;
    exp.rendererManager.instance.toneMapping = 0; // THREE.NoToneMapping
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:/Users/ALUNOO~1/AppData/Local/Temp/claude/c--Users-Aluno-Origem-Documents-Ms-Aula-PortifolinoDev/d67acda5-b894-4d72-b129-c22357608c65/scratchpad/diag1-notonemapping.png' });

  // Test 2: all lights off
  await page.evaluate(() => {
    const exp = window.__experience;
    exp.lights.traverse((o) => { if (o.isLight) o.intensity = 0; });
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:/Users/ALUNOO~1/AppData/Local/Temp/claude/c--Users-Aluno-Origem-Documents-Ms-Aula-PortifolinoDev/d67acda5-b894-4d72-b129-c22357608c65/scratchpad/diag2-nolights.png' });

  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
