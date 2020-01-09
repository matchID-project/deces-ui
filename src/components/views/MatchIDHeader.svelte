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
                        <FontAwesomeIcon icon={faLightbulb} class="icon is-small"/>
                        &nbsp; références
                    </div>
                    <div class="navbar-dropdown">
                        <a class="navbar-item" href="https://www.matchid.io/">
                            <FontAwesomeIcon icon={faFlask} className="icon is-small"/>
                            &nbsp; &nbsp; matchID
                        </a>
                        <a class="navbar-item" href="https://www.insee.fr/fr/information/4190491">
                            <FontAwesomeIcon icon={faDatabase} className="icon is-small"/>
                            &nbsp; &nbsp; source INSEE
                        </a>
                        <a class="navbar-item" href="https://www.data.gouv.fr/fr/datasets/fichier-des-personnes-decedees/">
                            <FontAwesomeIcon icon={faTable} className="icon is-small"/>
                            &nbsp; &nbsp; référence data.gouv
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</nav>

<script>

    import FontAwesomeIcon from './FontAwesomeIcon.svelte'

    import {
        faLightbulb
    } from '@fortawesome/free-regular-svg-icons';

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
        modalState = !modalState
    }

    function toggleBurger() {
        burgerState = !burgerState
    }

</script>

<!-- <Modal show={modalState} onClose={toggleModal}>
    <Modal.Card>
        <Modal.Card.Head onClose={toggleModal}>
            <Modal.Card.Title>
                À propos de ce service
            </Modal.Card.Title>
        </Modal.Card.Head>
        <Modal.Card.Body>
            <Content>
            <p><strong>Conditions d'usage et garanties (version alpha)</strong></p>
                <p>
                    Ce service est financé sur fonds personnels et est donc offert sans garantie.
                    L'usage est limité à une requête par seconde afin de préserver un service pour tous. Selon
                    l'affluence et les retours, nous envisagerons de le consolider. Contactez nous
                    sur <a href="mailto:matchid.project@gmail.com">matchid-project@gmail.com</a> pour
                    toute question ou signaler un problème.
                </p>
                <p><strong>Fichier des personnes décédées</strong></p>
                <p>
                    Ce service vise à permettre la recherche directe de personnes décédées. Il exploite la base opendata
                    délivrée par l'<a href="https://www.insee.fr/fr/information/4190491">INSEE</a> et
                    diffusée par <a href="https://www.data.gouv.fr/fr/datasets/fichier-des-personnes-decedees/">data.gouv.fr</a>.
                </p>
                <p>
                    Ce service utilise l'intégralité des données INSEE, soit environ 25 millions d'enregistrements.
                    Il concerne les déclarations de décès retransmises vers l'INSEE depuis 1970 jusqu'au mois précédent.
                    Seules les personnes ayant eu un numéro INSEE et ayant fait l'objet d'une déclaration de décès, en mairie ou
                    en consulat sont enregistrées. Le délai de déclaration et de transmission peut être variable (personnes disparues, ou
                    recherches historiques e.g. identifications tardives après guerre).
                </p>
                <p><strong>Traitement des données avec matchID</strong></p>
                <p>
                    Les données sont traitées avec l'outil opensource <a href="https://matchid.io">matchID</a> (Python/Pandas). Les traitements, disponibles
                    disponibles <a href="https://github.com/matchid-project/personnes-decedees_search">ici</a>,
                    consistent en une mise en forme (capitalisation, réconciliation avec les noms de pays et commune
                    selon les référentiels INSEE) puis une indexation. Les données sont actualisées chaque mois, après chaque diffusion sur le
                    site <a href="https://www.data.gouv.fr/fr/datasets/fichier-des-personnes-decedees/">data.gouv.fr</a>.
                </p>
                <p>La recherche et l'indexation reposent sur <a href="https://elastic.co">Elasticsearch</a>
                qui repose sur le moteur de recherche Lucène, qui apporte le bénéfice
                des <a href="https://wikipedia.org/wiki/Recherche_approximative">recherches floues</a> à
                large échelle. La visualisation est basée
                sur <a href="https://swiftype.com/search-ui">Search-UI</a>.
                Le code source est accessible sur <a href="https://github.com/matchid-project/personnes-decedees_search-ui">Github</a>.
                </p>
                <p><strong>Qui sommes nous ?</strong></p>
                <p>
                    Le projet matchID a été initié au ministère de l'Intérieur dans le contexte des
                    challenges d'<a href="https://entrepreneur-interet-general.etalab.gouv.fr/defis/2017/mi-matchid.html">Entrepreneur d'intérêt général</a>.
                    La réconciliation des personnes décédées avec le permis de conduire a été le premier cas d'usage réalisé avec
                    matchID. Le projet a été libéré et mis en opensource. Nous avons créé de service
                    en complément qui semblait d'utilité notamment pour la lutte contre la fraude.
                    Pour en savoir plus sur le projet matchID, suivez ce <a href="https://matchid.io">lien</a>.
                </p>
            </Content>
        </Modal.Card.Body>
        <Modal.Card.Foot>
        </Modal.Card.Foot>
    </Modal.Card>
</Modal> -->

<style>

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

</style>
