<div class="rf-container">
  <div class="rf-grid-row rf-grid-row--gutters">
    {#if !unavailable}
      {#each Object.keys(params) as view}
        {#if (!unavailable) && params[view].type && rawData[params[view].dataRef] && (rawData[params[view].dataRef].length > 0)}
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
                  {params[view].title||view}
                </h4>
                <svelte:component
                  style="max-height: {expanded[view] ? '500' : '250'}px;"
                  this={params[view] && params[view].type ? params[view].type : Line}
                  data={rawData[params[view].dataRef] && templateData(view)}
                  options={rawData[params[view].dataRef] && options(view)} />
              </div>
            </div>
          </div>
        {/if}
      {/each}
    {:else}
      <div class="rf-col-xl-3 rf-col-lg-2 rf-col-md-1 rf-col-sm-12 rf-col-xs-12"></div>
      <div class="rf-col-xl-6 rf-col-lg-8 rf-col-md-10 rf-col-sm-12 rf-col-xs-12 rf-margin-top-4N">
        <h4 class="rf-h4 rf-text--center rf-color--rm">
            <span class="rf-fi-alert-line rf-fi--xl">
            </span>
            <br>
            {unavailable.status} {unavailable.statusText}
        </h4>
        <p class="rf-text--left rf-padding-left-2N rf-padding-right-2N">
            { unavailable.status === 429
                ? "Le service étant fortement sollicité, votre requête est temporisée quelques secondes... Si le problème persiste, vous devrez revenir ultérieurement."
                : "Le service est indisponible. Veuillez réessayer dans quelques minutes. Si l'erreur perdure, veuillez nous contacter matchid-project@gmail.com"
            }
            {#if unavailable.status === 429}
              <Icon icon="ri:loader-line" class="rf-fi--xxl rf-margin-top-1N" spin center/>
            {/if}
        </p>
      </div>
    {/if}
  </div>
</div>


<script>
  import { onMount } from 'svelte';
  import Icon from './Icon.svelte';
  import FranceChroropleth from './FranceChoropleth.svelte';
  import Radar from './Radar.svelte';
  let Line;
  import('svelte-chartjs/src/Line.svelte').then(module => {
    Line = module.default;
  });
  let Bar;
  import('svelte-chartjs/src/Bar.svelte').then(module => {
    Bar = module.default;
  });
  let Pie;
  import('svelte-chartjs/src/Pie.svelte').then(module => {
    Pie = module.default;
  });
  import {
    searchInput,
    triggerAggregations,
    totalResults,
    totalBuckets,
    actualBuckets
  } from "../tools/stores.js";
  import { searchTrigger } from '../tools/search.js';
  import buildRequest from '../tools/buildRequest.js';
  import { runAggregationRequest } from '../tools/runRequest.js';

  let style = getComputedStyle(document.body);
  const hexToRgba = (hex, alpha) => 'rgba(' + hex.match(/^\s*\#?([\da-f]{2})([\da-f]{2})([\da-f]{2})\s*$/)
        .slice(1).map(e => parseInt(e, 16)).join(',') + `,${alpha})`;
  const datasets = {
    'deaths': {
      color: hexToRgba(style.getPropertyValue('--bf500'), 0.7)
    }
  };
  const colors = [
    hexToRgba(style.getPropertyValue('--bf500'), 0.7),
    hexToRgba(style.getPropertyValue('--bf500'), 0.55),
    hexToRgba(style.getPropertyValue('--bf500'), 0.4),
    hexToRgba(style.getPropertyValue('--bf500'), 0.25)
  ]

  const validKeys = ['q', 'firstName', 'lastName', 'legalName', 'sex', 'birthDate', 'birthCity', 'birthDepartment', 'birthCountry', 'deathDate', 'deathCity', 'deathDepartment', 'deathCountry', 'deathAge', 'fuzzy']
  const months = {'01': 'janvier', '02': 'février', '03': 'mars', '04': 'avril', '05': 'mai', '06': 'juin', '07': 'juillet', '08': 'août', '09': 'septembre', '10': 'octobre', '11': 'novembre', '12': 'décembre'}
  let unavailable = false;
  const fontFamily = '"Marianne",arial,sans-serif';

  let labels = {
      'deaths': 'Personnes décédées'
  };

  const templateData = (view) => {
    const data = (params[view] && (params[view].dataCB)) ? params[view].dataCB(rawData[params[view].dataRef]) : rawData[params[view].dataRef];
    return {
      labels: data.map(d => d.data),
      datasets: Object.keys(datasets)
      .map(id => {
        const datasetData = params[view].type === Pie ? data.filter(d => d.data).map(d => d.count || d.mean) : data.filter(d => d.data).map(d => {
          return {
            x: d.data,
            y: d.count || d.mean
          };
        })
        return {
          backgroundColor: params[view].type === Pie ? data.map((_, ind) => colors[ind]) : datasets[id].color,
          borderColor: 'rgba(255,255,255,0)',
          borderWidth: 2,
          pointRadius: 0,
          label:  labels[id] || id,
          yAxisID: id,
          data: datasetData
        };
      })
    };
  };

  let rawData = {};
  let cancelRequest = {};
  let departements = {}
  let geojson;
  const expanded = {}

  let params;
  $: params = {
    'deathDate': {
      title: 'Date de décès',
      dataRef: 'deathDate',
      type: Line,
      dataCB: (data) => data.map(x => {
          return {data: x["key_as_string"], count: +x.doc_count}
        })
        .filter(x => x.data >= "19700000"),
      xAxes: [{
        ticks: {
          autoSkip: true,
          fontFamily : fontFamily,
        },
        id: 'axisDeathDate',
        type: 'time',
        gridLines: {
          display: false
        },
        //ticks: {
        //  min: 0,
        //  max: 1586000000000,
        //}
      }],
      tooltipCallback: {
        title: (tooltipItems, data) => {
          let { index } = tooltipItems[0]
          let { datasetIndex } = tooltipItems[0]
          let date = data.datasets[datasetIndex].data[index].x;
          let month = date.replace(/\d{4}(\d{2})\d{2}/, '$1')
          return date.replace(/(\d{4})(\d{2})(\d{2})/,`${months[month]} $1`)
        }
      }
    },
    // 'deathDepartments': {
    //   title: 'Département de décès',
    //   type: FranceChroropleth,
    //   dataRef: 'deathDepartment',
    //   dataCB: (data) => {
    //     const d = data.map(x => {
    //       return {data: x["key"], count: +x.doc_count}
    //     });
    //     console.log(d);
    //     return d;
    //   }
    // },
    // 'birthDate': {
    //   title: 'Date de naissance',
    //   dataRef: 'birthDate',
    //   type: Line,
    //   dataCB: (data) => data.map(x => {
    //       return {data: x["key_as_string"], count: +x.doc_count}
    //     }),
    //   xAxes: [{
    //     ticks: {
    //       autoSkip: true,
    //       fontFamily : fontFamily,
    //     },
    //     id: 'axisBirthDate',
    //     type: 'time',
    //     gridLines: {
    //       display: false
    //     },
    //     //ticks: {
    //     //  min: 0,
    //     //  max: 1586000000000,
    //     //}
    //   }],
    //   tooltipCallback: {
    //     title: (tooltipItems, data) => {
    //       let { index } = tooltipItems[0]
    //       let { datasetIndex } = tooltipItems[0]
    //       let date = data.datasets[datasetIndex].data[index].x;
    //       let month = date.replace(/\d{4}(\d{2})\d{2}/, '$1')
    //       return date.replace(/(\d{4})(\d{2})(\d{2})/,`$3 ${months[month]} $1`)
    //     }
    //   }
    // },
    'birthDepartments': {
      title: 'Département de naissance',
      type: FranceChroropleth,
      dataRef: 'birthDepartment',
      dataCB: (data) => data.map(x => {
          return {data: x["key"], count: +x.doc_count}
        })
    },
    'polarDeathDate': {
      title: 'Mois de décès',
      type: Radar,
      dataRef: 'deathDate',
      dataCB: (data) => data.map(x => {
          return {data: x["key_as_string"], count: +x.doc_count}
        })
    },
    'deathAge': {
      title: 'Âge au décès',
      dataRef: 'deathAge',
      type: Line,
      dataCB: (data) => data.map(x => {
          return {data: x["key"], count: +x.doc_count}
        })
        .sort((a,b) => parseInt(a.data) - parseInt(b.data)),
      xAxes: [{
        ticks: {
          autoSkip: true,
          fontFamily : fontFamily,
        },
        id: 'axisDeathAge',
        gridLines: {
          display: false
        },
        //ticks: {
        //  min: 0,
        //  max: 1586000000000,
        //}
      }],
      tooltipCallback: {
        title: (tooltipItems, data) => {
          let { index } = tooltipItems[0]
          let { datasetIndex } = tooltipItems[0]
          let age = data.datasets[datasetIndex].data[index].x;
          return `${age} ans`
        }
      }

    },
    'firstName': {
      title: 'Prénom',
      type: Bar,
      dataRef: 'firstName',
      dataCB: (data) => data
        .map(x => {
          return {data: x["key"], count: x.doc_count}
        })
      ,
      xAxes: [{
        ticks: {
          autoSkip: true,
          fontFamily : fontFamily,
        },
        gridLines: {
          display: false
        },
        id: 'axisFirstName',
        type: 'category',
      }]
    },
    'lastName': {
      title: 'Nom',
      type: Bar,
      dataRef: 'lastName',
      dataCB: (data) => data
        .map(x => {
          return {data: x["key"], count: x.doc_count}
        })
      ,
      xAxes: [{
        ticks: {
          autoSkip: true,
          fontFamily : fontFamily,
        },
        gridLines: {
          display: false
        },
        id: 'axisLastName',
        type: 'category',
      }]
    },
    'sex': {
      title: 'Sexe',
      type: Pie,
      dataRef: 'sex',
      dataCB: (data) => data
      .map(x => {
        return {data: x['key'], count: +x.doc_count}
      }),
      scales: {},
      tooltipCallback: {
        title: (tooltipItems, data) => {
          let { index } = tooltipItems[0]
          let { datasetIndex } = tooltipItems[0]
          let sex = data.datasets[datasetIndex].data[index];
          let percent = Math.round(sex/$totalResults * 100)
          return `${percent}%`
        }
      }
    },
  };


  $: if (geojson) {
    geojson.features.filter(feature => feature.geometry && feature.geometry.coordinates)
      .forEach(feature => {
        departements[feature.properties.code] = feature.properties.nom;
      });
  }

  onMount(async () => {
    try{
      const response = await fetch('/simple-french-departments-wdom.json');
      geojson = await response.json();
    } catch(e) {
      console.log(reponse);
    }
  })

  $: if ($triggerAggregations) {
    refreshAggregations($searchInput);
    $triggerAggregations = false;
  };

  const refreshAggregations = async (mySearchInput) => {
    actualBuckets.set(0);
    totalBuckets.set(0);
    ["sex", "birthDepartment", "deathAge","firstName","lastName","deathDate"].forEach(s => {
      cancelRequest[s] = true
    })
    let success = false;
    while (!success) {
      try {
        await getData("sex", mySearchInput);
        await getData("birthDepartment", mySearchInput);
        // await getData("deathDepartment", mySearchInput);
        // await getData("birthDate", mySearchInput);
        await getData("deathDate", mySearchInput);
        await getData("deathAge", mySearchInput);
        await getData("firstName", mySearchInput);
        await getData("lastName", mySearchInput);
        success = true;
        unavailable = false;
      } catch(e) {
        console.log(e);
        unavailable = e;
        await sleep(unavailable.status === 429 ? 7000 : 30000);
      }
    }
  }

  const sleep = (ms) => {
      return new Promise(resolve => setTimeout(resolve, ms));
  }

  const smartNumber = (n) => {
    if (typeof n !== 'number') {
      return n;
    };
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


  const ticks = {
    autoSkip: true,
    fontFamily : fontFamily,
    callback: smartNumber,
  };
  const ticksY = {
    autoSkip: true,
    fontFamily : fontFamily,
    callback: smartNumber,
    maxTicksLimit: 5,
    beginAtZero: true
  };

  const options = (view) => {
    const o = {
        maintainAspectRatio: false,
        hover: {
          intersect: false,
          animationDuration: 0, // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
        tooltips: {
          mode: 'nearest',
          intersect: false,
          callbacks: params[view] && params[view].tooltipCallback || {}
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
          // disable
          display: false,
          labels: {
            fontFamily: fontFamily,
            boxWidth: 20,
            fontSize: 8,
            padding: 6
          },
          position: 'bottom'
        },
        scales: params[view].scales || {
            yAxes: Object.keys(datasets).map((id, i) => {
                return {
                    id: id,
                    type: params[view] && params[view].yLog ? 'logarithmic' : 'linear',
                    position: i%2 ? 'right' : 'left',
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

  const getData = async (s, mySearchInput) => {
    if (((s === 'birthDepartement') && ( (mySearchInput.birthCountry !== 'FRANCE') ||   mySearchInput.birthCity))
       || (mySearchInput[s].value)) {
      rawData[s] = [];
      return;
    }
    let headerLine = true;
    const aggRequest = buildRequest(mySearchInput);
    Object.keys(aggRequest).forEach(key => {
      if (!validKeys.includes(key)) {
        delete aggRequest[key];
      }
    })

    aggRequest.aggs = [s];

    if (['firstName', 'lastName'].includes(s)) {
      aggRequest.aggsSize = 15;
    }
    let response
    response = await runAggregationRequest(aggRequest);
    if (response.status) {
      throw(response);
    }

    const reader = response.getReader && response.getReader();
    totalBuckets.update(v => v + response.headers ? +response.headers.get(`total-results-${s}`) : 0);

    let header;
    rawData[s] = [];
    let tempChunk = []
    cancelRequest[s] = false;
    const decoder = new TextDecoder("utf-8");
    while(true) {
      let parsedChunk;
      if (reader) {
        const {done, value} = await reader.read();
        if (done) {
          break;
        }
        parsedChunk = decoder.decode(value).split("\n").filter(x => x);
      } else {
        parsedChunk = response.split("\n").filter(x => x);
        totalBuckets.update(v => v + parsedChunk.length - 1);
      }

      if (headerLine) {
        header = parsedChunk.splice(0,1);
        headerLine = false;
      }
      actualBuckets.update(v => v + parsedChunk.length);
      const parsedArray = parsedChunk.map(x => {
        const _row = {};
        header[0].split(",").forEach((key, ind) => {
          _row[key] = x.split(",")[ind]
        })
        return _row
      })
      if (cancelRequest[s]) {
        break
      }
      tempChunk = [...tempChunk, ...parsedArray];
      if (tempChunk.length > 1000) {
        rawData[s] = [...rawData[s], ...tempChunk];
        tempChunk = []
      }
      if ($actualBuckets >= $totalBuckets) {
        rawData[s] = [...rawData[s], ...tempChunk];
        tempChunk = []
        break
      }
      if (!reader) {
        break;
      }
    }
  };

</script>
