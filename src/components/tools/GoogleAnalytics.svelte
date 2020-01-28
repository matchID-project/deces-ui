<script>
    import { onMount } from 'svelte';
    export let trackingId;
    export let enabled=true;
    export let trackerName='ga';
    export let ga;

    onMount(async () => {
        if (window[trackerName]) {
            ga = window[trackerName]
            return
        }

        if (!trackingId) {
            throw new Error('Google Analytics configuration parameter is required, try <GoogleAnalytics trackingId="UA-XXXX-X" />')
        }

        /* eslint-disable */
        const scr = function (i,s,o,g,r,a,m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function() {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
            a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];
            a.async=1;
            a.src=g;
            m.parentNode.insertBefore(a,m);
        }

        await scr(window, document, 'script', 'https://www.google-analytics.com/analytics.js', trackerName, undefined, undefined)
        /* eslint-enable */

        ga = window[trackerName]

        if (enabled) {
            enable()
        }
    });

    const enable=() => {
        init()
        send('pageview')
    }

    const init=() => {
        query('create', trackingId, 'auto')
    }

    const send=(...options) => {
        query('send', ...options)
    }

    const query=(cmd, ...options) => {
        if (options.length === 1) {
            ga(cmd, options[0])
        } else {
            ga(cmd, ...options)
        }
    }

    const plugin=(name, fn) => {
        query('provide', name, fn)
    }
</script>

