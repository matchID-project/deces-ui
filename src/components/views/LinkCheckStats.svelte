<div class="rf-grid-row">
    <div class="rf-col-12 rf-padding-top-3N rf-margin-bottom-1N">
        <strong>Statistiques d'appariement</strong>
    </div>
    <div class="rf-col-12">
        <div class="rf-container-fluid">
            <div class="rf-grid-row rf-grid-row--gutters">
                <div class="rf-col-4">
                    <StatsTile number="{rawMatchingRate} %" label="Taux d'appariement brut"/>
                </div>
                <div class="rf-col-4">
                    <StatsTile number="{checkRate} %" label="Validation manuelle"/>
                </div>
                <div class="rf-col-4">
                    <StatsTile number="{multiMatchingRate} %" label="Appariements multiples"/>
                </div>
            </div>
        </div>
    </div>
    <div class="rf-col-12 rf-text--center">
        <span class="rf-padding-2N">
            <strong>Distribution des scores</strong>
        </span>
        {#if (Bar && scoresData)}
            <svelte:component
                style="max-height: 250px;"
                this={Bar}
                data={scoresData}
                options={chartOptions}
            />
        {/if}
    </div>
        <div class="rf-col-12">
        <label
            class="rf-label"
            for="threshold"
            style="overflow:hidden;text-overflow:ellipsis;"
        >
            Seuil (pour F1-score, rappel, précision)
        </label>
        <input
            class="rf-range"
            type="range"
            id="threshold"
            bind:value={threshold}
            min={0}
            max={1}
            step={0.01}
        />
    </div>
    <div class="rf-col-12">
        <div class="rf-container-fluid">
            <div class="rf-grid-row rf-grid-row--gutters">
                <div class="rf-col-4">
                    <StatsTile number="{recallRate} %" label="Rappel (seuil {(100 * $linkOptions.check.autoCheckThreshold).toFixed(0)} %)"/>
                </div>
                <div class="rf-col-4">
                    <StatsTile number="{precisionRate} %" label="Précision"/>
                </div>
                <div class="rf-col-4">
                    <StatsTile number="{fScore} %" label="F1-score"/>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    let Bar;
    import('svelte-chartjs/src/Bar.svelte').then(module => {
        Bar = module.default;
    });
    import StatsTile from './StatsTile.svelte';
    import { linkResults, linkCompleteResults, linkValidations, linkOptions } from '../tools/stores.js';
    import { smartNumber } from '../tools/stats.js';

    let threshold = $linkOptions.check.autoCheckThreshold;

    const fontFamily = '"Marianne",arial,sans-serif';
    const ticks = {
        autoSkip: true,
        fontFamily : fontFamily,
        callback: smartNumber,
    };
    const ticksY = {
        autoSkip: true,
        fontFamily : fontFamily,
        callback: smartNumber,
        maxTicksLimit: 5,
        beginAtZero: true
    };

    const chartOptions = {
        maintainAspectRatio: false,
        hover: {
            intersect: false
        },
        tooltips: {
            mode: 'x'
        },
        animation: {
            duration: 0
        },
        elements: {
            line: {
                tension: 0.1,
            }
        },
        legend: {
            labels: {
                fontFamily: fontFamily,
                boxWidth: 20,
                fontSize: 8,
                padding: 6
            },
            position: 'bottom'
        }
    };

    const get = (row, col) => {
        if (col === 'check') {
            return row[row.length - 2]
        } else {
            return row[$linkResults.header.indexOf(col)];
        }
    };


    const hexToRgb = (hex) => hexToRgba(hex,255);

    const hexToRgba = (hex, alpha) => 'rgba(' + hex.match(/^\s*\#?([\da-f]{2})([\da-f]{2})([\da-f]{2})\s*$/)
            .slice(1).map(e => parseInt(e, 16)).join(',') + `,${alpha})`;

    let rawMatchingRate, recallRate, multiMatchingRate, checkRate, precisionRate, fScore;
    let scoresData;

    const distribution = (values, range=10) => {
        if (values.length === 0) {
            return {}
        }
        return values.map(x => `${Math.floor(range*parseFloat(x))/range}`)
            .reduce((a,b) => {
                if (typeof(a)!=='object') {a = {}};
                if (!a[b]) {a[b] = 1} else {a[b] = a[b] + 1};
                return a;
            });
    }

    $: if ($linkResults && $linkResults.rows) {
        const style = getComputedStyle(document.body);
        const l = $linkValidations;
        const d = {
            Total: {
                data: distribution($linkResults.rows.map(r => get(r[0], 'score'))),
                color: hexToRgba(style.getPropertyValue('--bf500'), 0.7)
            },
            "Validé": {
                data: distribution($linkResults.rows.filter((r,i) => l[i][0].checked && l[i][0].checked.includes('manual') && l[i][0].valid).map(r => get(r[0], 'score'))),
                color: hexToRgba(style.getPropertyValue('--success'), 0.7)
            },
            "Invalidé": {
                data: distribution($linkResults.rows.filter((r,i) => l[i][0].checked && l[i][0].checked.includes('manual') && !l[i][0].valid).map(r => get(r[0], 'score'))),
                color: hexToRgba(style.getPropertyValue('--warning'), 0.7)
            }
        };
        console.log(d);
        scoresData = {
            labels: Object.keys(d.Total.data).map(k => parseFloat(k)).sort(),
            datasets: Object.keys(d).map((label) => {
                return {
                    label: label,
                    data: Object.keys(d[label].data).map(k => parseFloat(k)).sort().map(k => d[label].data[k]),
                    backgroundColor: d[label].color,
                    borderColor: 'rgba(255,255,255,0)',
                    borderWidth: 0,
                    pointRadius: 0,
                }
            })
        };
    };

    $: if ($linkResults && $linkResults.rows && $linkResults.rows.length) {
        const s = $linkResults.header.indexOf('score');
        rawMatchingRate = smartNumber(100 * $linkResults.rows.length / $linkCompleteResults.rows.length,1);
        recallRate = smartNumber(100 * $linkResults.rows.filter(r => r[0][s]>=threshold).length / $linkResults.rows.length,1);
        multiMatchingRate = smartNumber(100 * $linkResults.rows.filter(r => r.length > 1).length / $linkResults.rows.length,1);
        // helpedCheckRate = smartNumber(100 * $linkValidations.filter(r => r.some(rr => rr.checked)).length / $linkResults.rows.length,1);
        checkRate = smartNumber(100 * $linkValidations.filter(r => r.every(rr => rr.checked && rr.checked.includes('manual'))).length / $linkResults.rows.length,1);
        // helpedPrecisionRate = smartNumber(100 * $linkValidations.filter(r => r[0].checked && r[0].valid).length / ($linkValidations.filter(r => r[0].checked).length || 1),1);
        precisionRate = smartNumber(100 * $linkValidations.filter(r => r[0].checked && r[0].checked.includes('manual') && r[0].valid).length / ($linkValidations.filter(r => r[0].checked && r[0].checked.includes('manual')).length || 1),1);
        fScore = smartNumber(100 * 2/(100/precisionRate + 100/recallRate),1);
    }

</script>

