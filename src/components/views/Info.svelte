<div class="rf-container-fluid">
  <div class="rf-grid-row">
    {#each pages.filter(x => filter ? x.filter : true) as page, index}
      <div
        class="{currentPage === index ? "rf-col-12" : "rf-col-xl-6 rf-col-lg-6 rf-col-md-12 rf-col-sm-12 rf-col-xs-12"} rf-padding-1N"
      >
        <div class="rf-container-fluid">
          <div class="rf-grid-row">
            <div class="rf-col-12">
              <div
                class="rf-card rf-card--md rf-card--horizontal rf-href"
                class:rf-card--left-arrow={currentPage === index}
                on:click={() => { togglePage(index) }}
              >
                <div class="rf-card__body">
                  <span class="rf-card__lead rf-margin-top-1N rf-margin-left-1N">
                    {page.title}
                  </span>
                </div>
              </div>
            </div>
            {#if currentPage === index}
              <div class="rf-col-12" transition:slide|local>
                <div class="rf-callout rf-background--white">
                  {@html page.content}
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<script>
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import { themeDnum } from '../tools/stores.js';

  let currentPage = undefined;
  let pages;
  let pageDOM;
  let backendVersion;
  let mail;
  export let filter = false;

  $: mailTo = $themeDnum ?
    `<a href="mailto:datalab@interieur.gouv.fr">datalab@interieur.gouv.fr</a>`
    : `<a href="mailto:matchid.project@gmail.com">matchid.project@gmail.com</a>`;


  $: pages = [
    { title: 'à qui s\'adresse le service ?',
      content: $themeDnum ? `
        Professionnels du service public.
      ` : `
        Généalogistes, professionnels ou particuliers, services publics hospitaliers, ou de lutte contre la fraude.
      `},
    { title: 'qui sommes nous ?',
      content: `
        <p>
          Le projet matchID a été initié au ministère de l'Intérieur ${$themeDnum ? "(administrateur ministériel des données)":""}
           dans le contexte des challenges d'
           <a href="https://entrepreneur-interet-general.etalab.gouv.fr/defis/2017/mi-matchid.html" target="_blank">
           Entrepreneur d'intérêt général</a>.
          La réconciliation des personnes décédées avec le permis de conduire a été le premier cas d'usage réalisé avec
            matchID.
        </p>
        <p>
          Le projet a été libéré et mis en opensource. L'équipe est maintenant composée de développeurs
          du ministère de la Justice et du ministère de l'Intérieur, contribuant au service sur leur temps libre.
        </p>
        <p>
            Nous avons créé de service
            en complément qui semblait d'utilité publique notamment pour la lutte contre la fraude, ou pour la radiation
            des décédés aux fichiers clients (hôpitaux).
        </p>
        ${$themeDnum ? "" : `
        <p>
            L'exploitation du service est financé sur fonds personnels, il est offert sans garantie de fonctionnement, mais
            nous y portons le plus grand soin, sur notre temps libre, en attendant son support officiel par les services
            numériques de l'État.
        </p>
        `}
        <p>
            Pour en savoir plus sur le projet matchID, consultez notre site <a href="https://www.matchid.io" target="_blank">https://matchid.io</a>.
        </p>

      `},
    { title: 'd\'où proviennent les données ?',
      content: `
          <p>
              Le site exploite les fichiers des personnes décédées, disponibles en opendata sur
              <a href="https://www.data.gouv.fr/fr/datasets/fichier-des-personnes-decedees/" target="_blank">data.gouv.fr</a> et
              recueillies par l'<a href="https://www.insee.fr/fr/information/4190491" target="_blank">INSEE</a>.
          </p>
          <p>
              Les fichiers des personnes décédées sont établis par l’INSEE à partir des informations reçues des communes
              dans le cadre de leur mission de service public.
          </p>
          <p>
            Quelques informations sur le fichier :
            <ul class="rf-margin-0 rf-padding-0 rf-padding-left-4N">
              <li class="rf-margin-0">
                le fichier comporte 25400542 décès
              </li>
              <li class="rf-margin-0">
                il comporte les décès de 1970 à aujourd'hui (jusqu'au 30/09/2019)
              </li>
              <li class="rf-margin-0">
                il a été mis à jour le 12 octobre 2020
              </li>
            </ul>
          </p>
          <p>
            Quelques liens utiles:
            <ul class="rf-margin-0 rf-padding-0 rf-padding-left-4N">
              <li class="rf-margin-0">
                <a href="https://www.cnil.fr/fr/rnipp-repertoire-national-didentification-des-personnes-physiques-0" target="_blank">le RNIPP vu par la CNIL</a>
              </li>
              <li class="rf-margin-0">
                formulaires de <a href="https://www.insee.fr/fr/information/1303477" target="_blank">déclaration
                de décès</a> des communes vers l'INSEE
              <li class="rf-margin-0">
                démarches relatives au décès sur <a href="https://www.service-public.fr/particuliers/vosdroits/F16507" target="_blank">service-public.fr</a>
              </li>
              <li class="rf-margin-0">
                article wikipedia concernant le <a href="https://fr.wikipedia.org/wiki/R%C3%A9pertoire_national_d%27identification_des_personnes_physiques" target="_blank">RNIPP</a>
              </li>
          </p>
        </ul>
      `},
    { title: 'quelles sont les garanties sur les données ?',
      content: `
        <p>
            Le fichier de personnes décédées est un document administratif. Les données sont publiés en application des dispositions des articles L311-9 et L312-1-1 du code des relations entre le public et l’administration, et  réutilisables dans les conditions prévues par le titre II de ce livre.
        </p>
        <p>
            Les données INSEE sont sous <a href="https://www.etalab.gouv.fr/licence-ouverte-open-licence" target="_blank">Licence Ouverte / Open Licence version 2.0</a>.
        </p>
        <p> L’INSEE (et donc ce service) ne peuvent garantir que les fichiers des personnes décédées sont exempts d’omissions ou d’erreurs.
            Ce service et l'INSEE ne sauraient encourir aucune responsabilité quant à l’utilisation faite des informations contenues dans ces fichiers.
        </p>
        <p>
            <strong>
                En particulier, les informations contenues dans ces fichiers ne peuvent en aucun cas être utilisées dans un but de certification
                du statut vital des personnes.
            </strong>
        </p>
      `},
    { title: 'comment sont indexées les données ?',
      content: `
        <p>
          Les données sont traitées avec l'outil opensource <a href="https://www.matchid.io" target="_blank">matchID</a> (Python/Pandas). Les traitements, disponibles
          disponibles <a href="https://github.com/matchid-project/deces-dataprep" target="_blank">ici</a>,
          consistent en une mise en forme (capitalisation, réconciliation avec les noms de pays et commune
          selon les référentiels INSEE) puis une indexation. Les données sont actualisées chaque mois, après chaque diffusion sur le
          site <a href="https://www.data.gouv.fr/fr/datasets/fichier-des-personnes-decedees/" target="_blank">data.gouv.fr</a>.
      </p>
      <p>
          La recherche et l'indexation reposent sur <a href="https://elastic.co" target="_blank">Elasticsearch</a>
          qui repose sur le moteur de recherche Lucène, qui apporte le bénéfice
          des <a href="https://wikipedia.org/wiki/Recherche_approximative" target="_blank">recherches floues</a> à
          large échelle. Le code source du présent site est accessible sur <a href="https://github.com/matchid-project/deces-ui" target="_blank">Github</a>.
      </p>
      `},
    { title: "signaler un décès manquant",
      filter: true,
      content: `
            <p>
                Les données INSEE sont issues d'un processus de collecte administratif auprès
                des collectivités. Des absence et des erreurs sont possibles, voici les
                cas que nous avons identifié :
            </p>
            <ul>
                <li>
                    Le décès est récent - le délai de transmission des mairies ou du consulat à l'INSEE peut varier,
                    il n'existe pas de garantie quant au délai.
                </li>
                <li>
                    Les données sont parfois erronées dans le fichier INSEE. Il arrive par exemple, que le nom d'épouse soit enregistré
                    a lieu du nom de naissance. Supprimez alors le nom en conservant les autres informations. Essayez des recherches alternatives:
                    année de naissance ou de décès (plutôt que la date exacte), département plutôt que commune,
                    etc.
                </li>
                <li>
                    Avant 1990, le process INSEE était peu informatisé. Le processus de tranmission
                    par formulaire papier semble avoir généré des problèmes d'exhaustivité.
                </li>
                <li>
                    Seuls les personnes ayant eu un numéro INSEE sont inscrites au fichier. Un
                    parcours de vie (e.g. naissance / décès à l'étranger)
                    peut expliquer l'absence du fichier.
                </li>
            </ul>
            <p>
                Si vous avez l'assurance que la personne concernée disposait d'un numéro INSEE, il est important
                de savoir que celle-ci figure peut être toujours au fichier RNIPP. Il est peut être
                alors nécessaire de contacter la mairie ou le consultat de décès pour vous assurer
                de la bonne transmission à l'INSEE.
            </p>
            <p>
                Des erreurs liées à l'indexation peuvent subsister, nous nous tenons à disposition
                en cas de problème d'exhaustivité (${mailTo})
                pour confirmer l'absence du fichier d'origine.
            </p>
            <p>
                Nous ne pourrons vous accompagner plus loin dans la démarche administrative à ce stade, il n'existe pas de processus simplifié
                pour les demande d'ajout et de correction. Mais nous répondrons toujours à vos sollicitations.
            </p>
      `},
    { title: "signaler une erreur dans une fiche",
      content: `
            <p>
              <strong>
                Nous ne sommes pas habilités à modifier les données de l'INSEE.
              </strong>
            </p>
            <p>
                En cas d'erreur (e.g enregistrement du nom d'époux au lieu du nom de naissance), seuls
                la mairie et le consultat de décès sont habilités à transmettre
                un correctif à l'INSEE. Nous vous invitons donc à prendre contact avec le service
                d'État civil de la mairie ou du consulat du décès.
            </p>
            <p>
              N'hésitez cependant pas à nous écrire pour signaler votre cas à ${mailTo}.
              Nous reprendrons contact avec vous lorsqu'un processus de mise à jour sera identifié avec l'INSEE.
            </p>
      `},
    { title: 'signaler un bug ou poser une question',
      filter: true,
      content: `
          <p>
            Le service a bientôt un an, mais des bugs peuvent subsister. Commencez par actualiser l'application (touche Ctrl + F5),
            certaines mises à jours du service nécessitent un rechargement.
          </p>
          <p>
            En cas de doute sollicitez nous à ${mailTo}, en mentionnant la référence de version ci-dessous:
          </p>
          <p>
            <strong>__APP__ version __APP_VERSION__-api/${backendVersion}</strong>
          </p>
      `},
    { title: 'suggérer des améliorations du service',
      content: `
        <p>
            Nous prévoyons prochainement (fin 2020) :
        </p>
        <ul>
            ${$themeDnum ? `` : `
              <li>
                  le support des fichiers Gedcom
              </li>
            `}
            <li>
                le support du formulaire Service public pour la demande d'acte de décès (6000 communes)
            </li>
            <li>
                une configuration avancée pour les requêtes floues (regex, phonétique, fuzzy : par champ)
            </li>
        </ul>
        <p>
          Vos suggestions sont les bienvenues, nous les étudierons - écrivez nous à ${mailTo}.
      `},
    { title: 'où est le code open source ?',
      content: `
        <p>
          Le code source de ce site est disponible sur <a href="https://github.com/matchid-project/deces-ui" target="_blank">GitHub</a>,
          ainsi que celui de l'<a href="https://github.com/matchid-project/deces-backend" target="_blank">API</a>.
        </p>
        <p>
          Il est diffusé sous la licence libre <a href="https://spdx.org/licenses/LGPL-3.0.html#licenseText" target="_blank">LGPL 3.0</a>.
        </p>
      `},
    { title: 'documentation de l\'API',
      content: `
        <p>
          La documentation de l'API est <a href="/deces/api/v1/docs">ici</a>
        </p>
      `},
  ]

  onMount(async () => {
        const r = await fetch('__BACKEND_PROXY_PATH__/version');
        backendVersion = await r.json();
  })

  const togglePage = (index) => {
    if (currentPage === index) {
      currentPage = undefined;
    }
    else {
      currentPage = index;
    }
  };

  const urlNorm = (title) => {
    return title.replace(/[^a-z]*/,'-').replace('-+','-');
  }

</script>

<style>
  .ul-local {
    padding: auto!important;
  }

  ul li {
    margin: 0px!important;
  }


</style>