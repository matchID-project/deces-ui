<script>
    import Chart from 'chart.js/auto';

    import * as Adapter from "chartjs-adapter-date-fns";

    export let type = "line";
    export let data;
    export let style = "max-height: 250px";
    export let options = {};

    Chart.register(Adapter);
    Chart.defaults.font.family = '-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"';

	let canvas;
	let chart;
	let ctx;

	function updateChart() {
		ctx = canvas.getContext("2d");
        if (chart) {
            chart.data = data;
            chart.update();
        } else {
            chart = new Chart(ctx, {
                type: type,
                data: data,
                options: options
            });
        }
	}

    $: if (data && canvas) {
        updateChart();
    }
</script>

<canvas style={style} bind:this={canvas}></canvas>