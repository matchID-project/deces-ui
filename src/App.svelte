<svelte:window on:keydown={handleKeydown}/>
{#if !$themeDnum && $liveConfig && $liveConfig.googleAnalyticsId}
	<GoogleAnalytics properties={[ $liveConfig.googleAnalyticsId ]} />
{/if}
{#if !$themeDnum && $liveConfig && $liveConfig.googleAdsenseId}
	<GoogleAdsense id={$liveConfig.googleAdsenseId} />
{/if}
<MatchIDHeader/>
<main>
	{#if $route && $route.path && routes[$route.path] && routes[$route.path].component}
		<svelte:component this={routes[$route.path].component} {...routes[$route.path].props}/>
	{/if}
</main>

<script>
	import { onMount } from 'svelte';
	import MatchIDHeader from './components/views/MatchIDHeader.svelte';
	import { admin, user, accessToken, alphaFeatures, version, route, searchInput, searchCanvas, current, resultsPerPage,
		updateURL, advancedSearch, fuzzySearch, displayMode, themeDnum, wasSearched, liveConfig
	} from './components/tools/stores.js';
	import { URLSearchSubmit } from './components/tools/search.js';
	import { routes } from './components/tools/routes.js';
	import { register } from 'register-service-worker';
	import { useLocalSync } from './components/tools/useLocalStorage.js';
	import Shake from 'shake.js';
	import { GoogleAnalytics } from '@beyonk/svelte-google-analytics';
	import GoogleAdsense from './components/views/GoogleAdsense.svelte'

	onMount(async () => {
		if ($version && !$version.api) {
			try {
				const r = await fetch('__BACKEND_PROXY_PATH__/version');
				const json = await r.json();
				$version.api = json.backend;
				$version.data = json;
			} catch(e) {
			}
		}
		if (!$liveConfig) {
			try {
				const lr = await fetch('/liveConfig.json');
				const lc = await lr.json()
				await liveConfig.update(v => lc);
			} catch(e) {
				console.log(e);
			}
		}
		if ('serviceWorker' in navigator) {
			register('/sw.js', {
				registrationOptions: { scope: './' },
				ready (registration) {
					console.log('Service worker is active.');
				},
				registered (registration) {
					console.log('Service worker has been registered.')
				},
				cached (registration) {
					console.log('Content has been cached for offline use.')
				},
				updatefound (registration) {
					console.log('New content is downloading.')
				},
				updated (registration) {
					console.log('New content is available; please refresh.');
					registration.unregister();
					window.location.reload(true);
				},
				offline () {
					console.log('No internet connection found. App is running in offline mode.')
				},
				error (error) {
					console.error('Error during service worker registration:', error)
				}
			});
		}
		const myShakeEvent = new Shake({});
		myShakeEvent.start();
		window.addEventListener('shake', handleShake, false);
	});

	$: if ($route.path === '/search') {
		const searchParams = new URLSearchParams(location.search)
		if (! $accessToken) {
			const accessTokenTmp = searchParams.get('accessToken');
			const userTmp = searchParams.get('user');
			if (accessTokenTmp && userTmp) {
				localStorage.setItem("accessToken", JSON.stringify(accessTokenTmp));
				localStorage.setItem("user", JSON.stringify(userTmp));
			}
		}
		URLSearchSubmit(searchParams);
	};

	const setCanonical = (url) => {
		var link = !!document.querySelector("link[rel='canonical']") ? document.querySelector("link[rel='canonical']") : document.createElement('link');
		link.setAttribute('rel', 'canonical');
		link.setAttribute('href', url);
		document.head.appendChild(link);
	}

	$: if ($wasSearched && ['/search','/id'].includes($route.path)) {
			document.title = `matchID - ${$route.path === '/search' ? 'recherche ' : ''}${$wasSearched}`;
			document.querySelector('meta[name="description"]').setAttribute("content", `résultats de la recherche pour ${$wasSearched}`);
			setCanonical(window.location.href);
		} else {
	        document.title = `matchID - ${routes[$route.path].title}`;
			document.querySelector('meta[name="description"]').setAttribute("content", routes[$route.path].desc);
	        setCanonical(window.location.href.replace(/#.*/,'').replace(/\?.*/,''));
		};

	$: if ($liveConfig && $liveConfig.googleAnalyticsId) {
		console.log(`GA: ${$liveConfig.googleAnalyticsId}`);
	}

	$: element = document.getElementById('infoNotWorking');
	$: element.parentNode  && element.parentNode.removeChild(element);

	const handleKeydown = async (event) => {
		if (event.ctrlKey && event.altKey && event.key === 'd') {
			await themeDnum.update(v => v === 0 ? 1 : 0);
			console.log(`switch theme to ${$themeDnum ? 'DNUM' : 'public site'}`);
		}
		if (event.ctrlKey && event.altKey && event.key === 'a') {
			$alphaFeatures = !$alphaFeatures;
			console.log($alphaFeatures ? 'alpha features enabled':'alpha features disabled');
		}
	}

	const handleShake = () => {
		$alphaFeatures = !$alphaFeatures;
		console.log($alphaFeatures ? 'alpha features enabled':'alpha features disabled');
	}

</script>


