<div class="rf-callout rf-callout--scheme-soft-blue-soft rf-padding-top-4N rf-padding-left-2N rf-padding-right-2N rf-padding-bottom-1N hover-parent rf-href"
    on:drop|preventDefault={drop}
    class:rf-fi-alert-line={error}
    class:rf-fi-checkbox-line={$linkFile}
    class:rf-fi-play-line={!error && !$linkFile}
    ondragover="return false"
    on:dragover={() => {hovering = true}}
    on:dragleave={() => hovering = false}
    class:hovering={((hovering === true) || $linkFile) && !error}
    class:rf-text--error={error}
    on:click|preventDefault={chooseFile}
    on:keydown|preventDefault={chooseFile}
    style="postition: relative;"
>
    <p style="position: absolute;top: 1rem;left: 3rem;margin: 0">
            <strong>Étape {step}. {title}</strong>
    </p>
    <a
        href="#step{step}"
        aria-label={label}
    >
        <p class="rf-text--center" style="overflow: hidden;text-overflow:ellipsis;">
            {@html label}
        </p>
    </a>
</div>
<script>
    import { linkFile, linkStep } from '../tools/stores.js';
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

    .hover-parent * {
        pointer-events: none;
    }
</style>