
# Conditions d'usage et garanties (version alpha)

Ce service est développé avec le ministère de l'Intérieur. Néanmoins, la mise en ligne de service est financé sur fonds personnels et est donc offert sans garantie.
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

Le service de recherche est disponilbe depuis le 1er janvier 2002 sur <a href="https://deces.matchid.io" title="deces.matchid.io" target="_blank">deces.matchid.io</a>. Un service d'appariement en masse est également <a href="https://deces.matchid.io/link" title="deces.matchid.io" target="_blank">disponible ici</a>.

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
