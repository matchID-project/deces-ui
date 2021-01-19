<div class="rf-container">
  {#if fictifData["departementsBar"]}
  <div class="rf-grid-row rf-grid-row--gutters">
    <div class="rf-col-xl-{expanded["departements"] ? '12' : '6'} rf-col-lg-{expanded["departements"] ? '12' : '6'} rf-col-md-12 rf-col-sm-12 rf-col-xs-12">
      <div class="rf-tile">
        <div
          class="rf-tile__icon rf-href rf-color--bf rf-hide--mobile"
          on:click|preventDefault={() => expanded["departements"]=!expanded["departements"]}
          >
          <Icon icon="{expanded["departements"] ? 'ic:outline-minus' : 'ri:add-line'}"/>
        </div>
        <div class="rf-tile__body">
          <h4 class="rf-tile__title rf-padding-bottom-1N">
            Departement de décès
          </h4>
          <FranceChroropleth data={fictifData["departements"]} options={options("departements")} />
        </div>
      </div>
    </div>
    <div class="rf-col-xl-{expanded["departementsBar"] ? '12' : '6'} rf-col-lg-{expanded["departementsBar"] ? '12' : '6'} rf-col-md-12 rf-col-sm-12 rf-col-xs-12">
      <div class="rf-tile">
        <div
          class="rf-tile__icon rf-href rf-color--bf rf-hide--mobile"
          on:click|preventDefault={() => expanded["departementsBar"]=!expanded["departementsBar"]}
          >
          <Icon icon="{expanded["departementsBar"] ? 'ic:outline-minus' : 'ri:add-line'}"/>
        </div>
        <div class="rf-tile__body">
          <h4 class="rf-tile__title rf-padding-bottom-1N">
            Departement de décès
          </h4>
          <Bar style="max-height: {expanded["departementsBar"] ? '500' : '250'}px;" data={fictifData["departementsBar"] && fictifData["departementsBar"]} options={options("departementsBar")} />
        </div>
      </div>
    </div>
  </div>
  {/if}
  <div class="rf-grid-row rf-grid-row--gutters">
    <div class="rf-col-xl-{expanded["birthDate"] ? '12' : '6'} rf-col-lg-{expanded["birthDate"] ? '12' : '6'} rf-col-md-12 rf-col-sm-12 rf-col-xs-12">
      <div class="rf-tile">
        <div
          class="rf-tile__icon rf-href rf-color--bf rf-hide--mobile"
          on:click|preventDefault={() => expanded["birthDate"]=!expanded["birthDate"]}
          >
          <Icon icon="{expanded["birthDate"] ? 'ic:outline-minus' : 'ri:add-line'}"/>
        </div>
        <div class="rf-tile__body">
          <h4 class="rf-tile__title rf-padding-bottom-1N">
            Date de décès
          </h4>
          <Line style="max-height: {expanded["birthDate"] ? '500' : '250'}px;" data={fictifData["birthDate"] && fictifData["birthDate"]} options={fictifData["birthDate"] && options("birthDate")} />
        </div>
      </div>
    </div>
    <div class="rf-col-xl-{expanded["sex"] ? '12' : '6'} rf-col-lg-{expanded["sex"] ? '12' : '6'} rf-col-md-12 rf-col-sm-12 rf-col-xs-12">
      <div class="rf-tile">
        <div
          class="rf-tile__icon rf-href rf-color--bf rf-hide--mobile"
          on:click|preventDefault={() => expanded["sex"]=!expanded["sex"]}
          >
          <Icon icon="{expanded["sex"] ? 'ic:outline-minus' : 'ri:add-line'}"/>
        </div>
        <div class="rf-tile__body">
          <h4 class="rf-tile__title rf-padding-bottom-1N">
            Sexe
          </h4>
          {#if fictifData["sex"]}
            <Pie style="max-height: {expanded["sex"] ? '500' : '250'}px;" data={fictifData["sex"] && fictifData["sex"]} options={fictifData["sex"] && options("sex")} />
          {/if}

        </div>
      </div>
    </div>
  </div>
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


  let colors = ['#000091', '#cecece'] 
  const validKeys = ['q', 'firstName', 'lastName', 'legalName', 'sex', 'birthDate', 'birthCity', 'birthDepartment', 'birthCountry', 'deathDate', 'deathCity', 'deathDepartment', 'deathCountry', 'deathAge']
  const months = {'01': 'janvier', '02': 'février', '03': 'mars', '04': 'avril', '05': 'mai', '06': 'juin', '07': 'juillet', '08': 'août', '09': 'septembre', '10': 'octobre', '11': 'novembre', '12': 'décembre'}

  const templateData = (values) => {
    return {
      labels: values.map(item => item.x),
      datasets: [{
        label: 'personnes décédées',
        fill: false,
        data: values,
      }]
    }
  }

  let rawData = {};
  let fictifData = {};
  let departements = {}
  let geojson;
  const expanded = {}

  let params;
  $: params = {
    'birthDate': { 
      type: Line,
      xAxes: [{
        id: 'axisDeathDate',
        type: 'time',
        ticks: {
          min: 0,
          max: 1586000000000,
        }
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
      type: Pie,
      scales: {}
    },
    'departementsBar': { 
      type: Bar,
      xAxes: [{
        id: 'axisDeathDate',
        type: 'category',
      }]
    },
    'departements': { 
      type: FranceChroropleth,
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
    fictifData["birthDate"] = templateData(rawData["birthDate"].response.aggregations.map(x => {
      return {x: x.key["birthDate"], y: x.doc_count}
    }))
    //if (rawData["birthDate"].response.aggregations.length === 1) {
    //  myOptions["birthDate"].scales.xAxes[0].ticks.min = rawData["birthDate"].response.aggregations[0].key["birthDate"] - 300000000
    //  myOptions["birthDate"].scales.xAxes[0].ticks.max = rawData["birthDate"].response.aggregations[0].key["birthDate"] + 300000000
    //} else {
    //  myOptions["birthDate"].scales.xAxes[0].ticks.min = rawData["birthDate"].response.aggregations[0].key["birthDate"]
    //  myOptions["birthDate"].scales.xAxes[0].ticks.max = rawData["birthDate"].response.aggregations[rawData["birthDate"].response.aggregations.length - 1].key["birthDate"]
    //}
    await getData("sex")
    fictifData["sex"] = {
      labels: rawData["sex"].response.aggregations.map(x => x.key["sex"]),
      datasets: [{
        label: 'sexe',
        fill: false,
        backgroundColor: rawData["sex"].response.aggregations.map((_, ind) => colors[ind]),
        data: rawData["sex"].response.aggregations.map(x => x.doc_count)
      }]
    }

    try{
      const response = await fetch('/simple-french-departments-wdom.json');
      geojson = await response.json();
    } catch(e) {
      console.log(reponse);
    }

    await getData("deathDepartment")
    fictifData["departements"] = {
      labels: rawData["deathDepartment"].response.aggregations.map(x => x.key["deathDepartment"]),
      datasets: [{
        label: "décès",
        yAxisID: "décès",
        data: rawData["deathDepartment"].response.aggregations.map(x => {
          return {y: x.doc_count}
        })
      }]
    }
    fictifData["departementsBar"] = {
      labels: rawData["deathDepartment"].response.aggregations
        .sort((a, b) => b.doc_count - a.doc_count)
        .map(x => departements[x.key["deathDepartment"]]),
      datasets: [{
        label: "departements",
        data: rawData["deathDepartment"].response.aggregations
        .sort((a, b) => b.doc_count - a.doc_count)
        .map(x => x.doc_count )
      }]
    }
  })

  const fontFamily = '"Marianne",arial,sans-serif';

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

  let style = getComputedStyle(document.body);

  const hexToRgba = (hex, alpha) => 'rgba(' + hex.match(/^\s*\#?([\da-f]{2})([\da-f]{2})([\da-f]{2})\s*$/)
        .slice(1).map(e => parseInt(e, 16)).join(',') + `,${alpha})`;

  const datasets = {
    'deaths': {
      color: hexToRgba(style.getPropertyValue('--bf500'), 0.7)
    }
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
