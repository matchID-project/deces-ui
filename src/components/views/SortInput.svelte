{#if $sortInputDisplay}
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
        {item.label} <br>
        <span>
        {#if item.order === "desc"}
            <span class="rf-fi-arrow-down-s-line rf-fi--xl"></span>
        {:else if item.order === "asc"}
            <span class="rf-fi-arrow-up-s-line rf-fi--xl"></span>
        {/if}
        </span>
    </div>
  </DraggableList>
{/if}

<script>
    import { sortInput, sortInputDisplay } from '../tools/stores';
    import DraggableList from './DraggableList.svelte';
</script>

<style>
  .no-pointer-events {
		pointer-events: none; /* so that a child hover child is not a "dragleave" event */
  }
</style>