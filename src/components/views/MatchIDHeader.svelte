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
                    <span class="rf-service__title" title="matchID - moteur de recherche des personnes décédées">
                        fichier des décès
                    </span>
                    <p class="rf-service__tagline">
                        recherche libre parmi <strong>25 millions de décès</strong>
                        <span class="rf-hide--mobile">depuis 1970</span>
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

    function goToPage(page) {
        burgerState = false;
        if ((page === 'search') && ($route.path === '/search')) {
            toggleAdvancedSearch();
        } else {
            goTo({path: `/${page}`});
        }
    }

</script>

