<div class="columns">
	<div class="column is-6">
		<i>actives</i>
		<ul
			on:drop|preventDefault={event => dropTop(event, status[0], undefined, -1)}
			ondragover="return false"
		>
			{#if items.filter(x => isActive(x)).length === 0}
				<li
					on:drop|preventDefault={event => drop(event, status[0], undefined, -1)}
					ondragover="return false"
					on:dragenter={() => hovering = -1}
					on:dragleave={() => hovering = false}
					class:hovering={hovering === -1}
				>
					<i>glissez un filtre ici</i>
				</li>
			{/if}
			{#each items as item, index (getKey(item))}
				<li draggable={true}
					on:drop|preventDefault={event => drop(event, status[0], item, index)}
					ondragover="return false"
					on:dragenter={() => hovering = index}
					on:dragleave={() => hovering = false}
					class="is-info has-text-white"
					class:hovering={hovering === index}
					class:is-hidden={!isActive(item)}
					on:dragstart={event => dragstart(event, status[0], item, index)}
					on:click={nextStatus(item, index)}
					animate:flip={{ duration: 300 }}
					id={item}>
					<slot {item} {index}>
						<p>{getKey(item)}</p>
					</slot>
				</li>
			{/each}
		</ul>
	</div>
	<div class="column is-6">
		<i>inactives</i>
		<ul
			on:drop|preventDefault={event => dropTop(event, undefined, undefined, -1)}
			ondragover="return false"
		>
			{#if items.filter(x => !isActive(x)).length === 0}
				<li
					on:drop|preventDefault={event => drop(event, undefined, undefined, -1)}
					ondragover="return false"
					on:dragenter={() => hovering = -1}
					on:dragleave={() => hovering = false}
					class:hovering={hovering === -1}
				>
					<i>glissez un filtre ici</i>
				</li>
			{/if}
			{#each items as item, index (getKey(item))}
				<li draggable={true}
					on:drop|preventDefault={event => drop(event, undefined, item, index)}
					ondragover="return false"
					on:dragenter={() => hovering = index}
					on:dragleave={() => hovering = false}
					class:hovering={hovering === index}
					class:is-hidden={isActive(item)}
					on:dragstart={event => dragstart(event, undefined, item, index)}
					animate:flip={{ duration: 300 }}
					id={item}>
					<slot {item} {index}>
						<p>{getKey(item)}</p>
					</slot>
				</li>
			{/each}
		</ul>
	</div>
</div>
<script>
  import { flip } from "svelte/animate";
	let key;
	export let activeKey;
	export let statusKey;
	export let status;
	const getStatus = item => (status ? item[statusKey] : item);
	const getKey = item => (key ? item[key] : item);
	const isActive = item => (activeKey ? ( item[activeKey]? true : false ): item);
	const nextStatus = (item, index) => {
		if (statusKey) {
			items[index][statusKey] = status ? status[ ( status.indexOf(item[statusKey]) + 1 ) % status.length ] : item[statusKey]
		}
	};
	let hovering = false;
	export let items = [];
	export function dragstart (ev, status, item, i) {
		ev.dataTransfer.effectAllowed = 'move';
		ev.dataTransfer.dropEffect = 'move';
		let obj = {item: item, id: i, status: status};
   	ev.dataTransfer.setData('text/plain', JSON.stringify(obj));
	};
	export function dropTop (ev, status, items, i) {
		if (hovering === false) {
			drop(ev, status, items, i)
		}
	};
	export function drop (ev, status, item, i) {
		ev.dataTransfer.dropEffect = 'move';
		let obj = JSON.parse(ev.dataTransfer.getData("text/plain"));
		obj.item[statusKey] = status
		if (i >=0) {
			if (obj.id > i) {
				Array.from(Array(obj.id-i)).map((k,j) => items[obj.id-j] = items[obj.id-j-1]);
			} else {
				Array.from(Array(i-obj.id)).map((k,j) => items[obj.id+j] = items[obj.id+j+1]);
			}
		}
		items[i >= 0 ? i : obj.id] = obj.item;
		hovering = null;
	};
</script>

<style>
	ul {
		box-sizing: border-box;
		margin: 10px 0 20px;
		padding: 10px 0 0 10px;
		border: 1px solid #eee;
		min-height: 60px;
	}
	ul li {
		box-sizing: border-box;
		padding: 6px;
		list-style-type: none;
		margin:0 6px 6px 0;
		background: #f9f9f9;
		display: inline-block;
		cursor: pointer;
		border-radius: 4px;
		border: 1px solid transparent;
	}
	.is-hidden {
		display: none!important
	}
	.hovering {
		border: 1px solid orange;
	}
	.hovering * {
		pointer-events: none; /* so that a child hover child is not a "dragleave" event */
	}

	.is-info {
		background-color:#209cee;
	}

	.has-text-white {
		color:#fff!important;
	}
    .has-text-left {
        text-align: left!important;
    }
    .column {
        display: block;
        flex-basis: 0;
        flex-grow: 1;
        flex-shrink: 1;
        padding: 0rem 1rem 0rem 0.75rem;
    }

    .columns.is-mobile>.column.is-3 {
        flex: none;
        width: 25%;
    }

    .columns.is-mobile>.column.is-9 {
        flex: none;
        width: 75%;
    }

    @media print,screen and (min-width:769px) {
        .column.is-3 {
            flex: none;
            width: 25%;
        }

        .column.is-4 {
            flex: none;
            width: 33.3%;
        }

        .column.is-6 {
            flex: none;
            width: 50%;
        }

        .column.is-9 {
            flex: none;
            width: 75%;
        }

        .column.is-12 {
                flex: none;
                width: 100%;
        }
    }

    .columns {
        margin-left: -.75rem;
        margin-right: -.75rem;
        margin-top: -.75rem;
    }

    .columns:last-child {
        margin-bottom: -.75rem;
    }

    .columns:not(:last-child) {
        margin-bottom: .75rem;
    }

    .columns.is-mobile {
        display: flex;
    }

    .columns.is-multiline {
        flex-wrap: wrap;
    }

    .is-vcentered {
        align-items: center;
    }

    @media print,screen and (min-width:769px) {
        .columns:not(.is-desktop) {
            display: flex;
        }
    }
</style>