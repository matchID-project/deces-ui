{#if (result) && !(result.error) }
    <div class="{expand ? "rf-col-12" : "rf-col-xs-12 rf-col-sm-12 rf-col-md-12 rf-col-lg-6 rf-col-xl-6"} rf-padding-1N rf-padding-left-2N rf-padding-right-2N">
        <div class="rf-container-fluid">
            <div class="rf-grid-row">
                <div class="rf-col-12">
                    <div
                        class="rf-card rf-card--horizontal rf-card--{expand ? "md": "sm"}"
                        class:rf-card--left-arrow={expand}
                        on:click={() => { expand=!expand }}
                    >
                        <div class="rf-card__img">
                            <img
                                class="rf-background--g400"
                                alt={ result.sex }
                                src={ result.sex === 'M' ? '/male.svg' : '/female.svg' }
                            />
                        </div>
                        <div class="rf-card__body">
                            <h4 class="rf-card_lead rf-margin-0 {expand ? "" : "rf-text"}">
                                <span class="rf-hide--mobile">
                                    {result.name.last.toUpperCase()} { result.name.first ? result.name.first.join(' ') : '' }
                                </span>
                                <span class="rf-hide--desktop">
                                    {result.name.last.toUpperCase()} { result.name.first ? result.name.first[0] : '' }
                                </span>
                            </h4>

                            <p class="rf-card__desc rf-margin-0">
                                <span class="{expand ? "" : "rf-text--xs"}">
                                    <span class="rf-hide--mobile">
                                        { cityString(result.birth.location.city) }
                                    </span>
                                    { dateFormat(result.birth.date) }
                                    -
                                    <span class="rf-hide--mobile">
                                        { cityString(result.death.location.city) }
                                    </span>
                                    { dateFormat(result.death.date) }
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                {#if expand}
                    <div class="rf-col-12" transition:slide|local>
                        <div class="rf-callout rf-background--white">
                            <div class="rf-container-fluid">
                                <div class="rf-grid-row">
                                    <div class="rf-col-xs-12 rf-col-sm-12 rf-col-md-6 rf-cold-rf-col-xl-6">
                                        <span><strong>Naissance</strong></span>
                                        <table class="rf-table rf-table--narrow rf-table--striped">
                                            <tbody>
                                                <tr>
                                                    <td>Nom</td>
                                                    <td>{result.name.last}</td>
                                                </tr>
                                                <tr>
                                                    <td>Prénom(s)</td>
                                                    <td>
                                                        {
                                                            result.name.first
                                                                ? result.name.first.join(' ')
                                                                : '(sans prénom)'
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Sexe</td>
                                                    <td>
                                                        { result.sex === 'M' ? 'masculin' : 'féminin' }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Date</td>
                                                    <td>{dateFormat(result.birth.date)}</td>
                                                </tr>
                                                <PlaceInCard
                                                    city={result.birth.location.city}
                                                    cityCode={result.birth.location.cityCode}
                                                    department={result.birth.location.departmentCode}
                                                    country={result.birth.location.country}
                                                    countryCode={result.birth.location.countryCode}
                                                />
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="rf-col-xs-12 rf-col-sm-12 rf-col-md-6 rf-cold-rf-col-xl-6">
                                        <span><strong>Décès</strong></span>
                                        <table class="rf-table rf-table--narrow rf-table--striped">
                                            <tbody>
                                                <tr>
                                                    <td>Date</td>
                                                    <td>
                                                        {dateFormat(result.death.date)}
                                                    </td>
                                                </tr>
                                                {#if result.death.age && result.death.age>1}
                                                    <tr>
                                                        <td>Age</td>
                                                        <td>{result.death.age} ans</td>
                                                    </tr>
                                                {/if}
                                                <PlaceInCard
                                                    city={result.death.location.city}
                                                    cityCode={result.death.location.cityCode}
                                                    department={result.death.location.departmentCode}
                                                    country={result.death.location.country}
                                                    countryCode={result.death.location.countryCode}
                                                />
                                                <tr>
                                                    <td>Acte n°</td>
                                                    <td>
                                                        {
                                                            result.death.certificateId
                                                            ? result.death.certificateId
                                                            : "ND"
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Source INSEE</td>
                                                    <td>
                                                        {#if (result.source && $dataGouvCatalog)}
                                                            <a href={$dataGouvCatalog[result.source]} target="_blank">
                                                                fichier {result.source}
                                                            </a>
                                                        {:else}
                                                            ND
                                                        {/if}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}


<script>
    import { slide } from 'svelte/transition';
    import { dataGouvCatalog, displayMode } from '../tools/stores.js';
    import PlaceInCard from './PlaceInCard.svelte';

    export let result;
    export let forceExpand;

    let expand = forceExpand || ($displayMode === 'card-expand');

    $: expand = forceExpand || ($displayMode === 'card-expand');

    const dateFormat = (dateString) => {
        return dateString.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1");
    };

    const toDate = (dateString) => {
        return new Date(
            dateString.substring(0,4),
            dateString.substring(4,6) - 1,
            dateString.substring(6,8)
        );
    };

    const cityString = (city) => {
        return city
            ? ( Array.isArray(city)
                ? (city.some(x => !x.match(/arrondissement/i))
                    ? city.filter(x => !x.match(/arrondissement/i))[0]
                    : city[0])
                : city)
            : ''
    };

</script>

<style>


</style>
