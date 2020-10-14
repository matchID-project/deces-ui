<header class="rf-header">
    <div class="rf-container">
        <div class="rf-header__body">
            <div class="rf-header__brand">
                <span class="rf-logo" title="République Française">
                    <span class="rf-logo__title">
                        République
                        <br>Française
                    </span>
                </span>
            </div>
            <div class="rf-header__navbar">
                <div class="rf-service">
                    <span class="rf-service__title" title="Nom du service">
                        fichier des décès
                    </span>
                    <p class="rf-service__tagline">
                        recherche libre parmi <strong>25 millions de décès</strong> depuis 1970
                    </p>
                </div>
            </div>
            <div class="rf-header__tools">
                <div class="rf-shortcuts">
                    <ul class="rf-shortcuts__list">
                        <li class="rf-shortcuts__item">
                            <span
                                class="rf-link rf-href rf-fi-change-line rf-link--icon-left"
                                on:click|preventDefault={() => {
                                    if ($route.path !== '/search') {
                                        goTo({path: '/search'});
                                    } else {
                                        toggleAdvancedSearch();
                                    }
                                }}
                            >
                                recherche
                                {
                                    ($route.path === '/search')
                                        ? ( $advancedSearch ? 'simplifiée' : 'avancée' )
                                        : ''
                                }
                            </span>
                        </li>
                        <li class="rf-shortcuts__item">
                            <span
                                class="rf-link rf-href rf-fi-db-line rf-link--icon-left"
                                on:click|preventDefault={() => goTo({path: '/link'})}
                            >
                            appariement
                            </span>
                        </li>
                        <li class="rf-shortcuts__item">
                            <span
                                class="rf-link rf-href rf-fi-question-line rf-link--icon-left"
                                on:click|preventDefault={() => goTo({path: '/about'})}
                            >
                                à propos
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    </div>
</header>

<!-- <nav class="ztop navbar is-fixed-top is-white" role="navigation" aria-label="main navigation">
    <div class="container">
        <div class="navbar-brand">

            {#if !$themeDnum}
                <a class="logo" href="/search">
                    <img src={"/matchID-logo.svg"} alt="matchid Logo"/>
                </a>
            {:else}
                <a class="logo is-hidden-mobile" href="/search">
                    <img src={"/matchID-logo.svg"} alt="matchid Logo"/>
                </a>
                <a class="logo is-hidden-desktop" style="z-index:1200;position:absolute;margin-top:-10px;margin-left:-10px;" href="/search">
                    <img src={"/dnum-logo-round.svg"} alt="dnum Logo"/>
                </a>
            {/if}
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
                <div class="navbar-item has-dropdown is-hoverable">
                    <div class="navbar-link">
                        <span class="icon">
                            <FontAwesomeIcon icon={faSearch} class="icon"/>
                        </span>
                        <span>
                            recherche
                        </span>
                    </div>
                    <div class="navbar-dropdown">
                        <a class="navbar-item" href="/search">
                            <span class="icon">
                              <FontAwesomeIcon icon={faMagic} className="icon is-small"/>
                            </span>
                            <span>
                                simple
                            </span>
                        </a>
                        <a class="navbar-item" href="/search?advanced=true">
                            <span class="icon">
                                <FontAwesomeIcon icon={faThList} className="icon is-small"/>
                            </span>
                            <span>
                                avancée
                            </span>
                        </a>
                        <a class="navbar-item" href="/geo?advanced=true&fuzzy=false">
                            <span class="icon">
                                <FontAwesomeIcon icon={faGlobeEurope} className="icon is-small"/>
                            </span>
                            <span>
                                géographique
                            </span>
                        </a>
                            <a class="navbar-item" href="/link">
                            <span class="icon">
                                <FontAwesomeIcon icon={faCoins} className="icon is-small"/>
                            </span>
                            <span>
                                appariement
                            </span>
                        </a>
                    </div>
                </div>
                <div class="navbar-item has-dropdown is-hoverable">
                    <div class="navbar-link">
                        <span class="icon">
                            <FontAwesomeIcon icon={faQuestion} class="icon"/>
                        </span>
                        <span>
                            à propos
                        </span>
                    </div>
                    <div class="navbar-dropdown">
                        {#each aboutMenu as about}
                            <a class="navbar-item" href={`${about.url}`}>
                                <span class="icon">
                                    <FontAwesomeIcon icon={about.icon} class="icon"/>
                                </span>
                                <span> {about.title} </span>
                            </a>
                        {/each}
                    </div>
                </div>
                <div class="navbar-item has-dropdown is-hoverable">
                    <div class="navbar-link">
                        <span class="icon">
                            <FontAwesomeIcon icon={faLink} class="icon"/>
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
            {#if $themeDnum}
                <div class="navbar-end is-hidden-mobile">
                    {#if $socialIcons}
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
                        <div class="navbar-item">
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
                    {/if}
                    {#if $themeDnum}
                        <a class="logo" href="/search">
                            <img src={"/dnum-logo-round.svg"} style="position:absolute;z-index:1200;right:50px;" alt="DNUM Logo" height="110px" width="110px"  />
                        </a>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</nav> -->

<script>
    import { socialIcons, themeDnum, advancedSearch, displayMode } from '../tools/stores.js';
    import FontAwesomeIcon from './FontAwesomeIcon.svelte';
    import SearchBox from './SearchBox.svelte';
    import { toggleAdvancedSearch } from '../tools/search.js';
    import { goTo } from '../tools/routes.js';
    import { route } from '../tools/stores.js';

    import {
        faAddressCard,
        faCog,
        faCoins,
        faDatabase,
        faGlobeEurope,
        faGripLines,
        faMagic,
        faPlug,
        faPlus,
        faMinus,
        faSearch,
        faTable
    } from '@fortawesome/free-solid-svg-icons';

    import {
        faFacebook,
        faTwitter
    } from '@fortawesome/free-brands-svg-icons';

    // import { createEventDispatcher } from 'svelte';

    // const dispatch = createEventDispatcher();

    let burgerState = false;
    let modalState = false;
    let modalContent = 'service';
    let aboutMenu = [
      {
        url: '/about/service',
        icon: faSearch,
        title:'ce service'
      },
      {
        url: '/about/data',
        icon: faDatabase,
        title: 'données INSEE'
      },
      {
        url: '/deces/api/v1/docs',
        icon: faPlug,
        title:'documentation API'
      }
    ]

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
    .ztop {
        z-index: 1200 !important;
    }
</style>
