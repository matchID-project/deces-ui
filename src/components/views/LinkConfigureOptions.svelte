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
                    {#if csv}
                        <div class="rf-col-12">
                            <strong>Options de formattage du fichier :</strong>
                        </div>
                        {#each Object.keys(csvOptions) as key}
                            <div class="rf-col-xl-{csvOptions[key].size ? csvOptions[key].size : 2} rf-col-lg-{csvOptions[key].size ? csvOptions[key].size : 2} rf-col-md-6 rf-col-sm-6 rf-col-xs-6 rf-padding-1N">
                                <label
                                    class="rf-label"
                                    for={key}
                                    style="overflow:hidden;text-overflow:ellipsis;"
                                >
                                    {csvOptions[key].label}
                                </label>
                                <div class="rf-field">
                                    {#if csvOptions[key].options}
                                        <select
                                            class="rf-select"
                                            id={key}
                                            bind:value={$linkCsvType[key]}
                                        >
                                            {#each csvOptions[key].options as option}
                                                <option value={option[1]} selected={$linkCsvType[key] === option[1]}>{option[0]}</option>
                                            {/each}
                                        </select>
                                    {:else}
                                        <input
                                            class="rf-input"
                                            id={key}
                                            bind:value={$linkCsvType[key]}
                                        >
                                    {/if}
                                </div>
                            </div>
                        {/each}
                    {/if}
                    {#if (api || check)}
                        <div class="rf-col-12 rf-padding-top-1N">
                            <strong>Options {#if api}de l'algorithme{/if} :</strong>
                        </div>
                    {/if}
                    {#if api}
                        {#each Object.keys(apiOptions) as key}
                            <div class="rf-col-xl-6 rf-col-lg-6 rf-col-md-6 rf-col-sm-6 rf-col-xs-6 rf-padding-1N">
                                <label
                                    class="rf-label"
                                    for={key}
                                    style="overflow:hidden;text-overflow:ellipsis;"
                                >
                                    {apiOptions[key].label}
                                </label>
                                <div class="rf-field">
                                    {#if apiOptions[key].options}
                                        <select
                                            class="rf-select"
                                            id={key}
                                            bind:value={$linkAlgoOptions.api[key]}
                                        >
                                            {#each apiOptions[key].options as option}
                                                <option value={option[1]} selected={$linkAlgoOptions.api[key] === option[1]}>{option[0]}</option>
                                            {/each}
                                        </select>
                                    {:else}
                                        <input
                                            class="rf-input"
                                            id={key}
                                            bind:value={$linkAlgoOptions.api[key]}
                                        >
                                    {/if}
                                </div>
                            </div>
                        {/each}
                    {/if}
                    {#if check}
                        {#each Object.keys(checkOptions) as key}
                            <div class="rf-col-xl-{checkOptions[key].size ? checkOptions[key].size : 6} rf-col-lg-{checkOptions[key].size ? checkOptions[key].size : 6} rf-col-md-6 rf-col-sm-6 rf-col-xs-6 rf-padding-1N">
                                {#if checkOptions[key].checkbox}
                                    <div class="rf-checkbox-group">
                                        <input
                                            class="rf-input"
                                            type="checkbox"
                                            id={key}
                                            bind:checked={$linkAlgoOptions.check[key]}
                                        />
                                        <label
                                            class="rf-label"
                                            for={key}
                                            style="overflow:hidden;text-overflow:ellipsis;"
                                        >
                                            {checkOptions[key].label}
                                        </label>
                                    </div>
                                {:else}
                                    <label
                                        class="rf-label"
                                        for={key}
                                        style="overflow:hidden;text-overflow:ellipsis;"
                                    >
                                        {checkOptions[key].label}
                                    </label>
                                    <div class="rf-field">
                                        {#if checkOptions[key].options}
                                            <select
                                                class="rf-select"
                                                id={key}
                                                bind:value={$linkAlgoOptions.check[key]}
                                            >
                                                {#each checkOptions[key].options as option}
                                                    <option value={option[1]} selected={$linkAlgoOptions.check[key] === option[1]}>{option[0]}</option>
                                                {/each}
                                            </select>
                                        {:else}
                                            <input
                                                class="rf-input"
                                                id={key}
                                                bind:value={$linkAlgoOptions.check[key]}
                                            >
                                        {/if}
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</div>

<script>
    import { linkCsvType, linkAlgoOptions, activeElement } from '../tools/stores.js';
    import Icon from './Icon.svelte';
    export let csv = false;
    export let api = false;
    export let check = false;

    let display = false;
    const csvOptions = {
        encoding: {label: "Codage", options: [['Unicode','utf8'], ['Latin','latin1'],['Mac'],['Windows 1252','windows-1252']]},
        sep: {label: "Séparateur", options:[["Point-virgule (;)",";"],["Virgule (,)",","],["Tabulation","\t","Barre verticale (|)",'|'],["Espace"," "]]},
        quote: {size:3,label: "Délimiteur", options:[['aucun', undefined],['guillemets doubles (")','"'],["guillemets simples (')","'"]]},
        skipLines: {label: "Sauter des lignes:", options: [['aucune',0],[1,1],[2,2],[3,3],[4,4],[5,5]]},
        dateFormat: {size: 3,label: "Format des dates", options:[['DD/MM/YYYY','DD/MM/YYYY'],['YYYY-MM-DD','YYYY-MM-DD'],['YYYYMMDD','YYYYMMDD'],['DDMMYYYY','DDMMYYYY'],['DD-MM-YYYY','DD-MM-YYYY'],['YYYY/MM/DD']]},
    };
    const apiOptions = {
        candidateNumber: {label: "Maximum de correspondances (1 à 10)"},
        pruneScore: {label: "Seuil minimal de correspondance (entre 0 et 1"}
    };
    const checkOptions = {
        autoCheckSimilar: {label: "Valider automatiquement les paires similaires", checkbox: true},
        displayUnmappedColumns: {label: "Afficher toutes les colonnes", checkbox: true},
        similarThreshold: {label: "Seuil de regroupement des paires similaires"},
        autoCheckThreshold: {label: "Valider les scores au dessus de"},
        filter: {size:12, label: "Rechercher dans les résultats"}
    }

    const deactivateElement = () => {
            activeElement.update(v => {
                v && v.blur();
                return undefined;
        });
    }
</script>