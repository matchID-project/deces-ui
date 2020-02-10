<nav class="navbar is-fixed-top is-white" role="navigation" aria-label="main navigation">
    <div class="container">
        <div class="navbar-brand">
            <div class="navbar-item logo" on:click={toggleModal}>
                <img src={"/matchID-logo.svg"} alt="matchID Logo" />
            </div>
            <div
                class="navbar-burger"
                class:is-active={burgerState}
                on:click={toggleBurger}
                data-target="navMenu" aria-label="menu" aria-expanded="false"
            >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </div>
        </div>

        <div
            class="navbar-menu"
            class:is-active={burgerState}
            id="navMenu"
        >
            <div class="navbar-start">
                <a class="navbar-item" on:click={toggleModal} href="javascript:void(0);">
                        à propos de ce service
                </a>
                <div class="navbar-item has-dropdown is-hoverable">
                    <div class="navbar-link">
                        <span class="icon">
                            <FontAwesomeIcon icon={faLightbulb} class="icon is-small"/>
                        </span>
                        <span>
                            références
                        </span>
                    </div>
                    <div class="navbar-dropdown">
                        <a class="navbar-item" href="https://www.matchid.io/">
                            <span class="icon">
                              <FontAwesomeIcon icon={faFlask} className="icon is-small"/>
                            </span>
                            <span>
                                matchID
                            </span>
                        </a>
                        <a class="navbar-item" href="https://www.insee.fr/fr/information/4190491">
                            <span class="icon">
                                <FontAwesomeIcon icon={faDatabase} className="icon is-small"/>
                            </span>
                            <span>
                                source INSEE
                            </span>
                        </a>
                        <a class="navbar-item" href="https://www.data.gouv.fr/fr/datasets/fichier-des-personnes-decedees/">
                        <span class="icon">
                            <FontAwesomeIcon icon={faTable} className="icon is-small"/>
                        </span>
                        <span>
                            référence data.gouv
                        </span>
                        </a>
                    </div>
                </div>
            </div>
            <div class="navbar-end is-hidden-mobile">
                <div class="navbar-item">
                    <a
                        class="button is-info"
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURI(window.location)}`}
                        on:click|preventDefault={shareOn.bind(this,'facebook')}
                        target="_blank"
                        title="Partager sur Facebook"
                    >
                        <span class="icon"><FontAwesomeIcon class="is-24" icon={faFacebook}/></span>
                        <span>Facebook</span>
                    </a>
                </div>
                <div class="navbar-item is-hidden-mobile">
                    <a
                        class="button is-info"
                        href={`https://twitter.com/share?url=${encodeURI(window.location)}&via=fabien_antoine&text=${"#genealogistes, utilisez le moteur de recherche #matchID, basé sur le fichier des décès INSEE"}`}
                        on:click|preventDefault={shareOn.bind(this,'twitter')}
                        target="_blank"
                        title="Partager sur Twitter"
                    >
                        <span class="icon"><FontAwesomeIcon class="is-24" icon={faTwitter}/></span>
                        <span>Twitter</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</nav>

