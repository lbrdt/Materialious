<script lang="ts">
	import ItemsList from '$lib/components/layout/ItemsList.svelte';

	let { data } = $props();
</script>

<ItemsList items={data.videos} />
