<div class="rf-tile"
    on:drop|preventDefault={drop}
    ondragover="return false"
    on:dragover={() => {hovering = true}}
    on:dragleave={() => hovering = false}
    class:hovering={((hovering === true) || $linkFile) && !error}
    class:rf-text--error={error}
    on:click|preventDefault={chooseFile}
>
    <div class="rf-tile__body">
        <h4
            class="rf-tile__title"
            style="position: relative"
            class:rf-text--error={error}
        >
            <span class="rf-margin-right-3N">étape {step}. {title}</span>
            {#if error}
                <span
                    class="rf-fi-alert-line rf-fi--lg"
                    style="position: absolute;top: 0px;right:0px;"
                ></span>
            {:else if $linkFile}
                <span
                    class="rf-fi-checkbox-line rf-fi--lg"
                    style="position: absolute;top: 0px;right:0px;"
                ></span>
            {:else}
                <span
                    class="rf-fi-play-line rf-fi--lg"
                    style="position: absolute;top: 0px;right:0px;"
                ></span>
            {/if}
        </h4>
        <p class="rf-tile__desc rf-text--center">
            {@html label}
        </p>
    </div>
</div>
<script>
    import { linkFile, linkStep } from '../tools/stores.js';
    import FontAwesomeIcon from './FontAwesomeIcon.svelte';
    import { faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
    export let label;
    export let title;
    export let step;
    export let error;

    let hovering = false;
	export function dropTop (events) {
		if (hovering === false) {
			drop(ev)
		}
    };

    const drop = (ev) => {

        if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (let i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
                if (ev.dataTransfer.items[i].kind === 'file') {
                    $linkFile = ev.dataTransfer.items[i].getAsFile();
                }
            }
        } else {
            // Use DataTransfer interface to access the file(s)
            for (let i = 0; i < ev.dataTransfer.files.length; i++) {
            }
        }
		hovering = null;
    };

    const chooseFile = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = ev => {
            $linkFile = ev.target.files[0];
        }
        input.click();
    }

</script>

<style>
    .hovering {
    background-color: var(--yd500);
    }

    .hovering * {
    pointer-events: none;
    }
</style>