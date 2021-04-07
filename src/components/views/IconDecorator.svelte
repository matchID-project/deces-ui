<svg xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="130 130 240 240">
    <title>{text}</title>
<defs>
    <path d="M243.2, 382.4c-74.8,
    0-135.5-60.7-135.5-135.5s60.7-135.5,135.5-135.5s135.5, 60.7, 135.5,
    135.5 S318, 382.4, 243.2, 382.4z" id="textcircle" />
</defs>
    <text dy="70" textLength="1200">
        <textPath
            class="text"
            style="font-size: 25px;"
            xlink:href="#textcircle"
        >
            {text}
        </textPath>
    </text>
</svg>

<script>
export let text;
</script>

<style>

text {
            text-transform: lowercase;
            letter-spacing: 22px;
        }

</style>