<div class="rf-grid-row">
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


<script>
    import { linkOptions, activeElement } from '../tools/stores.js';
    export let csv = false;
    export let api = false;
    export let check = false;

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
                encoding: {label: "Codage", options: [['Unicode','utf8'], ['Latin','latin1'],['Mac','mac'],['Windows 1252','win1252']]},
                sep: {label: "Séparateur", options:[["Point-virgule (;)",";"],["Virgule (,)",","],["Tabulation","\t","Barre verticale (|)",'|'],["Espace"," "]]},
                quote: {size:3,label: "Délimiteur", options:[['aucun', undefined],['guillemets doubles (")','"'],["guillemets simples (')","'"]]},
                skipLines: {label: "Lignes sautées:", options: [['aucune',0],[1,1],[2,2],[3,3],[4,4],[5,5]]},
                dateFormat: {size: 3,label: "Format des dates", options:[['dd/MM/yyyy','dd/MM/yyyy'],['yyyy-MM-dd','yyyy-MM-dd'],['yyyyMMdd','yyyyMMdd'],['ddMMyyyy','ddMMyyyy'],['dd-MM-yyyy','dd-MM-yyyy'],['yyyy/MM/dd']]},
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
            label: "Paramètres de validation",
            defaultSize: 6,
            items: {
                autoCheckSimilar: {label: "Valider automatiquement les paires similaires", checkbox: true},
                displayUnmappedColumns: {label: "Afficher toutes les colonnes", checkbox: true},
                similarThreshold: {label: "Regrouper les pairs similaires à plus de", range: { type: 'percent', min: 0, max: 1, step: 0.005}},
                autoCheckThreshold: {label: "Valider les scores au dessus de", range: { type: 'percent', min: $linkOptions.api.pruneScore, max: 1, step: 0.01}},
                filter: {size:12, label: "Rechercher dans les résultats (filtre)"}
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

</style>
