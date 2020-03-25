<script>
    import { liveConfig } from '../tools/stores.js'
    let googleAnalyticsId, configured, configuring;
    export let command, commandParam, eventParam;
    $: gtag(command,commandParam,eventParam);


    const gtag = () => {
        if (!configured) {
            configure(() => {
                window.dataLayer = window.dataLayer || [];
                function g(){dataLayer.push(arguments);}
                g(command,commandParam,eventParam);
            });
        } else {
            if ($liveConfig.googleAnalyticsId) {
                window.dataLayer = window.dataLayer || [];
                function g(){dataLayer.push(arguments);}
                g(command,commandParam,eventParam);
            }
        }
    };

    const configure = async (callback) => {
        if (!configuring && !configured) {
            configuring = true;
            if (!$liveConfig) {
                await loadLiveConfig();
            }
            if ($liveConfig.googleAnalyticsId) {
                await loadScript(callback);
            } else {
                console.log('Google Analytics is not activated for privacy reasons')
            }
            configured = true;
            configuring = false;
    }
    };

	const loadLiveConfig = async () => {
        const response = await fetch('/liveConfig.json');
        const json = await response.json()
        await liveConfig.update(v => json);
	}

    const loadScript = async (callback) => {
        if ($liveConfig.googleAnalyticsId) {
            const googleAnalyticsScriptURL = `https://www.googletagmanager.com/gtag/js?id=${$liveConfig.googleAnalyticsId}`;
            let script = document.createElement('script');
            let prior = document.getElementsByTagName('script')[0];
            script.async = 1;

            script.onload = script.onreadystatechange = async ( _, isAbort ) => {
                if(isAbort || !script.readyState || /loaded|complete/.test(script.readyState) ) {
                    script.onload = script.onreadystatechange = null;
                    script = undefined;
                    if(!isAbort) {
                        await register(callback);
                        console.log(`Google Analytics script loaded and registered with ID ${$liveConfig.googleAnalyticsId}`);
                    }
                }
            };
            script.src = googleAnalyticsScriptURL;
            await prior.parentNode.insertBefore(script, prior);
        };
    };

    const register = async (callback) => {
        if ($liveConfig.googleAnalyticsId) {
            window.dataLayer = window.dataLayer || [];
            function g(){dataLayer.push(arguments);}
            g('js', new Date());
            g('config', $liveConfig.googleAnalyticsId);
        }
        if (callback) {
            callback();
        }
    };

</script>