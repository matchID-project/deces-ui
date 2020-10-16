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
                    <ul class="rf-nav__list">
                        <li
                            class="rf-nav__item rf-nav__item--hoverable"
                            class:rf-nav__item--active={($route.path === '/search')}
                            aria-expanded={expandMenu}
                            aria-controls="rf-recherche"
                            on:click|preventDefault={() => {expandMenu = !expandMenu}}
                        >
                            <span
                                class="rf-btn"
                            >
                                recherche
                            </span>
                            <div
                                class="rf-menu"
                                id="rf-recherche"
                            >
                                <ul class="rf-menu__list">
                                    {#each searchMenu as item}
                                        <li
                                            class="rf-menu__item rf-href"
                                            class:rf-menu__item--active={($route.path === '/search') && item.isActive}
                                            on:click|preventDefault={() => goToPage('search',item.mode)}
                                        >
                                            <span class="rf-link">
                                                {item.title}
                                            </span>
                                        </li>
                                    {/each}
                                </ul>
                            </div>
                        </li>

                        <li
                            class="rf-nav__item"
                            on:click|preventDefault={() => goToPage('link')}
                            class:rf-nav__item--active={($route.path === '/link')}
                        >
                            <span class="rf-link rf-href rf-fi-db-line rf-link--icon-left">
                                appariement
                            </span>
                        </li>
                        <li
                            class="rf-nav__item"
                            on:click|preventDefault={() => goToPage('about')}
                            class:rf-nav__item--active={($route.path === '/about')}
                        >
                            <span class="rf-link rf-href rf-fi-question-line rf-link--icon-left">
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
                    <ul class="rf-nav__list">
                        <li
                            class="rf-nav__item rf-nav__item--hoverable"
                            class:rf-nav__item--active={($route.path === '/search')}
                            aria-expanded={expandMenu}
                            aria-controls="rf-recherche"
                            on:click|preventDefault={() => {expandMenu = !expandMenu}}
                        >
                            <span
                                class="rf-btn"
                            >
                                recherche
                            </span>
                            <div
                                class="rf-menu"
                                id="rf-recherche"
                            >
                                <ul class="rf-menu__list">
                                    {#each searchMenu as item}
                                        <li
                                            class="rf-menu__item rf-href"
                                            class:rf-menu__item--active={($route.path === '/search') && item.isActive}
                                            on:click|preventDefault={() => goToPage('search',item.mode)}
                                        >
                                            <span class="rf-link">
                                                {item.title}
                                            </span>
                                        </li>
                                    {/each}
                                </ul>
                            </div>
                        </li>

                        <li
                            class="rf-nav__item"
                            on:click|preventDefault={() => goToPage('link')}
                            class:rf-nav__item--active={($route.path === '/link')}
                        >
                            <span class="rf-link rf-href rf-fi-db-line rf-link--icon-left">
                                appariement
                            </span>
                        </li>
                        <li
                            class="rf-nav__item"
                            on:click|preventDefault={() => goToPage('about')}
                            class:rf-nav__item--active={($route.path === '/about')}
                        >
                            <span class="rf-link rf-href rf-fi-question-line rf-link--icon-left">
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
    import { toggleAdvancedSearch, enableDisplayMode } from '../tools/search.js';
    import { goTo } from '../tools/routes.js';
    import { route } from '../tools/stores.js';

    // import { createEventDispatcher } from 'svelte';

    // const dispatch = createEventDispatcher();

    let burgerState = false;
    let expandMenu = false;
    let organization;
    let searchMenu;
    let searchOptions;
    let viewOptions;

    $: searchOptions = [
        { title: 'recherche simplifiée',
          mode: 'simple',
          isActive: !$advancedSearch
        },
        { title: 'recherche avancée',
          mode: 'advanced',
          isActive: $advancedSearch
        }
    ];

    $: viewOptions = [
        { title: 'affichage simple',
          mode: 'card',
          isActive: $displayMode === 'card'
        },
        { title: 'affichage complet',
          mode: 'card-expand',
          isActive: $displayMode === 'card-expand'
        },
        { title: 'affichage tableau',
          mode: 'table',
          isActive: $displayMode === 'table'
        },
        { title: 'affichage géoraphique',
          mode: 'geo',
          isActive: $displayMode === 'geo'
        }
    ]

    $: searchMenu = ($route.path === '/search') ? [...searchOptions, ...viewOptions] : searchOptions;

    $: organization = $themeDnum ? 'Ministère<br>de l\'Intérieur' : 'République<br>Française';

    function toggleBurger() {
        burgerState = !burgerState
    }

    function goToPage(page, mode) {
        burgerState = false;
        if ((page === 'search')) {
            if ($route.path !== '/search') {
                goTo({path: `/${page}`});
            }
            if (mode === 'simple') {
                toggleAdvancedSearch(false);
            } else if (mode === 'advanced') {
                toggleAdvancedSearch(true);
            } else {
                enableDisplayMode(mode)
            }
        } else {
            goTo({path: `/${page}`});
        }
    }

</script>
