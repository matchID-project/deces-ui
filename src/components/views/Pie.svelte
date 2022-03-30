<script>
    import Chart from './Chart.svelte';

    export let data;
    export let style;
    export let options = {};

</script>

<Chart type="pie" data={data} style={style} options={options}/>