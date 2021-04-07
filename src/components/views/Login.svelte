{#if show}
    <div class="modal" transition:fade>
        <div class="modal-container">
            <div class="rf-container-fluid">
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
                                        <div class="rf-card__body rf-text--center" style="margin-left: -80px!important; padding-top: 26px!important;">
                                            <h4 class="rf-card_lead rf-margin-0">Connexion</h4>
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
                                                        bind:value={id}
                                                        on:focus={() => {
                                                            validId = undefined;
                                                            codeSent = undefined;
                                                        }}
                                                        on:blur={register}
                                                    >
                                                    {#if ((id) && (validId === false))}
                                                        <p class="rf-error-text">
                                                            Le courriel fourni n'est pas valide.
                                                        </p>
                                                    {:else if codeSent}
                                                        <p class="rf-valid-text">
                                                            Un code vous a été envoyé à l'adresse indiquée
                                                        </p>
                                                    {/if}
                                                </div>
                                                <div class="rf-input-group rf-margin-top-1N" class:rf-input-group--error={authError}>
                                                    <label
                                                        class="rf-label rf-text--left"
                                                        for="token"
                                                        style="overflow:hidden;text-overflow:ellipsis;position: relative"
                                                    >
                                                        {isAdmin ?  "Mot de passe" : "Code"}
                                                    </label>
                                                    {#if isAdmin}
                                                        <input
                                                            id="token"
                                                            type="password"
                                                            class="rf-input"
                                                            on:input={() => {authError = false}}
                                                            bind:value={authPassword}
                                                        >
                                                    {:else}
                                                        <input
                                                            id="token"
                                                            type="text"
                                                            maxlength="6"
                                                            class="rf-input"
                                                            on:input={() => {
                                                                authPassword = authPassword.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1').replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
                                                                authError = false;
                                                            }}
                                                            bind:value={authPassword}
                                                        >
                                                    {/if}
                                                    {#if authError}
                                                        <p id="text-input-error-desc-error" class="rf-error-text">
                                                            Mauvais courriel ou code d'accès
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
                                                    <strong>Connecté en tant que {$user}</strong>
                                                </p>
                                                <button
                                                    class="rf-btn rf-padding-right-2N"
                                                    on:click|preventDefault={() => {
                                                        authPassword = '';
                                                        authError = false;
                                                        id = '';
                                                        validId = undefined;
                                                        $accessToken = '';
                                                        $user = '';
                                                        codeSent = '';
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
let id;
let codeSent;
let validId;
$: id = $user;
$: isAdmin = (id === '__BACKEND_TOKEN_USER__')


$: if ($accessToken) { checkJwt() };

const checkJwt = async () => {
    while($accessToken) {
        try {
            const response = await fetch('__BACKEND_PROXY_PATH__/auth',
                {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${$accessToken}` }
                });
            if (response.status === 422) {
                $accessToken = '';
            }
            await sleep(60000);
        } catch(e) {
            $accessToken = '';
        }
    }
};

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const register = () => {
    if (id === '__BACKEND_TOKEN_USER__') {
        return
    }
    if (/^\S+\@\S+\.\S+$/.test(id)) {
        validId = true;
        fetch('__BACKEND_PROXY_PATH__/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: id })
        }).then((response) => {
            if (response.status === 422) {
                codeSent = false
                return;
            }
            return response.json().then((json) => {
                codeSent = true;
            });
        })
    } else {
        validId = false;
    }
}

const login = () => {
    fetch('__BACKEND_PROXY_PATH__/auth', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: id, password: authPassword})
    }).then((response) => {
        if (response.status === 401) {
            authError = true;
            $accessToken = '';
            $user = '';
            return;
        }
        return response.json().then((json) => {
            authError = false;
            $accessToken = json.access_token;
            $user = id;
        });
    })
}

</script>

<style>

.modal {
    position: fixed;
    z-index: 50000;
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