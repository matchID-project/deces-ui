const assert = require('assert');
console.log('🚀 Démarrage du test de recherche avancée');
const { chromium } = require('playwright');
(async () => {
  console.log('📝 Étape 1: Initialisation du navigateur');
  const browser = await chromium.launch({
    headless: true
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  const port = process.env.PORT;
  const host = process.env.TEST_HOST;

  console.log('📝 Étape 2: Navigation vers la page de recherche avancée');
  await page.goto(`http://${host}:${port}/search?advanced=true`);
  console.log('✅ Page de recherche avancée chargée');

  console.log('📝 Étape 3: Recherche par nom');
  await page.click('[placeholder="Pompidou"]');
  await Promise.all([
    page.waitForNavigation(),
    page.fill('[placeholder="Pompidou"]', 'dupont')
  ]);
  console.log('✅ Nom saisi');

  console.log('📝 Étape 4: Recherche par prénom');
  await page.click('[placeholder="Georges"]');
  await Promise.all([
    page.waitForNavigation(),
    page.fill('[placeholder="Georges"]', 'jean')
  ]);
  console.log('✅ Prénom saisi');
  await page.screenshot({ path: 'advancedSearchStep1.png' })

  console.log('📝 Étape 5: Recherche par département');
  await page.click('[placeholder="Paris"]');
  await page.click('[placeholder="75"]');
  await Promise.all([
    page.waitForNavigation(),
    page.fill('[placeholder="75"]', '33')
  ]);
  console.log('✅ Département saisi');
  await page.screenshot({ path: 'advancedSearchStep2.png' })

  console.log('📝 Étape 6: Recherche par date');
  await page.click('[placeholder="1970-1980 ou 1974 ou 04/02/1974"]');
  await Promise.all([
    page.waitForNavigation(),
    page.fill('[placeholder="1970-1980 ou 1974 ou 04/02/1974"]', '2020')
  ]);
  console.log('✅ Date saisie');
  await page.screenshot({ path: 'advancedSearchStep3.png' })

  console.log('📝 Étape 7: Configuration de la recherche floue');
  await page.press('[placeholder="1970-1980 ou 1974 ou 04/02/1974"]', 'Control+Shift++');
  await page.click('text=Recherche floue');
  assert.equal(page.url(), `http://${host}:${port}/search?advanced=true&fuzzy=false&ln=dupont&fn=jean&dd=2020&ddep=33`);
  console.log('✅ Recherche floue configurée');
  await page.screenshot({ path: 'advancedSearchStep4.png' })

  console.log('📝 Étape 8: Sélection du résultat');
  await page.click('text=DUPONT Jean Pierre Eysines 1932 - Pessac 2020');
  console.log('✅ Résultat sélectionné');

  console.log('📝 Étape 9: Navigation vers le permalien');
  await Promise.all([
    page.waitForNavigation(),
    page.click('text=Permalien')
  ]);
  console.log('✅ Permalien chargé');
  await page.screenshot({ path: 'advancedSearchStep5.png' })

  console.log('✨ Test de recherche avancée terminé avec succès');
  await context.close();
  await browser.close();
})();
