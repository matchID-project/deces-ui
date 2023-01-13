<div style="width:100%">
    {#if ($waitSearch || !$wasSearched)}
        <div class="rf-wait-container" in:fade out:fade>
            <div class="rf-wait-content">
                <strong>Recherche en cours</strong>
                <br/>
                <Icon icon="ri:loader-line" class="rf-fi--xxl rf-margin-top-1N" spin center/>
            </div>
        </div>
    {/if}
</div>
<div class="rf-container-fluid">
    <div class="rf-grid-row">
        <div class="rf-col-12 rf-hide--mobile rf-padding-top-4N"></div>
        <div class="rf-col-xs-0 rf-col-sm-0 rf-col-md-1 rf-col-lg-2 rf-col-xl-2"></div>
        <div class="rf-col-xs-12 rf-col-sm-12 rf-col-md-10 rf-col-lg-8 rf-col-xl-8">
            {#if result}
                <ResultCard result={result} index={1}/>
            {:else if $wasSearched}
                <h4 class="rf-h4 rf-text--center">Oups... pas de résultats pour cet identifiant</h4>
                <Info filter={true}/>
            {/if}
        </div>
        <div class="rf-col-xs-0 rf-col-sm-0 rf-col-md-1 rf-col-lg-2 rf-col-xl-2"></div>
        <div class="rf-col-12">
            <PunchMessage/>
        </div>
    </div>
</div>

<script>
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { displayMode, waitSearch, wasSearched } from '../tools/stores.js';
    import { getById } from '../tools/search.js';
    import ResultCard from './ResultCard.svelte';
    import PunchMessage from './PunchMessage.svelte';
    import Info from './Info.svelte';
    import Icon from './Icon.svelte'

    let result;

    onMount(async () => {
        $wasSearched = false;
        $waitSearch = true;
        $displayMode = 'card-expand';
        const paths = location.pathname.split('/');
        if (paths.length > 1) {
            result = await getById({id: paths[2]});
        }
        $waitSearch = false;
        $wasSearched = toString(result);
    })

    const toString = (r) => {
      if (r !== undefined) {
        return `${r.name.last.toUpperCase()}
        ${r.name.first ? r.name.first.join(' ') : ''}${r.death && r.death.age ? ` ${r.death.age} ans`:''},
        ${cityString(result.birth.location.city, false)} ${dateFormat(r.birth.date)} -
        ${result.death ? cityString(result.death.location.city, false) : ''} ${r.death ? dateFormat(r.death.date) : ''}`
      } else {
        return 'not found'
      }
    }

    const dateFormat = (dateString) => {
        return dateString.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1");
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
