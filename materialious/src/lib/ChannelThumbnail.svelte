<script lang="ts">
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import type { Channel } from './Api/model';
	import { cleanNumber, getBestThumbnail, proxyGoogleImage, truncate } from './misc';

	export let channel: Channel;

	let channelPfp: HTMLImageElement | undefined;

	onMount(async () => {
		const img = new Image();
		img.src = proxyGoogleImage(getBestThumbnail(channel.authorThumbnails));

		img.onload = () => {
			channelPfp = img;
		};
	});
</script>

<a href={`/channel/${channel.authorId}`} class="wave" style="min-width: 100%;min-height: 100%;">
	<div class="padding">
		<div class="center-align">
			{#if !channelPfp}
				<progress class="circle"></progress>
			{:else}
				<img
					class="circle"
					style="width: 90px;height: 90px;"
					src={channelPfp.src}
					alt={channel.author}
				/>
			{/if}
		</div>
		<h5 class="center-align">{truncate(channel.author, 14)}</h5>
		<h6 style="margin-top: 0;" class="center-align grey-text medium-text">
			{cleanNumber(channel.subCount)}
			{$_('subscribers')}
		</h6>
		<p>{channel.description}</p>
	</div>
</a>
