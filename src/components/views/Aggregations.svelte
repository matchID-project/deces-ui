<div class="rf-container">
  <div class="rf-grid-row rf-grid-row--gutters">
    <div class="rf-col-xl-{true ? '12' : '6'} rf-col-lg-{true ? '12' : '6'} rf-col-md-12 rf-col-sm-12 rf-col-xs-12">
      <div class="rf-tile">
        <div
          class="rf-tile__icon rf-href rf-color--bf rf-hide--mobile"
          >
          <Icon icon="{true ? 'ic:outline-minus' : 'ri:add-line'}"/>
        </div>
        <div class="rf-tile__body">
          <h4 class="rf-tile__title rf-padding-bottom-1N">
            Date de décès
          </h4>
          <Line style="max-height: {true ? '500' : '250'}px;" data={fictifData["birthDate"] && fictifData["birthDate"]} options={fictifData["birthDate"] && myOptions} />
        </div>
      </div>
    </div>
    <div class="rf-col-xl-{true ? '12' : '6'} rf-col-lg-{true ? '12' : '6'} rf-col-md-12 rf-col-sm-12 rf-col-xs-12">
      <div class="rf-tile">
        <div
          class="rf-tile__icon rf-href rf-color--bf rf-hide--mobile"
          >
          <Icon icon="{true ? 'ic:outline-minus' : 'ri:add-line'}"/>
        </div>
        <div class="rf-tile__body">
          <h4 class="rf-tile__title rf-padding-bottom-1N">
            Sexe
          </h4>
          {#if fictifData["sex"]}
          <Pie style="max-height: {true ? '500' : '250'}px;" data={fictifData["sex"] && fictifData["sex"]}  />
          {/if}

        </div>
      </div>
    </div>
  </div>
</div>


<script>
  import { onMount } from 'svelte';
  import Icon from './Icon.svelte';
  import Line from "svelte-chartjs/src/Line.svelte"
  import Pie from "svelte-chartjs/src/Pie.svelte"
  import {
    searchInput,
  } from "../tools/stores.js";
  import buildRequest from '../tools/buildRequest';


  let colors = ['#000091', '#cecece'] 
  const validKeys = ['q', 'firstName', 'lastName', 'legalName', 'sex', 'birthDate', 'birthCity', 'birthDepartment', 'birthCountry', 'deathDate', 'deathCity', 'deathDepartment', 'deathCountry', 'deathAge']
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

  onMount(async () => {
    await getData("birthDate")
    fictifData["birthDate"] = templateData(rawData["birthDate"].response.aggregations.map(x => {
      return {x: x.key["birthDate"], y: x.doc_count}
    }))
    if (rawData["birthDate"].response.aggregations.length === 1) {
      myOptions["birthDate"].scales.xAxes[0].ticks.min = rawData["birthDate"].response.aggregations[0].key["birthDate"] - 300000000
      myOptions["birthDate"].scales.xAxes[0].ticks.max = rawData["birthDate"].response.aggregations[0].key["birthDate"] + 300000000
    } else {
      myOptions["birthDate"].scales.xAxes[0].ticks.min = rawData["birthDate"].response.aggregations[0].key["birthDate"]
      myOptions["birthDate"].scales.xAxes[0].ticks.max = rawData["birthDate"].response.aggregations[rawData["birthDate"].response.aggregations.length - 1].key["birthDate"]
    }
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

    console.log("fictif", fictifData["sex"]);
  })

  const months = {'01': 'janvier', '02': 'février', '03': 'mars', '04': 'avril', '05': 'mai', '06': 'juin', '07': 'juillet', '08': 'août', '09': 'septembre', '10': 'octobre', '11': 'novembre', '12': 'décembre'}
  const fontFamily = '"Marianne",arial,sans-serif';
  const options = (view) => {
    const o = {
        maintainAspectRatio: false,
        hover: {
            intersect: false
        },
        tooltips: {
          mode: 'nearest',
          intersect: false,
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
          display: false,
          labels: {
            fontFamily: fontFamily,
            boxWidth: 20,
            fontSize: 8,
            padding: 6
          },
          position: 'bottom'
        },
        scales: {
          xAxes: [{
            id: 'axisDeathDate',
            type: 'time',
            ticks: {
              min: 0,
              max: 1586000000000,
            }
          }],
          yAxes: [{
            id: 'temp-y-axis',
            type: 'linear',
            position: 'left',
            scaleLabel: {
              display: true,
              labelString: 'Nombre de personnes décédées'
            }
          }]
        },
        tooltips: {
          mode: 'nearest',
          intersect: false,
          callbacks: {
            title: function(tooltipItems, data) {
              let { index } = tooltipItems[0]
              let { datasetIndex } = tooltipItems[0]
              let date = data.datasets[datasetIndex].data[index].x;
              let month = date.replace(/\d{4}(\d{2})\d{2}/, '$1')
              return date.replace(/(\d{4})(\d{2})(\d{2})/,`$3 ${months[month]} $1`)
            }
          }
        }
    };
    return o;
  };

  let myOptions = {}
  myOptions['birthDate'] = options('birthDate')
  myOptions['sex'] = options('sex')

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
