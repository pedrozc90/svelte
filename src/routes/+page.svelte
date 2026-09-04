<script lang="ts">
	import { onMount } from "svelte";
	import { assess, type Stats } from "./roast.ts";
	import Plant from "./Plant.svelte";

	const controls: { key: keyof Stats; label: string }[] = [
		{ key: "moisture", label: "Soil moisture" },
		{ key: "light", label: "Light exposure" },
		{ key: "vibes", label: "Vibes" },
	];

	let stats = $state<Stats>({ moisture: 30, light: 52, vibes: 20 });

	const verdict = $derived(assess(stats));

	const dotColor = $derived(
		verdict.tier >= 3 ? "var(--leaf-well)" : verdict.tier === 2 ? "var(--leaf-fair)" : "var(--leaf-poor)",
	);

	// The illustration eases from a neutral pose to the real one on load.
	let settled = $state(false);
	onMount(() => {
		const id = requestAnimationFrame(() => (settled = true));
		return () => cancelAnimationFrame(id);
	});
	const health = $derived(settled ? verdict.health : 0.85);

	// Re-write the commentary under a short fade rather than swapping it outright.
	let shown = $state(assess(stats).paragraph);
	let fading = $state(false);
	$effect(() => {
		const next = verdict.paragraph;
		if (next === shown) return;
		fading = true;
		const id = setTimeout(() => {
			shown = next;
			fading = false;
		}, 150);
		return () => clearTimeout(id);
	});
</script>

<svelte:head>
	<title>Roast My Plant</title>
</svelte:head>

<main class="page">
	<article class="sheet">
		<header class="masthead">
			<h1>Roast My Plant</h1>
			<p class="specimen">
				Golden pothos, specimen no.&nbsp;001<br />
				<span class="binomial">Epipremnum aureum</span>
			</p>
		</header>

		<div class="plate">
			<div class="plant-wrap">
				<Plant {health} />
			</div>
		</div>

		<section class="assessment">
			<h2>Today's assessment</h2>
			<p class="note" class:fading>{shown}</p>
			<p class="condition">
				<span class="dot" style:background={dotColor}></span>
				<span class="condition-label">condition:</span>
				<span class="condition-value">{verdict.condition}</span>
			</p>
		</section>

		<hr />

		<section class="controls">
			{#each controls as control (control.key)}
				<div class="control">
					<div class="control-head">
						<label for={control.key}>{control.label}</label>
						<span class="reading">{stats[control.key]}</span>
					</div>
					<input
						id={control.key}
						type="range"
						min="0"
						max="100"
						step="1"
						bind:value={stats[control.key]}
						style:--pct="{stats[control.key]}%"
					/>
				</div>
			{/each}
		</section>
	</article>
</main>

<style lang="scss">
	.page {
		min-height: 100vh;
		padding: clamp(2rem, 8vh, 6rem) 1rem 4rem;
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}

	.sheet {
		width: 100%;
		max-width: 42rem;
		background: var(--color-surface-1);
		padding: clamp(1.5rem, 5vw, 3rem);
	}

	.masthead {
		margin-bottom: 2rem;
	}

	h1 {
		margin: 0;
		font-family: var(--font-sans);
		font-weight: var(--weight-bold);
		font-size: var(--size-title);
		letter-spacing: -0.012em;
		line-height: var(--leading-tight);
	}

	.specimen {
		margin: 0.6rem 0 0;
		font-size: var(--size-meta);
		line-height: 1.5;
		color: var(--color-text-muted);
	}

	.binomial {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 0.9375rem;
	}

	.plate {
		background: var(--color-surface-2);
		height: clamp(12rem, 30vw, 14rem);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: visible;
	}

	.plant-wrap {
		width: min(17rem, 70%);
		height: 94%;
	}

	.assessment {
		margin-top: 1.75rem;
	}

	h2 {
		margin: 0 0 0.75rem;
		font-family: var(--font-serif);
		font-weight: var(--weight-regular);
		font-size: var(--size-body);
		color: var(--color-text-muted);
	}

	.note {
		margin: 0;
		max-width: 54ch;
		font-family: var(--font-serif);
		font-size: var(--size-read);
		line-height: var(--leading-read);
		transition: opacity 200ms ease;

		&.fading {
			opacity: 0.3;
		}
	}

	.condition {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 1.25rem 0 0;
		font-size: var(--size-stat);
	}

	.dot {
		width: 0.5rem;
		height: 0.5rem;
		flex: none;
		transition: background 640ms linear;
	}

	.condition-label {
		color: var(--color-text-muted);
	}

	.condition-value {
		font-weight: var(--weight-medium);
	}

	hr {
		border: none;
		border-top: 1px solid var(--color-hairline);
		margin: 2rem 0;
	}

	.controls {
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
	}

	.control-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 0.85rem;
	}

	label {
		font-size: var(--size-stat);
		font-weight: var(--weight-medium);
	}

	.reading {
		font-variant-numeric: tabular-nums;
		font-size: var(--size-stat);
		color: var(--color-text-muted);
	}

	input[type="range"] {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 2px;
		background:
			linear-gradient(var(--color-accent), var(--color-accent)) 0 / var(--pct, 0%) 100% no-repeat,
			var(--color-hairline);
		cursor: pointer;

		&::-webkit-slider-thumb {
			-webkit-appearance: none;
			width: 12px;
			height: 18px;
			background: var(--color-accent);
			border: none;
		}

		&::-moz-range-thumb {
			width: 12px;
			height: 18px;
			border: none;
			border-radius: 0;
			background: var(--color-accent);
		}

		&::-moz-range-track {
			height: 2px;
			background: var(--color-hairline);
		}

		&::-moz-range-progress {
			height: 2px;
			background: var(--color-accent);
		}

		&:focus-visible {
			outline: 2px solid var(--color-accent);
			outline-offset: 6px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.note,
		.dot {
			transition: none;
		}
	}
</style>
