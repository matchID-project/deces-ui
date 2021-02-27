<div id="options" class:rf-padding-2N={!display} class:rf-padding-bottom-2N={display} style="position:relative">
    <div
        style="position: absolute;top: 16px; right: 16px;z-index:1200;"
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
        <div class="rf-card rf-card--no-arrow">
            <div class="rf-card__body rf-text--left">
                <div class="rf-grid-row">
                    {#each ['csv','api','check'].filter(x => showSection(x)) as section}
                        <div class="rf-col-12 rf-padding-top-1N">
                            <strong>{options[section].label} :</strong>
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
                candidateNumber: {label: "Maximum de correspondances", range: [1, 10,'integer']},
                pruneScore: {label: "Seuil minimal de correspondance", range: [0, 1,'percent']}
            }
        },
        check: {
            label: "Paramères de validation",
            defaultSize: 6,
            items: {
                autoCheckSimilar: {label: "Valider automatiquement les paires similaires", checkbox: true},
                displayUnmappedColumns: {label: "Afficher toutes les colonnes", checkbox: true},
                similarThreshold: {label: "Seuil de regroupement des paires similaires", range: [0, 0.01,'log']},
                autoCheckThreshold: {label: "Valider les scores au dessus de", range: [$linkOptions.api.pruneScore,1,'percent']},
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