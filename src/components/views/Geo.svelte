<Hero height={"6rem"}>
    <span slot="title">
      fichier des décès
    </span>
    <span slot="content">
        <div class="hide-desktop">
            <SearchBox/>
        </div>
    </span>
</Hero>

<div class="geo-container">
    <div class="results-body">
        <div class="container">
            <div class="margin">
                <ResultsHeader/>
                <div class="map-container">
                    <Map>
                        <TileLayer tileServer='cartodb.positron'/>
                    </Map>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    import Hero from './Hero.svelte';
    import SearchBox from './SearchBox.svelte';
	import Map from './Map.svelte';
    import TileLayer from './TileLayer.svelte';
    import ResultsHeader from './ResultsHeader.svelte';

</script>

<style>

  @media print,screen and (min-width:769px) {
    .hide-desktop {
        display: None;
    }
  }

  .results-body {
      max-width: 1235px;
      margin-left: auto;
      margin-right: auto;
      display: flex;
      padding: 0 24px;
  }
  @media (max-width: 800px) {
    .results-body {
        width: 100%;
        display: block;
        padding: 0 15px;
     }
  }

    .map-container {
        justify-content: center;
        display: flex;
    }

  .container {
    flex-grow: 1;
    margin: 0 auto;
    position: relative;
    width: auto;
  }

    @media screen and (min-width:1024px) {
    .container {
      max-width: 960px;
    }
  }

  @media screen and (min-width:1216px) {
    .container {
      max-width: 1152px;
    }
  }

  @media screen and (min-width:1408px) {
    .container {
      max-width: 1344px;
    }
  }

  .margin {
      padding: 24px 0px 32px 0px;
  }
</style>