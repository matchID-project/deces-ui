<div class="rf-container-fluid" style="margin-top: -1rem;">
    <div class="rf-grid-row rf-text--center">
        {#if $linkOptions.csv}
            <div class="rf-col-12">
                <IconMenuCallout menu={iconMenuCallout}/>
            </div>
        {/if}
        <div class="rf-col-6">
            <p>
                <strong>Choisissez les champs à apparier:</strong><br/>
                <span class="rf-text--sm">
                si un champ automatiquement associé ci-dessous est erronné, <br>
                cliquez dessus pour supprimer l'association
                </span>
            </p>
            <LinkFields bind:mapping={mapping} bind:fields={fields}/>
        </div>
        <div class="rf-col-1" style="position: relative">
            <div class="rf-col--vcenter">
                <Icon icon="ri:arrow-left-line" class="rf-fi--xxl"/>
            </div>
        </div>
        <div class="rf-col-5">
            <p>
                <strong>Depuis les colonnes ci-dessous:</strong><br/>
                <span class="rf-text--sm">glissez-collez une colonne du bas sur un champ ci-contre</span>
            </p>
            <LinkSampleTable bind:fields={fields}/>
        </div>
        <div class="rf-col-12 rf-margin-top-2N">
            {#if warning}
                <p class="rf-text--sm rf-color--rm">
                    Le contenu des colonnes suivantes n'est pas reconnu :
                    {#each fields.filter(f => (f.warning && !f.blockOnWarning)) as field}
                        <strong>{@html field.label} ({field.mapTo})</strong>,
                    {/each}
                    <br/>
                    ceci n'est pas bloquant pour le traitement mais pourrait conduire à une absence de résultats.
                </p>
            {/if}
            {#if disabled}
                {#if notEnoughFields}
                    <div class="rf-col-12">
                        <span class="rf-text--sm rf-color--rm">
                            Vous devez choisir au minimum {$linkMinFields} champs à apparier
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
                {#if !$user}
                        <span class="rf-text--sm rf-color--rm">
                            Pour des raisons de traçabilité et conformité RGPD,
                            <br>
                            vous devez être identifié pour effectuer un appariement.
                            <br>
                            Veuillez vous enregistrer ci-dessous.
                        </span>
                        <br/>
                {:else}
                    <span class="rf-text--sm" style="color: var(--success);">
                        Vous êtes identifié(e)
                    </span>
                {/if}
            {:else}
                <span class="rf-text--sm" style="color: var(--success);">
                    Vous êtes identifié(e), vous pouvez poursuivre l'appariement
                </span>
            {/if}
            <div style="display:flex;justify-content: center">
                {#if !$user}
                    <LoginField style="width: 100%; max-width: 320px;" button/>
                {:else}
                    <button
                        type="button"
                        class="rf-btn"
                        style="margin-top:1.3rem;height: 2.5rem;overflow: visible!important;"
                        disabled={disabled}
                        on:click|preventDefault={validate}
                        on:keydown|preventDefault={validate}
                    >
                        Valider
                    </button>
                {/if}
            </div>
        </div>
        {#if $linkOptions.csv && $linkOptions.csv.gedcom}
            <GedcomTree gedcom={$linkOptions.csv.gedcom}/>
        {/if}
    </div>
</div>
<script>
    import { user, linkStep, linkFile, linkMapping, linkMinFields, linkSourceHeaderTypes, linkOptions } from '../tools/stores.js';
    import Icon from './Icon.svelte';
    import LinkFields from './LinkFields.svelte';
    import LinkSampleTable from './LinkSampleTable.svelte';
    import IconMenuCallout from './IconMenuCallout.svelte';
    import LinkConfigureOptions from './LinkConfigureOptions.svelte';
    import LoginField from './LoginField.svelte';
    import GedcomTree from './GedcomTree.svelte';
    let mapping = {};

    const iconMenuCallout = {
        Options: { icon: "ri:settings-5-line", component: LinkConfigureOptions, props: {csv: true, api: true}}
    };

    let fields = [
        { group: '', size: 6, label: "Nom", field: "lastName", mapTo: undefined, type: "lastName"},
        { group: '', size: 6, label: "Nom&nbsp;d'usage", field: "legalName", mapTo: undefined, type: "lastName"},
        { group: '', size: 8, label: "Prénom(s)", field: "firstName", mapTo: undefined, type: "firstName"},
        { group: '', size: 4, label: "Sexe", field: "sex", mapTo: undefined, type: "sex"},
        { group: 'Naissance', size: 4, label: "Date", field: "birthDate", mapTo: undefined, type: "date", blockOnWarning: true,
            errorMessage: "le champ date ne supporte que les format JJ/MM/AAAA, JJ-MM-AAAA, AAAA/MM/JJ et AAAA-MM-JJ"},
        { group: 'Naissance', size: 4, label: "Département", field: "birthDepartment", mapTo: undefined, type: "depCode"},
        { group: 'Naissance', size: 4, label: "Pays", field: "birthCountry", mapTo: undefined, type: "country"},
        { group: 'Naissance', size: 4, label: "Commune", field: "birthCity", mapTo: undefined, type: "city"},
        { group: 'Naissance', size: 4, label: "Code&nbsp;INSEE", field: "birthLocationCode", mapTo: undefined, type: "locationCode"},
        { group: 'Naissance', size: 4, label: "Code&nbsp;Postal", field: "birthPostalCode", mapTo: undefined, type: "postalCode"},
        { group: 'Décès', size: 6, label: "Date", field: { query: "deathDate", result: "deathDate" }, mapTo: undefined, type: "date", blockOnWarning: true,
            errorMessage: "le champ date ne supporte que les format JJ/MM/AAAA, JJ-MM-AAAA, AAAA/MM/JJ et AAAA-MM-JJ"},
        { group: 'Décès', size: 6, label: "Après&nbsp;le&nbsp;(date)", field: { query: "lastSeenAliveDate", result: "deathDate" }, mapTo: undefined, type: "date", blockOnWarning: true,
            errorMessage: "le champ date ne supporte que les format JJ/MM/AAAA, JJ-MM-AAAA, AAAA/MM/JJ et AAAA-MM-JJ"},
        { group: 'Décès', size: 4, label: "Département", field: "deathDepartment", mapTo: undefined, type: "depCode"},
        { group: 'Décès', size: 4, label: "Code&nbsp;INSEE", field: "deathLocationCode", mapTo: undefined, type: "locationCode"},
        { group: 'Décès', size: 4, label: "Code&nbsp;Postal", field: "deathPostalCode", mapTo: undefined, type: "postalCode"}
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
    $: disabled =  notEnoughFields || blockOnWarning || (!$user) ;

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

    $: if ($linkOptions && $linkOptions.csv && ($linkOptions.csv.dateFormat === undefined) && fields.filter(f => f.field === "birthDate")[0].guessedFormat) {
        $linkOptions.csv.dateFormat = fields.filter(f => f.field === "birthDate")[0].guessedFormat;
    }

    $: if (done) {$linkStep = 3};

    const validate = (ev) => {
        $linkMapping = mapping;
        done = true;
    }

</script>

