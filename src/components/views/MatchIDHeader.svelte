<header class="rf-header">
    <div class="rf-container rf-container__header">
        <div class="rf-header__body">
            <div
                class="rf-header__brand"
                on:click|preventDefault={() => goToPage('search', 'reset')}
            >
                <a
                    href="/search{$advancedSearch ? '?advanced=true' : ''}"
                    class="rf-logo"
                    title="{organization.replace(/<br>/,' ')}"
                >
                    <span class="rf-logo__title">
                        {@html organization}
                    </span>
                </a>
            </div>
            {#if $themeDnum}
                <img
                    src={"/dnum-logo-round.svg"}
                    alt="DNUM Logo"
                    height="80px"
                    width="80px"
                />
            {:else}
                <img
                    src={"/favicon.svg"}
                    alt="matchID Logo"
                    height="64px"
                    width="64px"
                />
            {/if}
            <div class="rf-header__navbar">
                <div class="rf-service">
                    <span class="rf-service__title" title="matchID - moteur de recherche des personnes décédées">
                        Fichier des décès
                    </span>
                    <p class="rf-service__tagline">
                        Recherche <span class="rf-hide--mobile">libre</span> parmi <strong>25 millions de décès</strong>
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
                            class:rf-nav__item--active={!modal && ($route.path === '/search')}
                            on:mouseenter={() => {expandMenu.search = true}}
                            on:mouseleave={() => {expandMenu.search = false}}
                            bind:this={searchMenu}
                        >
                            <button
                                class="rf-btn"
                                aria-controls="rf-recherche"
                                aria-expanded={expandMenu.search}
                                on:click={() => {expandMenu.search = !expandMenu.search}}
                            >
                                Recherche
                            </button>
                            <div
                                class="rf-menu"
                                class:rf-menu--expanded={expandMenu.search}
                                id="rf-recherche"
                            >
                                <ul class="rf-menu__list">
                                    <li class="rf-menu__item">
                                        <strong>Mode de recherche</strong>
                                    </li>
                                    {#each searchOptions as item}
                                        <li
                                            class="rf-menu__item rf-href"
                                            class:rf-menu__item--active={!modal && ($route.path === '/search') && item.isActive}
                                            on:click|preventDefault={() => goToPage('search',item.mode)}
                                        >
                                            <a
                                                href={item.mode === 'simple' ? location.href.replace("&advanced=true","") : location.href.replace(/(&advanced=true|$)/, "&advanced=true")}
                                                class="rf-link"
                                                aria-label="recherche {item.title}"
                                            >
                                                <tr>
                                                    <td class="rf-td--vcenter rf-padding-right-1N">
                                                        <Icon class="rf-fi" icon={item.icon}/>
                                                    </td>
                                                    <td class="rf-td--vcenter">
                                                        {item.title}
                                                    </td>
                                                </tr>
                                            </a>
                                        </li>
                                    {/each}
                                    <li
                                        class="rf-menu__item"
                                        class:rf-inactive={!viewOptionsActive}
                                    >
                                        <strong>Mode d'affichage</strong>
                                    </li>
                                    {#each viewOptions as item}
                                        <li
                                            class="rf-menu__item"
                                            class:rf-menu__item--active={!modal && ($route.path === '/search') && item.isActive}
                                            class:rf-href={viewOptionsActive}
                                            class:rf-inactive={!viewOptionsActive}
                                            on:click|preventDefault={() => {
                                                if (viewOptionsActive) {
                                                    goToPage('search',item.mode)
                                                }
                                            }}
                                        >
                                            <a
                                                href={item.mode === 'card' ? location.href.replace(/(&view=[a-z\-]+|\?view=[a-z\-]+)/,"") : location.href.replace(/(&view=[a-z\-]+|\?view=[a-z\-]+)/,"").replace('?', `?view=${item.mode}&`)}
                                                class="rf-link"
                                                arial-label="mode d'affichage {item.title}"
                                            >
                                                <tr>
                                                    <td class="rf-td--vcenter rf-padding-right-1N">
                                                        <Icon icon={item.icon}/>
                                                    </td>
                                                    <td class="rf-td--vcenter">
                                                        {item.title}
                                                    </td>
                                                </tr>
                                            </a>
                                        </li>
                                    {/each}
                                </ul>
                            </div>
                        </li>

                        <li
                            class="rf-nav__item"
                            on:click|preventDefault={() => goToPage('link')}
                            class:rf-nav__item--active={!modal && ($route.path === '/link')}
                        >
                            <a
                                href="/link"
                                class="rf-link rf-href"
                            >
                                Appariement
                            </a>
                        </li>
                        <li
                            class="rf-nav__item"
                            on:click|preventDefault={() => goToPage('about')}
                            class:rf-nav__item--active={!modal && ($route.path === '/about')}
                        >
                            <a
                                href="/about"
                                class="rf-link rf-href rf-fi-question-line rf-link--icon-left"
                            >
                                À propos
                            </a>
                        </li>
                        {#if $alphaFeatures}
                            {#if admin}
                                <li
                                    class="rf-nav__item rf-nav__item--hoverable rf-nav__item--shadow"
                                    class:rf-nav__item--active={!modal && (['/jobs','/edits'].includes($route.path) )}
                                    on:mouseenter={() => {expandMenu.admin = true}}
                                    on:mouseleave={() => {expandMenu.admin = false}}
                                    bind:this={adminMenu}
                                >
                                    <button
                                        class="rf-btn"
                                        aria-controls="rf-admin"
                                        aria-expanded={expandMenu.admin}
                                        on:click={() => {expandMenu.admin = !expandMenu.admin}}
                                    >
                                        <Icon icon={$accessToken ? 'ri:user-follow-line' : 'ri:user-line'} circleText={admin}/>
                                    </button>
                                    <div
                                        class="rf-menu"
                                        class:rf-menu--expanded={expandMenu.admin}
                                        style="width: 10rem;right:0px;"
                                        id="rf-admin"
                                    >
                                        <ul class="rf-menu__list">
                                            <li
                                                class="rf-menu__item rf-href"
                                                on:click|preventDefault={() => showLogin = !showLogin}
                                                class:rf-nav__item--active={showLogin}
                                                on:mouseenter={() => {zoom = true}}
                                                on:mouseleave={() => {zoom = false}}
                                            >
                                                <a
                                                    href="/logout"
                                                    title="Se déconnecter"
                                                    class="rf-link rf-href rf-fi-question-line rf-link--icon-left"
                                                >
                                                    Se déconnecter
                                                </a>
                                            </li>
                                            <li
                                                class="rf-menu__item rf-href"
                                                class:rf-menu__item--active={!modal && ($route.path === '/stats')}
                                                on:click|preventDefault={() => goToPage('stats')}
                                            >
                                                <a
                                                    href="/stats"
                                                    title="Statistiques"
                                                    class="rf-link rf-href rf-fi-question-line rf-link--icon-left"
                                                >
                                                    Statistiques
                                                </a>
                                            </li>
                                            <li
                                                class="rf-menu__item rf-href"
                                                class:rf-menu__item--active={!modal && ($route.path === '/edits')}
                                                on:click|preventDefault={() => goToPage('edits')}
                                            >
                                                <a
                                                    href="/edits"
                                                    title="Modifications"
                                                    class="rf-link rf-href rf-fi-question-line rf-link--icon-left"
                                                >
                                                    Modifications
                                                </a>
                                            </li>
                                            <li
                                                class="rf-menu__item rf-href"
                                                class:rf-menu__item--active={!modal && ($route.path === '/jobs')}
                                                on:click|preventDefault={() => goToPage('jobs')}
                                            >
                                                <a
                                                    href="/jobs"
                                                    title="Appariements"
                                                    class="rf-link rf-href rf-fi-question-line rf-link--icon-left"
                                                >
                                                    Appariements
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            {:else}
                                <li
                                    class="rf-nav__item"
                                    on:click|preventDefault={() => showLogin = !showLogin}
                                    class:rf-nav__item--active={showLogin}
                                    on:mouseenter={() => {zoom = true}}
                                    on:mouseleave={() => {zoom = false}}
                                >
                                    <a
                                        href="/login"
                                        title="S'identifier"
                                        class="rf-link rf-href rf-fi-question-line rf-link--icon-left"
                                    >
                                        <Icon icon={$accessToken ? 'ri:user-follow-line' : 'ri:user-line'}/>
                                    </a>
                                </li>
                            {/if}
                        {/if}
                    </ul>
                </div>
            </div>
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
                    title="Fermer"
                    aria-controls="header-nav-popin"
                >
                    <span>
                        Fermer
                    </span>
                </button>
                <nav role="navigation" aria-label="Menu mobile">
                    <ul class="rf-nav__list">
                        <li
                            class="rf-nav__item"
                            class:rf-nav__item--active={!modal && ($route.path === '/search')}
                            aria-expanded={expandMenu.search}
                            aria-controls="rf-recherche-popin"
                        >
                            <button
                                class="rf-btn"
                                aria-expanded={expandMenu.search}
                                on:click|preventDefault={() => {expandMenu.search = !expandMenu.search}}
                            >
                                Recherche
                            </button>
                            <div
                                class="rf-menu"
                                class:rf-menu--expanded={expandMenu.search}
                                id="rf-recherche-popin"
                            >
                                <ul class="rf-menu__list">
                                    <li class="rf-menu__item">
                                        <strong>Mode de recherche</strong>
                                    </li>
                                    {#each searchOptions as item}
                                        <li
                                            class="rf-menu__item rf-href"
                                            class:rf-menu__item--active={!modal && ($route.path === '/search') && item.isActive}
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
                                        <strong>Mode d'affichage</strong>
                                    </li>
                                    {#each viewOptions as item}
                                        <li
                                            class="rf-menu__item"
                                            class:rf-menu__item--active={!modal && ($route.path === '/search') && item.isActive}
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
                            class:rf-nav__item--active={!modal && ($route.path === '/link')}
                        >
                            <span class="rf-link rf-href rf-fi-db-line rf-link--icon-left">
                                Appariement
                            </span>
                        </li>
                        <li
                            class="rf-nav__item"
                            on:click|preventDefault={() => goToPage('about')}
                            class:rf-nav__item--active={!modal && ($route.path === '/about')}
                        >
                            <span class="rf-link rf-href rf-fi-question-line rf-link--icon-left">
                                À propos
                            </span>
                        </li>
                        {#if $alphaFeatures}
                            {#if admin}
                                <li
                                    class="rf-nav__item"
                                    class:rf-nav__item--active={!modal && (['/jobs','/edits'].includes($route.path) )}
                                    aria-expanded={expandMenu.admin}
                                    aria-controls="rf-admin-popin"
                                >
                                    <button
                                        class="rf-btn rf-padding-left-1N"
                                        aria-expanded={expandMenu.admin}
                                        on:click={() => {expandMenu.admin = !expandMenu.admin}}
                                    >
                                        <Icon icon={$accessToken ? 'ri:user-follow-line' : 'ri:user-line'} circleText={admin}/>
                                    </button>
                                    <div
                                        class="rf-menu"
                                        class:rf-menu--expanded={expandMenu.admin}
                                        id="rf-admin-popin"
                                    >
                                        <ul class="rf-menu__list">
                                            <li
                                                class="rf-menu__item rf-href"
                                                on:click|preventDefault={() => showLogin = !showLogin}
                                                class:rf-nav__item--active={showLogin}
                                                on:mouseenter={() => {zoom = true}}
                                                on:mouseleave={() => {zoom = false}}
                                            >
                                                <a
                                                    href="/logout"
                                                    title="Se déconnecter"
                                                    class="rf-link rf-href rf-fi-question-line rf-link--icon-left"
                                                >
                                                    Se déconnecter
                                                </a>
                                            </li>
                                            <li
                                                class="rf-menu__item rf-href"
                                                class:rf-menu__item--active={!modal && ($route.path === '/stats')}
                                                on:click|preventDefault={() => goToPage('stats')}
                                            >
                                                <a
                                                    href="/edits"
                                                    title="Statistiques"
                                                    class="rf-link rf-href rf-fi-question-line rf-link--icon-left"
                                                >
                                                    Statistiques
                                                </a>
                                            </li>
                                            <li
                                                class="rf-menu__item rf-href"
                                                class:rf-menu__item--active={!modal && ($route.path === '/edits')}
                                                on:click|preventDefault={() => goToPage('edits')}
                                            >
                                                <a
                                                    href="/edits"
                                                    title="Modifications"
                                                    class="rf-link rf-href rf-fi-question-line rf-link--icon-left"
                                                >
                                                    Modifications
                                                </a>
                                            </li>
                                            <li
                                                class="rf-menu__item rf-href"
                                                class:rf-menu__item--active={!modal && ($route.path === '/jobs')}
                                                on:click|preventDefault={() => goToPage('jobs')}
                                            >
                                                <a
                                                    href="/jobs"
                                                    title="Appariements"
                                                    class="rf-link rf-href rf-fi-question-line rf-link--icon-left"
                                                >
                                                    Appariements
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            {:else}
                                <li
                                    class="rf-nav__item"
                                    on:click|preventDefault={() => showLogin = !showLogin}
                                    class:rf-nav__item--active={showLogin}
                                    on:mouseenter={() => {zoom = true}}
                                    on:mouseleave={() => {zoom = false}}
                                >
                                    <a
                                        href="/login"
                                        title="S'identifier"
                                        class="rf-link rf-href rf-fi-question-line rf-link--icon-left"
                                    >
                                        <Icon icon={$accessToken ? 'ri:user-follow-line' : 'ri:user-line'}/>
                                    </a>
                                </li>
                            {/if}
                        {/if}
                    </ul>
                </nav>
            </div>
        </div>
    </div>
</header>
<Login bind:show={showLogin}/>
<ProofViewer/>

<script>
    import { showProof, user, accessToken, alphaFeatures, firstSearch, themeDnum, advancedSearch, displayMode, wasSearched, activeElement } from '../tools/stores.js';
    import Icon from './Icon.svelte';
    import SearchBox from './SearchBox.svelte';
    import Login from './Login.svelte';
    import ProofViewer from './ProofViewer.svelte';
    import { toggleAdvancedSearch, enableDisplayMode } from '../tools/search.js';
    import { goTo } from '../tools/routes.js';
    import { route } from '../tools/stores.js';

    // import { createEventDispatcher } from 'svelte';

    // const dispatch = createEventDispatcher();

    let burgerState = false;
    let expandMenu = { search: false, admin: false };
    let showLogin = false;
    let modal = false;
    let organization;
    let searchOptions;
    let viewOptions;
    let viewOptionsActive;
    let searchMenu;
    let adminMenu;
    let zoom;
    let admin

    $: modal = showLogin;

    $: admin = $accessToken && ($user === '__BACKEND_TOKEN_USER__') && $user;

    $: searchOptions = [
        { title: 'Simple',
          mode: 'simple',
          icon: 'ri:search-line',
          isActive: !$advancedSearch
        },
        { title: 'Avancé',
          mode: 'advanced',
          icon: 'ri:zoom-in-line',
          isActive: $advancedSearch
        }
    ];

    $: if ($activeElement) {
        if (!searchMenu.contains($activeElement)) {
            expandMenu.search = false;
        } else {
            expandMenu.search = true;
        }
    }

    $: viewOptions = [
        { title: 'Simple',
          mode: 'card',
          icon: 'ri:list-check-2',
          isActive: $displayMode === 'card'
        },
        { title: 'Complet',
          mode: 'card-expand',
          icon: 'ri:profile-line',
          isActive: $displayMode === 'card-expand'
        },
        { title: 'Tableur',
          mode: 'table',
          icon: 'ri:table-line',
          isActive: $displayMode === 'table'
        },
        { title: 'Statistiques',
          mode: 'agg',
          icon: 'ri:bar-chart-box-line',
          isActive: $displayMode === 'agg'
        },
        { title: 'Géographique',
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
        expandMenu = { search: false, admin: false };
        if ((page === 'search')) {
            if ($route.path !== '/search') {
                goTo({path: `/${page}`});
            } else if (mode === 'reset') {
                $firstSearch = true;
                $wasSearched = undefined;
                goTo({path: `/${page}`, query: $advancedSearch ? { advanced: true} : {}});
            }
            if (mode === 'simple') {
                toggleAdvancedSearch(false);
            } else if (mode === 'advanced') {
                toggleAdvancedSearch(true);
            } else if (mode !== 'reset') {
                enableDisplayMode(mode)
            }
        } else {
            goTo({path: `/${page}`});
        }
    }

</script>