<div class="modal" class:is-active={modalState}>
    <div class="modal-background" on:click={toggleModal}></div>
    <div class="modal-card">
        <header class="modal-card-head" on:close={toggleModal}>
            <div class="modal-card-title">
                À propos de ce service
            </div>
            <button class="delete" aria-label="close" on:click={toggleModal}></button>
        </header>
        <section class="modal-card-body">
            <div class="content">
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
                                - une recherche avancée (bouton '+')
                                <br/>
                                - dans cette dernière version, l'indexation des communes et pays
                            </p>
                        <p><strong>Evolutions futures</strong></p>
                            <p>
                                Nous prévoyons prochainement la possibilité de télécharger les fichiers source restreints aux années et départements
                                pour favoriser les recherches approfondies.
                            </p>
                        <p><strong>Fichier des décès de l'INSEE</strong></p>
                            <p>
                                Ce service vise à permettre la recherche directe de personnes décédées. Il repose sur la base opendata
                                délivrée par l'<a href="https://www.insee.fr/fr/information/4190491" target="_blank">INSEE</a> et
                                diffusée par <a href="https://www.data.gouv.fr/fr/datasets/fichier-des-personnes-decedees/" target="_blank">data.gouv.fr</a>.
                            </p>
                            <p>
                                La recherche utilise l'intégralité des données INSEE, soit environ 25 millions d'enregistrements.
                                Elle concerne les déclarations de décès retransmises vers l'INSEE depuis 1970 jusqu'au mois précédent.
                                Seules les personnes ayant eu un numéro INSEE et ayant fait l'objet d'une déclaration de décès, en mairie ou
                                en consulat sont enregistrées. Le délai de déclaration et de transmission peut être variable (personnes disparues, ou
                                recherches historiques e.g. identifications tardives après guerre).
                            </p>
                            <p>
                                Quelques références sur le fichier RNIPP, duquel découle le fichier de décès :<br/>
                                - <a href="https://www.cnil.fr/fr/rnipp-repertoire-national-didentification-des-personnes-physiques-0" target="_blank">Le RNIPP vu par la CNIL</a><br/>
                                - les formulaires de <a href=" https://www.insee.fr/fr/information/1303477" target="_blank">déclaration de décès</a> des communes vers l'INSEE<br/>
                                Ces sites témoignent que le processus centralisé n'est pas simple et a pu manquer d'exhaustivité dans les années antérieures
                                à l'informatisation des systèmes. En cas de doute, n'hésitez pas à nous solliciter, nous répondrons
                                dans la limite de nos connaissances.
                            </p>
                            <p>
                                Les données INSEE sont sous <a href="https://www.etalab.gouv.fr/licence-ouverte-open-licence" target="_blank">Licence Ouverte / Open Licence version 2.0</a>.
                                L’INSEE et donc ce service ne peuvent garantir que les fichiers des personnes décédées sont exempts d’omissions ou d’erreurs.
                                Ce service et l'INSEE ne sauraient encourir aucune responsabilité quant à l’utilisation faite des informations contenues dans ces fichiers.
                                En particulier, les informations contenues dans ces fichiers ne peuvent en aucun cas être utilisées dans un but de certification
                                du statut vital des personnes.
                            </p>
                        <p><strong>Conditions d'usage et garanties (version bêta)</strong></p>
                            <p>
                                Ce service est gratuit, et financé sur fonds personnels. Il est offert sans garantie
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
            </div>
        </section>
        <footer class="modal-card-foot">
        </footer>
    </div>
</div>

<script>

    import FontAwesomeIcon from './FontAwesomeIcon.svelte'

    import {
        faLightbulb
    } from '@fortawesome/free-regular-svg-icons';

    import {
        faFacebook,
        faTwitter
    } from '@fortawesome/free-brands-svg-icons';


    import {
        faDatabase,
        faFlask,
        faTable
    } from '@fortawesome/free-solid-svg-icons';

    // import { createEventDispatcher } from 'svelte';

    // const dispatch = createEventDispatcher();

    let burgerState = false;
    let modalState = false;

    function toggleModal() {
        modalState= !modalState
        console.log(modalState)
    }

    function toggleBurger() {
        burgerState = !burgerState
    }

    const socialURL = (social) => {
        const text='genealogistes, utilisez le moteur de recherche matchID, basé sur le fichier des décès INSEE';
        const url = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURI(window.location)}`,
            twitter: `https://twitter.com/share?url=${encodeURI(window.location)}&via=fabien_antoine&text=${text}&hashtags=matchID,genealogistes`
        };
        return url[social]
    }

    const shareOn = (social) => {
        let h = 300;
        let w = 600;
        const y = window.top.outerHeight / 2 + window.top.screenY - ( h / 2);
        const x = window.top.outerWidth / 2 + window.top.screenX - ( w / 2);
        const options = `menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=${h},width=${w},top=${y},left=${x}`;
        window.open(socialURL(social),'',options);
    }

</script>

