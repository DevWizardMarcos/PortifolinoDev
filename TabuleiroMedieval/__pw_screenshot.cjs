const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const errors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (err) => errors.push(String(err)));

  await page.goto('http://localhost:5173', { waitUntil: 'load' });
  await page.waitForSelector('.intro-screen__button:not([disabled])', { timeout: 30000 });
  await page.screenshot({ path: 'C:/Users/ALUNOO~1/AppData/Local/Temp/claude/c--Users-Aluno-Origem-Documents-Ms-Aula-PortifolinoDev/d67acda5-b894-4d72-b129-c22357608c65/scratchpad/before-click.png' });
  await page.click('.intro-screen__button');
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'C:/Users/ALUNOO~1/AppData/Local/Temp/claude/c--Users-Aluno-Origem-Documents-Ms-Aula-PortifolinoDev/d67acda5-b894-4d72-b129-c22357608c65/scratchpad/lit-scene.png' });

  console.log('CONSOLE_ERRORS:', JSON.stringify(errors));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
