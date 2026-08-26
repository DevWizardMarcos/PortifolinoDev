const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await page.goto('http://localhost:5173', { waitUntil: 'load' });
  await page.waitForSelector('.intro-screen__button:not([disabled])', { timeout: 30000 });
  await page.click('.intro-screen__button');
  await page.waitForTimeout(2500);
  await page.screenshot({ path: process.argv[2] });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
