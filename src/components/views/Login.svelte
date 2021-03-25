{#if show}
    <div class="modal" transition:fade>
        <div class="modal-container">
            <div class="rf-container">
                <div class="rf-grid-row">
                    <div class="rf-col-xs-0 rf-col-sm-1 rf-col-md-2 rf-col-lg-3 rf-col-xl-3"></div>
                    <div class="rf-col-xs-12 rf-col-sm-10 rf-col-md-8 rf-col-lg-6 rf-col-xl-6">
                        <div class="rf-container-fluid rf-margin-top-4N">
                            <div class="rf-grid-row modal-content" transition:slide>
                                <div class="rf-col-12">
                                    <div
                                        class="rf-card rf-card--horizontal rf-card--md rf-card--no-arrow"
                                        style="position:relative;"
                                    >
                                        <div class="rf-card__img" style="position:relative;">
                                            <img
                                                alt='login'
                                                src='/favicon.svg'
                                            />
                                        </div>
                                        <div
                                            style="position:absolute;top:26px;right:26px"
                                            on:click={() => show = false}
                                        >
                                            <Icon
                                                icon='ri:close-line'
                                                class="rf-fi--lg"
                                            />
                                        </div>
                                        <div class="rf-card__body rf-text--center" style="margin-left: -80px!important; padding-top: 14px!important;">
                                            <h4 class="rf-card_lead rf-margin-0">Connexion</h4>
                                            <p class="rf-card__desc rf-margin-0"> Accès aux fonctions personnalisées</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="rf-col-12">
                                    <div class="rf-padding-7N rf-background--white">
                                        {#if !$accessToken}
                                            <form transition:slide>
                                                <div class="rf-input-group" class:rf-input-group--error={authError}>
                                                    <label
                                                        class="rf-label rf-text--left"
                                                        for="email"
                                                        style="overflow:hidden;text-overflow:ellipsis;position: relative"
                                                    >
                                                        Courriel
                                                    </label>
                                                    <input
                                                        id="email"
                                                        type="email"
                                                        class="rf-input"
                                                        on:input={() => {authError = false}}
                                                        bind:value={$user}
                                                    >
                                                </div>
                                                <div class="rf-input-group rf-margin-top-1N" class:rf-input-group--error={authError}>
                                                    <label
                                                        class="rf-label rf-text--left"
                                                        for="token"
                                                        style="overflow:hidden;text-overflow:ellipsis;position: relative"
                                                    >
                                                        Mot de passe
                                                    </label>
                                                    <input
                                                        id="token"
                                                        type="password"
                                                        class="rf-input"
                                                        on:input={() => {authError = false}}
                                                        bind:value={authPassword}
                                                    >
                                                    {#if authError}
                                                        <p id="text-input-error-desc-error" class="rf-error-text">
                                                            Mauvais courriel ou mot de passe
                                                        </p>
                                                    {/if}
                                                </div>
                                                <div class="rf-container--fluid rf-text--center">
                                                    <button
                                                        class="rf-btn rf-margin-top-1N"
                                                        on:click|preventDefault={login}
                                                    >
                                                        Se connecter
                                                    </button>
                                                </div>
                                            </form>
                                        {:else}
                                            <div style="width:100%;text-align:center;" transition:slide>
                                                <p>
                                                    <strong>Connecté avec succès</strong>
                                                </p>
                                                <button
                                                    class="rf-btn rf-padding-right-2N"
                                                    on:click|preventDefault={() => {
                                                        authPassword = '';
                                                        authError = false;
                                                        $accessToken = '';
                                                    }}
                                                >
                                                    Se déconnecter
                                                    &nbsp;
                                                    <Icon
                                                        icon='ri:close-line'
                                                        class="rf-fi--md"
                                                    />
                                                </button>
                                            </div>
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="rf-col-xs-0 rf-col-sm-1 rf-col-md-2 rf-col-lg-3 rf-col-xl-3"></div>
                </div>
            </div>
        </div>
    </div>
{/if}

<script>
import { onMount } from 'svelte';
import { fade, slide } from 'svelte/transition';
import { user, accessToken } from '../tools/stores.js';
import Icon from './Icon.svelte'

let authPassword = '';
let authError = false;
export let show;

const login = () => {
    fetch('__BACKEND_PROXY_PATH__/auth', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: $user, password: authPassword})
    }).then((response) => {
        if (response.status === 401) {
            authError = true;
            $accessToken = '';
            return;
        }
        return response.json().then((json) => {
            authError = false;
            $accessToken = json.access_token;
        });
    })
}

</script>

<style>

.modal {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.4);
    display: table;
}

.modal-container {
    display: table-cell;
    vertical-align: middle;
    overflow-y: hidden;
    padding: 16px;
}

.modal-content {
        box-shadow: 0 5px 15px rgb(0 0 0 / 50%);
}
</style>