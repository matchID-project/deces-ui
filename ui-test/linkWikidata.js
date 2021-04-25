console.log('linkageSearch');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({
    headless: true
  });
  const context = await browser.newContext();
  // Open new page
  const page = await context.newPage();
  // Go to http://nginx:80/link
  await page.goto('http://nginx:80/link');
  // Click text=Étape 1. Fichier Glissez un fichier au format CSV ou Gedcom ici (100Mo maximum)
  await page.click('text=Étape 1. Fichier Glissez un fichier au format CSV ou Gedcom ici (100Mo maximum)');
  await page.setInputFiles('input[type="file"]', './wikidata-deces-2020-m01.csv')
  // Click .rf-col-8 .rf-input-group
  await page.click('.rf-col-8 .rf-input-group');
  // Press Tab
  await page.press('body:has-text("<h1>Moteur de recherche des décès</h1> Ce service permet la recherche des décès,")', 'Tab');
  // Fill input[name="Prénom(s)"]
  await page.fill('input[name="Prénom(s)"]', 'firstnameLabel');
  // Click div:nth-child(10) .rf-input-group
  await page.click('div:nth-child(10) .rf-input-group');
  // Click button:has-text("Valider")
  await page.click('button:has-text("Valider")');
  // Click text=score check 82% 79% 79% 79% 79% ... ... >> div >> :nth-match(span, 2)
  await page.click('text=score check 82% 79% 79% 79% 79% ... ... >> div >> :nth-match(span, 2)');
  // Click text=score check 79% 79% 79% 79% 79% ... ... >> div >> :nth-match(span, 2)
  await page.click('text=score check 79% 79% 79% 79% 79% ... ... >> div >> :nth-match(span, 2)');
  // Click text=score check 77% 71% 69% 69% 61% ... ... >> div >> :nth-match(span, 2)
  await page.click('text=score check 77% 71% 69% 69% 61% ... ... >> div >> :nth-match(span, 2)');
  // Click text=score check 71% 69% 69% 61% 56% >> div >> :nth-match(span, 2)
  await page.click('text=score check 71% 69% 69% 61% 56% >> div >> :nth-match(span, 2)');
  // Click text=score check 69% 69% 61% 56% >> div >> :nth-match(span, 2)
  await page.click('text=score check 69% 69% 61% 56% >> div >> :nth-match(span, 2)');
  // Click text=score check 61% 56% >> :nth-match(span, 2)
  await page.click('text=score check 61% 56% >> :nth-match(span, 2)');
  // Click text=score check 56% >> :nth-match(span, 2)
  await page.click('text=score check 56% >> :nth-match(span, 2)');
  // Click text=les décès identifiés
  await page.click('text=les décès identifiés');
  // 0× click
  await page.click('text=les décès identifiés');
  // 0× click
  await page.click('p:has-text("Téléchargez: le fichier complet les décès identifiés")');
  // Click text=43/43 identifications validées
  await page.click('text=43/43 identifications validées');
  await page.screenshot({ path: 'linkage.png' })

  // ---------------------
  await context.close();
  await browser.close();
})();
