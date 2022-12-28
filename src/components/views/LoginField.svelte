<div>
    {#if (!emailSent || $user)}
        <div
            class="rf-input-group"
            class:rf-input-group--valid={email && emailSent}
            class:rf-input-group--error={emailSent===false}
        >
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
                class:rf-input--valid={emailSent}
                class="rf-input rf-margin-top-0"
                style="width: 100%; max-width: 240px;"
                bind:value={email}
                on:input={() => emailSent = undefined}
                on:focus={() => {
                    email = undefined;
                    emailSent = undefined;
                }}
                on:blur={register}
                disabled={$user}
            >
            {#if ($user)}
                <p class="rf-valid-text">
                    Vous êtes identifié(e)<br>
                </p>
            {:else}
                <p class="rf-text--xs" style="margin-top:.5rem">
                    Un code d'accès sera envoyé à cette<br>
                    adresse pour valider votre identité
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
            <input
                id="emailOTP"
                type="text"
                maxlength="6"
                class:rf-input--valid={emailValidate}
                class="rf-input rf-margin-top-0"
                style="width: 100%; max-width: 240px;"
                bind:value={emailOTP}
                on:input={() => {
                    emailOTP = emailOTP.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1').replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
                    emailValidate = undefined;
                    login();
                }}
                on:focus={() => {
                    emailOTP = '';
                    emailValidate = undefined;
                }}
                on:blur={login}
            >
            {#if (!emailOTP)}
                <p class="rf-valid-text">
                    Un code vous a été envoyé à l'adresse<br>
                    indiquée pour valider votre identité
                </p>
            {:else if (emailValidate === false)}
                <p class="rf-error-text">
                    Le code d'accès n'est pas valide<br>
                    Veuillez réessayer
                </p>
            {/if}
        </div>
    {/if}
</div>

<script>
    import { user, accessToken } from '../tools/stores.js';

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
                }).then((response) => {
                    if (response.status === 422) {
                        emailSent = false
                        return;
                    }
                    return response.json().then((json) => {
                        emailSent = true
                    });
                })
            } else {
                emailValidate = true;
            }
        } else {
            emailSent = false;
        }
    }

</script>