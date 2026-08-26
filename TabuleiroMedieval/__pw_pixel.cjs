const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const imgPath = process.argv[2];
  const url = 'file:///' + imgPath.replace(/\\/g, '/');
  await page.goto(url);
  const pixels = await page.evaluate(async () => {
    const img = document.querySelector('img');
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const sample = (x, y) => Array.from(ctx.getImageData(x, y, 1, 1).data);
    return {
      topLeft: sample(5, 5),
      topRight: sample(canvas.width - 10, 5),
      center: sample(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2)),
      bottomCenter: sample(Math.floor(canvas.width / 2), canvas.height - 20),
      size: [canvas.width, canvas.height],
    };
  });
  console.log(JSON.stringify(pixels, null, 2));
  await browser.close();
})();
