{#if (result) && !(result.error) }
    <div class="{expand ? "rf-col-12" : "rf-col-xs-12 rf-col-sm-12 rf-col-md-12 rf-col-lg-6 rf-col-xl-6"} rf-padding-1N rf-padding-left-2N rf-padding-right-2N">
        <div class="rf-container-fluid">
            <div class="rf-grid-row">
                <div class="rf-col-12">
                    <div
                        class="rf-card rf-card--horizontal rf-card--{expand ? "md": "sm"}"
                        class:rf-card--left-arrow={expand}
                        on:click|preventDefault={toggleExpand}
                    >
                        <div class="rf-card__img">
                            <img
                                class="rf-background--g400"
                                alt={ result.sex }
                                src={ result.sex === 'M' ? '/male.svg' : '/female.svg' }
                            />
                            {#if result.correction}
                                <div
                                    style="position:absolute;top:6px;left:6px"
                                    title="erreur de donnée signalée"
                                >
                                    <Icon icon='ri:alert-line' class="rf-color--rm rf-fi--{expand ? "xxl" : "xl"} rf-margin-left-4px"/>
                                </div>
                            {/if}
                        </div>
                        <div class="rf-card__body">
                            <a
                                href="#{index}"
                                aria-label="étendre la carte de {result.name.last.toUpperCase()} { result.name.first ? result.name.first.join(' ') : '' }"
                            >
                                <h4
                                    class="rf-card_lead rf-margin-0 {expand ? "" : "rf-text"}"
                                    style="overflow: hidden; text-overflow:ellipsis; {expand ? "" : "height: 1.5rem;"}"
                                >
                                    {result.name.last.toUpperCase()} { result.name.first ? result.name.first.join(' ') : '' }
                                </h4>
                                <p class="rf-card__desc rf-margin-0">
                                    <span class="{expand ? "" : "rf-text--xs"}">
                                        <span class="rf-hide--mobile">
                                            { cityString(result.birth.location.city) }
                                        </span>
                                        { dateFormat(result.birth.date) }
                                        {#if result.death}
                                            -
                                            <span class="rf-hide--mobile">
                                                { cityString(result.death.location.city) }
                                            </span>
                                            { dateFormat(result.death.date) }
                                        {/if}
                                    </span>
                                </p>
                            </a>
                        </div>
                    </div>
                </div>
                {#if expand}
                    <div class="rf-col-12" transition:slide|local>
                        <div class="rf-callout rf-background--white">
                            {#if result.correction}
                                <span style="display:flex" class="rf-color--rm">
                                    <Icon icon='ri:alert-line' class="rf-color--rm rf-fi--md rf-margin-right-1N" title="erreur de donnée signalée"/>
                                    La fiche a fait l'objet d'un signalement pour erreur.
                                    {#if result.correction.change === "cancel"}
                                        La personne mentionnée n'est pas décédée, et a demandé le retrait de cette fiche au fichier INSEE.
                                    {/if}
                                </span>
                            {/if}
                            <span
                                class="rf-top-right-6px rf-text--sm rf-link rf-fi-- rf-href rf-text--right"
                                title="copier le lien permanent"
                                on:click|preventDefault={() => copyLink(result)}
                            >
                                    <Icon icon='ri:link' class="rf-fi--md" href={link(result)} label="copier le lien permanent"/>
                                    lien {linkCopied ? "copié !" : "permanent"}
                            </span>
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
                                    {#if result.death}
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
                                    {/if}
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
    import { dataGouvCatalog, displayMode, searchInput, activeElement } from '../tools/stores.js';
    import { buildURLParams } from '../tools/search.js';
    import PlaceInCard from './PlaceInCard.svelte';
    import Icon from './Icon.svelte';

    export let result  = undefined;
    export let index = undefined;
    export let forceExpand = undefined;
    let linkCopied = false;

    let expand = forceExpand || ($displayMode === 'card-expand');

    $: expand = forceExpand || ($displayMode === 'card-expand');


    const toggleExpand = () => {
        expand = !expand;
        activeElement.update(v => {
            v && v.blur();
            return undefined;
        });
    }

    const link = (result) => {
        return `${location.origin}/search?${resultURL(result)}`;
    }

    const copyLink = (result) => {
        navigator.clipboard.writeText(link(result));
        linkCopied = true;
        setTimeout(() => linkCopied = false, 5000)
    }

    const resultURL = (r) => {
        const params = {
            lastName: { url: 'ln', value: r.name.last },
            firstName: { url: 'fn', value: r.name.first },
            birthDate: { url: 'bd', value: dateFormat(r.birth.date) },
            birthCity: { url: 'bc', value: r.birth.location.city },
        }
        if (r.death) {
            params.deathDate = { url: 'dd', value: dateFormat(r.death && r.death.date) };
        }
        return buildURLParams(params, true, false, 'card-expand', undefined, 1);
    }

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
