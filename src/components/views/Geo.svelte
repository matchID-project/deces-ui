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

  .margin {
      padding: 24px 0px 32px 0px;
  }
</style>