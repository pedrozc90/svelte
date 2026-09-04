<script lang="ts">
	import "$lib/styles/colors.scss";
	import "$lib/styles/typography.scss";
	import favicon from "$lib/assets/favicon.svg";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style>
	:global(*),
	:global(*::before),
	:global(*::after) {
		box-sizing: border-box;
	}

	:global(html) {
		background: var(--color-bg);
	}

	:global(body) {
		margin: 0;
		background: var(--color-bg);
		color: var(--color-text);
		font-family: var(--font-sans);
		font-size: var(--size-stat);
		line-height: var(--leading-tight);
		-webkit-font-smoothing: antialiased;
	}
</style>
