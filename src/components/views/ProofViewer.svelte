{#if $showProof}
    <div class="modal" transition:fade>
        <div class="modal-container">
            <div class="rf-container--fluid">
                <div class="rf-grid-row" style="position: relative">
                    <div
                        style="position:absolute;top:8px;right:4px;color:var(--g300);"
                        on:click={() => $showProof = ''}
                    >
                        <span class="rf-fi-close-circle-line rf-fi--lg"></span>
                    </div>
                    <div class="rf-col-12" style="height:95vh;">
                        <object
                            class="pdf"
                            data={$showProof}
                            type="application/pdf"
                            title="Visualisateur"
                            aria-label="Visualisateur"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}

<script>
import { fade } from 'svelte/transition';
import { showProof } from '../tools/stores.js';

</script>

<style>

.modal {
    position: fixed;
    z-index: 50000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.4);
    display: table;
}

.modal-container {
    display: table-cell;
    vertical-align: middle;
    overflow-y: hidden;
    padding: 16px;
}

.pdf {
    width: calc(100% - 40px);
    height:100%;
}
</style>