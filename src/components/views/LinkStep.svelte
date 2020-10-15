<div
    class="rf-tile"
    class:rf-inactive={step > $linkStep}
    class:rf-success={ (step < $linkStep) || $linkCompleted }
    class:rf-text--error={error}
>
    <div
        class="rf-tile__body"
    >
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
            {:else if ($linkStep > step) || ($linkCompleted)}
                <span
                    class="rf-fi-checkbox-line rf-fi--lg"
                    style="position: absolute;top: 0px;right:0px;"
                ></span>
            {:else if ($linkStep === step)}
                <span
                    class="rf-fi-play-line rf-fi--lg"
                    style="position: absolute;top: 0px;right:0px;"
                ></span>
            {/if}
        </h4>
        <p class="rf-tile__desc rf-text--center" style="overflow:hidden;text-overflow:ellipsis;">
            {@html label}
        </p>
    </div>
</div>
<script>
    import { linkStep, linkCompleted } from '../tools/stores.js';
    import FontAwesomeIcon from './FontAwesomeIcon.svelte';
    import { faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

    export let step;
    export let title;
    export let label;
    export let error;
</script>
