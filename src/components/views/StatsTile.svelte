<div class="rf-tile">
    <div class="rf-tile__body rf-text--center">
        <h4 class="rf-tile__title">
            <span class="rf-text--lg">
                {smartNumber(number, precision)}
            </span>
        </h4>
        <p class="rf-tile__desc rf-margin-top-0">
            {label}
        </p>
    </div>
</div>

<script>
    import { smartNumber } from '../tools/stats.js';
    export let number = 0;
    export let precision = 0;
    export let label = '';

</script>