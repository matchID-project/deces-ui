<div class="rf-container-fluid">
  <div class="rf-grid-row">
    {#if !filter}
      <div class="rf-col-xl-4 rf-col-lg-4 rf-col-md-3 rf-col-sm-12 rf-col-xs-12"></div>
      <div class="rf-col-xl-4 rf-col-lg-4 rf-col-md-6 rf-col-sm-12 rf-col-xs-12 rf-content--center">
        <div class="rf-search-bar rf-margin-bottom-1N" id="search-input">
          <input bind:value={search} class="rf-input" placeholder="Rechercher dans les questions" type="search" id="search-input-input" name="search-input-input">
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
                on:keydown|preventDefault={() => { togglePage(page.id) }}
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
  import { scrollTo } from 'svelte-scrolling'
  import { slide } from 'svelte/transition';
  import { version, themeDnum, route } from '../tools/stores.js';
  import Icon from './Icon.svelte';
  import Stats from './Stats.svelte';
  import Iframe from './Iframe.svelte';
  import AlgoDetails from '../views/AlgoDetails.svelte';

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
    : `<a href="mailto:__API_EMAIL__">__API_EMAIL__</a>`;

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
           <a href="https://entrepreneur-interet-general.etalab.gouv.fr/defis/2017/mi-matchid.html" target="_blank" rel="noopener noreferrer">
           Entrepreneur d'intérêt général</a>.
          La réconciliation des personnes décédées avec le permis de conduire a été le premier cas d'usage réalisé avec
            matchID.
        </p>
        <p>
          Le projet a été libéré et mis en open source. L'équipe est maintenant composée de développeurs,
          anciens du ministère de l'Intérieur, contribuant bénévolement au service sur leur temps libre.
        </p>
        <p>
            Nous avons créé ce service
            en complément, car il semblait d'utilité publique notamment pour la lutte contre la fraude, ou pour la radiation
            des décédés aux différents fichiers clients (e.g. hôpitaux).
        </p>
        ${$themeDnum ? "" : `
        <p>
            L'exposition sur deces.matchid.io au profit du public est assurée par Fabien ANTOINE, avec le soutien de Cristian Brokate
            notamment pour le soutien technique à l'API. Le service est offert sans garantie de fonctionnement,
            nous nous efforçons de répondre aux messages (hors "absence du fichier") sur notre temps libre, faut de support
            officiel par les services de l'Administration.
        </p>
        `}
        <p>
            Pour en savoir plus sur le projet matchID, consultez notre site <a href="https://www.matchid.io" target="_blank" rel="noopener noreferrer">https://matchid.io</a>.
        </p>

      `,
      tags: "bénévole geeks nerd passionnés fabien antoine cristian perez brokate"},
    { title: 'Merci pour votre soutien !',
      icon: 'ri:hand-heart-line',
      filter: true,
      content: $themeDnum ? `` : `
      <p>
        Depuis 3 ans, le site était financé sur fonds personnels, puis à l'aide de la publicité.
      </p>
      <p>
        En août 2022 une cagnotte a été créée pour lancer l'association matchID.
      </p>
      <p>
        Nous remercions tous les généreux donnateurs - l'objectif a été atteint et la création de l'association est en cours de lancement,
        et permettra de supprimer la publicité jusque fin 2023.
      </p>
      <p>
        Plus d'information sur <a href="https://matchid.io/cagnotte" target="_blank" rel="noopener noreferrer">la cagnotte</a>
      </p>
      `,
      tags: "help donate"
    },
    { title: 'D\'où proviennent les données ?',
      icon: 'ri:database-2-line',
      content: `
          <p>
              Le site exploite les fichiers des personnes décédées, disponibles en open data sur
              <a href="https://www.data.gouv.fr/fr/datasets/fichier-des-personnes-decedees/" target="_blank" rel="noopener noreferrer">data.gouv.fr</a> et
              recueillies par l'<a href="https://www.insee.fr/fr/information/4190491" target="_blank" rel="noopener noreferrer">INSEE</a>.
          </p>
          <p>
              Les fichiers des personnes décédées sont établis par l’INSEE à partir des informations reçues des communes
              dans le cadre de leur mission de service public.
          </p>
          <p>
            Quelques informations sur le fichier :
            <ul class="rf-margin-0 rf-padding-0 rf-padding-left-4N">
              <li class="rf-margin-0">
                le fichier comporte ${$version && $version.data && $version.data.uniqRecordsCount} décès et ${$version.data && $version.data.rawRecordsCount - $version.data.uniqRecordsCount} doublons (stricts)
              </li>
              <li class="rf-margin-0">
                il comporte les décès de 1970 à aujourd'hui (jusqu'au ${$version && $version.data && $version.data.lastRecordDate})
              </li>
              <li class="rf-margin-0">
                il a été mis à jour le ${$version && $version.data && $version.data.updateDate}
              </li>
            </ul>
          </p>
          <p>
            Quelques liens utiles :
            <ul class="rf-margin-0 rf-padding-0 rf-padding-left-4N">
              <li class="rf-margin-0">
                <a href="https://www.cnil.fr/fr/rnipp-repertoire-national-didentification-des-personnes-physiques-0" target="_blank" rel="noopener noreferrer">le RNIPP vu par la CNIL</a>
              </li>
              <li class="rf-margin-0">
                formulaires de <a href="https://www.insee.fr/fr/information/1303477" target="_blank" rel="noopener noreferrer">déclaration
                de décès</a> des communes vers l'INSEE
              <li class="rf-margin-0">
                démarches relatives au décès sur <a href="https://www.service-public.fr/particuliers/vosdroits/F16507" target="_blank" rel="noopener noreferrer">service-public.fr</a>
              </li>
              <li class="rf-margin-0">
                article wikipedia concernant le <a href="https://fr.wikipedia.org/wiki/R%C3%A9pertoire_national_d%27identification_des_personnes_physiques" target="_blank" rel="noopener noreferrer">RNIPP</a>
              </li>
          </p>
        </ul>
      `},
    { title: 'Quelles sont les garanties sur les données ?',
      icon: 'ri:shield-star-line',
      content: `
        <p>
            Le fichier de personnes décédées est un document administratif. Les données sont publiées en application des dispositions des articles L311-9 et L312-1-1 du code des relations entre le public et l’administration, et réutilisables dans les conditions prévues par le titre II de ce livre.
        </p>
        <p>
            Les données INSEE sont sous <a href="https://www.etalab.gouv.fr/licence-ouverte-open-licence" target="_blank" rel="noopener noreferrer">Licence Ouverte / Open Licence version 2.0</a>.
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
    { title: 'Données personnelles',
      icon: 'ri:shield-user-line',
      content: `
        <p>
          <strong>
            Le fichiers des décès est hors du champ d'application du RGPD  - article 85 loi CNIL
          </strong>
        </p>
        <p>
          Les informations des fichiers de personnes décédées ne sont pas des données à caractère personnel, ni ne relèvent du secret de la vie privée.
          Les droits prévus par l’article 85 de la loi Informatique et libertés s’appliquent néanmoins au bénéfice des ayants-droits ou héritiers des défunts.
        </p>
        <p>
          L’INSEE étant soumis à une obligation légale de diffusion, cet article ne s’applique à l’Insee.
        </p>
        <p>
          Les rediffuseurs (comme ce site) en particulier doivent exclure du champ des données qu’ils publient les informations relatives aux décès (identifiés par leur date, leur lieu et leur numéro d’acte) qui figurent
          dans le <a href="https://www.data.gouv.fr/fr/datasets/r/7bcdfa57-dc50-43a8-beb6-6c76537e7057">fichier des oppositions</a> à la rediffusion centralisées par l’Insee.
        </p>
        <p>
          Une demande motivée au titre d'ayant-droit et de l'article 85 peut être adressée à ${mailTo}, auquel cas une suppression
          sera effectuée le plus rapidement possible, et sous quelques jours au plus.
          Nous vous recommandons de saisir l'INSEE afin que votre demande soit prise en compte
          par l'ensemble des rediffuseurs.
        </p>
        <p>
          <strong>
            Traitement d'appariement en masse
          </strong>
        </p>
        <p>
          Concernant le service d'appariement, vous êtes susceptibles de transmettre à notre service
          un fichier comportant à la fois des données de personnes vivantes, et de personnes décédées.
        </p>
        <p>
          Les données que vous transmettez pour appariement sont stockées chiffrées temporairement pendant le traitement
          et effacées automatiquement un heure après. Leur consultation par l'équipe matchID n'est pas directement possible et
          nécessite un effort particulier relevant d'une volonté d'accès, contraire à notre engagement.
        </p>
        <p>
          Si nous attachons une forte importance à la sécurité de nos serveurs, nous recommandons l'usage parcimonieux
          des données personnelles. Vous vous engagez à ne nous transmettre que strictement que les données nécessaires
          à l'appariement (nom, prénom, lieu, date de naissance/décès). Il relève de votre responsabilité
          d'ajouter un identifiant technique pour une jointure ultérieur à un fichier comportant d'autres données personnelles.
        </p>
        <p>
          Nous nous dégageons de toute responsabilité lié à un envoi inapproprié de données personnelles non strictement
          nécessaires à l'appariement (e.g numéro de sécurité sociale), ne pouvant assurer une sécurité suffisante pour la
          protection de ces données en cas de sensibilité au sens CNIL/RGPD.
        </p>
        <p>
          En utilisant le service, vous vous engagez sur la conformité d'usage au <a href="https://www.cnil.fr/fr/rgpd-de-quoi-parle-t-on">RGPD</a>,
          et à la bonne information du délégué à la protection des données de votre entreprise, administration ou association.
        </p>
         <p>
          <strong>
            Données personnelles des utilisateurs de matchID
          </strong>
        </p>
        <p>
          Le service matchID n'utilise pas de base de donnée utilisateur. L'identification par mail repose sur un mécanisme sans base visant à
          assurer la validité d'une identité par mail. Ce mail est uniquement stocké en mémoire et dans le jeton d'accès (jwt) fourni lors de l'identification.
        </p>
        <p>
          Les mail utilisateurs sont présent dans les données suivantes : données de journaux l'API qui ne sont pas archivées (usage de New Relic EU pour l'exploitation aux finalités
          statistiques et de sécurité), mails d'identification (stockés dans Gmail), et données de suggestion de correction.
        <p>
        <p>
          Les IP sont présentes dans les logs de proxy applicatifs et archivées aux finalités statistiques et de sécurité.
        </p>
        <p>
          <strong>
            Google Analytics & Google Ads
          </strong>
        </p>
        <p>
          Le service matchID fait l'usage de cookies Google Analytics et Google Ads pour le ciblage publicitaire aux finalités de rémunération des serveurs.
          Cette utilisation est temporaire en attendant la constitution d'une association à but non lucratif visant à collecter les fonds nécessaires.
        </p>

      `
    },
    { title: 'Comment sont indexées les données ?',
      icon: 'ri:file-search-line',
      content: `
        <p>
          Les données sont traitées avec l'outil open source <a href="https://www.matchid.io" target="_blank" rel="noopener noreferrer">matchID</a> (Python/Pandas). Les traitements,
          disponibles <a href="https://github.com/matchid-project/deces-dataprep" target="_blank" rel="noopener noreferrer">ici</a>,
          consistent en une mise en forme (capitalisation, réconciliation avec les noms de pays et commune
          selon les référentiels INSEE) puis une indexation. Les données sont actualisées chaque mois, après chaque diffusion sur le
          site <a href="https://www.data.gouv.fr/fr/datasets/fichier-des-personnes-decedees/" target="_blank" rel="noopener noreferrer">data.gouv.fr</a>.
      </p>
      <p>
          La recherche et l'indexation reposent sur <a href="https://elastic.co" target="_blank" rel="noopener noreferrer">Elasticsearch</a>
          qui repose sur le moteur de recherche Lucène, apportant le bénéfice
          des <a href="https://wikipedia.org/wiki/Recherche_approximative" target="_blank" rel="noopener noreferrer">recherches floues</a> à
          large échelle. Le code source du présent site est accessible sur <a href="https://github.com/matchid-project/deces-ui" target="_blank" rel="noopener noreferrer">Github</a>.
      </p>
      `},
    { title: "Décès manquant",
      icon: 'ri:user-search-line',
      filter: true,
      content: `
            <p>
              <strong>
                Nous ne traitons pas aujourd'hui plus le cas des décès manquant,
                ni ne répondons au mails associés, trop fréquents.
              </strong>
            </p>
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
                    au lieu du nom de naissance. Supprimez alors le nom en conservant les autres informations. Essayez des recherches alternatives :
                    année de naissance ou de décès (plutôt que la date exacte), département plutôt que commune,
                    etc.
                </li>
                <li>
                    Avant 1990, le process INSEE était peu informatisé. Le processus de tranmission
                    par formulaire papier semble avoir généré des problèmes d'exhaustivité.
                </li>
                <li>
                    Seules les personnes ayant eu un numéro INSEE sont inscrites au fichier. Un
                    parcours de vie (e.g. naissance/décès à l'étranger)
                    peut expliquer l'absence du fichier.
                </li>
            </ul>
            <p>
                Si vous avez l'assurance que la personne concernée disposait d'un numéro INSEE, il est important
                de savoir que celle-ci figure peut être toujours au fichier RNIPP. Il est peut-être
                alors nécessaire de contacter la mairie ou le consultat de décès pour vous assurer
                de la bonne transmission à l'INSEE.
            </p>
            <p>
                Nous ne pourrons vous accompagner plus loin dans la démarche administrative. À ce stade, il n'existe pas de processus simplifié
                pour les demandes d'ajout et de correction. Mais nous répondrons toujours à vos sollicitations.
            </p>
      `,
      tags: "Trouver personne proche absent"},
    { title: "Données erronnées",
      icon: 'ri:file-damage-line',
      content: `
            <p>
              <strong>
                Nous ne sommes pas habilités à modifier les données de l'INSEE.
                Il est inutile de nous écrire pour signaler une erreur, nous ne répondons plus à ces messages, trop nombreux.
              </strong>
            </p>
            <p>
              Nous avons cependant implémenté une fonction permettant de proposer une correction
              qui sera affichée explicitement comme telle après validation d'un administrateur.
            </p>
            <p>
              La tâche étant laborieuse, nous n'avons pas le temps de traiter assez bien ces demandes.
              Si vous êtes passionnés et souhaitez contribuer au service, écrivez nous à ${mailTo}.
            </p>
            <p>
                En cas d'erreur (e.g enregistrement du nom d'époux au lieu du nom de naissance), seule
                la mairie (ou le consultat) de décès est habilité à transmettre
                un correctif à l'INSEE. Nous vous invitons donc à prendre contact avec le service
                d'État civil de la mairie ou du consulat du décès.
            <p>
              Vous pouvez également signaler le problème sur le site du fournisseur de données: https://www.data.gouv.fr/fr/datasets/fichier-des-personnes-decedees/
            </p>
      `,
      tags: "Problème corriger correction faute"},
    { title: 'Signaler un bug',
      icon: 'ri:bug-line',
      filter: true,
      content: `
          <p>
            Le service a bientôt un an, mais des bugs peuvent subsister. Commencez par actualiser l'application (touche Ctrl + F5),
            certaines mises à jour du service nécessitent un rechargement.
          </p>
          <p>
            En cas de doute, sollicitez-nous à ${mailTo}, en mentionnant la référence de version ci-dessous :
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
    { title: 'Développeurs, utilisez l\'API',
      icon: 'ri:plug-line',
      content: ``,
      component: Iframe,
      fullWidthMobile: true,
      params: {
        src: 'https://matchid.io/link-api',
        style: 'margin-top:-450px;margin-bottom:-1000px;width: 100%;height: 2200px;border-width: 0px;'
      },
      tags: "swagger"
    },
    { title: 'Algorithme de rapprochement d\'identités',
      icon: 'mdi:brain-freeze-outline',
      content: '',
      component: AlgoDetails,
      fullWidthMobile: true,
      tags: 'explication algorithme'
    },
    { title: 'Code open source',
      icon: 'ri:github-line',
      content: `
        <p>
          Le code source de ce site est open source et disponible sur <a href="https://github.com/matchid-project/deces-ui" target="_blank" rel="noopener noreferrer">GitHub</a>,
          ainsi que celui de l'<a href="https://github.com/matchid-project/deces-backend" target="_blank" rel="noopener noreferrer">API</a>.
        </p>
        <p>
          Il est diffusé sous la licence libre <a href="https://spdx.org/licenses/LGPL-3.0.html#licenseText" target="_blank" rel="noopener noreferrer">LGPL 3.0</a>.
        </p>
      `},
    { title: 'Statistiques de consultation',
      icon: 'ri:bar-chart-box-line',
      content: '',
      component: Stats,
      fullWidthMobile: true,
      tags: 'api hits visiteurs'
    },
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
          scrollTo({ref: `#${id}`, duration: 400});
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
