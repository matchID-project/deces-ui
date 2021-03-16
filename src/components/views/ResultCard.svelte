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
                        <div class="rf-card__img" style="position:relative">
                            {#if (wikimediaImgSrc)}
                                <img
                                    class:rf-hide={!wikimediaImgLoaded}
                                    alt={ wikimediaImgSrc }
                                    bind:this={ wikimediaImg }
                                />
                            {/if}
                            <img
                                class="rf-background--{result.links ? 'bf' : 'g400'}"
                                class:rf-hide={wikimediaImgLoaded}
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
                        <div
                            class="rf-card__body"
                            style={(expand && !(result.links && result.links.label)) ? "padding-top: 14px!important;" : ""}
                        >
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
                                <p class="rf-card__desc rf-margin-0" style="display: inline;">
                                    <span class="{expand ? "" : "rf-text--xs"}">
                                        {#if ((result.links && result.links.label))}
                                            <strong>
                                                {(expand || (result.links.label.length < 40)) ?
                                                    result.links.label : result.links.label.substring(0,40) + ' ...'
                                                }
                                            </strong>
                                            {expand ? '(source: wikidata.org)' : ''}
                                            {#if expand} <br> {:else} - {/if}
                                        {/if}
                                        {#if (expand || !(result.links && result.links.label))}
                                            <span class="rf-hide--mobile">
                                                { cityString(result.birth.location.city, false) }
                                            </span>
                                        {/if}
                                        { dateFormat(result.birth.date, !expand) }
                                        {#if result.death}
                                            -
                                            {#if (expand || !(result.links && result.links.label))}
                                                <span class="rf-hide--mobile">
                                                    { cityString(result.death.location.city, false) }
                                                </span>
                                            {/if}
                                            { dateFormat(result.death.date, !expand) }
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
                            <span class="rf-top-right-6px">
                                {#if $route.path === '/search'}
                                    <a
                                        class="rf-text--sm rf-link rf-fi-- rf-href rf-text--right"
                                        title="afficher le lien permanent"
                                        href="/id/{result.id}"
                                    >
                                            <Icon icon='ri:link' class="rf-fi--md" href={link(result)} label="copier le lien permanent"/>
                                            {linkCopied ? "Copié !" : "Permalien"}
                                    </a>
                                {:else}
                                    <a
                                        class="rf-text--sm rf-link rf-fi-- rf-href rf-text--right"
                                        title="copier le lien permanent"
                                        on:click|preventDefault={() => copyLink(result)}
                                        href="/id/{result.id}"
                                    >
                                            <Icon icon='ri:link' class="rf-fi--md" href={link(result)} label="copier le lien permanent"/>
                                            {linkCopied ? "Copié !" : "Permalien"}
                                    </a>
                                {/if}
                            </span>
                            <div class="rf-container-fluid">
                                <div class="rf-grid-row">
                                    {#if edit}
                                        <div class="rf-col-12 rf-text--center">
                                            <p>
                                                <strong>
                                                    Vous pouver maintenant éditer les champs ci-dessous :
                                                </strong>
                                            </p>
                                        </div>
                                    {/if}
                                    {#each Object.keys(conf) as column}
                                        <div class="rf-col-xs-12 rf-col-sm-12 rf-col-md-6 rf-col-lg-6 rf-col-xl-6">
                                            <span><strong>{ column }</strong></span>
                                            <table class="rf-table rf-table--narrow rf-table--striped">
                                                <tbody>
                                                    {#each conf[column] as field}
                                                        {#if field.value &&
                                                            (Array.isArray(field.value) ? field.value.some(x => x) : true)}
                                                            <tr>
                                                                <td width="10rem">{ field.label }</td>
                                                                <td
                                                                    on:mouseenter={() => {
                                                                        editInput[`${column}.${field.label}`] = edit;
                                                                        editTmpValue[`${column}.${field.label}`] = editValue[`${column}.${field.label}`] || (field.cb ? field.cb(field.value) : field.value);
                                                                    }}
                                                                    on:mouseleave={() => {
                                                                        editInput[`${column}.${field.label}`] = false;
                                                                        if (editTmpValue[`${column}.${field.label}`] === (field.cb ? field.cb(field.value) : field.value)) {
                                                                            delete editValue[`${column}.${field.label}`]
                                                                        } else {
                                                                            editValue[`${column}.${field.label}`] = editTmpValue[`${column}.${field.label}`]
                                                                        }
                                                                    }}
                                                                >
                                                                    {#if ((field.editable!==false)&&editInput[`${column}.${field.label}`])}
                                                                        <input
                                                                            class="rf-input"
                                                                            style="height:1.3rem;padding:0;"
                                                                            bind:value={editTmpValue[`${column}.${field.label}`]}
                                                                            use:focus
                                                                        >
                                                                    {:else}
                                                                        {#if (editValue[`${column}.${field.label}`] && (editValue[`${column}.${field.label}`] !== (field.cb ? field.cb(field.value) : field.value)))}
                                                                            <span class="rf-color--rm">
                                                                                {@html `<strike>${field.cb ? field.cb(field.value) : field.value}</strike> ${editValue[`${column}.${field.label}`]}`}
                                                                            </span>
                                                                        {:else}
                                                                            {@html field.cb ? field.cb(field.value) : field.value }
                                                                        {/if}
                                                                    {/if}
                                                                </td>
                                                            </tr>
                                                        {/if}
                                                    {/each}
                                                </tbody>
                                            </table>
                                        </div>
                                    {/each}
                                    {#if (result.links && Object.keys(result.links).length)}
                                        {#each wikilinks as key}
                                            <div class="rf-col-xs-12 rf-col-sm-12 rf-col-md-{wikilinks.length === 2 ? 6 : 12} rf-col-lg-{wikilinks.length === 2 ? 6 : 12} rf-col-xl-{wikilinks.length === 2 ? 6 : 12} rf-text--center rf-padding-top-1N">
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
                                    <div class="rf-col-12 rf-text--center rf-margin-top-2N">
                                        {#if edit}
                                            <p>
                                                <strong>
                                                    Fournir une pièce justificative
                                                </strong>
                                            </p>
                                            <p>
                                                Pour renforcer la confiance dans votre suggestion, un acte de décès est demandé, ou à défaut, un acte de naissance avec mention marginale du décès,
                                                est nécessaire. Nous acceptons également un lien vers un document public d'un site d'archive départementale.
                                            </p>
                                        {/if}
                                    </div>
                                    {#if ($alphaFeatures && !edit)}
                                        <div class="rf-col-12 rf-text--center">
                                            <button
                                                class="rf-btn rf-btn--secondary rf-padding-right-2N"
                                                title="Proposer une correction"
                                                on:click|preventDefault={toggleEdit}
                                            >
                                                    Proposer une correction
                                                    &nbsp;<Icon icon='ri:edit-line' class="rf-fi--md" href={link(result)} label="copier le lien permanent"/>
                                            </button>
                                        </div>
                                    {:else if $alphaFeatures}
                                        <div class="rf-col-xs-12 rf-col-sm-12 rf-col-md-12 rf-col-lg-12 rf-col-xl-2"></div>
                                        <div class="rf-col-xs-12 rf-col-sm-6 rf-col-md-6 rf-col-lg-6 rf-col-xl-4 rf-text--center">
                                            <button
                                                class="rf-btn rf-btn--secondary rf-padding-right-2N rf-inactive"
                                                class:rf-inactive={editUrlValidate}
                                                title="Charger un fichier"
                                                on:click|preventDefault={chooseFile}
                                            >
                                                    { editFile ? ellipsis(editFile.name) : 'Charger un fichier'}
                                                    &nbsp;<Icon icon={editFile ? 'ri:check-line' : 'ri:upload-cloud-line'} class="rf-fi--md" href={link(result)} label="copier le lien permanent"/>
                                            </button>
                                        </div>
                                        <div class="rf-col-xs-12 rf-col-sm-6 rf-col-md-6 rf-col-lg-6 rf-col-xl-4">
                                            <div style="width:80%;padding-left:8px;">
                                                <div
                                                    class="rf-input-group"
                                                    class:rf-input-group--valid={editUrl && editUrlValidate}
                                                    class:rf-input-group--error={editUrl && (editUrlValidate===false)}
                                                >
                                                    <label
                                                        class="rf-label rf-text--left"
                                                        for="editUrl"
                                                        style="overflow:hidden;text-overflow:ellipsis;position: relative"
                                                    >
                                                        <span
                                                            class:rf-fi-check-line={editUrl && editUrlValidate}
                                                            class:rf-fi-alert-line={editUrl && (editUrlValidate===false)}
                                                        >
                                                            &nbsp;
                                                        </span>
                                                        <span style="position:absolute;top:-2px">Lien</span>
                                                    </label>
                                                    <input
                                                        id="editUrl"
                                                        class:rf-input--valid={editUrlValidate}
                                                        class="rf-input rf-margin-top-0"
                                                        bind:value={editUrl}
                                                        on:focus={() => { editUrlValidate = undefined }}
                                                        on:blur={testEditUrl}
                                                        disabled={editFile}
                                                    >
                                                </div>
                                            </div>
                                        </div>
                                        <div class="rf-col-xs-12 rf-col-sm-12 rf-col-md-12 rf-col-lg-12 rf-col-xl-2"></div>
                                        <div class="rf-col-12 rf-text--center">
                                            <button
                                                class="rf-btn rf-padding-right-2N"
                                                title={editValidate ? 'Transmettre' : 'Annuler'}
                                                on:click={() => {
                                                    if (editValidate) { return }
                                                    else { toggleEdit() }
                                                }}
                                            >
                                                    {editValidate ? 'Transmettre' : 'Annuler'}
                                                    &nbsp;<Icon icon={editValidate ? 'ri:send-plane-line' : 'ri:close-line'} class="rf-fi--md" href={link(result)} label="copier le lien permanent"/>
                                            </button>
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
    import { alphaFeatures, route, dataGouvCatalog, displayMode, searchInput, activeElement } from '../tools/stores.js';
    import Icon from './Icon.svelte';
    import md5 from 'md5';

    export let result  = undefined;
    export let index = undefined;
    export let forceExpand = undefined;
    let linkCopied = false;
    let wikilinks;
    let wikimediaImgSrc;
    let wikimediaImg;
    let wikimediaImgLoaded;
    let edit = false;
    let editInput = {};
    let editTmpValue = {};
    let editValue = {};
    let editFile;
    let editUrl;
    let editUrlValidate;
    let editValidate;
    let expand = forceExpand || ($displayMode === 'card-expand');

    $: expand = forceExpand || ($displayMode === 'card-expand');

    $: editValidate = ((editFile || editUrlValidate) && (Object.keys(editValue).length));

    const testEditUrl = async () => {
        if (!/https?:\/\/\S+\.\S+/.test(editUrl)) {
            editUrlValidate = false;

            return
        }
        try {
            const response = await fetch(editUrl, { mode: 'cors' });
            if (response.status>=400) { throw(response); }
            editUrlValidate = true;
        } catch(e) {
            editUrlValidate = false;
        }
    }

    const chooseFile = () => {
        if (editUrl) {return}
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = ev => {
            editFile = ev.target.files[0];
        }
        activeElement.update(v => {
            v && v.blur();
            return undefined;
        });
        input.click();
    }

    const focus = (el) => {
        el.focus();
    }

    const ellipsis = (s) => {
        if (s.length < 20) { return s }
        return `${s.substring(0,9)}...${s.substring(s.length-9,s.length)}`;
    }

    const wikimediaThumbUrl = (img) => {
        try {
            const imgName = decodeURIComponent(img).replace(/^.*\//,'').replace(/ /g,'_');
            const md = md5(imgName);
            return `https://upload.wikimedia.org/wikipedia/commons/thumb/${md[0]}/${md.substring(0,2)}/${imgName}/80px-${imgName}`
        } catch(e) {
            return img;
        }
    }

    $: wikimediaImgSrc = result.links && wikimediaThumbUrl(result.links.wikimedia);

    $: if (wikimediaImg && wikimediaImgSrc) {
        wikimediaImgLoaded = false;
        wikimediaImg.src = wikimediaImgSrc;
        wikimediaImg.onload = () => { wikimediaImgLoaded = true }
    }

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
            { label: 'Age',  editable: false, value: result.death.age, cb: (a) => `${a} ans`},
            { label: 'Commune',  value: [result.death.location.city, result.death.location.code], cb: (c) => `${cityString(c[0],true)} (${c[1]})` },
            { label: 'Département',  value: result.death.location.departmentCode },
            { label: 'Pays',  value: [result.death.location.country, result.death.location.countryCode], cb: (c) => `${c[0]}${c[1] ? ` (${c[1]})` : ''}` },
            { label: 'Acte n°',  value: result.death.certificateId },
            { label: 'Source INSEE', editable: false, value: $dataGouvCatalog && [result.source, result.sourceLine], cb: (s) => `<a href=${$dataGouvCatalog[s[0]]} title="source INSEE ${s[0]}" target="_blank">fichier ${s[0]}</a>, ligne n°${s[1]}` }
        ]
    } else {
        conf['Décès'] && delete conf['Décès'];
    };

    const toggleEdit = () => {
        edit = !edit;
        activeElement.update(v => {
            v && v.blur();
            return undefined;
        });
    }

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
        activeElement.update(v => {
            v && v.blur();
            return undefined;
        });
        setTimeout(() => linkCopied = false, 5000)
    }

    const dateFormat = (dateString, short=false) => {
        if (short) {
            return dateString.replace(/(\d{4})(\d{2})(\d{2})/,"$1");
        } else {
            return dateString.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1");
        }
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

    $: if (result.links) {
        wikilinks = Object.keys(result.links).filter(x => ['wikipedia','wikidata'].includes(x))
    };

</script>

<style>

</style>
