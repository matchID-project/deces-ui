<div class="table-body content is-size-6-7">
    {#if $linkSourceHeader}
        <div class="columns">
            {#each $linkSourceHeader as col, colNumber}
                <div
                    class="column"
                    draggable={true}
                    on:dragstart={event => dragstart(event, col)}
                >
                    <table class="table is-narrow">
                        <tr>
                            <th
                            >{col}</th>
                        </tr>
                        {#each displayRows as row, rowNumber}
                            <tr class:is-striped={rowNumber%2}>
                                <td
                                    title={row[colNumber]}
                                >{row[colNumber]}</td>
                            </tr>
                        {/each}
                    </table>
                </div>
            {/each}
        </div>
    {/if}
</div>

<script>
    import { linkFile, resultsPerPage, linkStep, linkSourceHeader } from '../tools/stores.js';

    export let sep = /;/;
    export let page = 1;
    export let pageSize=5;
    let rows;
    let displayRows;
    let mapping = {};

    $: $linkFile && read($linkFile);
    $: if ($linkSourceHeader) { displayRows = rows.slice((page-1)*page,page*pageSize); }

    const parseCsv = (ev) => {
        var contents = ev.target.result;
        rows = contents.split(/\s*\r?\n\s*/).map(r => r.split(sep));
        $linkSourceHeader = rows.shift();
    };

    const read = (ev) => {
        const reader = new FileReader();
        const blob = $linkFile.slice(0, 1024);
        reader.onload = parseCsv;
        reader.readAsText(blob);
    }

	export function dragstart (ev, col) {
		ev.dataTransfer.effectAllowed = 'move';
		ev.dataTransfer.dropEffect = 'move';
   	    ev.dataTransfer.setData('text/plain', col);
	};

</script>

<style>
  .table-body {

  }

  td {
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .is-striped {
    background-color: #fafafa;
  }

</style>