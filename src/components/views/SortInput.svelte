{#if $sortInputDisplay}
        <div class="">
            <div class="container">
                <p><b>clés de tri</b></p>
                <DraggableList
                    bind:items={$sortInput}
                    activeKey={'order'}
                    statusKey={'order'}
                    status={['asc','desc']}
                    let:item
                    let:index
                >
                    <div class="no-pointer-events">
                        {item.label}
                        <span>
                        {#if item.order === "desc"}
                            <FontAwesomeIcon icon={faSortDown} class="is-low"/>
                        {:else if item.order === "asc"}
                            <FontAwesomeIcon icon={faSortUp} class="is-low"/>
                        {/if}
                        </span>
                    </div>
                </DraggableList>
            </div>
        </div>
{/if}

<script>
    import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
    import FontAwesomeIcon from './FontAwesomeIcon.svelte'
    import { sortInput, sortInputDisplay } from '../tools/stores';
    import DraggableList from './DraggableList.svelte';
</script>

<style>
  .no-pointer-events {
		pointer-events: none; /* so that a child hover child is not a "dragleave" event */
  }

  .list-box {
    z-index: 1;
    display: flex;
    flex-direction: column;
    width: auto;
    line-height: 0.75em;
    background: white;
    position: absolute;
    box-shadow: rgba(59, 69, 79, 0.3) 0px 2px 4px;
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  @media screen and (min-width:769px) {
    .is-centered {
      transform: translate(35%, 0%);
    }
  }
  @media screen and (max-width:768px) {
    .is-centered {
      transform: translate(-20%, 0%);
    }
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

  .container {
    flex-grow: 1;
    margin: 0 auto;
    position: relative;
    width: auto;
  }


  ul {
    margin: 0!important;
    padding: 0!important;
  }

  li {
    margin: 0!important;
    padding: 0!important;
  }

  .is-size-6 {
      font-size: 1rem!important;
  }

</style>