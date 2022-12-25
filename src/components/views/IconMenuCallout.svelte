<div
    id="options"
    class:rf-padding-2N={!display}
    class:rf-padding-bottom-2N={display}
    style="position: relative"
>
    <div style="position: absolute;top: 1.1rem; left: 1rem;z-index:1200;">
        <div style="display: flex">
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

</style>