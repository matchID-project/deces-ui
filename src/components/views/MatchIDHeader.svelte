<header class="rf-header">
    <div class="rf-container rf-container__header">
        <div class="rf-header__body">
            <div class="rf-header__brand">
                <span class="rf-logo" title="{organization.replace(/<br>/,' ')}">
                    <span class="rf-logo__title">
                        {@html organization}
                    </span>
                </span>
            </div>
            {#if $themeDnum}
                    <img
                        src={"/dnum-logo-round.svg"}
                        class="rf-hide--desktop"
                        alt="DNUM Logo"
                        height="80px"
                        width="80px"
                    />
            {/if}
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
            </div>
            <div class="rf-header__tools">
                <div class="rf-shortcuts" role="navigation" aria-label="Menu principal">
                    <ul class="rf-nav__list">
                        <li
                            class="rf-nav__item rf-nav__item--hoverable rf-nav__item--shadow"
                            class:rf-nav__item--active={($route.path === '/search')}
                        >
                            <button
                                class="rf-btn"
                                aria-expanded={expandMenu}
                                aria-controls="rf-recherche"
                            >
                                recherche
                            </button>
                            <div
                                class="rf-menu"
                                id="rf-recherche"
                            >
                                <ul class="rf-menu__list">
                                    <li class="rf-menu__item">
                                        <strong>mode de recherche</strong>
                                    </li>
                                    {#each searchOptions as item}
                                        <li
                                            class="rf-menu__item rf-href"
                                            class:rf-menu__item--active={($route.path === '/search') && item.isActive}
                                            on:click|preventDefault={() => goToPage('search',item.mode)}
                                        >
                                            <tr>
                                                <td class="rf-td--vcenter rf-padding-right-1N">
                                                    <Icon class="rf-fi" icon={item.icon}/>
                                                </td>
                                                <td class="rf-td--vcenter">
                                                    {item.title}
                                                </td>
                                            </tr>
                                        </li>
                                    {/each}
                                    <li
                                        class="rf-menu__item"
                                        class:rf-inactive={!viewOptionsActive}
                                    >
                                        <strong>mode d'affichage</strong>
                                    </li>
                                    {#each viewOptions as item}
                                        <li
                                            class="rf-menu__item"
                                            class:rf-menu__item--active={($route.path === '/search') && item.isActive}
                                            class:rf-href={viewOptionsActive}
                                            class:rf-inactive={!viewOptionsActive}
                                            on:click|preventDefault={() => {
                                                if (viewOptionsActive) {
                                                    goToPage('search',item.mode)
                                                }
                                            }}
                                        >
                                            <tr>
                                                <td class="rf-td--vcenter rf-padding-right-1N">
                                                    <Icon icon={item.icon}/>
                                                </td>
                                                <td class="rf-td--vcenter">
                                                    {item.title}
                                                </td>
                                            </tr>
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
                        class="rf-hide--mobile"
                        style="position:relative;z-index:1200;top:0px;right:-30px;"
                        alt="DNUM Logo"
                        height="80px"
                        width="80px"
                    />
            {/if}
            <div class="rf-hide--desktop" style="position: absolute; top: 8px; right: 8px">
                    <button
                        class="rf-btn rf-fi-menu-fill rf-btn--icon rf-background--white rf-color--black"
                        aria-controls="header-nav-popin"
                        on:click|preventDefault={toggleBurger}
                        title="ouvrir le menu"
                    >
                    </button>
                <div>
            <div
                id="header-nav-popin"
                class="rf-header__tools rf-header__popin rf-hide--desktop"
                class:rf-header__popin--expanded={burgerState}
            >
                <button
                    class="rf-btn rf-fi-close-line rf-btn--icon-right rf-btn--sm"
                    on:click={toggleBurger}
                    title="fermer"
                    aria-controls="header-nav-popin"
                >
                    <span>
                        fermer
                    </span>
                </button>
                <nav role="navigation" aria-label="Menu mobile">
                    <ul class="rf-nav__list">
                        <li
                            class="rf-nav__item"
                            class:rf-nav__item--active={($route.path === '/search')}
                            aria-expanded={expandMenu}
                            aria-controls="rf-recherche-popin"
                        >
                            <button
                                class="rf-btn"
                                aria-expanded={expandMenu}
                                on:click|preventDefault={() => {expandMenu = !expandMenu}}
                            >
                                recherche
                            </button>
                            <div
                                class="rf-menu"
                                class:rf-menu--expanded={expandMenu}
                                id="rf-recherche-popin"
                            >
                                <ul class="rf-menu__list">
                                    <li class="rf-menu__item">
                                        <strong>mode de recherche</strong>
                                    </li>
                                    {#each searchOptions as item}
                                        <li
                                            class="rf-menu__item rf-href"
                                            class:rf-menu__item--active={($route.path === '/search') && item.isActive}
                                            on:click|preventDefault={() => goToPage('search',item.mode)}
                                        >
                                            <tr>
                                                <td class="rf-td--vcenter rf-padding-right-1N">
                                                    <Icon class="rf-fi" icon={item.icon}/>
                                                </td>
                                                <td class="rf-td--vcenter">
                                                    {item.title}
                                                </td>
                                            </tr>
                                        </li>
                                    {/each}
                                    <li
                                        class="rf-menu__item"
                                        class:rf-inactive={!viewOptionsActive}
                                    >
                                        <strong>mode d'affichage</strong>
                                    </li>
                                    {#each viewOptions as item}
                                        <li
                                            class="rf-menu__item"
                                            class:rf-menu__item--active={($route.path === '/search') && item.isActive}
                                            class:rf-href={viewOptionsActive}
                                            class:rf-inactive={!viewOptionsActive}
                                            on:click|preventDefault={() => {
                                                if (viewOptionsActive) {
                                                    goToPage('search',item.mode)
                                                }
                                            }}
                                        >
                                            <tr>
                                                <td class="rf-td--vcenter rf-padding-right-1N">
                                                    <Icon icon={item.icon}/>
                                                </td>
                                                <td class="rf-td--vcenter">
                                                    {item.title}
                                                </td>
                                            </tr>
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
                </nav>
            </div>
        </div>
    </div>
</header>

<script>
    import { themeDnum, advancedSearch, displayMode, wasSearched } from '../tools/stores.js';
    import Icon from './Icon.svelte';
    import SearchBox from './SearchBox.svelte';
    import { toggleAdvancedSearch, enableDisplayMode } from '../tools/search.js';
    import { goTo } from '../tools/routes.js';
    import { route } from '../tools/stores.js';

    // import { createEventDispatcher } from 'svelte';

    // const dispatch = createEventDispatcher();

    let burgerState = false;
    let expandMenu = false;
    let organization;
    let searchOptions;
    let viewOptions;
    let viewOptionsActive;

    $: searchOptions = [
        { title: 'simple',
          mode: 'simple',
          icon: 'ri:search-line',
          isActive: !$advancedSearch
        },
        { title: 'avancé',
          mode: 'advanced',
          icon: 'ri:zoom-in-line',
          isActive: $advancedSearch
        }
    ];

    $: viewOptions = [
        { title: 'simple',
          mode: 'card',
          icon: 'ri:list-check-2',
          isActive: $displayMode === 'card'
        },
        { title: 'complet',
          mode: 'card-expand',
          icon: 'ri:profile-line',
          isActive: $displayMode === 'card-expand'
        },
        { title: 'tableur',
          mode: 'table',
          icon: 'ri:table-line',
          isActive: $displayMode === 'table'
        },
        { title: 'géographique',
          mode: 'geo',
          icon: 'ri:earth-line',
          isActive: $displayMode === 'geo'
        }
    ];

    $: viewOptionsActive = ($route && ($route.path === '/search')) && $wasSearched;

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
