<Line data={fictifData} />

<script>
  import { onMount } from 'svelte';
  import Line from "svelte-chartjs/src/Line.svelte"
  import {
    searchInput,
  } from "../tools/stores.js";
  import buildRequest from '../tools/buildRequest';

  let rawData;
  const validKeys = ['q', 'firstName', 'lastName', 'legalName', 'sex', 'birthDate', 'birthCity', 'birthDepartment', 'birthCountry', 'deathDate', 'deathCity', 'deathDepartment', 'deathCountry', 'deathAge']

  const randomScalingFactor = () => {
    return 0.5
  }


  const templateData = (values) => {
    return {
      labels: values.map(item => item.x),
      datasets: [{
        label: 'My First dataset',
        fill: false,
        data: values,
      }]
    }
  }

  let fictifData;
  let unavailable = false;

  onMount(async () => {
    await getData(["birthCountry"])
  })

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
          aggs: s
        })
      })

      rawData = await response.json();
      fictifData = templateData(rawData.response.aggregations.map(x => {
        return {x: x.key.birthCountry, y: x.doc_count}
      }))

    } catch(e) {
      unavailable = true
    }
  };

</script>
