{#if (result) && (result.error) }
    <div class="column is-12">
        <div class="card has-text-centered">
            <div class="card-header has-background-danger">
                <div class="level is-mobile is-vcentered">
                        <div class="level-left" style="margin-right:8px;margin-left:8px">
                            <figure class="image is-48x48 has-text-white">
                                <FontAwesomeIcon icon={faExclamationTriangle} class="is-48 is-vcentered"/>
                            </figure>
                        </div>
                        <div class="level-item has-text-left">
                            <div>
                                <h1 class="title is-size-5 has-text-white">Erreur {result.status}</h1>
                                <h1 class="is-size-6-7 has-text-white">
                                    {result.statusText} {result.msg && result.msg}
                                </h1>
                            </div>
                        </div>
                </div>
            </div>
            <div class="card-content">
                <div class="content">
                    {result.status === 429
                        ? "Le service est momentanément saturé, veuillez réessayer."
                        : "Erreur de service. Le service est en version alpha, à ce stade tous les cas d'erreur ne sont pas gérés. Si l'erreur perdure, veuillez nous contacter matchid.result@gmail.com"
                    }
                </div>
            </div>
        </div>
    </div>
{:else if (result)}
    <tr class={`is-size-7 ${(index%2) ? "is-striped" : "bof"}`} >
        <td><div class="expand-on-hover">{result.name && result.name.last || ''} </div></td>
        <td><div class="expand-on-hover">{result.name && result.name.first.join(' ') || ''} </div></td>
        <td><div class="expand-on-hover">{result.sex || ''}</div></td>
        <td><div class="expand-on-hover">{result.birth && result.birth.date && dateFormat(result.birth.date) || ''}</div></td>
        <td><div class="expand-on-hover">{result.birth && result.birth.location && result.birth.location.city && cityString(result.birth.location.city) || ''}</div></td>
        <td><div class="expand-on-hover">{result.birth && result.birth.location && (Array.isArray(result.birth.location.cityCode) ? result.birth.location.cityCode[0]:result.birth.location.cityCode) || ''}</div></td>
        <td><div class="expand-on-hover">{result.birth && result.birth.location && result.birth.location.departmentCode || ''}</div></td>
        <td><div class="expand-on-hover">{result.birth && result.birth.location && result.birth.location.country || ''}</div></td>
        <td><div class="expand-on-hover">{result.death && result.death.date && dateFormat(result.death.date) || ''}</div></td>
        <td><div class="expand-on-hover">{result.death && result.death.age || ''}</div></td>
        <td><div class="expand-on-hover">{result.death && result.death.location && result.death.location.city && cityString(result.death.location.city) || ''}</div></td>
        <td><div class="expand-on-hover">{result.death && result.death.location && (Array.isArray(result.death.location.cityCode) ? result.death.location.cityCode[0]:result.death.location.cityCode) || ''}</div></td>
        <td><div class="expand-on-hover">{result.death && result.death.location && result.death.location.departmentCode || ''}</div></td>
        <td><div class="expand-on-hover">{result.death && result.death.location && result.death.location.country || ''}</div></td>
        <td><div class="expand-on-hover">{result.death && result.death.location && result.death.certificateId || ''}</div></td>
        <td><div class="expand-on-hover">
            {#if $dataGouvCatalog && result.source}
                <a href={$dataGouvCatalog[result.source]} target="_blank">
                {result.source}
                </a>
            {/if}
        </div></td>
    </tr>
{/if}


<script>
    import { dataGouvCatalog } from '../tools/stores.js';
    import FontAwesomeIcon from './FontAwesomeIcon.svelte';

    import {
        faExclamationTriangle,
        faMinus,
        faPlus
    } from '@fortawesome/free-solid-svg-icons';

    export let result;
    export let index;

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

    .expand-on-hover {
        display: inline-block;
        position: relative;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .expand-on-hover:hover {
        z-index: 1;
        width: auto;
        background-color: #FFFFCC;
    }


    .is-striped {
        background-color: #fafafa;
    }
    .block-flex {
        flex: none!important;
        width: 100%;
    }

    .has-text-centered {
        text-align: center!important;
    }

    .has-text-left {
        text-align: left!important;
    }

    .has-text-white {
        color: #fff!important;
    }

    .has-text-primary {
        color: #00d1b2!important;
    }

    .has-background-white {
        background-color: #fff!important;
    }

    .has-background-primary {
        background-color: #00d1b2!important;
    }

    .has-background-danger {
        background-color: hsl(348, 100%, 61%)!important;
    }

    figure, h1, html, li, ul {
        margin: 0;
        padding: 0;
    }

    .is-vcentered {
        align-items: center;
    }

    .image.is-64x64 {
        height: 64px;
        width: 64px;
    }

    .image.is-48x48 {
        height: 48px;
        width: 48px;
    }

    .image img {
        display: block;
        height: auto;
        width: 100%;
    }

    img {
        height: auto;
        max-width: 100%;
    }

    h1 {
        font-size: 100%;
        font-weight: 400;
    }

    .subtitle,.title {
        word-break: break-word;
    }

    .title {
        color: #363636;
        font-size: 2rem;
        font-weight: 600;
        line-height: 1.125;
    }

    .subtitle:not(.is-spaced)+.title,.title:not(.is-spaced)+.subtitle {
        margin-top: -1.25rem;
    }

    .title.is-size-4 {
        font-size: 1.5rem;
    }

    .title.is-size-5 {
        font-size: 1.25rem;
    }

    .subtitle {
        color: #4a4a4a;
        font-size: 1.25rem;
        font-weight: 400;
        line-height: 1.25;
    }

    .is-size-6 {
        font-size: 1rem;
    }

    .is-size-6-7 {
        font-size: 0.875rem;
    }

    .is-size-7 {
        font-size: 0.75rem;
    }

    @media screen and (max-width: 768px) {
        .is-hidden-mobile {
            display: none!important;
        }
    }


</style>