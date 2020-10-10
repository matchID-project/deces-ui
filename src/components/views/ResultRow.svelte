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
    <tr class="{(index%2) ? "rf-background--beige" : ""}">
        <td><div class="expand-on-hover">{result.name && result.name.last || ''} </div></td>
        <td><div class="expand-on-hover">{(result.name && result.name.first && result.name.first.join(' ')) || '(aucun)'} </div></td>
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
        background-color: var(--yd500);
    }

</style>