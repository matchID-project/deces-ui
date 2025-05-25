# Conditions d'usage et garanties

Ce service a éte développé partiellement avec le ministère de l'Intérieur, et est maintenant 100% en maintenance bénévole.
La mise en ligne de service est financé sur fonds personnels et est donc offert sans garantie.
L'usage est limité à une requête par seconde afin de préserver un service pour tous. Selon
l'affluence et les retours, nous envisagerons de le consolider. Contactez nous
sur <a href="mailto:matchid.project@gmail.com">matchid-project@gmail.com</a> pour
toute question ou signaler un problème.

# Fichier des personnes décédées
Ce service vise à permettre la recherche directe de personnes décédées. Il exploite la base opendata
délivrée par l'<a href="https://www.insee.fr/fr/information/4190491">INSEE</a> et
diffusée par <a href="https://www.data.gouv.fr/fr/datasets/fichier-des-personnes-decedees/">data.gouv.fr</a>.

Ce service utilise l'intégralité des données INSEE, soit plus de 25 millions d'enregistrements.
Il concerne les déclarations de décès retransmises vers l'INSEE depuis 1970 jusqu'au mois précédent.
Seules les personnes ayant eu un numéro INSEE et ayant fait l'objet d'une déclaration de décès, en mairie ou
en consulat sont enregistrées. Le délai de déclaration et de transmission peut être variable (personnes disparues, ou
recherches historiques e.g. identifications tardives après guerre).

Le service de recherche est disponilbe depuis le 1er janvier 2020 sur <a href="https://deces.matchid.io" title="deces.matchid.io" target="_blank">deces.matchid.io</a>. Un service d'appariement en masse est également <a href="https://deces.matchid.io/link" title="deces.matchid.io" target="_blank">disponible ici</a>.

La présentation de l'ensemble des services matchID est disponible sur le site <a href="https://matchid.io" title="matchid.io" target="_blank">matchid.io</a>.

# Traitement des données avec matchID
Les données sont traitées avec l'outil opensource <a href="https://matchid.io">matchID</a> (Python/Pandas). Les traitements, disponibles
disponibles <a href="https://github.com/matchid-project/personnes-decedees_search">ici</a>,
consistent en une mise en forme (capitalisation, réconciliation avec les noms de pays et commune
selon les référentiels INSEE) puis une indexation. Les données sont actualisées chaque mois, après chaque diffusion sur le
site <a href="https://www.data.gouv.fr/fr/datasets/fichier-des-personnes-decedees/">data.gouv.fr</a>.

La recherche et l'indexation reposent sur <a href="https://elastic.co">Elasticsearch</a>
qui repose sur le moteur de recherche Lucène, qui apporte le bénéfice
des <a href="https://wikipedia.org/wiki/Recherche_approximative">recherches floues</a> à
large échelle. La visualisation est basée
sur <a href="https://swiftype.com/search-ui">Search-UI</a>.
Le code source est accessible sur <a href="https://github.com/matchid-project/personnes-decedees_search-ui">Github</a>.

