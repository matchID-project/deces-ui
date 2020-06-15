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

    const guessTypeRegexp = [
        [/^[1-2]\d{3}\/[0-1]\d\/[0-3]\d$/, 'guess:date:YYYY/MM/DD'],
        [/^[1-2]\d{3}-[0-1]\d-[0-3]\d$/, 'guess:date:YYYY-MM-DD'],
        [/^[0-3]\d-[0-1]\d-[1-2]\d{3}$/, 'guess:date:DD-MM-YYYY'],
        [/^[0-3]\d\/[0-1]\d\/[1-2]\d{3}$/, 'guess:date:DD/MM/YYYY'],
        [/^\d[0-9a-b]\d{3}/, 'guess:cityCode'],
        [/^[1-2]$/, 'guess:sex:12'],
        [/^(f|m)$/, 'guess:sex:fm'],
        [/^(\d[0-9a-b]|97[1-5])$/, 'guess:depCode'],
        [/^(petit|du(rand|bois|pon[dt]|val|mont|four)|mor(e(au|l)|in)|le(feb?vre|roy|grand|maire)|roux|fournier|girard|bonnet|lambert|fontaine|rousseau|muller|faure|mercier|blanc|guerin|boyer|garnier|chevalier|perrin|garcia|gauthier|robin|roussel|masson|meunier|meyer|giraud|blanchard|joly|martinez|brunet|barbier|payet|diallo|lacroix|vidal|schmi(dt|tt)|fabre|roche|renard|colin|caron|aubert)$/, 'guess:lastName'],
        [/^(marie|jean{2}e|francoise|monique|catherine|nathalie|isabel{2}e|jacqueline|sylvie|an{2}e|jean|pier{2}e|michel|andre|philip{2}e|louis|rene|alain|jacques)((\s*\w+)+)?$/, 'guess:firstName'],
        [/^\s*(((saint|st)(-|\s)\w+.*)|((paris|marseille|lyon)(\s.*?))|toulouse|nice|nantes|montpellier|strasbourg)\s*$/, 'guess:city'],
        [/^\s*(france|algerie)\s*$/, 'guess:country'],
        [/^(?!guess:).*/, ''],
        [/^guess:/, '']
    ];

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

    const norm = (s) => {
        return s ? s.normalize('NFKD').replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase() : '';
    }

    const guessFieldType = (column) => {
        return maxFreqTerm(column.map(f => {
            let g = norm(f);
            guessTypeRegexp.map(r => g = g.replace(r[0],r[1]));
            return g;
        }).filter(x => x));
    };

    const maxFreqTerm = (a) => {
        let maxCount = 0;
        let maxTerm = undefined;
        let dic = {};
        a.map(v => {
            dic[v] = dic[v] ? dic[v] + 1 : 1;
            if (dic[v] > maxCount) {
                maxTerm = v;
                maxCount = dic[v]
            }
        });
        return maxTerm;
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
        $linkSourceHeader = rows.shift();
    };

    const read = (ev) => {
        const reader = new FileReader();
        const blob = $linkFile.slice(0, 32768);
        reader.onload = parseCsv;
        reader.readAsText(blob);
    }

	export function dragstart (ev, col) {
		ev.dataTransfer.effectAllowed = 'move';
        ev.dataTransfer.dropEffect = 'move';
        const type = guessFieldType(rows.map(row => row[$linkSourceHeader.indexOf(col)]));
        ev.dataTransfer.setData('text/plain', JSON.stringify({
                col: col,
                type: type && type.replace(/:.*/,''),
                format: type && /:/.test(type) && type.replace(/.*:/, '')
        }));
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