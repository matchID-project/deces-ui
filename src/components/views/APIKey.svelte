<Modal title="API Key" bind:show={showAPIKey}>
    <div style="width:100%;text-align:center" transition:slide>
        <div class="rf-input-group">
            <label
                class="rf-label rf-text--left"
                for="text"
                style="overflow: hidden;text-overflow:ellipsis;position: relative"
            >
                Votre clé d'API
            </label>
            <form style="display: flex">
            <input
                id="email"
                type="text"
                class="rf-input rf-margin-top-0"
                style="width: 100%"
                value={$accessTokenInfos.access_token}
                readonly
            >
            </form>
            <p class="rf-text--xs rf-text--left">
                Date de création :  {new Date(parseInt($accessTokenInfos.created_at)*1000).toLocaleString()} <br>
                Date d'expiration :  {new Date(parseInt($accessTokenInfos.expiration_date)*1000).toLocaleString()} <br>
                Date limite de renouvellement : {new Date(parseInt($accessTokenInfos.renewal_limit_date)*1000).toLocaleString()} <br>
            </p>
        </div>
        <p></p>
        <button
            class="rf-btn rf-margin-1N rf-padding-right-2N"
            on:click|preventDefault={() => copyToClipBoard($accessTokenInfos.access_token, "apiKey")}
        >
            Copier clé
            &nbsp;
            <Icon
                icon={linkCopied.apiKey ? 'ri:check-line' : 'ri:clipboard-line' }
                class="rf-fi--md {linkCopied.apiKey ? "rf-fi--valid" : ""}"
            />
        </button>
        <button
            class="rf-btn rf-margin-1N rf-padding-right-2N"
            on:click|preventDefault={() => copyToClipBoard(link(), "link")}
        >
            Copier lien
            &nbsp;
            <Icon
                icon={linkCopied.link ? 'ri:check-line' : 'ri:link' }
                class="rf-fi--md {linkCopied.link ? "rf-fi--valid" : ""}"
            />
        </button>
        <button
            class="rf-btn rf-margin-1N rf-padding-right-2N"
            on:click|preventDefault={() => showAPIKey=false}
        >
            Fermer
            &nbsp;
            <Icon
                icon='ri:close-line'
                class="rf-fi--md"
            />
        </button>
    </div>
</Modal>

<script>
import { slide } from 'svelte/transition';
import { user, accessTokenInfos } from '../tools/stores.js';
import Modal from './Modal.svelte';
import Icon from './Icon.svelte';

export let showAPIKey = false;
let linkCopied = {
    apiKey: false,
    link: false
};

const copyToClipBoard = (text, key) => {
    navigator.clipboard.writeText(text);
    linkCopied[key] = true;
    blur();
    setTimeout(() => linkCopied[key] = false, 2000)
}

const link = () => {
    return `${location.origin}/search?user=${$user}&accessToken=${$accessTokenInfos.access_token}`;
}


</script>