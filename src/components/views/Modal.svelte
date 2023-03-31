{#if show}
    <div class="modal" transition:fade>
        <div class="modal-container">
            <div class="rf-container-fluid">
                <div class="rf-grid-row">
                    <div class="rf-col-xs-0 rf-col-sm-1 rf-col-md-2 rf-col-lg-3 rf-col-xl-3"></div>
                    <div class="rf-col-xs-12 rf-col-sm-10 rf-col-md-8 rf-col-lg-6 rf-col-xl-6">
                        <div class="rf-container-fluid rf-margin-top-4N">
                            <div class="rf-grid-row modal-content" transition:slide>
                                <div class="rf-col-12">
                                    <div
                                        class="rf-card rf-card--horizontal rf-card--md rf-card--no-arrow"
                                        style="position: relative;"
                                    >
                                        <div class="rf-card__img" style="position: relative;">
                                            <img
                                                alt='login'
                                                src='/favicon.svg'
                                            />
                                        </div>
                                        <div
                                            style="position:absolute;top:26px;right:26px"
                                            on:click={closeModal}
                                            on:keydown={closeModal}
                                        >
                                            <Icon
                                                icon='ri:close-line'
                                                class="rf-fi--lg"
                                            />
                                        </div>
                                        <div class="rf-card__body rf-text--center" style="margin-left: -80px!important; padding-top: 26px!important;">
                                            <h4 class="rf-card_lead rf-margin-0">{title}</h4>
                                        </div>
                                    </div>
                                </div>
                                <div class="rf-col-12">
                                    <div class="rf-padding-7N rf-background--white">
                                        <slot></slot>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="rf-col-xs-0 rf-col-sm-1 rf-col-md-2 rf-col-lg-3 rf-col-xl-3"></div>
                </div>
            </div>
        </div>
    </div>
{/if}

<script>
import { fade, slide } from 'svelte/transition';
import Icon from './Icon.svelte';

export let title = "Modal";
export let show = false;
export let callback = () => {}

const closeModal = () =>  {
    show = false;
    callback();
}

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

.modal-content {
        box-shadow: 0 5px 15px rgb(0 0 0 / 50%);
}
</style>
