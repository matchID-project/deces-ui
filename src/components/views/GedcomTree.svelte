{#if computed}
    <div
        class="rf-container-fluid"
        on:click={actualizeLines}
        on:mouseleave={() => {showFamily = undefined; showId = undefined}}
    >
        <div class="rf-grid-row rf-text--center">
            <div class="rf-col-12 rf-margin-3N">
                <strong>Visualisation des individus de l'arbre généalogique: </strong>
            </div>
            {#each Object.keys(gedcom)
                    .filter(x => /\@i.*@/i.test(x))
                    .map(i => Math.round(gedcom[i].rank))
                    .sort()
                    .filter(function(el,i,a){return i===a.indexOf(el)})
                as gen}
                <div class="rf-container-fluid">
                    <div class="rf-grid-row rf-text--center rf-margin-bottom-2N">
                        {#each Object.keys(gedcom)
                            .filter(i => /\@i.*@/i.test(i) && (Math.round(gedcom[i].rank) === gen))
                            as id}
                            <GedcomPersonCard
                                id={id}
                                focus={(showId  === id)}
                                active={(!showId)
                                    || sameFamily(gedcom[id].fams,showFamily)
                                    || sameFamily(gedcom[id].famc,showFamily)
                                    || (gedcom[id].chil && gedcom[id].chil.some(c => c.id === showId))
                                }
                                record={gedcom[id]}
                                mouseenter={() => {
                                    actualizeLines();
                                    showFamily = gedcom[id].fams;
                                    showId = id;
                                }}
                            />
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>
    {#each Object.keys(gedcom).filter(x => /\@f.*@/i.test(x)) as f}
        <div class="line" class:rf-hide={!sameFamily(f,showFamily)} id={f}></div>
    {/each}
{/if}

<script>
    import { onMount } from 'svelte';
    import GedcomPersonCard from './GedcomPersonCard.svelte';
    export let gedcom;
    let computed = false;
    let fmax = 10000;
    let showFamily, showId;

    const getGenerationRank = (i) => {
        if (!i) {return -1;}
        if (gedcom[i].rank !== undefined) {
            return gedcom[i].rank
        }
        if(gedcom[i] && gedcom[i].pare) {
            let fRank = 0;
            if (gedcom[i].fams) {
                if (typeof(gedcom[i].fams)==='string') {
                    fRank = parseInt((gedcom[i].fams.replace(/\@f(.*)\@/i,'$1'))) / fmax;
                } else {
                    fRank = Math.max(...gedcom[i].fams.map(f => parseInt((f.replace(/\@f(.*)\@/i,'$1'))))) / fmax;
                }
            }
            gedcom[i].rank = 1 + fRank + Math.max(...gedcom[i].pare.map(p => getGenerationRank(p.id)));
        } else {
            gedcom[i].rank = 0;
        }
        gedcom[i].rank = Math.max(
            gedcom[i].rank || 0,
            (gedcom[i].cons && Math.max(...gedcom[i].cons.map(c => getGenerationRank(c.id)))) || 0
        );
        return gedcom[i].rank;
    }

    const sameFamily = (f1, f2) => {
        if (!f1) {return false}
        if (f1 && typeof(f1) === 'string') {
            f1 = [f1];
        }
        return f1.some(f => f2 && f2.includes(f));
    }

    const actualizeLines = () => {
        Object.keys(gedcom).filter(x => /\@f.*\@/i.test(x)).forEach(f => {
            const fId = f;
            f = gedcom[fId];
            if (f.wife && f.husb) {
                gedcom[fId].rank = gedcom[f.wife].rank;
                setTimeout(() => {
                    adjustLine(
                        f.wife,
                        f.husb,
                        fId
                    );
                }, 500);
            }
        })
    };

    onMount(() => {
        if (gedcom) {
            Object.keys(gedcom).filter(x => /\@f.*\@/i.test(x)).forEach(f => {
                fmax = Math.max(parseInt(f.replace(/\@f(.*)\@/i,'$1')),fmax);
                const fId = f;
                f = gedcom[fId];
                if (f.chil) {
                    const parents = f.husb && f.wife ? [f.husb, f.wife] : (f.wife ? [f.wife] : [f.husb]);
                    if (typeof(f.chil) === 'string') {
                        f.chil = [f.chil]
                    } else {
                        f.chil = f.chil.map(c => c)
                    }
                    f.chil.forEach(c => {
                        gedcom[c].pare = parents.filter(p => gedcom[p]).map(p => {
                          if (typeof gedcom[p].name === 'object' &&
                            !Array.isArray(gedcom[p].name) &&
                            gedcom[p].name !== null) {

                            return {
                                id: p,
                                surn: gedcom[p].name.surn,
                                givn: gedcom[p].name.givn
                            }
                          } else {
                            return {
                                id: p,
                                surn: gedcom[p].surn || gedcom[p].name.replace(/^.*\/\s*(.*)\s*\/.*$/,'$1'),
                                givn: gedcom[p].givn || gedcom[p].name.replace(/^(.*)\/\s*(.*)\s*\/.*$/,'$1')
                            }
                          }
                        })
                    })
                    parents.forEach(p => {
                        gedcom[p].chil = f.chil.filter(c => gedcom[c]).map(c => {
                          if (typeof gedcom[p].name === 'object' &&
                            !Array.isArray(gedcom[p].name) &&
                            gedcom[p].name !== null) {
                            return {
                                id: c,
                                surn: gedcom[c].name.surn,
                                givn: gedcom[c].name.givn
                            }
                          } else {
                            return {
                                id: c,
                                surn: gedcom[c].surn || gedcom[c].name.replace(/^.*\/\s*(.*)\s*\/.*$/,'$1'),
                                givn: gedcom[c].givn || gedcom[c].name.replace(/^(.*)\/\s*(.*)\s*\/.*$/,'$1')
                            }
                          }
                        })
                    })
                }
                if (f.wife && f.husb) {
                    if (!gedcom[f.wife].cons) { gedcom[f.wife].cons = [] }
                    gedcom[f.wife].cons.push({
                        id: f.husb,
                        surn: gedcom[f.husb].surn || gedcom[f.husb].name.surn || gedcom[f.husb].name.replace(/^.*\/\s*(.*)\s*\/.*$/,'$1'),
                        givn: gedcom[f.husb].givn || gedcom[f.husb].name.givn || gedcom[f.husb].name.replace(/^(.*)\/\s*(.*)\s*\/.*$/,'$1')
                    });
                    if (!gedcom[f.husb].cons) { gedcom[f.husb].cons = [] }
                    gedcom[f.husb].cons.push({
                        id: f.wife,
                        surn: gedcom[f.wife].surn || gedcom[f.wife].name.surn || gedcom[f.wife].name.replace(/^.*\/\s*(.*)\s*\/.*$/,'$1'),
                        givn: gedcom[f.wife].givn || gedcom[f.wife].name.givn || gedcom[f.wife].name.replace(/^(.*)\/\s*(.*)\s*\/.*$/,'$1')
                    });
                }
            });
            Object.keys(gedcom).filter(x => /\@i.*\@/i.test(x)).forEach(i => {
                getGenerationRank(i);
            });
            computed = true;
            actualizeLines();
        }
    });

    const adjustLine = (f, t, l) => {
        const from = document.getElementById(f);
        const to = document.getElementById(t);
        const line = document.getElementById(l);
        if (from && to && line) {
            const fT = from.offsetTop  + from.offsetHeight/2;
            const tT = to.offsetTop    + to.offsetHeight/2;
            const fL = from.offsetLeft + from.offsetWidth/2;
            const tL = to.offsetLeft   + to.offsetWidth/2;

            const CA   = Math.abs(tT - fT);
            const CO   = Math.abs(tL - fL);
            const H    = Math.sqrt(CA*CA + CO*CO);
            let ANG  = 180 / Math.PI * Math.acos( CA/H );

            let top, left;

            if(tT > fT){
                top  = (tT-fT)/2 + fT;
            }else{
                top  = (fT-tT)/2 + tT;
            }
            if(tL > fL){
                left = (tL-fL)/2 + fL;
            }else{
                left = (fL-tL)/2 + tL;
            }

            if(( fT < tT && fL < tL) || ( tT < fT && tL < fL) || (fT > tT && fL > tL) || (tT > fT && tL > fL)){
                ANG *= -1;
            }
            top-= H/2;

            line.style["-webkit-transform"] = 'rotate('+ ANG +'deg)';
            line.style["-moz-transform"] = 'rotate('+ ANG +'deg)';
            line.style["-ms-transform"] = 'rotate('+ ANG +'deg)';
            line.style["-o-transform"] = 'rotate('+ ANG +'deg)';
            line.style["-transform"] = 'rotate('+ ANG +'deg)';
            line.style.top    = top+'px';
            line.style.left   = left+'px';
            line.style.height = H + 'px';
        }
    }

</script>

<style>

.line{
  position:absolute;
  width:2px;
  color: var(--bf500);
  background-color: var(--bf500);
}

</style>
