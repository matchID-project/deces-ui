<script>
    import { liveConfig } from '../tools/stores.js'
    let googleAnalyticsId, configured, configuring;
    export let tag;

    $: gtag(tag);

    window.dataLayer = window.dataLayer || [];

    export const gtag = async () => {
        if (!configured) {
            await configure(async () => gtag(arguments));
        } else {
            if ($liveConfig.googleAnalyticsId) {
                dataLayer.push(arguments);
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
            await gtag('js', new Date());
            await gtag('config', $liveConfig.googleAnalyticsId);
        }
        if (callback) {
            await callback();
        }
    }

</script>