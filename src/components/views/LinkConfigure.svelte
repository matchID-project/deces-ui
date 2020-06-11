<div class="content">

    <div class="wrap">
        <p>
            <strong>Choisissez les champs à apparier:</strong><br/>
            <span class="is-size-7">(choisissez au minimum {$linkMinFields} champs à apparier)</span>

        </p>
        <LinkFields bind:mapping={mapping} bind:fields={fields}/>
        <button
            type="button"
            class="button is-info"
            disabled={(mapping.direct && (Object.keys(mapping.direct).length < $linkMinFields))}
            on:click|preventDefault={validate}
        >
            valider
        </button>
        <p>
            <strong>Depuis les colonnes ci-dessous:</strong><br/>
            <span class="is-size-7">(glissez-collez une colonne du bas sur un champ au-dessus)</span>
        </p>
        <div class="wrap-table">
            <LinkSampleTable bind:mapping={mapping} bind:fields={fields}/>
        </div>
    </div>
</div>
<script>
    import { linkStep, linkMapping, linkMinFields } from '../tools/stores.js';
    import LinkFields from './LinkFields.svelte';
    import LinkSampleTable from './LinkSampleTable.svelte';
    let mapping = {};
    let fields = [
        { label: "nom", field: "lastName", mapTo: null},
        { label: "prénom(s)", field: "firstName", mapTo: null},
        { label: "sexe", field: "sex", mapTo: null},
        { label: "date de naissance", field: "birthDate", mapTo: null},
        { label: "commune de naissance", field: "birthCity", mapTo: null},
        { label: "département de naissance", field: "birthDepartment", mapTo: null},
        { label: "pays de naissance", field: "birthCountry", mapTo: null}
    ];
    let done = false;

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
