
<div style="height: 450px;overflow-y:scroll;overflow-x:None;">
    <div class="rf-container-fluid">
        {#if header}
            <datalist id="LinkSampleTable">
                {#each header as col, colNumber}
                    <option>{col}</option>
                {/each}
            </datalist>
            <div class="rf-grid-row">
                {#each header as col, colNumber}
                    <div
                        class="rf-col rf-padding-4px"
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
</div>

<script>
    import { onMount } from 'svelte';
    import { linkFile, resultsPerPage, linkStep, linkSourceHeader, linkSourceHeaderTypes, linkOptions } from '../tools/stores.js';
    import yaml from 'yamljs';

    export let potentialSeparators = [';',',','|','\t'];
    export let potentialQuotes = ["'",'"'];
    export let sep;
    export let quote;
    export let page = 1;
    export let pageSize=5;
    export let mapping;
    export let fields;
    export let skipLines;
    export let encoding;
    export let type = 'csv';
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
        [/^[1-2]\d{3}[0-1]\d[0-3]\d$/, 'date=YYYYMMDD'],
        [/^[0-3]\d-[0-1]\d-[1-2]\d{3}$/, 'date=DD-MM-YYYY'],
        [/^[0-3]\d\/[0-1]\d\/[1-2]\d{3}$/, 'date=DD/MM/YYYY'],
        [/^[0-3]\d[0-1]\d[1-2]\d{3}$/, 'date=DDMMYYYY'],
        [/^\d[0-9a-b]\d{3}/, 'locationCode'],
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

    $: if ($linkOptions && $linkOptions.csv &&
        (
            ($linkOptions.csv.sep !== sep) ||
            ($linkOptions.csv.skipLines !== skipLines) ||
            ($linkOptions.csv.quote !== quote) ||
            ($linkOptions.csv.encoding !== encoding)
        )) {
            read($linkOptions.csv);
        }

    $: if ($linkSourceHeader && mapping && rows) {
        header = [
            ...fields.map(f => mapping.reverse && $linkSourceHeader.includes(mapping.reverse[f.field]) && mapping.reverse[f.field])
                .filter(x => x),
            ...$linkSourceHeader.map(h => !(mapping.direct && mapping.direct[h]) && h).filter(x => x)
        ];

        displayRows = rows.slice((page-1)*page,page*pageSize)
            .map(row => header.map(h => row[$linkSourceHeader.indexOf(h)]))
    }

    $: $linkSourceHeader && linkSourceHeaderTypes.update(v => {
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
        const pLines = csvLines.length ? (1/csvLines.length) : 1;
        potentialSeparators.map(c => {
            const dist={};
            csvLines.forEach(r => {
                const m = r.split(c).length;
                if (dist[m]) { dist[m]+=pLines } else { dist[m] = pLines }
            });
            let n = 0;
            let p = 0;
            Object.keys(dist).forEach(m => {if (dist[m]>p) {n = parseInt(m); p = dist[m]}});
            if ((p > 0.5) && (n > max)) { max = n; sep = c; }
        });
        skipLines= 0;
        csvLines.slice(0,10).forEach(r => {
            const m = r.split(sep).length;
            if (m !== max) {
                skipLines++;
            }
        });
    };

    const guessQuote = (csv, sep, skipLines) => {
        let rows;
        if (quote) {potentialQuotes = [quote]}
        potentialQuotes.map(q => {
            const re = new RegExp(`^(${q}(([^${q}]|${q}${q})*?)${q}|([^${protect(sep)}]*))(\\${protect(sep)}(.*))?$`);
            const re2 = new RegExp(`${q}${q}`,'g');
            const quoteCounts = [0, 0];
            rows = csv.split(/(\r\n|\n\r|\n|\r)/).slice(skipLines).map(r => r.trim()).filter(r => r).map(r => {
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

    const guessFileType = (ev) => {
        const contents = ev.target.result;
        if (type === 'gedcom') {
            parseGedcom(contents);
        } else {
           parseCsv(contents);
        }
    }

    const gedcomToYaml = [
        [/(\r\n|\n\r|\r)/mg, '\n'],
        [/^0 /mg,''],
        [/^1 /mg,'  '],
        [/^2 /mg,'    '],
        [/^3 /mg,'      '],
        [/^4 /mg,'        '],
        [/^5 /mg,'          '],
        [/^6 /mg,'            '],
        [/^( *)(\S+) (\S+.*)\n  \1(\S+)/mg,'$1$2\n  $1XXXX $3\n  $1$4'],
        [/^( *)([a-zA-Z_0-9\-\@]+):?/mg, (a,b,c) => {return b+c.toLowerCase()+':'}],
        // simple array
        [/^( *)(\w{4}): *([^\n]+)\n(\1(\2): *([^\n]+)\n)+/mg,(a) => {
            return a.replace(/:.*$/s,':\n') + a.replace(/( +)\w{4}: +(.*)/mg,'  $1- $2');
        }],
        //complex arrays
        [/^(\s*)(\w{4}):\s*([^\n]*\n(\s+\1[a-zA-Z0-9_\-][^\n]*\n)*)\1(\2):\s*([^\n]*)\n/mg,'$1$2:\n  $1- $3  $1- $6\n'],
        [/^( *)\- *\-/mg,'$1-'],
        [/^( *)\- *([^\n]+\n(  \1[^\- ][^\n]*\n)*)\1(\w[^\n]*)\n/mg,'$1- $2$1  $4\n']
    ];

    const gedcomDatesPattern = /^(((de|entre|between|from)\s)?(((\d{1,2})\s+)?(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\S?\s+)?(\d{4})\s+)?((à|et|to|avant|bef|before|après|aft|after|autour de|vers|around)\s)?(((\d{1,2})\s+)?(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\S?\s+)?(\d{4})/;

    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

    const gedcomDate = (stringDate) => {
        stringDate=`${stringDate}`;
        const parsed = stringDate.match(gedcomDatesPattern);
        if (parsed) {
            const startMonth = `${months.indexOf(parsed[7])+1}`;
            const endMonth = `${months.indexOf(parsed[14])+1}`;
            if (parsed[3]) {
                // range
                stringDate = `${parsed[8]}${startMonth.padStart(2, '0')}${parsed[6]}-${parsed[15]}${endMonth.padStart(2, '0')}${parsed[13]}`;
            } else {
                let limit = '';
                if (['before','bef','avant'].includes(parsed[10])) {
                    limit = '<'
                } else if (['après','aft','after'].includes(parsed[10])) {
                    limit = '<'
                }
                stringDate = `${parsed[15]}${endMonth.padStart(2, '0')}${parsed[13]}`;
            }
        }
        return stringDate;
    }

    const parseGedcom = (contents) => {
        if (!(/^0 HEAD/.test(contents))) {
            return false;
        }
        let tree = contents;
        gedcomToYaml.forEach(r => {
            let changed = tree.replace(r[0],r[1]);
            while (changed!==tree) {
                tree = changed;
                changed = tree.replace(r[0],r[1]);
            }
        });
        tree = yaml.parse(tree);
        rows = Object.keys(tree).map(k => {
            if (/^\@i.*\@$/.test(k)) {
                const id = k;
                let firstName = tree[k].surn;
                let lastName = tree[k].givn;
                const name = tree[k].name;
                const normName = name.replace(/^\s*(Mr|Monsieur|Madame|Mme|M\.|Mrs)\s+/gi,'');
                const sex = tree[k].sex;
                if (normName) {
                    if (!firstName) {
                        firstName = normName.replace(/^(.*)\s+\/.*$/,'$1');
                    }
                    if (!lastName) {
                        lastName = name.replace(/^.*\/\s*(.*)\s*\/.*$/,'$1');
                    }
                }
                let birthDate, birthPlace, birthCity, birthCountry, birthDep;
                if (tree[k].birt) {
                    birthDate = tree[k].birt.date ? gedcomDate(tree[k].birt.date) : '';
                    birthPlace = tree[k].birt.plac;
                    if (birthPlace && birthPlace.includes(',')) {
                        birthCity = birthPlace.replace(/^(.*)\s*,.*/,'$1');
                        birthCountry = birthPlace.replace(/^.*,\s*(.*)$/,'$1');
                        birthDep = birthPlace.replace(/.*,\s*(.*)\s*,\.*/,'$1');
                    }
                }
                let deathDate, deathPlace, deathCity, deathCountry, deathDep;
                if (tree[k].deat) {
                    deathDate = tree[k].deat.date ? gedcomDate(tree[k].deat.date) : '';
                    deathPlace = tree[k].deat.plac;
                    if (deathPlace && deathPlace.includes(',')) {
                        deathCity = deathPlace.replace(/^(.*)\s*,.*/,'$1');
                        deathCountry = deathPlace.replace(/^.*,\s*(.*)$/,'$1');
                        deathDep = deathPlace.replace(/.*,\s*(.*)\s*,\.*/,'$1');
                    }
                }
                return [
                    id,lastName,firstName,name, sex,
                    birthDate, birthCity, birthCountry, birthDep, birthPlace,
                    deathDate, deathCity, deathCountry, deathDep, deathPlace,
                ].map(x => x || '');
            }
        }).filter(x => x);
        const myHeader = [
            'gedcom_id','nom','prénom(s)','nom_prénom(s)','sexe',
            'date de naissance', 'ville de naissance','pays de naissance','département de naissance','lieu de naissance',
            'date de décès', 'ville de décès','pays de décès','département de décès','lieu de décès'
        ];
        if ((!$linkOptions.csv) && ($linkFile)) {
            $linkOptions.csv = {
                sep: '\t',
                skipLines: 0,
                dateFormat: 'YYYYMMDD',
                encoding: 'utf-8',
                type: type,
                gedcom: tree,
                csv: myHeader.join('\t')+'\n'+rows.map(r => r.join('\t')).join('\n')
            };
            console.log('Guessed type:',$linkOptions.csv);
        }
        $linkSourceHeader = myHeader;
        return true;
    }

    const parseCsv = (contents) => {
        if (!sep) { guessSeparator(contents) }
        rows = guessQuote(contents, sep, skipLines);
        if ((!$linkOptions.csv) && ($linkFile)) {
            $linkOptions.csv = {
                sep: sep,
                quote: quote,
                skipLines: skipLines,
                encoding: encoding,
                type: type
            };
            console.log('Guessed CSV type:',$linkOptions.csv);
        }
        mapping = {};
        $linkSourceHeader = rows.shift();
    };

    const read = async (csvOptions) => {
        let blob = $linkFile.slice(0, 100000);
        if (csvOptions) {
            sep = csvOptions.sep;
            encoding = csvOptions.encoding;
            quote = csvOptions.quote;
            skipLines = csvOptions.skipLines;
        } else {
            const badChars = 'a';
            const potentialEncodings = ['utf8','latin1','windows-1252','mac'];
            let min = 9999;
            await Promise.all(potentialEncodings.map(async enc => {
                const reader = new FileReader();
                reader.readAsText(blob, enc);
                const result = await new Promise((resolve, reject) => {
                    reader.onload = (ev) => {
                        const contents = ev.target.result;
                        if (/^0 HEAD/.test(ev.target.result)) {
                            type = 'gedcom';
                        }
                        resolve(contents.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().replace(/\s*/,'').replace(/[\x00-\x7F]*/g,'').length)
                    }
                });
                if (result < min) {
                    encoding = enc;
                    min = result;
                }
            }));
        }
        console.log('type',type)
        const reader = new FileReader();
        reader.readAsText(blob, encoding);
        reader.onload = guessFileType;
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

    onMount(() => {
        $linkFile && read();
    })

</script>

<style>

  td {
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

</style>