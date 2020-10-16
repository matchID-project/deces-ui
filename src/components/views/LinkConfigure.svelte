<div class="rf-container-fluid">
    <div class="rf-grid-row rf-margin-top-2N rf-text--center">
        <div class="rf-col-12">
            <p>
                <strong>Choisissez les champs à apparier:</strong><br/>
                <span class="rf-text--sm">
                si une colonne automatiquement associée ci-dessous est erronnée, <br>
                cliquez dessus pour supprimer l'association
                </span>
            </p>
            <LinkFields bind:mapping={mapping} bind:fields={fields}/>
            {#if warning}
                <p class="rf-text--sm rf-color--rm">
                    Le contenu des colonnes suivantes n'est pas reconnu :
                    {#each fields.filter(f => (f.warning && !f.blockOnWarning)) as field}
                        <strong>{field.label} ({field.mapTo})</strong>,
                    {/each}
                    <br/>
                    ceci n'est pas bloquant pour le traitement mais pourrait conduire à une absence de résultats.
                </p>
            {/if}
            {#if disabled}
                {#if notEnoughFields}
                    <div class="rf-col-12">
                        <span class="rf-text--sm rf-color--rm">
                            vous devez choisir au minimum {$linkMinFields} champs à apparier
                            {#if selectedFieldsNumber}
                                ({selectedFieldsNumber} champ(s) sélectionné(s))
                            {:else}
                                (aucun champ sélectionné)
                            {/if}
                        </span>
                        <br/>
                    </div>
                {/if}
                {#if blockOnWarning}
                    {#each fields.filter(f => (f.warning && f.blockOnWarning)) as field}
                        <span class="rf-text--sm rf-color--rm">
                            {field.errorMessage}
                        </span>
                        <br/>
                    {/each}
                {/if}
            {/if}
            <button
                type="button"
                class="rf-btn rf-margin-1N"
                disabled={disabled}
                on:click|preventDefault={validate}
            >
                valider
            </button>
            <p>
                <strong>Depuis les colonnes ci-dessous:</strong><br/>
                <span class="rf-text--sm">glissez-collez une colonne du bas sur un champ au-dessus</span>
            </p>

            <LinkSampleTable bind:mapping={mapping} bind:fields={fields}/>

        </div>
    </div>
</div>
<script>
    import { linkStep, linkMapping, linkMinFields, linkSourceHeaderTypes, linkCsvType } from '../tools/stores.js';
    import LinkFields from './LinkFields.svelte';
    import LinkSampleTable from './LinkSampleTable.svelte';
    let mapping = {};
    let fields = [
        { label: "nom", field: "lastName", mapTo: undefined, type: "lastName"},
        { label: "prénom(s)", field: "firstName", mapTo: undefined, type: "firstName"},
        { label: "sexe", field: "sex", mapTo: undefined, type: "sex"},
        { label: "date de naissance", field: "birthDate", mapTo: undefined, type: "date", blockOnWarning: true,
            errorMessage: "le champ date ne supporte que les format JJ/MM/AAAA, JJ-MM-AAAA, AAAA/MM/JJ et AAAA-MM-JJ"},
        { label: "commune de naissance", field: "birthCity", mapTo: undefined, type: "city"},
        { label: "département de naissance", field: "birthDepartment", mapTo: undefined, type: "depCode"},
        { label: "pays de naissance", field: "birthCountry", mapTo: undefined, type: "country"},
        { label: "décès ultérieur à (date)", field: { query: "lastSeenAliveDate", result: "deathDate" }, mapTo: undefined, type: "date", blockOnWarning: true,
            errorMessage: "le champ date ne supporte que les format JJ/MM/AAAA, JJ-MM-AAAA, AAAA/MM/JJ et AAAA-MM-JJ"}
    ];
    let done = false;
    let disabled = true;
    let notEnoughFields = true;
    let blockOnWarning = false;
    let warning = false;
    let selectedFieldsNumber = 0;

    $: selectedFieldsNumber = mapping.direct ? Object.keys(mapping.direct).length : 0;
    $: warning = fields.some(f => (f.warning && !f.blockOnWarning));
    $: blockOnWarning = fields.some(f => (f.warning && f.blockOnWarning));
    $: notEnoughFields = (selectedFieldsNumber < $linkMinFields);
    $: disabled =  notEnoughFields || blockOnWarning ;

    $: if ($linkSourceHeaderTypes) {
        fields = fields.map(field => {
            let possibleColumns = undefined
            Object.keys($linkSourceHeaderTypes).forEach(col => {
                if ($linkSourceHeaderTypes[col]
                    && (field.type === $linkSourceHeaderTypes[col].type)
                    && !($linkSourceHeaderTypes[col].mapped)
                    && (!field.guessedFreq || (field.guessedFreq < $linkSourceHeaderTypes[col].type))) {
                        field.guessedType = $linkSourceHeaderTypes[col].type;
                        field.guessedFormat = $linkSourceHeaderTypes[col].format;
                        field.guessedFreq = $linkSourceHeaderTypes[col].freq;
                        field.mapTo = col;
                }
            });
            if (field.mapTo) {
                if ($linkSourceHeaderTypes[field.mapTo]) {
                    $linkSourceHeaderTypes[field.mapTo].mapped = field;
                }
            }
            return field;
        });
    };

    $: if ($linkCsvType && fields.filter(f => f.field === "birthDate")[0].guessedFormat) {
        linkCsvType.update(v => {
            v.dateFormat = fields.filter(f => f.field === "birthDate")[0].guessedFormat
            return v;
        });
    }

    $: if (done) {$linkStep = 3};

    const validate = (ev) => {
        $linkMapping = mapping;
        done = true;
    }

</script>

<style>
    .wrap {
        max-width: 1024px;
        margin-left: auto;
        margin-right: auto;
        padding: 8px;
        text-align: center;
    }
    .wrap-table {
        border: 1px solid;
        overflow-x: hidden;
        overflow-y: hidden;
    }
</style>
