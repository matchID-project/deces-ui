console.log('simpleSearch');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({
    headless: true
  });
  const context = await browser.newContext();
  // Open new page
  const page = await context.newPage();
  // Go to http://nginx:80/
  await page.goto('http://nginx:80/');
  // Go to http://nginx:80/search
  await page.goto('http://nginx:80/search');
  // Click [placeholder="Pompidou Georges 02/04/1974"]
  await page.click('[placeholder="Pompidou Georges 02/04/1974"]');
  // Fill [placeholder="Pompidou Georges 02/04/1974"]
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://nginx:80/search?q=dupont+jean' }*/),
    page.fill('[placeholder="Pompidou Georges 02/04/1974"]', 'dupont jean')
  ]);
  // Click text=DUPONT Jean Pierre
  await page.click('text=DUPONT Jean Pierre');
  // Click text=Permalien
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://nginx:80/id/dLLRnfUc1Eof' }*/),
    page.click('text=Permalien')
  ]);
  // Click text=Eysines 03/10/1932 - Pessac 16/01/2020
  await page.click('text=Eysines 03/10/1932 - Pessac 16/01/2020');
  // Click text=Eysines
  await page.click('text=Eysines');
  // Click text=Eysines (33162)
  await page.click('text=Eysines (33162)');
  await page.screenshot({ path: 'simpleSearch.png' })
  // ---------------------
  await context.close();
  await browser.close();
})();
