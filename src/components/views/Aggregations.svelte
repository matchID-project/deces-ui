<div class="rf-container">
  {#if (!unavailable) && rawData["deathDepartment"]}
  <div class="rf-grid-row rf-grid-row--gutters">
    {#each Object.keys(params) as view}
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
    {/each}
  </div>
  {/if}
</div>


<script>
  import { onMount } from 'svelte';
  import Icon from './Icon.svelte';
  import FranceChroropleth from './FranceChoropleth.svelte';
  import Line from "svelte-chartjs/src/Line.svelte"
  import Pie from "svelte-chartjs/src/Pie.svelte"
  import Bar from "svelte-chartjs/src/Bar.svelte"
  import {
    searchInput,
  } from "../tools/stores.js";
  import buildRequest from '../tools/buildRequest';


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

  const validKeys = ['q', 'firstName', 'lastName', 'legalName', 'sex', 'birthDate', 'birthCity', 'birthDepartment', 'birthCountry', 'deathDate', 'deathCity', 'deathDepartment', 'deathCountry', 'deathAge']
  const months = {'01': 'janvier', '02': 'février', '03': 'mars', '04': 'avril', '05': 'mai', '06': 'juin', '07': 'juillet', '08': 'août', '09': 'septembre', '10': 'octobre', '11': 'novembre', '12': 'décembre'}
  let unavailable = false;
  const fontFamily = '"Marianne",arial,sans-serif';

  let labels = {
      'deaths': 'Personnes décédées'
  };

  const templateData = (view) => {
    const data = (params[view] && (params[view].dataCB)) ? params[view].dataCB() : rawData[view];
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
  let departements = {}
  let geojson;
  const expanded = {}

  let params;
  $: params = {
    'birthDate': { 
      title: 'Date de naissance',
      dataRef: 'birthDate',
      type: Line,
      dataCB: () => rawData['birthDate'].response.aggregations.map(x => {
        return {data: x.key["birthDate"], count: x.doc_count}
      }),
      xAxes: [{
        autoSkip: true,
        fontFamily : fontFamily,
        id: 'axisDeathDate',
        type: 'time',
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
          return date.replace(/(\d{4})(\d{2})(\d{2})/,`$3 ${months[month]} $1`)
        }
      }
    },
    'sex': { 
      title: 'Sexe',
      type: Pie,
      dataRef: 'sex',
      dataCB: () => rawData['sex'].response.aggregations
      .map(x => {
        return {data: x.key['sex'], count: x.doc_count}
      }),
      scales: {}
    },
    'departementsBar': { 
      title: 'Département de décès',
      type: Bar,
      dataRef: 'deathDepartment',
      dataCB: () => rawData['deathDepartment'].response.aggregations
        .sort((a, b) => b.doc_count - a.doc_count)
        .map(x => {
          return {data: departements[x.key["deathDepartment"]], count: x.doc_count}
      }),
      xAxes: [{
        id: 'axisDeathDepartement',
        type: 'category',
      }]
    },
    'departements': { 
      title: 'Département de décès',
      type: FranceChroropleth,
      dataRef: 'deathDepartment',
      dataCB: () => {
        const _data = rawData['deathDepartment'].response.aggregations.map(x => {
          return {data: x.key["deathDepartment"], count: x.doc_count}
        })
        _data.unshift({data: "", count: 0})
        return _data
      },
      yLog: true,
    },
  };


  $: if (geojson) {
    geojson.features.filter(feature => feature.geometry && feature.geometry.coordinates)
      .forEach(feature => {
        departements[feature.properties.code] = feature.properties.nom;
      });
  }

  onMount(async () => {
    await getData("birthDate")
    await getData("sex")
    try{
      const response = await fetch('/simple-french-departments-wdom.json');
      geojson = await response.json();
    } catch(e) {
      console.log(reponse);
    }
    await getData("deathDepartment")
  })


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
            intersect: false
        },
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

  const getData = async (s) => {
    try {
      const body = buildRequest($searchInput)
      Object.keys(body).forEach(key => {
        if (!validKeys.includes(key)) {
          delete body[key];
        }
      })

      const response = await fetch('__BACKEND_PROXY_PATH__/agg', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...body,
          aggs: [s]
        })
      })

      rawData[s] = await response.json();
    } catch(e) {
      unavailable = true
    }
  };

</script>
