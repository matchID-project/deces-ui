{#if status === 'downloading'}
    <span
        title={`${fallback ? 'préparation du téléchargement' : 'téléchargement en cours'} ${Math.round($progress/max*100)}%`}
    >
        <progress class="progress is-info is-small download-bar" value={$progress} max={max}/>
    </span>
{:else if (status === undefined)}
    <a
        class="download"
        href={src || '/'}
        on:click|preventDefault={download}
        title="téléchargez l'ensemble des résultats en tableur CSV"
    >
        téléchargement des résultats
        <FontAwesomeIcon icon={faFileDownload} class="is-lower"/>
    </a>
{:else if (status === 'success')}
    <span class="is-primary">
        téléchargement terminé
        <FontAwesomeIcon icon={faCheck} class="is-small"/>
    </span>
{:else if (status === 'fail')}
    <span class="is-danger">
        le téléchargement a échoué
        <FontAwesomeIcon icon={faExclamationTriangle} class="is-small"/>
    </span>
{/if}

<script>
    import { onMount, onDestroy } from 'svelte';
    import { tweened } from 'svelte/motion';
	import { sineInOut } from 'svelte/easing';
    import { faFileDownload, faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
    import FontAwesomeIcon from './FontAwesomeIcon.svelte';
    import { searchInput, searchResults, maxResultsPerPage, mitmUrl } from '../tools/stores.js';
    import { searchString } from '../tools/search.js'
    import buildRequest from '../tools/buildRequest.js';
    import runRequest from '../tools/runRequest.js';
    import { ReadableStream, WritableStream, TransformStream } from 'web-streams-polyfill/ponyfill';
    import streamSaver from '../tools/streamSaver.js';

    let status = undefined;
    let writer = undefined;
    let src=undefined;
    let fallback=false;
    const progress = tweened(0, {
		duration: 500,
		easing: sineInOut
	});
    let max = 0;

    $: if ($searchInput) {status = undefined};

    const handleStreamSaverMessage = (data) => {
        if (data.download) {
            src = data.download;
        }
        if (data.start) {
            status = 'downloading';
        }
        if (data.end) {
            status = data.end === 'success' ? data.end : 'fail';
        }
    }

    onMount(() => {
        streamSaver.mitm = $mitmUrl;
        streamSaver.WritableStream = WritableStream;
        streamSaver.onmessage = handleStreamSaverMessage;
    });

    const fileName = () => {
        return `deces-${Object.keys($searchInput).map(k => {
            return ($searchInput[k].value && $searchInput[k].value.replace(/\s+/,"_").toUpperCase()) || undefined;
        }).filter(x => x).join('-')}.csv`;
    };

    const cityString = (city) => {
        return city
            ? ( Array.isArray(city)
                ? (city.some(x => x.match(/arrondissement/i))
                    ? city.filter(x => x.match(/arrondissement/i))[0]
                    : city[0])
                : city)
            : ''
    };

    const dateFormat = (dateString) => {
        return dateString.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1");
    };

    const csvRow = (row) => {
        return `${row.name.last || ''};${(row.name.first && row.name.first.join(' ')) || ''};${row.sex};`+
            `${dateFormat(row.birth.date)};${cityString(row.birth.location.city || '')};"${row.birth.location.cityCode || ''}";"${row.birth.location.departmentCode || ''}";${row.birth.location.country || ''};${row.birth.location.countryCode || ''};`+
            `${dateFormat(row.death.date)};${row.death.age};${cityString(row.death.location.city || '')};"${row.death.location.cityCode || ''}";"${row.death.location.departmentCode || ''}";${row.death.location.country || ''};${row.death.location.countryCode || ''};${row.death.certificateId || ''};${row.source};`;
     }

    const toCsv = (searchResults) => {
        if (searchResults && Array.isArray(searchResults)) {
            return searchResults.map(row => csvRow(row)).join('\n') + '\n';
        }
    }

    const csvHeader = 'nom;prénoms;sexe;' +
        'date_naissance;commune_naissance;code_INSEE_naissance;département_naissance;pays_naissance;pays_ISO_naissance;'+
        'date_décès;age_décès;commune_décès;code_INSEE_décès;département_décès;pays_décès;pays_ISO_décès;num_décès;source_INSEE\n';

    const searchNext = async (state) => {
        const page = state.page;
        const size = state.size;
        let request = buildRequest($searchInput, {page: page, size: size, scrollId: state.scrollId});
        state = await runRequest(request, false);
        return {
            total: state.response.total,
            searchResults: state.response.persons,
            scrollId: state.response.scrollId,
            size: size,
            page: page + 1
        };
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const download = async (e) => {
        max = 0;
        await progress.set(0);
        let fileStream;
        const encoder = new TextEncoder();
        while (status !== 'downloading') {
            fileStream = await streamSaver.createWriteStream(fileName());
            writer = await fileStream.getWriter();
            writer.write(encoder.encode(csvHeader));
            await sleep(200);
            if (status !== 'downloading') {
                streamSaver.useBlobFallback = true;
                fallback = true;
                console.warn('download using blob fallback');
                status = 'downloading';
            }
        }
        let state ={
            total: $maxResultsPerPage + 1,
            page: 1,
            size: $maxResultsPerPage
        };
        while ((state.page - 1) * $maxResultsPerPage < state.total) {
            try {
                state = await searchNext(state);
            } catch(err) {
                throw(err);
            }
            max = state.total;
            progress.set($progress + state.searchResults.length);
            try {
                await writer.write(encoder.encode(toCsv(state.searchResults)));
            } catch(err) {
                throw(err);
            }
        }
        if (status !== 'downloading') {
            writer.abort();
            console.warn('could not download');
        } else {
            writer.close();
        }
        fallback = false;
        max = 0;
    };

    onDestroy(() => {
        if (writer) {
            writer.abort();
        }
        status = undefined;
    });

</script>

<style>

    a {
         text-decoration: none;
         color: #e2011c;
    }
    .is-primary {
        color: #e2011c;
    }
    .is-danger {
        color:  hsl(348, 100%, 61%);
    }

    .download:hover {
        color: #209cee;
        cursor: pointer;
    }

    .download-bar {
        width: 50%!important;
        display: inline!important;
    }

    .progress.is-info::-moz-progress-bar {
        background-color: #3298dc;
    }
    .progress::-moz-progress-bar {
        background-color: #4a4a4a;
    }

    .progress {
        -moz-appearance: none;
        -webkit-appearance: none;
        border: none;
        border-radius: 290486px;
        display: block;
        height: 1rem;
        overflow: hidden;
        padding: 0;
        width: 100%;
    }

    .progress.is-small {
        height: .75rem;
    }

    *, ::after, ::before {
        box-sizing: inherit;
    }
</style>
