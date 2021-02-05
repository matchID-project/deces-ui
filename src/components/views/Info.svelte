<div class="rf-container-fluid">
  <div class="rf-grid-row">
    {#if !filter}
      <div class="rf-col-xl-4 rf-col-lg-4 rf-col-md-3 rf-col-sm-12 rf-col-xs-12"></div>
      <div class="rf-col-xl-4 rf-col-lg-4 rf-col-md-6 rf-col-sm-12 rf-col-xs-12 rf-content--center">
        <div class="rf-search-bar rf-margin-bottom-1N" id="search-input">
          <input bind:value={search} class="rf-input" placeholder="Rechercher dans les questions" type="search" id="search-input-input" name="search-input-input">
          <button class="rf-btn" title="Rechercher">
            <span>
                Rechercher
            </span>
          </button>
        </div>
      </div>
      <div class="rf-col-xl-4 rf-col-lg-4 rf-col-md-3 rf-col-sm-12 rf-col-xs-12"></div>
    {/if}
    {#each filteredPages as page, index}
      <div
        class="{currentPage === page.id ? "rf-col-12" : "rf-col-xl-6 rf-col-lg-6 rf-col-md-12 rf-col-sm-12 rf-col-xs-12"} rf-padding-1N"
      >
        <div
          class="rf-container-fluid"
          id={page.id}
        >
          <div class="rf-grid-row">
            <div class="rf-col-12">
              <div
                class="rf-card rf-card--md rf-card--horizontal rf-href"
                class:rf-card--left-arrow={currentPage === page.id}
                on:click|preventDefault={() => { togglePage(page.id) }}
              >
                <div class="rf-card__body">
                  <span class="rf-card__lead rf-margin-top-1N rf-margin-left-1N">
                    <Icon
                      class="rf-fi--lg"
                      icon={page.icon || 'ri:question-line'}
                      href={page.id}
                      label={page.title}
                    />
                    <span class="rf-text--lg">{page.title}</span>
                  </span>
                </div>
              </div>
            </div>
            {#if currentPage === page.id}
              <div class="rf-col-12" transition:slide|local>
                <div
                  class="rf-callout rf-background--white"
                  class:rf-callout--no-mobile={page.fullWidthMobile}
                >
                  {@html page.content}
                  {#if page.component}
                    <svelte:component this={page.component} {...page.params}/>
                  {/if}
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
  import * as animateScroll from 'svelte-scrollto';
  import { slide } from 'svelte/transition';
  import { version, themeDnum, route } from '../tools/stores.js';
  import Icon from './Icon.svelte';
  import Stats from './Stats.svelte';
  import Iframe from './Iframe.svelte';

  let currentPage = undefined;
  let pages;
  let filteredPages;
  let pageDOM;
  let mail;
  let search;
  let offset = 0;
  export let filter = false;

  onMount (() => {
    filteredPages.forEach((p, i) => {
      if (`#${p.id}` === $route.hash) {
        togglePage(p.id);
      }
    })
  })

  $: mailTo = $themeDnum ?
    `<a href="mailto:datalab@interieur.gouv.fr">datalab@interieur.gouv.fr</a>`
    : `<a href="mailto:matchid.project@gmail.com">matchid.project@gmail.com</a>`;

  $: pages = [
    { title: 'À qui s\'adresse le service ?',
      icon: 'ri:group-line',
      content: $themeDnum ? `
        Professionnels du service public.
      ` : `
        Généalogistes, professionnels ou particuliers, services publics hospitaliers, ou de lutte contre la fraude.
      `},
    { title: 'Qui sommes nous ?',
      icon: 'ri:aliens-line',
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
          du ministère de la Justice et du ministère de l'Intérieur, contribuant bénévolement au service sur leur temps libre.
        </p>
        <p>
            Nous avons créé ce service
            en complément, car il semblait d'utilité publique notamment pour la lutte contre la fraude, ou pour la radiation
            des décédés aux différents fichiers clients (e.g. hôpitaux).
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

      `,
      tags: "bénévole geeks nerd passionnés fabien antoine cristian perez brokate"},
    { title: 'D\'où proviennent les données ?',
      icon: 'ri:database-2-line',
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
                le fichier comporte ${$version && $version.data.uniqRecordsCount} décès et ${$version.data.rawRecordsCount - $version.data.uniqRecordsCount} doublons (stricts)
              </li>
              <li class="rf-margin-0">
                il comporte les décès de 1970 à aujourd'hui (jusqu'au ${$version && $version.data.lastRecordDate})
              </li>
              <li class="rf-margin-0">
                il a été mis à jour le ${$version && $version.data.updateDate}
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
    { title: 'Quelles sont les garanties sur les données ?',
      icon: 'ri:shield-star-line',
      content: `
        <p>
            Le fichier de personnes décédées est un document administratif. Les données sont publiées en application des dispositions des articles L311-9 et L312-1-1 du code des relations entre le public et l’administration, et  réutilisables dans les conditions prévues par le titre II de ce livre.
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
    { title: 'Comment sont indexées les données ?',
      icon: 'ri:file-search-line',
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
    { title: "Signaler un décès manquant",
      icon: 'ri:user-search-line',
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
      `,
      tags: "Trouver personne proche absent"},
    { title: "signaler une erreur dans une fiche",
      icon: 'ri:file-damage-line',
      content: `
            <p>
              <strong>
                Nous ne sommes pas habilités à modifier les données de l'INSEE.
              </strong>
            </p>
            <p>
                En cas d'erreur (e.g enregistrement du nom d'époux au lieu du nom de naissance), seule
                la mairie (ou le consultat) de décès est habilitées à transmettre
                un correctif à l'INSEE. Nous vous invitons donc à prendre contact avec le service
                d'État civil de la mairie ou du consulat du décès.
            </p>
            <p>
              N'hésitez cependant pas à nous écrire pour signaler votre cas à ${mailTo}.
              Nous reprendrons contact avec vous lorsqu'un processus de mise à jour sera identifié avec l'INSEE.
            </p>
      `,
      tags: "Problème corriger correction faute"},
    { title: 'signaler un bug ou poser une question',
      icon: 'ri:bug-line',
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
            <strong>${$version && `${$version.ui}-api/${$version.api}`}</strong>
          </p>
      `,
      tags: "problème bogue plante"},
    { title: 'Suggérer des améliorations du service',
      icon: 'ri:service-line',
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
      `,
      tags: "évolutions"},
    { title: 'Statistiques de consultation',
      icon: 'ri:bar-chart-box-line',
      content: '',
      component: Stats,
      fullWidthMobile: true,
      tags: 'api hits visiteurs'
    },
    { title: 'Le code est-il open source ?',
      icon: 'ri:github-line',
      content: `
        <p>
          Le code source de ce site est opensource et disponible sur <a href="https://github.com/matchid-project/deces-ui" target="_blank">GitHub</a>,
          ainsi que celui de l'<a href="https://github.com/matchid-project/deces-backend" target="_blank">API</a>.
        </p>
        <p>
          Il est diffusé sous la licence libre <a href="https://spdx.org/licenses/LGPL-3.0.html#licenseText" target="_blank">LGPL 3.0</a>.
        </p>
      `},
    { title: 'Documentation de l\'API',
      icon: 'ri:plug-line',
      content: `
        <p>
          La documentation de l'API est consultable ci-dessous ou en suivant <a href="/deces/api/v1/docs">le lien suivant</a>.
        </p>
      `,
      component: Iframe,
      fullWidthMobile: true,
      params: { src: '/deces/api/v1/docs' },
      tags: "swagger"}
  ]

  $: filteredPages = pages.filter(p => {
    const terms = search && search.split(/\s+/).map(s => RegExp(`(^|\s|[^a-z])${s}.*(\s|^[a-z]|$)`,'i')) || [];
    return (filter ? p.filter : true) && (p.tags && ( terms.every(r => r.test(p.tags))) || (p.content && terms.every(r => r.test(p.content))) || (p.title && terms.every(r => r.test(p.title))));
  }).map(p => {
    p.id = slugify(p.title);
    return p;
  });

  const indexOf = (id) => {
    let index = -1
    filteredPages.forEach((p, i) => {
      if (p.id === id) {
        index = i;
      }
    });
    return index;
  }

  const togglePage = (id) => {
    if (currentPage === id) {
      currentPage = undefined;
      if (history) {
        history.pushState(null, null, window.location.href.split('#')[0]);
      } else {
        location.hash='';
      }
      $route.hash = undefined;
    }
    else {
      currentPage = id;
      location.hash = id;
      $route.hash = location.hash;
      if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
        setTimeout(() => {
          animateScroll.scrollTo({element: `#${id}`, duration: 400});
        }, 400);
      };
    };
  };

  const urlNorm = (title) => {
    return title.replace(/[^a-z]*/,'-').replace('-+','-');
  }

  const slugify = (str) => {
    try {
      return str.normalize('NFD').toLowerCase().replace(/[\u0300-\u036f]*/g, '').replace(/[^a-z0-9]+/gi, ' ').replace(/(^\s*|\s*)$/,'').replace(/\s+/gi,'-');
    } catch (e) {
      return str.toLowerCase().replace(/[\u0300-\u036f]*/g, '').replace(/[^a-z0-9]+/gi, ' ').replace(/(^\s*|\s*)$/,'').replace(/\s+/gi,'-');
    }
  }

</script>
