<p><strong>A qui s'adresse ce service</strong></p>
    <p>
        Généalogistes, professionnels ou particuliers, services publics de lutte contre la fraude.
    </p>
<p><strong>Un bug, une question ?</strong></p>
    <p>
        Le service est encore en version bêta (cf conditions d'utilisation).
        Des bugs peuvent subsister. En cas de doute commencez par actualiser l'application (touche Ctrl + F5),
        certaines mises à jours du service nécessitent un rechargement.
        En cas de doute sollicitez nous à <a href="mailto:matchid.project@gmail.com">matchid.project@gmail.com</a>, en mentionnant la référence de version ci-dessous:
    </p>
    <p>
        __APP__ version __APP_VERSION__
    </p>
<p><strong>Evolutions récentes</strong></p>
    <p>
        Nous avons mis récemment à jour l'application pour favoriser les recherches approfondies:
        <br/>
        - une recherche avancée (bouton '+') par année, lieu de naissance
        <br/>
        - une configuration du tri des résultats
    </p>
<p><strong>Evolutions futures</strong></p>
    <p>
        Nous prévoyons prochainement :
    </p>
    <ul>
        <li>
            la possibilité de désactiver de la recherche floue
        </li>
        <li>
            dans la recherche avancée la recherche par plage de date
        </li>
        <li>
            la possibilité de télécharger les fichiers source restreints aux années et départements
    pour favoriser les recherches approfondies.
        </li>
    </ul>

<p><strong>Conditions d'usage et garanties (version bêta)</strong></p>
    <p>
        Ce service vise à faciliter l'accès à l'exploration des données INSEE (cf. menu idoine).
        Il est gratuit, et financé sur fonds personnels. Il est offert sans garantie
        particulière. Etant donné l'affluence, nous avons choisi de consolider et maintenir ce service.
        Les retours sont les bienvenus, nous vous répondrons sur <a href="mailto:matchid.project@gmail.com">matchid.project@gmail.com</a> pour
        toute question, signalement ou tout avis sur le service.
    </p>
    <p>
        Le code source de ce site est disponible sur <a href="https://github.com/matchid-project/deces-ui" target="_blank">GitHub</a>.
        Il est diffusé sous la licence libre <a href="https://spdx.org/licenses/LGPL-3.0.html#licenseText" target="_blank">LGPL 3.0</a>.
    </p>
<p><strong>Utilisation des cookies</strong></p>
    <p>
        Ce site utilise les service Cloudflare et Google Analytics qui déposent chacun un cookie pour connaitre la fréquentation et l'audience
        du site. Les informations sont anonymes (IP anonymisées). Vous pouvez vous désactiver l'enregistrement de cookies depuis sur site et sur d’autres.
        Le moyen le plus efficace consiste à désactiver les cookies dans votre navigateur, n'hésitez pas à consulter l'aide de votre navigateur.
    </p>
<p><strong>Traitement des données avec matchID</strong></p>
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
    large échelle. Le code source de la visualisation est accessible sur <a href="https://github.com/matchid-project/deces-ui" target="_blank">Github</a>.
</p>
<p><strong>Qui sommes nous ?</strong></p>
<p>
    Le projet matchID a été initié au ministère de l'Intérieur dans le contexte des
    challenges d'<a href="https://entrepreneur-interet-general.etalab.gouv.fr/defis/2017/mi-matchid.html" target="_blank">Entrepreneur d'intérêt général</a>.
    La réconciliation des personnes décédées avec le permis de conduire a été le premier cas d'usage réalisé avec
    matchID. Le projet a été libéré et mis en opensource. Nous avons créé de service
    en complément qui semblait d'utilité notamment pour la lutte contre la fraude.
    Pour en savoir plus sur le projet matchID, suivez ce <a href="https://www.matchid.io" target="_blank">lien</a>.
</p>

