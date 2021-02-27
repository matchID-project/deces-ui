<div
    class="rf-callout rf-padding-top-4N rf-padding-left-2N rf-padding-right-2N rf-padding-bottom-1N"
    class:rf-fi-play-line={!error && ($linkStep === step)}
    class:rf-callout--scheme-soft-blue-soft={!error && ($linkStep === step)}
    class:rf-fi-checkbox-line={!error && (($linkStep > step) || ($linkCompleted))}
    class:rf-callout--scheme-soft-green-soft={!error && (($linkStep > step) || ($linkCompleted))}
    class:rf-fi-alert-line={error}
    class:rf-inactive={step > $linkStep}
    class:rf-fi-lock-fill={step > $linkStep}
    class:rf-text--error={error}
    style="postition: relative;"
>
    <p style="position: absolute;top: 1rem;left: 3rem;margin: 0">
        <strong>Étape {step}. {title}</strong>
    </p>
    <p class="rf-text--center" style="overflow:hidden;text-overflow:ellipsis;">
        {@html label}
    </p>
</div>
<script>
    import { linkStep, linkCompleted } from '../tools/stores.js';

    export let step;
    export let title;
    export let label;
    export let error;
</script>