# Qui sommes nous ?
Le projet matchID a été initié au ministère de l'Intérieur dans le contexte des
challenges d'<a href="https://entrepreneur-interet-general.etalab.gouv.fr/defis/2017/mi-matchid.html">Entrepreneur d'intérêt général</a>.
La réconciliation des personnes décédées avec le permis de conduire a été le premier cas d'usage réalisé avec
matchID. Le projet a été libéré et mis en opensource. Nous avons créé de service
en complément qui semblait d'utilité notamment pour la lutte contre la fraude.
Pour en savoir plus sur le projet matchID, suivez ce <a href="https://matchid.io">lien</a>.
Aujourd'hui le projet est composé de personnes travaillant dans l'administration (ministere de l'intérieur, ministère de la justice)

# Données personnelles

## Suppression des données : article 85 de la loi CNIL

Les données de décès du site deces.matchid.io proviennent du site [data.gouv.fr](https://www.data.gouv.fr/fr/datasets/fichier-des-personnes-decedees/).

Les données de décès ne sont pas soumises au RGPD directement (l'article 21 de la loi CNIL ne s'applique pas), mais à l'[article 85 de la loi CNIL](https://www.cnil.fr/fr/la-loi-informatique-et-libertes#article85) prévoyant les conditions de conservation et suppression de données après le décès. L'équipe matchID met tout en oeuvre pour oeuvrer à la suppression des données dans un délai rapide.

Les tiers, ayants-droits ou héritiers peuvent de plus consulter la page « Protection des données personnelles » du site Insee.fr (https://www.insee.fr/fr/information/3719162), où ils trouveront des informations de contact leur permettant d'effectuer la démarche directement sur le fichier source. 

L'INSEE met à disposition un fichier d'opposition permettant à chaque réutilisateur de ces données de décès. Ces opposition sont prises en compte sur deces.matchid.io, a minima chaque mois.

## Traitement d'appariements

Les personnes morales et physique utilisant la fonction d'appariement deces.matchid.io engagent leur responsabilité lorsqu'ils soumettent fichier nécessairement soumis au RGPD, à partir du moment où des personnes vivantes sont potentiellement incluses audit fichier.

Le site deces.matchid.io devient dès lors implicitement sous-traitant au sens RGPD. Dès lors qu'aujourd'hui le site n'est pas soumis à l'obligation d'une identification, toute responsabilité quand à l'alerte d'une rupture de sécurité dans le traitement technique des données. Nous vous engageons donc à vous signaler auprès de l'équipe à matchid-project@gmail.com pour nouer le lien réciproque minimal nous permettant de vous alerter en cas de traitement récurrent.

Les conditions générales de traitement sont les suivantes :
- le fichier soumis est stocké chiffré pendant la durée du traitement et supprimé à l'issue
- le fichier complété est stocké chiffré et conservé 1h à l'issue du traitement
- la clé de chiffrement est uniquement accessible de l'application (et n'est pas accessible des opérateurs)
- le protocole est AES256, et la clé est renouvelée chaque mois
- l'opérateur d'hébergement est Scaleway (région Parisienne - fr-par-1, suceptible de bouger à tout moment sur fr-par-2)

Lors de l'utilisation de l'application (plutôt que l'API) deces.matchid.io, les données résultantes sont stockées en clair dans le stockage local du navigateur. L'utilisation de la fonction de suppression (icône "poublelle") supprime définitivement les données. Néanmoins deces.matchid.io n'est pas responsable de la configuration du navigateur que vous utilisez et des failles potentielles qu'elle peut engendrer.

## Cookies et données stockées sur le navigateurs

Les cookies utilisés sont ceux de Cloudflare pour des raisons techniques, ainsi que Google Ads lors des campagnes de financement du site (c'est le cas depuis debut fin aout 2022), les revenus ayant pour seul but le financement des serveurs.

Aucun cookie n'est utilisé par ailleurs par l'application matchID.

## Données de statistiques

L'application matchID conserve 12 mois les données de log pour des raisons de sécurité du traitement. 

# Développement

## Prérequis

- Docker et Docker Compose
- Node.js (version spécifiée dans package.json)
- Make
- Git

## Stack technique

- Frontend : Svelte 3.x avec Rollup pour le bundling
- Backend : TypeScript
- Tests : Playwright
- Base de données : Elasticsearch
- Reverse Proxy : Nginx
- CI/CD : GitHub Actions

## Structure du projet

Le projet est composé de plusieurs parties :
- Frontend (Svelte) : `src/`
- Backend (TypeScript) : `deces-backend/`
- Configuration Nginx : `nginx/`
- Tests (Playwright) : `ui-test/`
- Préparation des données : `deces-dataprep/`

## Commandes de développement

Les commandes principales sont disponibles via le Makefile :

```bash
# Configuration initiale
make config

# Démarrage de l'environnement de développement
make dev

# Construction des images Docker
make build

# Tests
make test
```

## Environnement de développement

L'environnement de développement utilise Docker Compose avec la configuration `docker-compose-dev.yml`. Il inclut :
- Un serveur Nginx pour le reverse proxy
- Un conteneur frontend pour le développement Svelte
- Un conteneur backend (optionnel)
- Elasticsearch pour la base des décès (indexé via le projet deces-dataprep)

## CI/CD

Le projet utilise GitHub Actions pour la CI/CD avec les workflows suivants :
- `push.yml` : Build et déploiement sur push
- `pr.yml` : Vérifications sur les pull requests
- `build.yml` : Construction des images Docker
- `logs-*.yml` : Gestion des logs

## Variables d'environnement

Les variables d'environnement importantes sont :
- `PORT` : Port du serveur de développement (défaut: 8083)
- `BACKEND_PORT` : Port du backend (défaut: 8080)
- `ES_HOST` : Hôte Elasticsearch (défaut: elasticsearch)
- `ES_PORT` : Port Elasticsearch (défaut: 9200)

## Bonnes pratiques

1. Toujours exécuter les tests avant de pousser du code
2. Suivre les conventions de style Svelte
3. Documenter les changements majeurs
4. Utiliser les branches feature pour le développement
5. Maintenir la compatibilité avec les versions spécifiées dans package.json
