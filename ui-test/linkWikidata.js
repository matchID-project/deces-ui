const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Démarrage du test d\'appariement Wikidata');
  const port = process.env.PORT;
  const host = process.env.TEST_HOST;
  const frontendUrl = `http://${host}:${port}/link`;
  const maildevUrl = 'http://smtp:1080';
  const testEmail = 'bob.morane@contretout.chacal';
  const testFile = './wikidata-deces-2020-m01.csv';

  // 1. Aller sur la page d'appariement et charger le fichier CSV
  console.log('📝 Étape 1: Chargement de la page et upload du fichier CSV');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(frontendUrl);
  console.log('✅ Page d\'appariement chargée');
  await page.screenshot({ path: 'linkStep0.png' })
  
  // Intercepter le filechooser dynamique et uploader le fichier
  console.log('📤 Upload du fichier CSV...');
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.click('div.rf-callout')
  ]);
  await fileChooser.setFiles(testFile);
  console.log('✅ Fichier CSV uploadé avec succès');
  await page.screenshot({ path: 'linkStep1.png' })

  // 2. Remplacer le champ Prénom(s) par firstnameLabel
  console.log('📝 Étape 2: Configuration du mapping des champs');
  await page.waitForSelector('label:has-text("Prénom(s)")');
  const prenomInput = await page.locator('input[name="Prénom(s)"]').first();
  await prenomInput.fill('firstnameLabel');
  console.log('✅ Mapping du champ Prénom(s) configuré');
  await page.screenshot({ path: 'linkStep2.png' })

  // Scroller vers le bas pour voir le champ courriel
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.screenshot({ path: 'linkStep3.png' })

  // Remplir le champ courriel et cliquer sur envoyer
  console.log('📝 Étape 3: Identification par email');
  await page.fill('input[type="email"]#email', testEmail);
  await page.click('button[type="submit"]');
  console.log('✅ Email envoyé pour validation');
  await page.screenshot({ path: 'linkStep4.png' })

  // 3. Aller sur MailDev et récupérer le code
  console.log('📝 Étape 4: Récupération du code de validation');
  const mailPage = await context.newPage();
  await mailPage.goto(maildevUrl);
  await mailPage.waitForSelector('a[href^="#/email/"]');
  await mailPage.click('a[href^="#/email/"]');
  console.log('✅ Email reçu dans MailDev');
  await mailPage.screenshot({ path: 'linkStep5.png' })
  
  // Extraire le code à 6 chiffres
  const mailContent = await mailPage.textContent('.email-content-view .plain-text');
  const codeMatch = mailContent.match(/Votre code, valide 10 minutes: (\d{6})/);
  if (!codeMatch) throw new Error('Code de validation non trouvé dans l\'email');
  const code = codeMatch[1];
  console.log('✅ Code de validation extrait:', code);

  // 4. Retour sur la page d'appariement, entrer le code et valider
  console.log('📝 Étape 5: Validation du code et lancement de l\'appariement');
  await page.bringToFront();
  await page.fill('input[type="text"]#emailOTP', code);
  await page.screenshot({ path: 'linkStep6.png' })
  await page.click('button[type="submit"]');
  console.log('✅ Code de validation soumis');
  await page.screenshot({ path: 'linkStep7.png' })
  
  await page.click('button.rf-btn:has-text("Valider")');
  console.log('✅ Appariement lancé');
  await page.screenshot({ path: 'linkStep8.png' })

  // 5. Attendre la fin du traitement et vérifier la présence de "Costes" dans la table
  console.log('📝 Étape 6: Vérification des résultats');
  await page.waitForTimeout(5000); // attendre quelques secondes
  await page.screenshot({ path: 'linkStep9.png' })
  const tableText = await page.textContent('body');
  if (!tableText.includes('Costes')) {
    throw new Error('Le nom "Costes" n\'a pas été trouvé dans la table des résultats');
  } else {
    console.log('✅ Test réussi : "Costes" trouvé dans la table des résultats');
  }

  console.log('✨ Test d\'appariement Wikidata terminé avec succès');
  await browser.close();
})();