<style>

    .delete {
        -moz-appearance:none;
        -webkit-appearance:none;
        background-color:rgba(10,10,10,.2);
        border:none;
        border-radius:290486px;
        cursor:pointer;
        pointer-events:auto;
        display:inline-block;
        flex-grow:0;
        flex-shrink:0;
        font-size:0;
        height:20px;
        max-height:20px;
        max-width:20px;
        min-height:20px;
        min-width:20px;
        outline:none;
        position:relative;
        vertical-align:top;
        width:20px
    }
    .delete:after,
    .delete:before {
        background-color:#fff;
        content:"";
        display:block;
        left:50%;
        position:absolute;
        top:50%;
        transform:translateX(-50%) translateY(-50%) rotate(45deg);
        transform-origin:center center
    }
    .delete:before {
        height:2px;
        width:50%
    }
    .delete:after {
        height:50%;
        width:2px
    }
    .delete:focus,
    .delete:hover {
        background-color:rgba(10,10,10,.3)
    }

    @media print,screen and (min-width:769px) {
        .logo {
        margin-top: -8px;
        margin-bottom: -8px;
        margin-left: -12px;
        }
    }
    @media print,screen and (max-width:768px) {
        .logo {
        margin-top: -8px;
        margin-bottom: -15px;
        margin-left: -12px;
        }
    }

    img {
        height: auto;
        max-width: 100%;
    }

    a {
        color: #3273dc;
        cursor: pointer;
        text-decoration: none;
    }

    a.navbar-item {
        cursor: pointer;
    }

    .icon {
    align-items: center;
    display: inline-flex;
    justify-content: center;
    height: 1.5rem;
    width: 1.5rem;
    }

    .icon.is-small {
    height: 1rem;
    width: 1rem;
    }

    .navbar-link:not(.is-arrowless):after {
    border: 3px solid transparent;
    border-radius: 2px;
    border-right: 0;
    border-top: 0;
    content: " ";
    display: block;
    height: .625em;
    pointer-events: none;
    position: absolute;
    top: 50%;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
    -webkit-transform-origin: center;
    transform-origin: center;
    width: .625em;
    border-color: #3273dc;
    margin-top: -.375em;
    right: 1.125em;
    }

    .navbar {
    background-color: #fff;
    min-height: 3.25rem;
    position: relative;
    z-index: 30;
    }

    .navbar.is-white {
    background-color: #fff;
    color: #0a0a0a;
    }

    .navbar.is-white .navbar-burger {
    color: #0a0a0a;
    }

    @media screen and (max-width:1023px) {
    .navbar>.container {
        display: block;
    }

    .navbar-link:after {
        display: none;
    }

    .navbar-menu {
        background-color: #fff;
        box-shadow: 0 8px 16px rgba(10,10,10,.1);
        padding: .5rem 0;
    }

    .navbar.is-fixed-top .navbar-menu {
        -webkit-overflow-scrolling: touch;
        max-height: calc(100vh - 3.25rem);
        overflow: auto;
    }
    }


    @media screen and (min-width:1024px) {
    .navbar.is-white .navbar-start .navbar-link,.navbar.is-white .navbar-start>.navbar-item {
        color: #0a0a0a;
    }

    .navbar.is-white .navbar-item.has-dropdown:focus .navbar-link,.navbar.is-white .navbar-item.has-dropdown:hover .navbar-link,.navbar.is-white .navbar-start .navbar-link:focus,.navbar.is-white .navbar-start .navbar-link:hover,.navbar.is-white .navbar-start>a.navbar-item:focus,.navbar.is-white .navbar-start>a.navbar-item:hover {
        background-color: #f2f2f2;
        color: #0a0a0a;
    }

    .navbar.is-white .navbar-start .navbar-link:after {
        border-color: #0a0a0a;
    }
    }

    .navbar>.container {
    align-items: stretch;
    display: flex;
    min-height: 3.25rem;
    width: 100%;
    }

    .navbar.is-fixed-top {
    left: 0;
    position: fixed;
    right: 0;
    z-index: 30;
    top: 0;
    }

    .navbar-end {
        justify-content: flex-end;
        margin-left: auto;
    }

    .navbar, .navbar-menu, .navbar-start, .navbar-end {
        align-items: stretch;
        display: flex;
    }

    html.has-navbar-fixed-top {
    padding-top: 3.25rem;
    }

    .navbar-brand {
    align-items: stretch;
    display: flex;
    flex-shrink: 0;
    min-height: 3.25rem;
    }

    .navbar-burger {
    color: #4a4a4a;
    cursor: pointer;
    display: block;
    height: 3.25rem;
    position: relative;
    width: 3.25rem;
    margin-left: auto;
    }

    .navbar-burger span {
    background-color: currentColor;
    display: block;
    height: 1px;
    left: calc(50% - 8px);
    position: absolute;
    -webkit-transform-origin: center;
    transform-origin: center;
    -webkit-transition-duration: 86ms;
    transition-duration: 86ms;
    -webkit-transition-property: background-color,opacity,-webkit-transform;
    transition-property: background-color,opacity,transform;
    transition-property: background-color,opacity,transform,-webkit-transform;
    -webkit-transition-timing-function: ease-out;
    transition-timing-function: ease-out;
    width: 16px;
    }

    .navbar-burger span:first-child {
    top: calc(50% - 6px);
    }

    .navbar-burger span:nth-child(2) {
    top: calc(50% - 1px);
    }

    .navbar-burger span:nth-child(3) {
    top: calc(50% + 4px);
    }

    .navbar-burger:hover {
    background-color: rgba(0,0,0,.05);
    }

    .navbar-burger.is-active span:first-child {
    transform:translateY(5px) rotate(45deg)
    }
    .navbar-burger.is-active span:nth-child(2) {
    opacity:0
    }
    .navbar-burger.is-active span:nth-child(3) {
    transform:translateY(-5px) rotate(-45deg)
    }

    .navbar-menu {
    display: none;
    }

    .navbar-item, .navbar-link {
        color:
        #4a4a4a;
        line-height: 1.5;
        padding: .5rem .75rem;
        position: relative;
    }

    .navbar-link {
    display: block;
    }

    .navbar-item .icon:only-child,.navbar-link .icon:only-child {
    margin-left: -.25rem;
    margin-right: -.25rem;
    }

    .navbar-link:focus,.navbar-link:focus-within,.navbar-link:hover,a.navbar-item:focus,a.navbar-item:focus-within,a.navbar-item:hover {
    background-color: #fafafa;
    color: #3273dc;
    }

    .navbar-item {
    display: block;
    flex-grow: 0;
    flex-shrink: 0;
    }

    .navbar-item.has-dropdown {
    padding: 0;
    }

    .navbar-link:not(.is-arrowless) {
    padding-right: 2.5em;
    }

    .navbar-dropdown {
    font-size: .875rem;
    padding-bottom: .5rem;
    padding-top: .5rem;
    }

    .navbar-dropdown .navbar-item {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    }

    @media screen and (max-width:1023px) {
    .navbar>.container {
        display: block;
    }

    .navbar-link:after {
        display: none;
    }

    .navbar-menu {
        background-color: #fff;
        box-shadow: 0 8px 16px rgba(10,10,10,.1);
        padding: .5rem 0;
    }

    .navbar.is-fixed-top .navbar-menu {
        -webkit-overflow-scrolling: touch;
        max-height: calc(100vh - 3.25rem);
        overflow: auto;
    }

    .navbar-menu.is-active {
        display: block;
    }
    }

    @media screen and (min-width:1024px) {
    .navbar,.navbar-menu,.navbar-start {
        align-items: stretch;
        display: flex;
    }

    .navbar {
        min-height: 3.25rem;
    }

    .navbar.is-transparent .navbar-link:focus,.navbar.is-transparent .navbar-link:hover,.navbar.is-transparent a.navbar-item:focus,.navbar.is-transparent a.navbar-item:hover {
        background-color: transparent!important;
    }

    .navbar.is-transparent .navbar-item.has-dropdown.is-hoverable:focus .navbar-link,.navbar.is-transparent .navbar-item.has-dropdown.is-hoverable:focus-within .navbar-link,.navbar.is-transparent .navbar-item.has-dropdown.is-hoverable:hover .navbar-link {
        background-color: transparent!important;
    }

    .navbar-dropdown a.navbar-item:focus,.navbar-dropdown a.navbar-item:hover,.navbar.is-transparent .navbar-dropdown a.navbar-item:focus,.navbar.is-transparent .navbar-dropdown a.navbar-item:hover {
        background-color: #f5f5f5;
        color: #0a0a0a;
    }

    .navbar-burger {
        display: none;
    }

    .navbar-item,.navbar-link {
        align-items: center;
    }

    .navbar-link {
        display: flex;
    }

    .navbar-item {
        display: flex;
    }

    .navbar-item.has-dropdown {
        align-items: stretch;
    }

    .navbar-item.is-hoverable:focus .navbar-dropdown,.navbar-item.is-hoverable:focus-within .navbar-dropdown,.navbar-item.is-hoverable:hover .navbar-dropdown {
        display: block;
    }

    .navbar-item.is-hoverable:focus .navbar-dropdown.is-boxed,.navbar-item.is-hoverable:focus-within .navbar-dropdown.is-boxed,.navbar-item.is-hoverable:hover .navbar-dropdown.is-boxed {
        opacity: 1;
        pointer-events: auto;
        -webkit-transform: translateY(0);
        transform: translateY(0);
    }

    .navbar-menu {
        flex-grow: 1;
        flex-shrink: 0;
    }

    .navbar-start {
        justify-content: flex-start;
        margin-right: auto;
    }

    .navbar-dropdown {
        background-color: #fff;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        border-top: 2px solid #dbdbdb;
        box-shadow: 0 8px 8px rgba(10,10,10,.1);
        display: none;
        font-size: .875rem;
        left: 0;
        min-width: 100%;
        position: absolute;
        top: 100%;
        z-index: 20;
    }

    .navbar-dropdown .navbar-item {
        padding: .375rem 1rem;
        white-space: nowrap;
    }

    .navbar-dropdown a.navbar-item {
        padding-right: 3rem;
    }

    .navbar>.container .navbar-brand {
        margin-left: -.75rem;
    }

    .navbar>.container .navbar-menu {
        margin-right: -.75rem;
    }

    .navbar-item.has-dropdown:focus .navbar-link,.navbar-item.has-dropdown:hover .navbar-link {
        background-color: #fafafa;
    }
    }

    .navbar-link {
    cursor: pointer;
    }

    .container {
    flex-grow: 1;
    margin: 0 auto;
    position: relative;
    width: auto;
    }


    @media screen and (min-width:1024px) {
    .container {
        max-width: 960px;
    }
    }

    @media screen and (min-width:1216px) {
    .container {
        max-width: 1152px;
    }
    }

    @media screen and (min-width:1408px) {
    .container {
        max-width: 1344px;
    }
    }

    .navbar.is-white .navbar-start .navbar-link::after {
        border-color:
        #0a0a0a;
    }


    .modal,
    .modal-background {
    bottom:0;
    left:0;
    position:absolute;
    right:0;
    top:0
    }
    .modal {
    align-items:center;
    display:none;
    flex-direction:column;
    justify-content:center;
    overflow:hidden;
    position:fixed;
    z-index:40
    }
    .modal.is-active {
    display:flex
    }
    .modal-background {
    background-color:rgba(10,10,10,.86)
    }
    .modal-card,
    .modal-content {
    margin:0 20px;
    max-height:calc(100vh - 160px);
    overflow:auto;
    position:relative;
    width:100%
    }
    @media print,screen and (min-width:769px) {
    .modal-card,
    .modal-content {
        margin:0 auto;
        max-height:calc(100vh - 40px);
        width:640px
    }
    }
    .modal-close {
        background:none;
        height:40px;
        position:fixed;
        right:20px;
        top:20px;
        width:40px
    }
    .modal-card {
        display:flex;
        flex-direction:column;
        max-height:calc(100vh - 40px);
        overflow:hidden;
        -ms-overflow-y:visible
    }
    .modal-card-foot,
    .modal-card-head {
        align-items:center;
        background-color:#f5f5f5;
        display:flex;
        flex-shrink:0;
        justify-content:flex-start;
        padding: 20px;
        position:relative
    }
    .modal-card-head {
        border-bottom:1px solid #dbdbdb;
        border-top-left-radius:6px;
        border-top-right-radius:6px;
    /* padding: 0px 20px 0px 20px; */
    }
    .modal-card-title {
        color:#363636;
        flex-grow:1;
        flex-shrink:0;
        font-size:1.5rem;
        line-height:1
    }
    .modal-card-foot {
        border-bottom-left-radius:6px;
        border-bottom-right-radius:6px;
        border-top:1px solid #dbdbdb
    }
    .modal-card-foot .button:not(:last-child) {
        margin-right:.5em
    }
    .modal-card-body {
        -webkit-overflow-scrolling:touch;
        background-color:#fff;
        flex-grow:1;
        flex-shrink:1;
        overflow:auto;
        padding:20px
    }
    .modal-container {
        z-index:100;
        position:fixed
    }

  .button {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    align-items: center;
    border: 1px solid transparent;
    border-radius: 4px;
    box-shadow: none;
    display: inline-flex;
    font-size: 1rem;
    height: 2.25em;
    line-height: 1.5;
    position: relative;
    vertical-align: top;
    background-color: #fff;
    border-color: #dbdbdb;
    border-width: 1px;
    color: #363636;
    cursor: pointer;
    justify-content: center;
    padding: calc(.375em - 1px) .75em;
    text-align: center;
    white-space: nowrap;
    box-sizing: border-box;
  }

  .button:active,.button:focus {
    outline: 0;
  }

  .button:hover {
    border-color: #b5b5b5;
    color: #363636;
  }

  .button:focus {
    border-color: #3273dc;
    color: #363636;
  }

  .button:focus:not(:active) {
    box-shadow: 0 0 0 .125em rgba(50,115,220,.25);
  }

  .button:active {
    border-color: #4a4a4a;
    color: #363636;
  }

  .button.is-info,.button.is-info:hover {
    background-color: #209cee;
    border-color: transparent;
    color: #fff;
  }

  .button.is-info:hover {
    background-color: #1496ed;
  }

  .button.is-info:focus {
    border-color: transparent;
    color: #fff;
  }

  .button.is-info:focus:not(:active) {
    box-shadow: 0 0 0 .125em rgba(32,156,238,.25);
  }

  .button.is-info:active {
    background-color: #118fe4;
    border-color: transparent;
    color: #fff;
  }

 .icon {
    margin-right: 8px
 }

    @media print,screen and (max-width:768px) {
        .is-hidden-mobile {
            display: none!important;
        }
    }

    *, ::after, ::before {
        box-sizing: inherit;
    }

</style>
