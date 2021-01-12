<Line data={fictifData} options={rawData && myOptions} />

<script>
  import { onMount } from 'svelte';
  import Line from "svelte-chartjs/src/Line.svelte"
  import {
    searchInput,
  } from "../tools/stores.js";
  import buildRequest from '../tools/buildRequest';

  let rawData;
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

  let fictifData;
  let unavailable = false;

  onMount(async () => {
    await getData("birthDate")
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

  let myOptions = options("birthDate")

  const getData = async (s) => {
    try {
      const body = buildRequest($searchInput)
      Object.keys(body).forEach(key => {
        if (!validKeys.includes(key)) {
          delete body[key];
        }
      })

      const response = await fetch('__BACKEND_PROXY_PATH__/agg', {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...body,
          aggs: [s]
        })
      })

      rawData = await response.json();
      fictifData = templateData(rawData.response.aggregations.map(x => {
        return {x: x.key[s], y: x.doc_count}
      }))

      if (rawData.response.aggregations.length === 1) {
        myOptions.scales.xAxes[0].ticks.min = +rawData.response.aggregations[0].key[s] - 300000000
        myOptions.scales.xAxes[0].ticks.max = +rawData.response.aggregations[0].key[s] + 300000000
      } else {
        myOptions.scales.xAxes[0].ticks.min = rawData.response.aggregations[0].key[s]
        myOptions.scales.xAxes[0].ticks.max = rawData.response.aggregations[rawData.response.aggregations.length - 1].key[s]
      }
    } catch(e) {
      unavailable = true
    }
  };

</script>
