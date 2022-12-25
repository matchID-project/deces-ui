{#if (result) && !(result.error) }
    <tr
        class="{(index%2) ? "rf-background--beige" : ""}"
        class:rf-color--rm={result.correction}
        title={result.correction ? "la fiche a fait l'objet d'un signalement" : ""}
    >
        <td><div class="expand-on-hover">{result.name && result.name.last || ''} </div></td>
        <td><div class="expand-on-hover">{(result.name && result.name.first && result.name.first.join(' ')) || '(aucun)'} </div></td>
        <td><div class="expand-on-hover">{result.sex || ''}</div></td>
        <td><div class="expand-on-hover">{result.birth && result.birth.date && dateFormat(result.birth.date) || ''}</div></td>
        <td><div class="expand-on-hover">{result.birth && result.birth.location && result.birth.location.city && cityString(result.birth.location.city) || ''}</div></td>
        <td><div class="expand-on-hover">{result.birth && result.birth.location && (Array.isArray(result.birth.location.code) ? result.birth.location.code[0]:result.birth.location.code) || ''}</div></td>
        <td><div class="expand-on-hover">{result.birth && result.birth.location && result.birth.location.departmentCode || ''}</div></td>
        <td><div class="expand-on-hover">{result.birth && result.birth.location && result.birth.location.country || ''}</div></td>
        <td><div class="expand-on-hover">{result.death && result.death.date && dateFormat(result.death.date) || ''}</div></td>
        <td><div class="expand-on-hover">{result.death && result.death.age || ''}</div></td>
        <td><div class="expand-on-hover">{result.death && result.death.location && result.death.location.city && cityString(result.death.location.city) || ''}</div></td>
        <td><div class="expand-on-hover">{result.death && result.death.location && (Array.isArray(result.death.location.code) ? result.death.location.code[0]:result.death.location.code) || ''}</div></td>
        <td><div class="expand-on-hover">{result.death && result.death.location && result.death.location.departmentCode || ''}</div></td>
        <td><div class="expand-on-hover">{result.death && result.death.location && result.death.location.country || ''}</div></td>
        <td><div class="expand-on-hover">{result.death && result.death.location && result.death.certificateId || ''}</div></td>
        <td><div class="expand-on-hover">
            {#if $dataGouvCatalog && result.source}
                <a href={$dataGouvCatalog[result.source]} target="_blank" rel="noopener noreferrer">
                {result.source}
                </a>
            {/if}
        </div></td>
    </tr>
{/if}


<script>
    import { dataGouvCatalog } from '../tools/stores.js';

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
        margin-bottom: -6px;
    }
    .expand-on-hover:hover {
        z-index: 1;
        width: auto;
        background-color: var(--yd500);
    }

</style>