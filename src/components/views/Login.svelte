<Modal title="Connexion" bind:show={showLogin}>
    {#if !$accessToken}
        <form transition:slide>
            <div class="rf-input-group" class:rf-input-group--error={authError}>
                <label
                    class="rf-label rf-text--left"
                    for="email"
                    style="overflow: hidden;text-overflow:ellipsis;position: relative"
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
                        {codeSent}
                    </p>
                {:else if (validId == true) && (codeSent)}
                    <p class="rf-valid-text">
                        {codeSent}
                    </p>
                {/if}
            </div>
            <div class="rf-input-group rf-margin-top-1N" class:rf-input-group--error={authError}>
                <label
                    class="rf-label rf-text--left"
                    for="token"
                    style="overflow: hidden;text-overflow:ellipsis;position: relative"
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
                    codeSent = '';
                    $accessToken = '';
                    $accessTokenInfos = {};
                    $user = '';
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
</Modal>

<script>
import { onMount } from 'svelte';
import { slide } from 'svelte/transition';
import { route, user, accessToken, accessTokenInfos, admin } from '../tools/stores.js';
import { routes, goTo, defaultRoute } from '../tools/routes.js';
import { useLocalSync } from '../tools/useLocalStorage.js';
import Modal from './Modal.svelte';
import Icon from './Icon.svelte';

export let showLogin = false;
let authPassword = '';
let authError = false;
let id;
let codeSent;
let validId;
let mounting = true;
let refresh = true;

$: isAdmin = (id === '__BACKEND_TOKEN_USER__')

$: $admin = $accessToken && ($user === '__BACKEND_TOKEN_USER__') && $user;

$: if (!mounting && !$user && $route && $route.path && routes[$route.path].auth) {
    showLogin = true;
}

const closeLogin = () =>  {
    if (!mounting && !$user && $route && $route.path && routes[$route.path].auth) {
        goTo({path: defaultRoute});
    }
    showLogin = false;
}

onMount(async () => {
    await useLocalSync(accessToken, 'accessToken');
    await useLocalSync(user, 'user');
    id = $user || '';
    refresh = true;
    mounting = false;
    checkJwt();
});

const checkJwt = async () => {
    while($accessToken) {
        try {
            const response = await fetch(`__BACKEND_PROXY_PATH__/auth${refresh ? "?refresh=true" : ""}`,
                {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${$accessToken}` }
                });
            if (response.status === 422) {
                $accessToken = '';
                $accessTokenInfos = {};
                $user = '';
            } else if (refresh) {
                const json = await response.json();
                if (json.access_token) {
                    $accessToken = json.access_token;
                    $accessTokenInfos = json;
                    refresh = false;
                    setTimeout(() => refresh = true, 3600000)
                }
            }
            // for other errors, 401, 403, 404, 500, 502, 503, 504, etc.
            // try again in 1 minute
            await sleep(60000);
        } catch(e) {
            // Do nothing - probable browser side network error
            // try again in 1 minute
            await sleep(60000);
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
        }).then(async (response) => {
            await response.json().then((json) => {
              validId = json.valid
              codeSent = json.msg
            });
        })
    } else {
      codeSent = "Le courriel fourni n'est pas valide.";
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
            $user = '';
            $accessToken = '';
            $accessTokenInfos = {};
            return;
        }
        return response.json().then((json) => {
            authError = false;
            $accessToken = json.access_token;
            $accessTokenInfos = json;
            $user = id;
        });
    })
}

</script>