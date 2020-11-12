<div class="rf-container">
    <div class="rf-grid-row rf-grid-row--gutters">
        {#if (!unavailable) && rawData}
            {#each stats as key}
                <div class="rf-col">
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
            {#each views as view}
                <div class="rf-col-xl-6 rf-col-lg-6 rf-col-md-12 rf-col-sm-12 rf-col-xs-12">
                    <div class="rf-tile">
                        <div class="rf-tile__body">
                            <h4 class="rf-tile__title rf-padding-bottom-1N">
                                {labels[view]||view}
                            </h4>
                            <svelte:component
                                this={params[view] && params[view].type ? params[view].type : Line}
                                data={data(view)}
                                options={options(view)}
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
  import { iso2to3 } from '../tools/countries.js';

  let style = getComputedStyle(document.body);
  let rawData;
  let unavailable = false;

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
  const datasets = {
      'visitors': {
          color: style.getPropertyValue('--bf500')
      },
      'hits': {
          color: style.getPropertyValue('--rm500')
      },
      'bytes': {
          color: style.getPropertyValue('--gl500')
      }
  };

    const siteUrlRegexp = [
        [/^\/(.*)\.(css|css.map)$/, 'static: css'],
        [/^\/(.*)\.(js|json|js.map)$/, 'static: javascript'],
        [/^\/(.*)\.(png|svg|woff2?)$/, 'static: images'],
        [/^\/(search.*|geo\?.*|\?(current|q|advanced|ln|fn)=.*)$/,'page: search'],
        [/^\/(link.*)$/,'page: link'],
        [/^\/(about.*)$/,'page: about'],
        [/^\/deces\/api\/v1\/search\/csv\/\S+$/, 'api: link csv'],
        [/^\/deces\/api\/v1\/search\/csv$/, 'api: download csv'],
        [/^\/(.*\/api\/v0|deces\/api\/v1)\/search$/, 'api: search'],
        [/^\/deces\/api\/v1\/([A-Za-z]*)\/?$/, 'api: $1'],
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
    callback: smartNumber
  }

  const options = (view) => {
    const o = {
        elements: {
            line: {
                tension: 0
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
                    ticks: {...ticks, maxTicksLimit: 5}
                }
            }),
            xAxes: params[view] && params[view].xAxes || [{
                ticks: ticks
            }]
        }
    };
    return o;
  };

  let stats = ['total_requests', 'failed_requests', 'unique_visitors', 'unique_files', 'unique_static_files', 'bandwidth']
  let views = ['visitors', 'visit_time', 'browsers', 'requests', 'referring_sites', 'geolocation'];

  let params = {
    'browsers': { type: Bar },
    'hosts': { type: Bar },
    'visit_time': {
        dataCB: (data) => data.map(d => {
            d.data = d.data + 'h';
            return d;
        })
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
        dataCB: (data) => aggregate(data, (d) => urlAgg(d.data, referrerUrlRegexp))
    },
    'referrers': {
        type: Bar,
        yLog: true,
        dataCB: (data) => aggregate(data, (d) => urlAgg(d.data, referrerUrlRegexp))
    },
    'hosts': { type: Bar },
    'visitors': {
        xAxes: [{
            type: 'time',
            time: {
                unit: 'month'
            },
            ticks: ticks
        }]
    },
    'requests': {
        type: Bar,
        yLog: true,
        dataCB: (data) => aggregate(data, (d) => urlAgg(d.data, siteUrlRegexp))
    }
  };

  const dateParse = (obj) => {
      if ((typeof obj === 'string') && /^\d{8}$/.test(obj)) {
        return new Date(obj.substr(0,4), parseInt(obj.substr(4,2))-1 , obj.substr(6,2));
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
                            x: dateParse(d.data),
                            y: d[id].count
                        };
                    });
                    return {
                        backgroundColor: `${datasets[id].color}${( params[view] && params[view].type ) ? 'ff' : '22'}`,
                        borderColor: datasets[id].color,
                        pointRadius: 1,
                        label:  labels[id] || id,
                        yAxisID: id,
                        data: datasetData
                    };
            })
        };
    };

    onMount(async () => {
        try{
            const response = await fetch('/stats/full.json');
            rawData = await response.json();
        } catch(e) {
            unavailable = true;
        }
  })

</script>