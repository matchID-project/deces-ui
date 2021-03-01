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
                            {#if (result.links && result.links.wikimedia)}
                                <img
                                    alt={ result.links.wikimedia }
                                    src={ result.links.wikimedia }
                                />
                            {:else}
                                <img
                                    class="rf-background--g400"
                                    alt={ result.sex }
                                    src={ result.sex === 'M' ? '/male.svg' : '/female.svg' }
                                />
                            {/if}
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
                                            { cityString(result.birth.location.city, false) }
                                        </span>
                                        { dateFormat(result.birth.date) }
                                        {#if result.death}
                                            -
                                            <span class="rf-hide--mobile">
                                                { cityString(result.death.location.city, false) }
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
                                    {#each Object.keys(conf) as column}
                                        <div class="rf-col-xs-12 rf-col-sm-12 rf-col-md-6 rf-cold-rf-col-xl-6">
                                            <span><strong>{ column }</strong></span>
                                            <table class="rf-table rf-table--narrow rf-table--striped">
                                                <tbody>
                                                    {#each conf[column] as field}
                                                        {#if field.value &&
                                                            (Array.isArray(field.value) ? field.value.some(x => x) : true)}
                                                            <tr>
                                                                <td>{ field.label }</td>
                                                                <td>{@html field.cb ? field.cb(field.value) : field.value }</td>
                                                            </tr>
                                                        {/if}
                                                    {/each}
                                                </tbody>
                                            </table>
                                        </div>
                                    {/each}
                                    {#if (result.links && Object.keys(result.links).length)}
                                        {#each Object.keys(result.links).filter(x => ['wikipedia','wikidata'].includes(x)) as key}
                                            <div class="rf-col-xs-12 rf-col-sm-12 rf-col-md-6 rf-cold-rf-col-xl-6 rf-text--center rf-padding-top-1N">
                                                <a
                                                    href={result.links[key]}
                                                    title={`lien ${key}`}
                                                    target="_blank"
                                                    class="rf-link"
                                                >
                                                    Voir sur {key}
                                                </a>
                                            </div>
                                        {/each}
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
    import Icon from './Icon.svelte';

    export let result  = undefined;
    export let index = undefined;
    export let forceExpand = undefined;
    let linkCopied = false;

    let expand = forceExpand || ($displayMode === 'card-expand');

    $: expand = forceExpand || ($displayMode === 'card-expand');

    let conf = {};
    $: conf.Naissance = [
            { label: 'Nom', value: result.name.last },
            { label: 'Prénom(s)', value: result.name.first, cb: (p) => p ? p.join(' ') : '(sans prénom)' },
            { label: 'Sexe', value: result.sex, cb: (s) => s === 'M' ? 'masculin' : 'féminin' },
            { label: 'Date',  value: result.birth.date, cb: dateFormat },
            { label: 'Commune',  value: [result.birth.location.city, result.birth.location.code], cb: (c) => `${cityString(c[0],true)} (${c[1]})` },
            { label: 'Département',  value: result.birth.location.departmentCode },
            { label: 'Pays',  value: [ result.birth.location.country, result.birth.location.countryCode], cb: (c) => `${c[0]}${c[1] ? ` (${c[1]})` : ''}` }
        ];
    $: if (result.death) {
        conf['Décès'] = [
            { label: 'Date',  value: result.death.date, cb: dateFormat },
            { label: 'Age',  value: result.death.age, cb: (a) => `${a} ans`},
            { label: 'Commune',  value: [result.death.location.city, result.death.location.code], cb: (c) => `${cityString(c[0],true)} (${c[1]})` },
            { label: 'Département',  value: result.death.location.departmentCode },
            { label: 'Pays',  value: [result.death.location.country, result.death.location.countryCode], cb: (c) => `${c[0]}${c[1] ? ` (${c[1]})` : ''}` },
            { label: 'Acte n°',  value: result.death.certificateId },
            { label: 'Source INSEE',  value: $dataGouvCatalog && [result.source, result.sourceLine], cb: (s) => `<a href=${$dataGouvCatalog[s[0]]} title="source INSEE ${s[0]}" target="_blank">fichier ${s[0]}</a>, ligne n°${s[1]}` }
        ]
    } else {
        conf['Décès'] && delete conf['Décès'];
    };

    const toggleExpand = () => {
        expand = !expand;
        activeElement.update(v => {
            v && v.blur();
            return undefined;
        });
    }

    const link = (result) => {
        return `${location.origin}/id/${result.id}`;
    }

    const copyLink = (result) => {
        navigator.clipboard.writeText(link(result));
        linkCopied = true;
        setTimeout(() => linkCopied = false, 5000)
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

    const cityString = (city, full) => {
        return city
            ? ( Array.isArray(city)
                ? (city.some(x => full ? x.match(/arrondissement/i) : !x.match(/arrondissement/i))
                    ? city.filter(x => full ? x.match(/arrondissement/i) : !x.match(/arrondissement/i))[0]
                    : city[0])
                : city)
            : ''
    };

</script>

<style>


</style>
