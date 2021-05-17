console.log('advancedSearch');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({
    headless: true
  });
  const context = await browser.newContext();
  // Open new page
  const page = await context.newPage();
  // Go to http://nginx:80/search?advanced=true
  await page.goto('http://nginx:80/search?advanced=true');
  // Click [placeholder="Pompidou"]
  await page.click('[placeholder="Pompidou"]');
  // Fill [placeholder="Pompidou"]
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://nginx:80/search?advanced=true&ln=dupont' }*/),
    page.fill('[placeholder="Pompidou"]', 'dupont')
  ]);
  // Click [placeholder="Georges"]
  await page.click('[placeholder="Georges"]');
  // Fill [placeholder="Georges"]
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://nginx:80/search?advanced=true&ln=dupont&fn=jean' }*/),
    page.fill('[placeholder="Georges"]', 'jean')
  ]);
  // Click [placeholder="Paris"]
  await page.click('[placeholder="Paris"]');
  // Click [placeholder="75"]
  await page.click('[placeholder="75"]');
  // Fill [placeholder="75"]
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://nginx:80/search?advanced=true&ln=dupont&fn=jean&ddep=33' }*/),
    page.fill('[placeholder="75"]', '33')
  ]);
  // Click [placeholder="1970-1980 ou 1974 ou 04/02/1974"]
  await page.click('[placeholder="1970-1980 ou 1974 ou 04/02/1974"]');
  // Fill [placeholder="1970-1980 ou 1974 ou 04/02/1974"]
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://nginx:80/search?advanced=true&ln=dupont&fn=jean&dd=2020&ddep=33' }*/),
    page.fill('[placeholder="1970-1980 ou 1974 ou 04/02/1974"]', '2020')
  ]);
  // Press + with modifiers
  await page.press('[placeholder="1970-1980 ou 1974 ou 04/02/1974"]', 'Control+Shift++');
  // Click text=Recherche floue
  await page.click('text=Recherche floue');
  // assert.equal(page.url(), 'http://nginx:80/search?advanced=true&fuzzy=false&ln=dupont&fn=jean&dd=2020&ddep=33');
  // Click text=DUPONT Jean Pierre Eysines 1932 - Pessac 2020
  await page.click('text=DUPONT Jean Pierre Eysines 1932 - Pessac 2020');
  // Click text=Permalien
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://nginx:80/id/dLLRnfUc1Eof' }*/),
    page.click('text=Permalien')
  ]);
  await page.screenshot({ path: 'advancedSearch.png' })

  // ---------------------
  await context.close();
  await browser.close();
})();
