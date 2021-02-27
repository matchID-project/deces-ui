<div id="options" class:rf-padding-2N={!display} class:rf-padding-bottom-2N={display} style="position:relative">
    <div
        style="position: absolute;top: 1rem; left: 1rem;z-index:1200;"
        on:click={() =>{display = !display; deactivateElement();}}
    >
        <span style="display:flex" title="Options">
            <Icon
                icon="ri:settings-5-line"
                label="Options"
                href="#options"
                class="rf-fi--lg"
            />
        </span>
    </div>
    {#if display}
        <div class="rf-callout rf-callout--scheme-soft-blue-soft rf-text--left rf-padding-bottom-3N">
            <div class="rf-grid-row" style="margin-top: -35px;">
                {#each ['csv','api','check'].filter(x => showSection(x)) as section}
                    <div class="rf-col-12 rf-padding-top-3N rf-margin-bottom-1N">
                        <strong>{options[section].label}</strong>
                    </div>
                    {#each Object.keys(options[section].items) as key}
                        <div class="rf-col-xl-{options[section].items[key].size ? options[section].items[key].size : options[section].defaultSize } rf-col-lg-{options[section].items[key].size ? options[section].items[key].size : options[section].defaultSize} rf-col-md-6 rf-col-sm-6 rf-col-xs-6 rf-padding-1N">
                            {#if options[section].items[key].checkbox}
                                <div class="rf-checkbox-group">
                                    <input
                                        class="rf-input"
                                        type="checkbox"
                                        id={key}
                                        bind:checked={$linkOptions[section][key]}
                                    />
                                    <label
                                        class="rf-label"
                                        for={key}
                                        style="overflow:hidden;text-overflow:ellipsis;"
                                    >
                                        {options[section].items[key].label}
                                    </label>
                                </div>
                            {:else}
                                <label
                                    class="rf-label"
                                    for={key}
                                    style="overflow:hidden;text-overflow:ellipsis;"
                                >
                                    {options[section].items[key].label}
                                    {#if options[section].items[key].range}
                                        :
                                        {options[section].items[key].range.type === 'percent' ?
                                            `${Math.floor(100 * $linkOptions[section][key])}%`
                                            : $linkOptions[section][key]
                                        }
                                    {/if}
                                </label>
                                <div class="rf-field">
                                    {#if options[section].items[key].options}
                                        <select
                                            class="rf-select"
                                            id={key}
                                            bind:value={$linkOptions[section][key]}
                                        >
                                            {#each options[section].items[key].options as option}
                                                <option value={option[1]} selected={$linkOptions[section][key] === option[1]}>{option[0]}</option>
                                            {/each}
                                        </select>
                                    {:else if options[section].items[key].range}
                                        <input
                                            class="rf-range"
                                            type="range"
                                            id={key}
                                            bind:value={$linkOptions[section][key]}
                                            min={options[section].items[key].range.min}
                                            max={options[section].items[key].range.max}
                                            step={options[section].items[key].range.step || 1}
                                        />
                                    {:else}
                                        <input
                                            class="rf-input"
                                            id={key}
                                            bind:value={$linkOptions[section][key]}
                                        >
                                    {/if}
                                </div>
                            {/if}
                        </div>
                    {/each}
                {/each}
            </div>
        </div>
    {/if}
</div>

<script>
    import { linkOptions, activeElement } from '../tools/stores.js';
    import Icon from './Icon.svelte';
    export let csv = false;
    export let api = false;
    export let check = false;

    let display = false;
    let options;

    const showSection = (section) => {
        if (section === 'csv') {return csv};
        if (section === 'api') {return api};
        if (section === 'check') {return check};
    }

    $: options = {
        csv: {
            label: "Formattage du fichier",
            defaultSize: 2,
            items: {
                encoding: {label: "Codage", options: [['Unicode','utf8'], ['Latin','latin1'],['Mac'],['Windows 1252','windows-1252']]},
                sep: {label: "Séparateur", options:[["Point-virgule (;)",";"],["Virgule (,)",","],["Tabulation","\t","Barre verticale (|)",'|'],["Espace"," "]]},
                quote: {size:3,label: "Délimiteur", options:[['aucun', undefined],['guillemets doubles (")','"'],["guillemets simples (')","'"]]},
                skipLines: {label: "Sauter des lignes:", options: [['aucune',0],[1,1],[2,2],[3,3],[4,4],[5,5]]},
                dateFormat: {size: 3,label: "Format des dates", options:[['DD/MM/YYYY','DD/MM/YYYY'],['YYYY-MM-DD','YYYY-MM-DD'],['YYYYMMDD','YYYYMMDD'],['DDMMYYYY','DDMMYYYY'],['DD-MM-YYYY','DD-MM-YYYY'],['YYYY/MM/DD']]},
            }
        },
        api: {
            label: "Paramètres de l'algorithme",
            defaultSize: 6,
            items: {
                candidateNumber: {label: "Maximum de correspondances", range: { min: 1, max: 10, step: 1 }},
                pruneScore: {label: "Seuil minimal de correspondance", range: { type: 'percent', min: 0, max: 1, step: 0.01}}
            }
        },
        check: {
            label: "Paramères de validation",
            defaultSize: 6,
            items: {
                autoCheckSimilar: {label: "Valider automatiquement les paires similaires", checkbox: true},
                displayUnmappedColumns: {label: "Afficher toutes les colonnes", checkbox: true},
                similarThreshold: {label: "Regrouper les pairs similaires à plus de", range: { type: 'percent', min: 0, max: 1, step: 0.005}},
                autoCheckThreshold: {label: "Valider les scores au dessus de", range: { type: 'percent', min: $linkOptions.api.pruneScoe, max: 1, step: 0.01}},
                filter: {size:12, label: "Rechercher dans les résultats"}
            }
        }
    };

    const deactivateElement = () => {
            activeElement.update(v => {
                v && v.blur();
                return undefined;
        });
    }
</script>

<style>
    /* The slider itself */
    .rf-range {
        margin-top: 12px;
        margin-bottom: 4px;
        -webkit-appearance: none;  /* Override default CSS styles */
        appearance: none;
        width: 100%; /* Full-width */
        height: 8px; /* Specified height */
        background: var(--g200); /* Grey background */
        outline: none; /* Remove outline */
        opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
        -webkit-transition: .2s; /* 0.2 seconds transition on hover */
        transition: opacity .2s;
    }

    /* Mouse-over effects */
    .rf-range:hover {
        opacity: 1; /* Fully shown on mouse-over */
    }

    /* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */
    .rf-range::-webkit-slider-thumb {
        -webkit-appearance: none; /* Override default look */
        appearance: none;
        width: 8px; /* Set a specific slider handle width */
        height: 16px; /* Slider handle height */
        background: var(--bf500); /* Green background */
        cursor: pointer; /* Cursor on hover */
    }

    .rf-range::-moz-range-thumb {
        width: 25px; /* Set a specific slider handle width */
        height: 25px; /* Slider handle height */
        background: #4CAF50; /* Green background */
        cursor: pointer; /* Cursor on hover */
    }

</style>