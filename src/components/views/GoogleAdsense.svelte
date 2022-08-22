<script>
    export let id;

    import { onMount } from 'svelte';

    onMount (async () => {
        const scriptURL = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${id}`;
        let script = document.createElement('script');
        let prior = document.getElementsByTagName('script')[0];
        script.async = 1;

        script.onload = script.onreadystatechange = async ( _, isAbort ) => {
            if(isAbort || !script.readyState || /loaded|complete/.test(script.readyState) ) {
                script.onload = script.onreadystatechange = null;
                script = undefined;
                if(!isAbort) {
                    console.log(`Google Adsense script loaded and registered with ID ${id}`);
                }
            }
        };
        script.src = scriptURL;
        await prior.parentNode.insertBefore(script, prior);
    })
</script>