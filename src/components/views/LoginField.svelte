<div style={style}>
    {#if (!emailSent || (emailSent && !emailSent.valid) || $user)}
        <div
            class="rf-input-group"
            class:rf-input-group--valid={email && emailSent}
            class:rf-input-group--error={emailSent && emailSent.valid===false}
        >
            <label
                class="rf-label rf-text--left"
                for="email"
                style="overflow: hidden;text-overflow:ellipsis;position: relative"
            >
                Courriel
            </label>
            <form style="display: flex" on:submit|preventDefault={register}>
            <input
                id="email"
                type="email"
                class:rf-input--valid={emailSent && emailSent.valid}
                class="rf-input rf-margin-top-0"
                style="width: 100%"
                bind:value={email}
                on:input={() => emailSent = undefined}
                on:focus={() => {
                    email = undefined;
                    emailSent = undefined;
                }}
                on:blur={button?null:register}
                disabled={$user}
            >
                {#if button && !$user}
                    <button
                        title="Valider le courriel"
                        type="submit"
                        class="rf-btn"
                        style="margin-top: 0px; padding: 0 0.5rem 0 0.5rem; overflow: visible!important;"
                    >
                        <Icon icon="ri:send-plane-line" style="margin: 0"/>
                    </button>
                {/if}
            </form>
            {#if ($user)}
                <p class="rf-valid-text">
                    Vous êtes identifié(e)<br>
                </p>
            {:else if !emailSent}
                <p class="rf-text--xs rf-text--left" style="margin-top:.5rem">
                    Un code d'accès sera envoyé à cette adresse pour valider votre identité
                </p>
            {:else if emailSent && !emailSent.valid}
                <p class="rf-error-text rf-text--xs rf-text--left">
                    {emailSent.msg}
                </p>
            {/if}
        </div>
    {:else}
        <div
            class="rf-input-group"
            class:rf-input-group--valid={email && emailValidate}
            class:rf-input-group--error={emailValidate===false}
        >
            <label
                class="rf-label rf-text--left"
                for="emailOTP"
                style="overflow: hidden;text-overflow:ellipsis;position: relative"
            >
                Code de validation
            </label>
            <form style="display: flex;" on:submit|preventDefault={login}>
            <input
                id="emailOTP"
                type="text"
                maxlength="6"
                class:rf-input--valid={emailValidate}
                class="rf-input rf-margin-top-0"
                style="width: 100%"
                bind:value={emailOTP}
                on:input={() => {
                    emailOTP = emailOTP.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1').replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
                    emailValidate = undefined;
                    if (!button) {
                        login();
                    }
                }}
                on:focus={() => {
                    emailOTP = '';
                    emailValidate = undefined;
                }}
                on:blur={button?null:login}
            >
            {#if button && !$user}
                <button
                    title="Valider pour s'identifier"
                    type="submit"
                    class="rf-btn"
                    style="margin-top: 0px; padding:0 0.5rem 0 0.5rem; overflow: visible!important;"
                >
                    <Icon icon="ri:login-box-line" style="margin: 0"/>
                </button>
            {/if}
            </form>
            {#if (!emailOTP)}
                <p class="rf-valid-text rf-text--left">
                    Un code vous a été envoyé à l'adresse<br>
                    indiquée pour valider votre identité
                </p>
            {:else if (emailValidate === false)}
                <p class="rf-error-text rf-text--left">
                    Le code d'accès n'est pas valide<br>
                    Veuillez réessayer
                </p>
            {/if}
        </div>
    {/if}
</div>

<script>
    import { user, accessToken } from '../tools/stores.js';
    import Icon from './Icon.svelte';

    export let style="width: 100%;";
    export let button = false;
    let email;
    let emailSent;
    let emailOTP;
    let emailValidate;
    $: if ($user) { email = $user;}

    $: emailValidate = $user;

    const login = () => {
        if (/^\d{6}$/.test(`${emailOTP}`)) {
            if (!$user) {
                fetch('__BACKEND_PROXY_PATH__/auth', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user: email, password: `${emailOTP}` })
                }).then((response) => {
                    if (response.status === 401) {
                        emailValidate = false
                        $user = undefined;
                        $accessToken = undefined;
                        return;
                    }
                    return response.json().then((json) => {
                        $accessToken = json.access_token;
                        $user = email;
                        emailOTP = '';
                        emailValidate = true
                    });
                })
            } else {
                emailValidate = true;
            }
        } else {
            emailValidate = undefined;
        }
    }

    const register = () => {
        if (/^\S+\@\S+\.\S+$/.test(email)) {
            if (!$user) {
                fetch('__BACKEND_PROXY_PATH__/register', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user: email })
                }).then(async (response) => {
                    await response.json().then((json) => {
                        emailSent = json;
                    });
                })
            } else {
                emailValidate = true;
            }
        } else {
            emailSent = {valid: false, msg: "Format email invalide"};
        }
    }

</script>