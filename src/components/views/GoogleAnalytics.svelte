<script>
    import { onMount } from 'svelte';
    import { googleAnalyticsId } from '../tools/stores.js';

    const googleAnalyticsScriptURL = `https://www.googletagmanager.com/gtag/js?id=${$googleAnalyticsId}`;

    const load = async () => {
        console.log($googleAnalyticsId);
        let script = document.createElement('script');
        let prior = document.getElementsByTagName('script')[0];
        script.async = 1;

        script.onload = script.onreadystatechange = function( _, isAbort ) {
            if(isAbort || !script.readyState || /loaded|complete/.test(script.readyState) ) {
                script.onload = script.onreadystatechange = null;
                script = undefined;
                if(!isAbort) { config(); }
            }
        };
        script.src = googleAnalyticsScriptURL;
        prior.parentNode.insertBefore(script, prior);
    };

    const config = async () => {
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', $googleAnalyticsId);
    };

    onMount(load);

</script>