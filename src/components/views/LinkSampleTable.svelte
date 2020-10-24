<div class="rf-container-fluid">
    {#if $linkSourceHeader}
        <div class="rf-grid-row">
            {#each header as col, colNumber}
                <div
                    class="rf-col"
                    draggable={true}
                    on:dragstart={event => dragstart(event, col)}
                >
                    <div class="rf-tile">
                        <table
                            class="rf-table rf-table--narrow rf-table--striped"
                            class:rf-inactive={!(mapping && mapping.direct && mapping.direct[col])}
                        >
                            <tbody>
                                <tr>
                                    <th
                                    >{col}</th>
                                </tr>
                                {#each displayRows as row, rowNumber}
                                    <tr class="rf-text--sm">
                                        <td
                                            title={row[colNumber]}
                                        >{row[colNumber]}</td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<script>
    import { linkFile, resultsPerPage, linkStep, linkSourceHeader, linkSourceHeaderTypes, linkCsvType } from '../tools/stores.js';

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

    const guessBoost = {
        city: 3,
        firstName: 3,
        lastName: 2
    }

    const guessTypeRegexp = [
        [/^[1-2]\d{3}\/[0-1]\d\/[0-3]\d$/, 'date=YYYY/MM/DD'],
        [/^[1-2]\d{3}-[0-1]\d-[0-3]\d$/, 'date=YYYY-MM-DD'],
        [/^[1-2]\d{3}[0-1]\d[0-3]\d$/, 'date=YYYY-MM-DD'],
        [/^[0-3]\d-[0-1]\d-[1-2]\d{3}$/, 'date=DD-MM-YYYY'],
        [/^[0-3]\d\/[0-1]\d\/[1-2]\d{3}$/, 'date=DD/MM/YYYY'],
        [/^[0-3]\d[0-1]\d[1-2]\d{3}$/, 'date=DDMMYYYY'],
        [/^\d[0-9a-b]\d{3}/, 'cityCode'],
        [/^[1-2]$/, 'sex=12'],
        [/^[0-1]$/, 'sex=01'],
        [/^(f|m)$/, 'sex=fm'],
        [/^(f|h)$/, 'sex=fh'],
        [/^((0?|[1-9])[0-9a-b]|97[1-5]?|99)$/, 'depCode'],
        [/^(martin|bernard|thomas|petit|robert|richard|durand|dubois|moreau|simon|laurent|garcia|michel|lefebvre|leroy|david|martinez|bertrand|roux|morel|fournier|girard|lambert|dupont|bonnet|rousseau|fontaine|vincent|andre|muller|lefevre|guerin|mercier|faure|garnier|chevalier|blanc|francois|boyer|legrand|gauthier|lopez|perrin|clement|robin|da|morin|sanchez|henry|gautier|nicolas|roussel|masson|mathieu|duval|perez|marchand|denis|marie|noel|dumont|lemaire|lucas|dufour|meyer|blanchard|meunier|fernandez|joly|brun|brunet|riviere|barbier|gerard|giraud|gaillard|leroux|arnaud|vidal|roy|renard|schmitt|colin|roche|caron|rodriguez|roger|picard|pereira|aubert|nguyen|lemoine|fabre|renaud|pierre|olivier|ferreira|dumas|lacroix|leclerc|bourgeois|philippe|dos|benoit|rey|jean|guillaume|rolland|lecomte|leclercq|hubert|louis|payet|guillot|rodrigues|berger|fernandes|carpentier|dupuy|dupuis|moulin|deschamps|gonzalez|goncalves|huet|adam|vasseur|charles|fleury|menard|boucher|poirier|baron|jacquet|aubry|royer|paris|guyot|klein|bertin|renault|maillard|charpentier|carre|herve|gomez|schneider|marty|bailly|collet|le|bouvier|leger|julien|daniel|millet|martins|breton|germain|langlois|cousin|perrot|lebrun|prevost|besson|le|leveque|barre|le|pelletier|remy|weber|leblanc|hamon|marchal|monnier|hernandez|michaud|perrier|boulanger|etienne|tessier|mallet|jacob|guichard|chauvin|gillet|ruiz|collin|poulain|lemaitre|chevallier|antoine|bouchet|diallo|marechal|gay|pons|humbert|delaunay|benard|perret|hoarau|pasquier|da|grondin|gilbert|alexandre|lejeune|cordier|reynaud|briand|lamy|albert|besnard|pichon|georges|barthelemy|lopes|cohen|ollivier|launay|gros|carlier|buisson|charrier|guillou|lesage|voisin|vallee|legros|hebert|delattre|coulon|laporte|rossi|guillet|jacques|didier|marques|gomes|marin|camus|martel|paul|levy|lebreton|blanchet|barbe|bigot|pineau|leduc|ribeiro|navarro|mahe|lelievre|gaudin|pascal|sauvage|maillot|gregoire|coste|joubert|verdier|maury|bodin|bousquet|tanguy|masse|guillon|raynaud|hardy|colas|morvan|allard|alves|raymond|berthelot|delmas|devaux|laine|thibault|delorme|regnier|lebon|lenoir|blondel|courtois|seguin|joseph|valentin|ferrand|chauvet|clerc|bruneau|bonneau|brunel|costa|imbert|allain)$/, 'lastName'],
        [/^(jean|marie|michel|pierre|philippe|alain|andre|claude|bernard|jacques|anne|daniel|christian|dominique|patrick|christophe|nathalie|nicolas|isabelle|gerard|catherine|sylvie|francoise|monique|eric|laurent|frederic|rene|francois|stephane|david|pascal|sebastien|martine|thierry|robert|julien|olivier|roger|christine|jacqueline|nicole|valerie|guy|georges|sandrine|marcel|didier|stephanie|sophie|veronique|marc|paul|mohamed|celine|bruno|alexandre|vincent|chantal|louis|henri|serge|jerome|yves|maria|christiane|thomas|patricia|guillaume|annie|joseph|brigitte|maurice|michele|antoine|helene|franck|gilles|laurence|aurelie|raymond|virginie|corinne|jose|julie|christelle|anthony|romain|emilie|gilbert|cedric|francis|danielle|elodie|caroline|denis|florence|maxime|cecile|joel)((\s*\w+)+)?$/, 'firstName'],
        [/^\s*(paris|marseille|lyon|toulouse|nice|nantes|montpellier|strasbourg|bordeaux|lille|rennes|reims|saint.etienne|havre|toulon|grenoble|dijon|angers|nimes|villeurbanne|saint.denis|aix.en.provence|mans|clermont.ferrand|brest|tours|amiens|limoges|annecy|perpignan|boulogne.billancourt|metz|besani�on|orliaans|saint.denis|argenteuil|rouen|mulhouse|montreuil|saint.paul|caen|nancy|tourcoing|roubaix|nanterre|vitry.sur.seine|avignon|criateil|dunkerque|poitiers|aubervilliers|asnii�res.sur.seine|colombes|versailles|aulnay.sous.bois|saint.pierre|courbevoie|fort.de.france|cherbourg.en.cotentin|rueil.malmaison|champigny.sur.marne|tampon|pau|biaziers|la.rochelle|calais|saint.maur.des.fossias|cannes|antibes|mamoudzou|miarignac|drancy|colmar|saint.nazaire|ajaccio|issy.les.moulineaux|evry|noisy.le.grand|bourges|vianissieux|la.seyne.sur.mer|cergy|levallois.perret|quimper|valence|villeneuve.d.ascq|antony|pessac|ivry.sur.seine|troyes|cayenne|neuilly.sur.seine|montauban|clichy|chambiary|niort|sarcelles|lorient|beauvais|blanc.mesnil)\s*$/, 'city'],
        [/^\s*(france|algerie|maroc|tunisie|italie|portugal|espagne)\s*$/, 'country'],
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

    $: rows && linkSourceHeaderTypes.update(v => {
        const types = {};
        $linkSourceHeader.forEach(col => {
            types[col] = guessFieldType(rows.map(row => row[$linkSourceHeader.indexOf(col)]))
        });
        return types
    });

    const norm = (s) => {
        return s ? s.normalize('NFKD').replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase() : '';
    }

    const guessFieldType = (column) => {
        const guess = maxFreqTerm(column.map(f => {
            let g = norm(f);
            const dic = {};
            guessTypeRegexp.map(r => {
                if (g.replace(r[0],r[1]) === r[1]) {
                    dic[r[1]] = true;
                }
            });
            return dic;
        }));
        return guess && {
            type: guess[0].replace(/=.*/,''),
            format: /=/.test(guess[0]) && guess[0].replace(/.*=/, ''),
            freq: guess[1]
        };
    };

    const maxFreqTerm = (a) => {
        let maxCount = 0;
        let maxTerm = undefined;
        let dic = {};
        a.map(d => {
            Object.keys(d).forEach(v => {
                const boost = guessBoost[dic[v]] ? guessBoost[dic[v]] : 1
                dic[v] = dic[v] ? dic[v] + boost : boost;
                if (dic[v] > maxCount) {
                    maxTerm = v;
                    maxCount = dic[v]
                }
            });
        });
        if (maxCount > (a.length / 20)) {
            return [maxTerm, Math.max(1, Math.round(100 * maxCount / Math.max(1, a.length)) / 100)];
        } else {
            return undefined;
        }
    }

    const guessSeparator = (csv) => {
        let max = 0;
        const csvLines = csv.split(/(\r\n|\n\r|\n|\r)/).map(r => r.trim()).filter(r => r);
        potentialSeparators.map(c => {
            const n = csvLines.map(r => r.split(c).length).reduce((a,b) => Math.min(a,b))
            if (n > max) { max = n; sep = c}
        });
    };

    const guessQuote = (csv, sep) => {
        let rows
        potentialQuotes.map(q => {
            const re = new RegExp(`^(${q}(([^${q}]|${q}${q})*?)${q}|([^${protect(sep)}]*))(\\${protect(sep)}(.*))?$`);
            const re2 = new RegExp(`${q}${q}`,'g');
            const quoteCounts = [0, 0];
            rows = csv.split(/(\r\n|\n\r|\n|\r)/).map(r => r.trim()).filter(r => r).map(r => {
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
                return row.map(col => col.replace(/^\s*/,'') || '<vide>');
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
        const blob = $linkFile.slice(0, 100000);
        reader.onload = parseCsv;
        reader.readAsText(blob);
    };

	export function dragstart (ev, col) {
		ev.dataTransfer.effectAllowed = 'move';
        ev.dataTransfer.dropEffect = 'move';
        ev.dataTransfer.setData('text/plain', JSON.stringify({
                col: col,
                type: $linkSourceHeaderTypes[col] && $linkSourceHeaderTypes[col].type,
                format: $linkSourceHeaderTypes[col] && $linkSourceHeaderTypes[col].format,
                freq: $linkSourceHeaderTypes[col] && $linkSourceHeaderTypes[col].freq
        }));
	};

</script>

<style>

  td {
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

</style>