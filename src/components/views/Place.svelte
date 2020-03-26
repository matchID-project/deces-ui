{#if city}
    <tr>
        <td>Commune</td>
        <td>{city} ({citycode})</td>
    </tr>
{/if}

{#if department}
    <tr>
        <td>Département</td>
        <td>{department}</td>
    </tr>
{/if}

{#if country}
    <tr>
        <td>Pays</td>
        <td>{country}</td>
    </tr>
{/if}

<script>
    export let city, citycode, department, country, countrycode;
</script>

<style>

</style>