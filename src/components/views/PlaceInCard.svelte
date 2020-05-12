{#if city}
    <tr>
        <td>Commune</td>
        <td>{cityString(city)} ({cityCode})</td>
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
        <td>{country} {countryCode ? `(${countryCode})` : ''}</td>
    </tr>
{/if}

<script>
    export let city, cityCode, department, country, countryCode;

    const cityString = (city) => {
        return city
            ? ( Array.isArray(city)
                ? (city.some(x => x.match(/arrondissement/i))
                    ? city.filter(x => x.match(/arrondissement/i))[0]
                    : city[0])
                : city)
            : ''
    };
</script>

<style>

</style>