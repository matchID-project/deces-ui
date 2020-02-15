<nav class="navbar is-fixed-top is-white" role="navigation" aria-label="main navigation">
    <div class="container">
        <div class="navbar-brand">
            <div class="navbar-item logo" on:click={() => toggleModal('service')}>
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
                {#each Object.keys(modalMenu) as about}
                    <a class="navbar-item" on:click={() => toggleModal(about)} href="javascript:void(0);">
                        <span class="icon">
                            <FontAwesomeIcon icon={modalMenu[about].icon} class="icon"/>
                        </span>
                        <span> {modalMenu[about].title} </span>
                    </a>
                {/each}
                <div class="navbar-item has-dropdown is-hoverable">
                    <div class="navbar-link">
                        <span class="icon">
                            <FontAwesomeIcon icon={faLightbulb} class="icon"/>
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
            {#if socialIcons}
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
                </div>
            {/if}
        </div>
    </div>
</nav>

<Modal bind:active={modalState} title={modalMenu[modalContent].title}>
    {#if modalContent === 'service'}
        <AboutService/>
    {:else}
        <AboutData/>
    {/if}
</Modal>

<script>
    import { socialIcons } from '../tools/stores.js'
    import FontAwesomeIcon from './FontAwesomeIcon.svelte'
    import Modal from './Modal.svelte'
    import AboutService from './AboutService.svelte'
    import AboutData from './AboutData.svelte'

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
        faSearch,
        faTable
    } from '@fortawesome/free-solid-svg-icons';

    // import { createEventDispatcher } from 'svelte';

    // const dispatch = createEventDispatcher();

    let burgerState = false;
    let modalState = false;
    let modalContent = 'service';
    let modalMenu = {
        service: {
            icon: faSearch,
            title:'à propos de ce service'
        },
        data: {
            icon: faDatabase,
            title: 'à propos des données INSEE'
        }
    }

    function toggleModal(page) {
        modalState= !modalState;
        modalContent = page;
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
