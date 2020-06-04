<div class="table-body content is-size-6-7">
    {#if $linkSourceHeader}
        <div class="columns">
            {#each header as col, colNumber}
                <div
                    class="column"
                    draggable={true}
                    on:dragstart={event => dragstart(event, col)}
                >
                    <table class="table is-narrow">
                        <tr>
                            <th
                                class:is-active={mapping && mapping.direct && mapping.direct[col]}
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
    import { linkFile, resultsPerPage, linkStep, linkSourceHeader, linkCsvType } from '../tools/stores.js';

    export let potentialSeparators = [';',',','|','\t'];
    export let potentialQuotes = ["'",'"'];
    export let sep = ';';
    export let quote;
    export let page = 1;
    export let pageSize=5;
    export let mapping;
    export let fields;
    let rows;
    let header;
    let displayRows;

    $: $linkFile && read($linkFile);

    $: if ($linkSourceHeader && mapping) {
        header = [
            ...fields.map(f => mapping.reverse && mapping.reverse[f.field])
                .filter(x => x),
            ...$linkSourceHeader.map(h => !(mapping.direct && mapping.direct[h]) && h).filter(x => x)
        ];

        displayRows = rows.slice((page-1)*page,page*pageSize)
            .map(row => header.map(h => row[$linkSourceHeader.indexOf(h)]))
    }

    const guessSeparator = (csv) => {
        let max = 0;
        potentialSeparators.map(c => {
            const n = csv.split(/\s*\r?\n\s*/).map(r => r.split(c).length).reduce((a,b) => Math.min(a,b))
            if (n > max) { max = n; sep = c}
        });
    };

    const guessQuote = (csv, sep) => {
        let rows
        potentialQuotes.map(q => {
            const re = new RegExp(`^(${q}(([^${q}]|${q}${q})*?)${q}|([^${protect(sep)}]*))(\\${protect(sep)}(.*))?$`);
            const re2 = new RegExp(`${q}${q}`,'g');
            const quoteCounts = [0, 0];
            rows = csv.split(/\s*\r?\n\s*/).map(r => {
                const row = [];
                let i = 0;
                while(r !== undefined) {
                    i += 1;
                    const m = r.match(re);
                    if (m) {
                        row.push(m[2] ? m[2].replace(re2, `${q}`) : m[4]);
                        if (m[2]) { quoteCounts[0] += 1}
                        if (m[4]) { quoteCounts[1] += 1}
                        r = m[6];
                    } else {
                        if (r === '') {
                            row.push('');
                        } else {
                            r = undefined;
                        }
                    }
                };
                return row.map(col => col || '<vide>');
            });
            if (quoteCounts[0] > quoteCounts[1]) {
                quote = q;
            }
        });
        return rows;
    }

    const protect = (sep) => {
        return sep === '|' ? '\|' : sep;
    }

    const parseCsv = (ev) => {
        const contents = ev.target.result;
        guessSeparator(contents);
        rows = guessQuote(contents, sep);
        $linkCsvType = {
            sep: sep,
            quote: quote
        };
        console.log($linkCsvType);
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
      overflow-x: scroll;
      overflow-y: hidden;
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