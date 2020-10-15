<div class="rf-container-fluid">
	<div class="rf-grid-row">
		<div class="rf-col-6 rf-padding-1N">
			<strong>actives</strong>
			<div
				class="rf-container-fuild"
				on:drop|preventDefault={event => dropTop(event, status[0], undefined, -1)}
				ondragover="return false"
			>
				<div class="rf-grid-row bordered rf-text--xs">
					{#if items.filter(x => isActive(x)).length === 0}
						<div
							class="rf-col-12 rf-text--center rf-padding-top-3N rf-padding-bottom-3N"
							on:drop|preventDefault={event => drop(event, status[0], undefined, -1)}
							ondragover="return false"
							on:dragenter={() => hovering = -1}
							on:dragleave={() => hovering = false}
							class:hovering={hovering === -1}
						>
							<span>glissez un filtre ici</span>
						</div>
					{/if}
					{#each items as item, index (getKey(item))}
						<div
							class="rf-col-xl-3 rf-col-lg-4 rf-col-md-6 rf-col-sm-6 rf-col-xs-6 rf-padding-1N"
							draggable={true}
							on:drop|preventDefault={event => drop(event, status[0], item, index)}
							on:dragover={() => hovering = index}
							on:dragleave={() => hovering = false}
							class:rf-hide={!isActive(item)}
							on:dragstart={event => dragstart(event, status[0], item, index)}
							on:click={nextStatus(item, index)}
							animate:flip={{ duration: 300 }}
							id={item}
						>
							<div class="rf-card rf-card--no-arrow rf-margin-0 rf-padding-0">
								<div
									class="rf-card__body rf-margin-0 rf-padding-1N rf-text--center"
									style="overflow:hidden;text-overflow:ellipsis;"
									class:hovering={hovering === index}
								>
									<slot {item} {index}>
										<p>{getKey(item)}</p>
									</slot>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
		<div class="rf-col-6 rf-padding-1N">
			<strong>inactives</strong>
			<div
				class="rf-container-fuild"
				on:drop|preventDefault={event => dropTop(event, undefined, undefined, -1)}
				ondragover="return false"
			>
				<div class="rf-grid-row bordered rf-text--xs">
					{#if items.filter(x => !isActive(x)).length === 0}
						<div
							class="rf-col-12 rf-text--center rf-padding-top-3N rf-padding-bottom-3N"
							on:drop|preventDefault={event => drop(event, undefined, undefined, -1)}
							ondragover="return false"
							on:dragenter={() => hovering = -1}
							on:dragleave={() => hovering = false}
							class:hovering={hovering === -1}
						>
							<span>glissez un filtre ici</span>
						</div>
					{/if}
					{#each items as item, index (getKey(item))}
						<div
							class="rf-col-xl-3 rf-col-lg-4 rf-col-md-6 rf-col-sm-6 rf-col-xs-6 rf-padding-1N"
							draggable={true}
							on:drop|preventDefault={event => drop(event, undefined, item, index)}
							on:dragover={() => hovering = index}
							on:dragleave={() => hovering = false}
							class:rf-hide={isActive(item)}
							on:dragstart={event => dragstart(event, undefined, item, index)}
							animate:flip={{ duration: 300 }}
							id={item}
						>
							<div class="rf-card rf-card--no-arrow rf-margin-0 rf-padding-0">
								<div
									class="rf-card__body rf-margin-0 rf-padding-1N rf-text--center"
									style="overflow:hidden;text-overflow:ellipsis;"
									class:hovering={hovering === index}
								>
									<slot {item} {index}>
										<p>{getKey(item)}</p>
									</slot>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
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
	.bordered {
		border: 2px solid var(--beige);
	}
	.hovering {
		background-color: var(--yd500)!important;
	}
	.hovering * {
		pointer-events: none; /* so that a child hover child is not a "dragleave" event */
	}

</style>