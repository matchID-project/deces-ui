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
    import { searchInput, mitmUrl } from '../tools/stores.js';
    import { WritableStream } from 'web-streams-polyfill/ponyfill';
    import streamSaver from '../tools/streamSaver.js';
    import axios from 'axios';

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
            await sleep(200);
            if (status !== 'downloading') {
                streamSaver.useBlobFallback = true;
                fallback = true;
                console.warn('download using blob fallback');
                status = 'downloading';
            }
        }
        try {
          const headers = {
            'Accept': 'text/csv'
          }
          const formData = {}
          Object.keys($searchInput).forEach(k => {
            if ($searchInput[k].value) {
              if ($searchInput[k].backendQuery) {
                formData[$searchInput[k].backendQuery] = $searchInput[k].value.replace(/\s+/,"_")
              } else {
                formData[k] = $searchInput[k].value.replace(/\s+/,"_").toUpperCase()
              }
            }
          })
          const res = await axios.post('__BACKEND_PROXY_PATH__/search', formData, {
            headers,
            onDownloadProgress: (progressEvent) => {
              max = progressEvent.target.getResponseHeader('total-results');
              progress.set(progressEvent.currentTarget.response.split('\n').length - 2)
            }
          })
          await writer.write(encoder.encode(res.data));
        } catch(err) {
            throw(err);
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
         color: #003189;
    }
    .is-primary {
        color: #003189;
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
        background-color: #003189;
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
