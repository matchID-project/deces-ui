<div class="rf-container">
    <div class="rf-grid-row rf-grid-row--gutters">
        {#if (!unavailable) && rawData}
            {#if kpi}
                <div class="rf-col-12 rf-text--center">
                    <h4 class="rf-margin-bottom-0"> Statistiques de consultation </h4>
                </div>
                {#each stats as key}
                    <div class="rf-col-xl-3 rf-col-lg-3 rf-col-md-3 rf-col-sm-3 rf-col-xs-6">
                        <StatsTile
                            number={kpi[key]}
                            precision={1}
                            label={labels[key] || key}
                        />
                    </div>
                {/each}
                <div class="rf-col-4">
                    <label class="rf-label" for="select">Cycle</label>
                    <select class="rf-select" id="select" name="select" bind:value={sourceScope}>
                        <option value="" selected disabled hidden>- Choisir -</option>
                        {#each Object.keys(sourceScopes) as scope}
                            <option value={scope}>{sourceScopes[scope].label}</option>
                        {/each}
                    </select>
                </div>
                <div class="rf-col-4">
                    <label class="rf-label" for="select">Période</label>
                    <select class="rf-select" id="select" name="select" bind:value={source} disabled={/today|full/.test(sourceScope)}>
                        <option value="" selected disabled hidden>- Choisir -</option>
                        {#if !/today|full/.test(sourceScope)}
                            {#each filteredCatalog as range}
                                <option value={range}>
                                    {range.replace(sourceScopes[sourceScope].select,sourceScopes[sourceScope].replace)}
                                </option>
                            {/each}
                        {/if}
                    </select>
                </div>
                <div class="rf-col-4">
                    <label class="rf-label" for="select">Filtre URL</label>
                    <select class="rf-select" id="select" name="select" bind:value={urlScope}>
                        <option value="" selected disabled hidden>Aucun</option>
                        {#if (urlScopes && (urlScopes.length >= 0))}
                            <option value="">Aucun</option>
                            {#each urlScopes as url}
                                <option value={url}>
                                    {url}
                                </option>
                            {/each}
                        {/if}
                    </select>
                </div>
            {/if}
            {#each
                views.filter(x => !day || !(x === 'hour_of_day_of_week'))
                    .filter(x => !urlScope || !(['referring_sites'].includes(x)) )
                    .filter(x => rawData[x] && rawData[x].data && rawData[x].data.length)
                as view
            }
                <div class="rf-col-xl-{expanded[view] ? '12' : '6'} rf-col-lg-{expanded[view] ? '12' : '6'} rf-col-md-12 rf-col-sm-12 rf-col-xs-12">
                    <div class="rf-tile">
                        <div
                            class="rf-tile__icon rf-href rf-color--bf rf-hide--mobile"
                            on:click|preventDefault={() => expanded[view]=!expanded[view]}
                        >
                            <Icon icon="{expanded[view] ? 'ic:outline-minus' : 'ri:add-line'}"/>
                        </div>
                        <div class="rf-tile__body">
                            <h4 class="rf-tile__title rf-padding-bottom-1N">
                                {labels[view]||view}
                            </h4>
                            <svelte:component
                                style="max-height: {expanded[view] ? '500' : '250'}px;"
                                this={params[view] && params[view].type ? params[view].type : Line}
                                data={rawData && data(view)}
                                options={rawData && options(view)}
                            />
                        </div>
                    </div>
                </div>
            {/each}
        {/if}
        {#if unavailable}
            <div class="rf-col-12 rf-text--center">
                <Icon icon="ri:alarm-line" class="rf-fi--xxl" center/>
                <br>
                <strong> Les statistiques seront bientôt disponibles ... </strong>
            </div>
        {/if}
    </div>
</div>

<script>
  import { onMount } from 'svelte';
  import Bar from './Bar.svelte';
  import Line from './Line.svelte';
  import Icon from './Icon.svelte';
  import WorldChoropleth from './WorldChoropleth.svelte';
  import FranceChoropleth from './FranceChoropleth.svelte';
  import StatsTile from './StatsTile.svelte';
  import Heatmap from './Heatmap.svelte';
  import { smartNumber } from '../tools/stats.js';
  import { route } from '../tools/stores.js';
  import { iso2to3 } from '../tools/countries.js';


  let style = getComputedStyle(document.body);
  let rawDataSource, rawData, kpi;
  let unavailable = false;
  let urlScope, urlScopes
  let sourceScopes = {
      'full': {
          label: 'Complet',
          select: 'full',
      },
      'today': {
          label: 'Aujourd\'hui',
          select: 'day'
      },
      'day': {
          label: 'Jour',
          select: /^(\d{4})(\d{2})(\d{2})$/,
          replace: (a, b, c, d) => `${d}/${c}/${b}`
      },
      'month': {
          label: 'Mois',
          select: /^(\d{4})(\d{2})$/,
          replace: (a, b, c) => `${datesLabels.months[parseInt(c)]} ${b}`
      },
      'week': {
          label: 'Semaine',
          select: /^(\d{4})(S\d{2})$/,
          replace: (a, b, c) => `Semaine ${c} ${b}`
      },
      'today-detailed': {
          label: 'Aujourd\'hui (détail)',
          select: 'day-detailed'
      },
      'day-detailed': {
          label: 'Jour (détail)',
          select: /^(\d{4})(\d{2})(\d{2})-detailed$/,
          replace: (a, b, c, d) => `${d}/${c}/${b}`
      },
      'month-detailed': {
          label: 'Mois (détail)',
          select: /^(\d{4})(\d{2})-detailed$/,
          replace: (a, b, c) => `${datesLabels.months[parseInt(c)]} ${b}`
      },
      'week-detailed': {
          label: 'Semaine (détail)',
          select: /^(\d{4})(S\d{2})-detailed$/,
          replace: (a, b, c) => `semaine ${c} ${b}`
      }
  };
  let sourceScope;
  let source;
  let catalog;
  let filteredCatalog = [];

  $: if (sourceScope && !/today|full/.test(sourceScope)) {
    filteredCatalog = catalog.filter(x => sourceScopes[sourceScope].select.test(x)).reverse()
  };

  $: if (/today|full/.test(sourceScope)) {
        source = sourceScopes[sourceScope].select;
     } else {
        if (filteredCatalog && !(filteredCatalog.includes(source))) {
            source = filteredCatalog[0];
        }
     }

  $: borderWidth = /full|detailed/.test(sourceScope) ? 1 : 2;

  const displayRange =  (range) => {
      return range.replace(/(....)(...)(..)-/,"$3/$2/$1").replace("detailed", " (détaillé)");
  }

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    $: if (rawData && rawData.general) {
        const tmp = rawData.general;
        tmp['api_search_requests']=countSum(
            rawData.requests.data.filter(k => /^api: search .*/.test(k.data)),
            'hits');
        tmp['api_link_rows']=smartNumber(
            countSum(
                rawData.requests.data.filter(k => /^api: search\/csv GET/.test(k.data)),
                'bytes')
            / 400,1);
        tmp['api_update']=countSum(
            rawData.requests.data.filter(k => /^api: id.* POST/.test(k.data)),
            'hits');
        kpi = tmp;
    }

  const countSum = (values, key) => {
      if (values.length > 0) {
          if (values.length === 1) {
              return values[0][key].count
          } else {
          const v = values.reduce((a,b) => {
                return typeof(a) === 'number' ?
                    a+b[key].count :
                        (typeof(b) === undefined ? a[key].count:a[key].count+b[key].count)
                }
            );
            return v;
          }
      } else {
          return 0;
      }
  }

  $: rawData = urlScope ? rawDataSource[urlScope] : rawDataSource;

  $: urlScopes = rawDataSource && Object.keys(rawDataSource)
    .filter(k => /api: (search(\/(csv|json))?|id|updates\/proof|updated|auth|agg|docs|version|healthcheck|queue(\jobs)?|register) (GET|POST)/.test(k)
        && (Object.keys(rawDataSource[k]).length > 0));

  const getData = async (s) => {
    try {
        const response = await fetch(`/stats/${s}.json`);
        rawDataSource = await response.json();
    } catch(e) {
        unavailable = true
    }
  };

  const getDataStrategy = async (s) => {
    if (/^day/.test(s)) {
        while (s === source) {
            await getData(s);
            await sleep(150000);
        }
    } else {
        getData(s);
    }
  }

  $: if (source) {
      getDataStrategy(source);
      const p = new URLSearchParams;
      p.set('source', source);
      p.set('scope', sourceScope);
      window.history.replaceState({}, '', `${location.href.replace(/\?.*/,'')}?${p}`);
    };

  let day;
  $: day = /day/.test(sourceScope);

  let labels = {
      visitors: 'Visiteurs',
      duration: 'Temps de réponse',
      hits: 'Nombre de requêtes',
      'date_time': 'Mise à jour',
      'static_requests': 'Contenu statique',
      requests: 'Requêtes',
      country: 'Par pays',
      depcode: 'Par département',
      not_found: 'Non trouvé',
      hosts: 'Clients',
      os: 'Système d\'exploitation',
      browsers: 'Navigateur',
      visit_time: 'Heure de visite',
      hour_of_day_of_week: 'Heure de visite',
      referrers: 'Sources',
      referring_sites: 'Sites sources',
      status_code: 'Statut',
      bytes: 'Bande passante',
      'start_date': 'Début',
      'end_date': 'Fin',
      'total_requests': 'Requêtes au total',
      'api_search_requests': 'Appels API décès',
      'api_link_rows': 'Appariements',
      'api_update': 'Corrections usager',
      'valid_requests': 'Reqnsuêtes valides',
      'failed_requests': 'Requêtes en erreur',
      'unique_visitors': 'Visiteurs',
      'unique_files': 'Requêtes uniques',
      'excluded_hits': 'Requêtes exclues',
      'unique_referrers': 'Sources',
      'unique_static_files': 'Fichiers statiques',
      'unique_not_found': 'Non trouvés (uniques)',
      'bandwidth': 'Bande passante'
  };

  const hexToRgb = (hex) => hexToRgba(hex,255);

  const hexToRgba = (hex, alpha) => 'rgba(' + hex.match(/^\s*\#?([\da-f]{2})([\da-f]{2})([\da-f]{2})\s*$/)
        .slice(1).map(e => parseInt(e, 16)).join(',') + `,${alpha})`;


  const datasets = {
      'visitors': {
          color: hexToRgba(style.getPropertyValue('--bf500'), 0.7)
      },
      'hits': {
          color: hexToRgba(style.getPropertyValue('--bf500'), 0.55)
      },
      'bytes': {
          color: hexToRgba(style.getPropertyValue('--bf500'), 0.4)
      },
      'duration': {
          color: hexToRgba(style.getPropertyValue('--bf500'), 0.25),
          key: 'mean'
      }
  };

    const siteUrlRegexp = [
        [/^page: \/(favicon|fonts) \(GET\)$/, 'static: images'],
        [/^page: \/index \(GET\)$/, 'page: search'],
        [/^page: \/(search|link|about|id|stats) \(GET\)$/, 'page: $1'],
        [/^page: \/css \(GET\)$/, 'static: /css'],
        [/^page: \/.* \(GET\)$/, 'page: WRONG'],
        // [/^\/(.*)\.(js|json|js.map)$/, 'static: javascript'],
        // [/^\/(.*)\.(png|svg|woff2?)$/, 'static: images'],
        // [/^GET \/$/, 'page: /search (GET)'],
        // [/^page:\s*\/?\s*\(GET\)$/, 'page: /search (GET)'],
        // [/^\/(search.*|geo\?.*|\?(current|q|advanced|ln|fn)=.*)$/,'page: /search'],
        // [/^\/(link.*)$/,'page: /link'],
        // [/^\/(about.*)$/,'page: /about'],
        // [/^\/deces\/api\/v1\/search\/csv(\/\S+)?$/, 'api: link csv'],
        // [/^\/(.*\/api\/v0|deces\/api\/v1)\/search$/, 'api: search'],
        // [/^\/deces\/api\/v1\/([A-Za-z]*)\/?$/, 'api: $1'],
        // [/^page: \/(https|dev|backup|wordpress|wp|e|personnes|OLD) \(GET\)$/, 'wrong calls'],
        // [/^\/.*$/, 'wrong calls']
    ];

    const referrerUrlRegexp = [
        [/^.*matchid.io(.*)?/, 'matchid.io'],
        [/^www\./, ''],
        [/^(.*\.)?google(usercontent)?\.(com|fr)(\/.*)?$/, 'google.com'],
        [/^(.*\.)?facebook\.com(\/.*)?$/, 'facebook.com'],
    ];

    const urlAgg = (url, rules) => {
        let simpleUrl = url;
        rules.forEach(r => {
            simpleUrl = simpleUrl.replace(r[0], r[1]);
        });
        return simpleUrl;
    };

    const aggregate = (data, keyCB) => {
        let agg = {};
        let count = {};
        data.forEach(d => {
            const keyAgg = keyCB(d);
            Object.keys(datasets).forEach(id => {
                if (id !== 'duration') {
                    agg[keyAgg] = agg[keyAgg] ? agg[keyAgg] : {};
                    agg[keyAgg][id] = agg[keyAgg][id] ? agg[keyAgg][id] + d[id].count : d[id].count;
                } else {
                    if (d[id]) {
                        agg[keyAgg] = agg[keyAgg] ? agg[keyAgg] : {};
                        agg[keyAgg][id] = agg[keyAgg][id] ? agg[keyAgg][id] + d[id].delay : d[id].delay;
                        count[keyAgg] = count[keyAgg] ? count[keyAgg] : {};
                        count[keyAgg][id] = count[keyAgg][id] ? count[keyAgg][id] + 1 : 1;
                    }
                }
            })
        });
        const dataAgg = Object.keys(agg).sort().map(key => {
            const d = {
                data: key
            };
            Object.keys(datasets).forEach(id => {
                if (id !== 'duration') {
                    d[id] = { count: agg[key][id] };
                } else {
                    d[id] = { mean: agg[key][id]/(count[key] ? (count[key][id]||1) : 1) };
                }
            });
            return d;
        });
        return dataAgg;
    }

  const fontFamily = '-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"'
  const ticks = {
    autoSkip: true,
    fontFamily : fontFamily,
  };
  const ticksY = {
    autoSkip: true,
    fontFamily : fontFamily,
    callback: smartNumber,
    maxTicksLimit: 5,
    beginAtZero: true
  };

  const options = (view) => {
    const yAxes = {};
    Object.keys(datasets).forEach((id,i) => yAxes[id] = {
        type: params[view] && params[view].yLog ? 'logarithmic' : 'linear',
        position: i%2 ? 'left' : 'right',
        ticks: ticksY
    });
    const o = {
        maintainAspectRatio: false,
        hover: {
            intersect: false
        },
        tooltips: {
            mode: 'x'
        },
        animation: {
            duration: 0
        },
        elements: {
            line: {
                tension: 0,
            }
        },
        legend: {
            labels: {
                fontFamily: fontFamily,
                boxWidth: 20,
                fontSize: 8,
                padding: 6
            },
            position: 'bottom'
        },
        scales: {
            ...yAxes,
            x: params[view] && params[view].xAxis || {}
        }
    };
    return o;
  };

  const stats = ['unique_visitors', 'api_search_requests', 'api_link_rows', 'api_update']
  const views = ['visitors', 'referring_sites', 'depcode', 'hour_of_day_of_week','requests', 'browsers', 'country'];

  const expanded = {}
  views.forEach(view => expanded[view] = false);

  let datesLabels = {
      months: {
          1: 'Janvier',
          2: 'Févier',
          3: 'Mars',
          4: 'Avril',
          5: 'Mai',
          6: 'Juin',
          7: 'Juillet',
          8: 'Août',
          9: 'Septembre',
          10: 'Octobre',
          11: 'Novembre',
          12: 'Décembre'
      }
  }

  let dayOrder = {
      'lun': 1,
      'mar': 2,
      'mer': 3,
      'jeu': 4,
      'ven': 5,
      'sam': 6,
      'dim': 7
  };

  let params;
  $: params = {
    'browsers': {
        type: Bar,
        dataCB: (data) => data.filter(d => /Chrome|Safari|Edge|Firefox|MSIE|Others|Crawlers$/.test(d.data))
    },
    'hosts': { type: Bar },
    'visit_time': {
        dataCB: (data) => data.map(d => {
            d.data = d.data.replace(/(..)00$/,'$1') + 'h';
            return d;
        })
    },
    'hour_of_day_of_week': {
        type: Heatmap,
        dataCB: (data) => data.map(d => {
            d.data = d.data.replace(/(..)00$/,'$1') + 'h';
            return d;
        }).sort((a,b) => dayOrder[a.data.replace(/-.*/,'')]*100 + parseInt(a.data.replace(/.*-(.*)h/,'$1'))
            - dayOrder[b.data.replace(/-.*/,'')]*100 + parseInt(b.data.replace(/.*-(.*)h/,'$1'))
        )
    },
    'country': {
        type: WorldChoropleth,
        yLog: true,
        dataCB: (data) => {
            let expandedData = [];
            data.forEach(d => {
                if (d.items) {
                    d.items.forEach(dd => {
                        let tmp = dd.data
                        tmp = dd.data.replace(/\s.*$/,'');
                        dd.data = iso2to3[tmp] || dd.data;
                        expandedData.push(dd);
                    });
                } else {
                    let tmp = d.data
                    tmp = d.data.replace(/\s.*$/,'');
                    d.data = iso2to3[tmp] || d.data;
                    expandedData.push(d);
                }
            });
            return expandedData;
        }
    },
    'depcode': {
        type: FranceChoropleth,
        yLog: true,
        dataCB: (data) => {
            let expandedData = [];
            data.forEach(d => {
                if (d.items) {
                    d.items.forEach(dd => {
                        d.data = d.data.replace(/\s.*$/,'');
                        if (/[0-9][0-9ab]/i.test(d.data)) {
                            expandedData.push(dd);
                        }
                    });
                } else {
                    d.data = d.data.replace(/\s.*$/,'');
                    if (/[0-9][0-9ab]/i.test(d.data)) {
                        expandedData.push(d);
                    }
                }
            });
            return expandedData;
        }
    },
    'referring_sites': {
        type: Bar,
        yLog: true,
        dataCB: (data) =>
            aggregate(data, (d) => urlAgg(d.data, referrerUrlRegexp))
                .filter(x => (x.data.length > 1) && (x.visitors.count > 1) && (x.data !== 'matchid.io'))
                .sort((a,b) => b.visitors.count - a.visitors.count)
                .slice(0,15)
    },
    'referrers': {
        type: Bar,
        yLog: true,
        dataCB: (data) => aggregate(data, (d) => urlAgg(d.data, referrerUrlRegexp)).filter(x => x.data.length > 1)
    },
    'hosts': { type: Bar },
    'visitors': {
        xAxis: {
            type: 'time',
        },
        dataCB: (data) => data.map(d => { d.data = dateParse(d.data); return d})
    },
    'requests': {
        type: Bar,
        yLog: true,
        dataCB: (data) =>
            aggregate(data, (d) => urlAgg(d.data, siteUrlRegexp))
                .filter(x => !/OPTIONS|HEAD/.test(x.data))
                .filter(x => /^(page: \/(search|link|id|about|stats)|(static|api):)/.test(x.data))
                .sort((a,b) => b.visitors.count - a.visitors.count)
                .slice(0,20)
    }
  };

  const dateParse = (obj) => {
      if ((typeof obj === 'string')) {
          let d;
          if (/^\d{8}-\d{4}$/.test(obj)) {
            d = new Date(obj.substr(0,4), parseInt(obj.substr(4,2))-1 , obj.substr(6,2), obj.substr(9,2), obj.substr(11,2));
          } else if (/^\d{8}$/.test(obj)) {
            d = new Date(obj.substr(0,4), parseInt(obj.substr(4,2))-1 , obj.substr(6,2));
          } else if (/^\d{4}S\d{2}-\d{4}$/.test(obj)) {
            d = new Date(obj.substr(0,4), parseInt(obj.substr(8,2))-1 , obj.substr(10,2));
          } else if (/^\d{4}S\d{2}-\d{4}-\d{4}$/.test(obj)) {
            d = new Date(obj.substr(0,4), parseInt(obj.substr(8,2))-1 , obj.substr(10,2), obj.substr(13,2), obj.substr(15,2));
          }
          if (d) {
            return new Date(d.getTime() + (60*60*1000));
          }
      }
      return obj
  }

    const data = (view) => {
        const data = (params[view] && (params[view].dataCB)) ? params[view].dataCB(rawData[view].data) : rawData[view].data;
        const d = {
            labels: data.map(d => d.data),
            datasets: Object.keys(datasets)
                .map(id => {
                    const datasetData = data.filter(d => d[id]).map(d => {
                        return {
                            x: d.data,
                            y: d[id].count || d[id].mean
                        };
                    })
                    return {
                        backgroundColor: datasets[id].color,
                        fill: 'origin',
                        borderColor: 'rgba(255,255,255,0)',
                        borderWidth: borderWidth,
                        barPercentage: 1,
                        categoryPercentage: 1,
                        pointRadius: 0,
                        label:  labels[id] || id,
                        yAxisID: id,
                        data: datasetData
                    };
            })
        };
        return d;
    };

    onMount(async () => {
        try{
            const response = await fetch('/stats/catalog.json');
            catalog = await response.json();
        } catch(e) {
            unavailable = true;
        }
      if ($route && catalog) {
        if ($route.query && $route.query.scope) {
            if ((!/today|full/.test(sourceScope)) && $route.query.source) {
                source = $route.query.source;
            }
            sourceScope = $route.query.scope
        } else {
            sourceScope = 'today';
        }
      }
  })

</script>