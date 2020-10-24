<span>
    {#if status === 'downloading'}
        <span
            title={`${fallback ? 'préparation du téléchargement' : 'téléchargement en cours'} ${Math.round($progress/max*100)}%`}
        >
            <progress class="rf-margin-top-1N progress is-info is-small download-bar" value={$progress} max={max}/>
        </span>
    {:else if (status === undefined)}
        <span
            on:click|preventDefault={download}
            title={disabled ? "téléchargement limité à 500000 lignes"
                : "téléchargez l'ensemble des résultats en tableur CSV"}
        >
            <Icon icon="{disabled ? "ri:file-forbid-line" : "ri:file-download-line"}" class="rf-fi--lg {disabled ? "rf-color--g400 rf-href" : "rf-color--bf"}"/>
        </span>
    {:else if (status === 'success')}
        <span title="téléchargement terminé">
            <Icon icon="ri:checkbox-circle-fill" class="rf-fi--lg {disabled ? "rf-color--g400 rf-href" : "rf-color--bf"}"/>
        </span>
    {:else if (status === 'fail')}
        <span
            title="problème de téléchargement"
        >
            <Icon icon="ri:file-warning-line" class="rf-fi--lg rf-color--rm"/>
        </span>
    {/if}
</span>

<script>
    import { tweened } from 'svelte/motion';
    import { sineInOut } from 'svelte/easing';
    import { searchInput } from '../tools/stores.js';
    import Icon from './Icon.svelte';
    import axios from 'axios';

    export let disabled = false;
    let status = undefined;
    let lazyCountDate = 0;
    let fallback=false;
    const progress = tweened(0, {
      duration: 500,
      easing: sineInOut
    });
    let max = 0;

    $: if ($searchInput) {status = undefined};

    const fileName = () => {
        return `deces-${Object.keys($searchInput).map(k => {
            return ($searchInput[k].value && $searchInput[k].value.replace(/\s+/,"_").toUpperCase()) || undefined;
        }).filter(x => x).join('-')}.csv`;
    };

    const download = async (e) => {
      if (disabled) { return }
      max = 0;
      await progress.set(0);
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
            status = 'downloading';
            max = progressEvent.target.getResponseHeader('total-results');
            if (max > 5000) {
                const date = Date.now();
                if (date > (lazyCountDate + 2000)) {
                    lazyCountDate = date;
                    progress.set(countLines(progressEvent.currentTarget.response))
                }
            } else {
                progress.set(countLines(progressEvent.currentTarget.response))
            }
          }
        });
        status = 'success';
        const blob = new Blob([res.data], { type: 'text/csv' });
        // Create an object URL for the blob object
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName();
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        link.remove();
      } catch(err) {
        status = 'fail'
        throw(err);
      }
      max = 0;
    };

    const countLines = (data) => {
        let idx = -1;
        let n = -1;
        do {
        idx = data.indexOf(10, idx+1);
        n++;
        } while (idx !== -1);
        return n;
    }

</script>

