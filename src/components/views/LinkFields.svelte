<div class="container fields-container">
    {#each fields as field}
        <LinkField bind:field={field}/>
    {/each}
</div>

<script>
    import LinkField from './LinkField.svelte';
    export let mapping = {}

    let fields = [
        { label: "nom", field: "lastName", mapTo: null},
        { label: "prénom(s)", field: "firstName", mapTo: null},
        { label: "sexe", field: "sex", mapTo: null},
        { label: "date de naissance", field: "birthDate", mapTo: null},
        { label: "commune de naissance", field: "birthCity", mapTo: null},
        { label: "département de naissance", field: "birthDepartment", mapTo: null},
        { label: "pays de naissance", field: "birthCountry", mapTo: null}
    ]

    $: if (fields) {
        mapping={};
        fields.filter(f => f.mapTo).map(f => mapping[f.mapTo]=f.field);
    };

</script>

<style>
    .fields-container {
        display: flex;
        justify-content: center;
    }
</style>