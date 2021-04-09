<div
    id="options"
    class:rf-padding-2N={!display}
    class:rf-padding-bottom-2N={display}
    style="position:relative"
>
    <div style="position: absolute;top: 1.1rem; left: 1rem;z-index:1200;">
        <div style="display:flex">
            {#each Object.keys(menu).filter(m => (!display || (activeComponent === m))) as m (m)}
                <span
                    on:click={() => {
                        if (activeComponent === m) {
                            activeComponent = undefined;
                        } else {
                            activeComponent = m
                        }
                        deactivateElement();
                    }}
                    animate:flip
                >
                    <Icon
                        icon={menu[m].icon}
                        label={m}
                        href="#{m.toLowerCase()}"
                        class="rf-fi--lg"
                    />
                </span>
            {/each}
        </div>
    </div>
    {#if display}
        <div class="rf-callout rf-callout--scheme-soft-blue-soft rf-text--left rf-padding-bottom-3N rf-padding-top-0">
            <svelte:component this={menu[activeComponent].component} {...menu[activeComponent].props}/>
        </div>
    {/if}
</div>

<script>
    import { linkOptions, activeElement } from '../tools/stores.js';
    import { flip } from 'svelte/animate';
    import Icon from './Icon.svelte';
    export let menu;

    let display = false;
    let activeComponent;

    $: display = (activeComponent!==undefined);

    const deactivateElement = () => {
            activeElement.update(v => {
                v && v.blur();
                return undefined;
        });
    }
</script>

<style>
    /* The slider itself */
    .rf-range {
        margin-top: 12px;
        margin-bottom: 4px;
        -webkit-appearance: none;  /* Override default CSS styles */
        appearance: none;
        width: 100%; /* Full-width */
        height: 8px; /* Specified height */
        background: var(--g200); /* Grey background */
        outline: none; /* Remove outline */
        opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
        -webkit-transition: .2s; /* 0.2 seconds transition on hover */
        transition: opacity .2s;
    }

    /* Mouse-over effects */
    .rf-range:hover {
        opacity: 1; /* Fully shown on mouse-over */
    }

    /* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */
    .rf-range::-webkit-slider-thumb {
        -webkit-appearance: none; /* Override default look */
        appearance: none;
        width: 8px; /* Set a specific slider handle width */
        height: 16px; /* Slider handle height */
        background: var(--bf500); /* Green background */
        cursor: pointer; /* Cursor on hover */
    }

    .rf-range::-moz-range-thumb {
        width: 25px; /* Set a specific slider handle width */
        height: 25px; /* Slider handle height */
        background: #4CAF50; /* Green background */
        cursor: pointer; /* Cursor on hover */
    }

</style>