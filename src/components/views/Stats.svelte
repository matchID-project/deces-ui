<div class="rf-container">
    <div class="rf-grid-row rf-grid-row--gutters">
        {#if (!unavailable) && rawData}
            {#if rawData.general}
                <div class="rf-col-6">
                    <label class="rf-label" for="select">cycle</label>
                    <select class="rf-select" id="select" name="select" bind:value={sourceScope}>
                        <option value="" selected disabled hidden>- choisir -</option>
                        {#each Object.keys(sourceScopes) as scope}
                            <option value={scope}>{sourceScopes[scope].label}</option>
                        {/each}
                    </select>
                </div>
                <div class="rf-col-6">
                    <label class="rf-label" for="select">période</label>
                    <select class="rf-select" id="select" name="select" bind:value={source} disabled={/today|full/.test(sourceScope)}>
                        <option value="" selected disabled hidden>- choisir -</option>
                        {#if !/today|full/.test(sourceScope)}
                            {#each filteredCatalog as range}
                                <option value={range}>
                                    {range.replace(sourceScopes[sourceScope].select,sourceScopes[sourceScope].replace)}
                                </option>
                            {/each}
                        {/if}
                    </select>
                </div>
                {#each stats.filter(x => rawData.general[x]) as key}
                    <div class="rf-col-xl-3 rf-col-lg-3 rf-col-md-3 rf-col-sm-3 rf-col-xs-6">
                        <div class="rf-tile">
                            <div class="rf-tile__body rf-text--center">
                                <strong class="rf-text--lg">
                                    {smartNumber(rawData.general[key], 1)}
                                </strong>
                                <br>
                                <span class="rf-text--xs">
                                    {labels[key] || key}
                                </span>
                            </div>
                        </div>
                    </div>
                {/each}
            {/if}
            {#each views.filter(x => !day || !(x === 'hour_of_day_of_week')) as view}
                <div class="rf-col-xl-6 rf-col-lg-6 rf-col-md-12 rf-col-sm-12 rf-col-xs-12">
                    <div class="rf-tile">
                        <div class="rf-tile__body">
                            <h4 class="rf-tile__title rf-padding-bottom-1N">
                                {labels[view]||view}
                            </h4>
                            <svelte:component
                                style="max-height: 250px;"
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
                <strong> les statistiques seront bientôt disponibles ... </strong>
            </div>
        {/if}
    </div>
</div>

<script>
  import { onMount } from 'svelte';
  import Line from 'svelte-chartjs/src/Line.svelte';
  import Bar from 'svelte-chartjs/src/Bar.svelte';
  import Icon from './Icon.svelte';
  import WorldChoropleth from './WorldChoropleth.svelte';
  import Heatmap from './Heatmap.svelte';
  import { route, updateURL } from '../tools/stores.js';
  import { iso2to3 } from '../tools/countries.js';


  let style = getComputedStyle(document.body);
  let rawData;
  let unavailable = false;
  let sourceScopes = {
      'full': {
          label: 'complet',
          select: 'full',
      },
      'today': {
          label: 'aujourd\'hui',
          select: 'day'
      },
      'day': {
          label: 'jour',
          select: /^(\d{4})(\d{2})(\d{2})$/,
          replace: (a, b, c, d) => `${d}/${c}/${b}`
      },
      'month': {
          label: 'mois',
          select: /^(\d{4})(\d{2})$/,
          replace: (a, b, c) => `${datesLabels.months[parseInt(c)]} ${b}`
      },
      'week': {
          label: 'semaine',
          select: /^(\d{4})(S\d{2})$/,
          replace: (a, b, c) => `semaine ${c} ${b}`
      },
      'today-detailed': {
          label: 'aujourd\'hui (détail)',
          select: 'day-detailed'
      },
      'day-detailed': {
          label: 'jour (détail)',
          select: /^(\d{4})(\d{2})(\d{2})-detailed$/,
          replace: (a, b, c, d) => `${d}/${c}/${b}`
      },
      'month-detailed': {
          label: 'mois (détail)',
          select: /^(\d{4})(\d{2})-detailed$/,
          replace: (a, b, c) => `${datesLabels.months[parseInt(c)]} ${b}`
      },
      'week-detailed': {
          label: 'semaine (détail)',
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
      return range.replace(/(....)(..)(..)-/,"$3/$2/$1").replace("detailed", " (détaillé)");
  }

  $: if (source) {
      fetch(`/stats/${source}.json`)
        .then(response => response.json())
        .catch(() => { unavailable = true})
        .then(json => {
            rawData = json;
        });
      const p = new URLSearchParams;
      p.set('source', source);
      p.set('scope', sourceScope);
      window.history.replaceState({}, '', `${location.href.replace(/\?.*/,'')}?${p}`);
    };

  let day;
  $: day = /day/.test(sourceScope);

  let labels = {
      visitors: 'visiteurs',
      hits: 'nombre de requêtes',
      'date_time': 'mise à jour',
      'static_requests': 'contenu statique',
      requests: 'requêtes',
      geolocation: 'statistiques géographiques',
      not_found: 'non trouvé',
      hosts: 'clients',
      os: 'système d\'exploitation',
      browsers: 'navigateur',
      visit_time: 'heure de visite',
      hour_of_day_of_week: 'heure de visite',
      referrers: 'sources',
      referring_sites: 'sites sources',
      status_code: 'statut',
      bytes: 'bande passante',
      'start_date': 'début',
      'end_date': 'fin',
      'total_requests': 'requêtes au total',
      'valid_requests': 'requêtes valides',
      'failed_requests': 'requêtes en erreur',
      'unique_visitors': 'visiteurs',
      'unique_files': 'requêtes uniques',
      'excluded_hits': 'requêtes exclues',
      'unique_referrers': 'sources',
      'unique_static_files': 'fichiers statiques',
      'unique_not_found': 'non trouvés (uniques)',
      'bandwidth': 'bande passante'
  };

  const hexToRgb = (hex) => 'rgba(' + hex.match(/^\s*\#?([\da-f]{2})([\da-f]{2})([\da-f]{2})\s*$/)
        .slice(1).map(e => parseInt(e, 16)).join(',') + ',255)';

  const datasets = {
      'visitors': {
          color: hexToRgb(style.getPropertyValue('--bf500'))
      },
      'hits': {
          color: hexToRgb(style.getPropertyValue('--rm500'))
      },
      'bytes': {
          color: hexToRgb(style.getPropertyValue('--gl500'))
      }
  };

    const siteUrlRegexp = [
        [/^page: \/favicon \(GET\)$/, 'static: images'],
        [/^\/(.*)\.(css|css.map)$/, 'static: css'],
        [/^\/(.*)\.(js|json|js.map)$/, 'static: javascript'],
        [/^\/(.*)\.(png|svg|woff2?)$/, 'static: images'],
        [/^GET \/$/, 'page: /search (GET)'],
        [/^page:\s*\/?\s*\(GET\)$/, 'page: /search (GET)'],
        [/^\/(search.*|geo\?.*|\?(current|q|advanced|ln|fn)=.*)$/,'page: /search'],
        [/^\/(link.*)$/,'page: /link'],
        [/^\/(about.*)$/,'page: /about'],
        [/^\/deces\/api\/v1\/search\/csv(\/\S+)?$/, 'api: link csv'],
        [/^\/(.*\/api\/v0|deces\/api\/v1)\/search$/, 'api: search'],
        [/^\/deces\/api\/v1\/([A-Za-z]*)\/?$/, 'api: $1'],
        [/^page: \/(https|dev|backup|wordpress|wp|e|personnes|OLD) \(GET\)$/, 'wrong calls'],
        [/^\/.*$/, 'wrong calls']
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
        data.forEach(d => {
            const keyAgg = keyCB(d);
            Object.keys(datasets).forEach(id => {
                agg[keyAgg] = agg[keyAgg] ? agg[keyAgg] : {};
                agg[keyAgg][id] = agg[keyAgg][id] ? agg[keyAgg][id] + d[id].count :  d[id].count;
            })
        });
        const dataAgg = Object.keys(agg).sort().map(key => {
            const d = {
                data: key
            };
            Object.keys(datasets).forEach(id => {
                d[id] = { count: agg[key][id] }
            });
            return d;
        });
        return dataAgg;
    }

    const smartNumber = (n, digits) => {
      if (typeof n !== 'number') {
          return n;
      };
      const d = digits ? digits : 0;
      if (n < 1000) {
          return n;
      }
      if (n < 1000000) {
          return `${(n/1000).toFixed(1).replace(/.0$/,'')}k`;
      }
    if (n < 1000000000) {
          return `${(n/1000000).toFixed(1).replace(/.0$/,'')}M`;
    }
    return `${(n/1000000000).toFixed(1).replace(/.0$/,'')}G`;
  }

  const fontFamily = '"Marianne",arial,sans-serif';
  const ticks = {
    autoSkip: true,
    fontFamily : fontFamily,
    callback: smartNumber,
  };
  const ticksY = {
    autoSkip: true,
    fontFamily : fontFamily,
    callback: smartNumber,
    maxTicksLimit: 5
  };

  const options = (view) => {
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
                fontFamily: fontFamily
            }
        },
        scales: {
            yAxes: Object.keys(datasets).map((id, i) => {
                return {
                    id: id,
                    type: params[view] && params[view].yLog ? 'logarithmic' : 'linear',
                    position: i%2 ? 'left' : 'right',
                    ticks: ticksY
                }
            }),
            xAxes: params[view] && params[view].xAxes || [{
                ticks: ticks
            }]
        }
    };
    return o;
  };

  const stats = ['total_requests', 'failed_requests', 'unique_visitors', 'bandwidth']
  const views = ['visitors', 'hour_of_day_of_week', 'geolocation',  'referring_sites', 'requests', 'browsers'];

  let datesLabels = {
      months: {
          1: 'janvier',
          2: 'févier',
          3: 'mars',
          4: 'avril',
          5: 'mai',
          6: 'juin',
          7: 'juillet',
          8: 'août',
          9: 'septembre',
          10: 'octobre',
          11: 'novembre',
          12: 'décembre'
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
    'geolocation': {
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
        xAxes: [{
            type: 'time',
            ticks: ticks
        }],
        dataCB: (data) => data.map(d => { d.data = dateParse(d.data); return d})
    },
    'requests': {
        type: Bar,
        yLog: true,
        dataCB: (data) =>
            aggregate(data, (d) => urlAgg(d.data, siteUrlRegexp))
                .filter(x => x.visitors.count > 10)
                .filter(x => !/OPTIONS|HEAD/.test(x.data))
                .sort((a,b) => b.visitors.count - a.visitors.count)
                .slice(0,15)
    }
  };

  const dateParse = (obj) => {
      if ((typeof obj === 'string')) {
          if (/^\d{8}-\d{4}$/.test(obj)) {
            return new Date(obj.substr(0,4), parseInt(obj.substr(4,2))-1 , obj.substr(6,2), obj.substr(9,2), obj.substr(11,2));
          } else if (/^\d{8}$/.test(obj)) {
            return new Date(obj.substr(0,4), parseInt(obj.substr(4,2))-1 , obj.substr(6,2));
          } else if (/^\d{4}S\d{2}-\d{4}$/.test(obj)) {
            return new Date(obj.substr(0,4), parseInt(obj.substr(8,2))-1 , obj.substr(10,2));
          } else if (/^\d{4}S\d{2}-\d{4}-\d{4}$/.test(obj)) {
            return new Date(obj.substr(0,4), parseInt(obj.substr(8,2))-1 , obj.substr(10,2), obj.substr(13,2), obj.substr(15,2));
          }
      }
      return obj
  }

    const data = (view) => {
        const data = (params[view] && (params[view].dataCB)) ? params[view].dataCB(rawData[view].data) : rawData[view].data;
        return {
            labels: data.map(d => d.data),
            datasets: Object.keys(datasets).map(id => {
                    const datasetData = data.map(d => {
                        return {
                            x: d.data,
                            y: d[id].count
                        };
                    });
                    return {
                        backgroundColor: ( params[view] && params[view].type ) ? datasets[id].color : 'rgba(255,255,255,0)',
                        borderColor: datasets[id].color,
                        borderWidth: borderWidth,
                        pointRadius: 0,
                        label:  labels[id] || id,
                        yAxisID: id,
                        data: datasetData
                    };
            })
        };
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
            sourceScope = 'full';
        }
      }
  })

</script>