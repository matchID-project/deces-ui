<header class="rf-header">
    <div class="rf-container">
        <div class="rf-header__body">
            <div class="rf-header__brand">
                <span class="rf-logo" title="{organization.replace(/<br>/,' ')}">
                    <span class="rf-logo__title">
                        {@html organization}
                    </span>
                </span>
            </div>
            <div class="rf-header__navbar">
                <div class="rf-service">
                    <span class="rf-service__title" title="matchID - moteur de recherche des personnes décédées">
                        fichier des décès
                    </span>
                    <p class="rf-service__tagline">
                        recherche <span class="rf-hide--mobile">libre</span> parmi <strong>25 millions de décès</strong>
                        {#if !$themeDnum}
                            <span class="rf-hide--mobile">depuis 1970</span>
                        {/if}
                    </p>
                </div>
                <span
                    class="rf-btn rf-fi-menu-fill"
                    on:click|preventDefault={toggleBurger}
                >
                </span>
            </div>
            <div class="rf-header__tools">
                <div class="rf-shortcuts" role="navigation" aria-label="Menu principal">
                    <ul class="rf-shortcuts__list">
                        <li class="rf-shortcuts__item">
                            <span
                                class="rf-link rf-href rf-fi-change-line rf-link--icon-left"
                                on:click|preventDefault={() => goToPage('search')}
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
                                on:click|preventDefault={() => goToPage('link')}
                            >
                            appariement
                            </span>
                        </li>
                        <li class="rf-shortcuts__item">
                            <span
                                class="rf-link rf-href rf-fi-question-line rf-link--icon-left"
                                on:click|preventDefault={() => goToPage('about')}
                            >
                                à propos
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
            {#if $themeDnum}
                    <img
                        src={"/dnum-logo-round.svg"}
                        style="position:relative;z-index:1200;top:0px;right:0px;"
                        alt="DNUM Logo"
                        height="80px"
                        width="80px"
                    />
            {/if}
            <div
                class="rf-header__popin"
                class:rf-header__popin--expanded={burgerState}
            >
                <span
                    class="rf-btn rf-fi-close-line"
                    on:click|preventDefault={toggleBurger}
                >
                </span>
                <ul class="rf-shortcuts__list">
                    <li class="rf-shortcuts__item">
                        <span
                            class="rf-link rf-href rf-fi-change-line rf-link--icon-left"
                            on:click|preventDefault={() => goToPage('search')}
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
                            on:click|preventDefault={() => goToPage('link')}
                        >
                        appariement
                        </span>
                    </li>
                    <li class="rf-shortcuts__item">
                        <span
                            class="rf-link rf-href rf-fi-question-line rf-link--icon-left"
                            on:click|preventDefault={() => goToPage('about')}
                        >
                            à propos
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</header>

<script>
    import { themeDnum, advancedSearch, displayMode } from '../tools/stores.js';
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
    let organization;

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


    $: organization = $themeDnum ? 'Ministère<br>de l\'Intérieur' : 'République<br>Française';

    function toggleBurger() {
        burgerState = !burgerState
    }

    function goToPage(page) {
        burgerState = false;
        if ((page === 'search') && ($route.path === '/search')) {
            toggleAdvancedSearch();
        } else {
            goTo({path: `/${page}`});
        }
    }

</script>
