<script lang="ts">
	import { poseFor } from "./plant.ts";

	let { health }: { health: number } = $props();

	const pose = $derived(poseFor(health));

	// One pointed leaf: petiole at the origin, blade growing straight up (-y).
	const LEAF = "M0 0 C -2 -8 -9 -14 -9 -24 C -9 -33 -4 -39 0 -42 C 4 -39 9 -33 9 -24 C 9 -14 2 -8 0 0 Z";
</script>

<svg
	class="plant"
	style:--leaf={pose.foliageColor}
	viewBox="18 58 164 162"
	role="img"
	aria-label="A single potted pothos, drawn to match its current condition."
>
	<rect class="pot" x="74" y="162" width="52" height="8" />
	<path class="pot" d="M77 170 L123 170 L117 206 L83 206 Z" />
	<ellipse class="soil" cx="100" cy="165" rx="22" ry="4" />

	<g class="fallen" class:down={pose.fallenLeaf}>
		<g transform="translate(140 197) rotate(102) scale(0.86)">
			<path class="leaf" d={LEAF} />
		</g>
	</g>

	<g class="foliage" style:transform={pose.foliageTransform}>
		<path class="stem" d="M100 166 C 99 150 99 134 100 121" fill="none" />
		{#each pose.leaves as leaf, i (i)}
			<g class="leaf-g" style:transform={leaf.transform}>
				<g style:transform="scale({leaf.scale})">
					<path class="leaf" d={LEAF} />
				</g>
			</g>
		{/each}
	</g>
</svg>

<style lang="scss">
	.plant {
		display: block;
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	.pot {
		fill: var(--pot);
	}

	.soil {
		fill: var(--soil);
	}

	.stem {
		stroke: var(--leaf);
		stroke-width: 3.2;
		stroke-linecap: round;
		transition: stroke 640ms linear;
	}

	.leaf {
		fill: var(--leaf);
		transition: fill 640ms linear;
	}

	.leaf-g,
	.foliage,
	.fallen g {
		transform-box: view-box;
		transform-origin: 0 0;
		transition: transform 660ms cubic-bezier(0.22, 0.61, 0.36, 1);
	}

	.foliage {
		transform-origin: 100px 166px;
	}

	.fallen {
		opacity: 0;
		transition: opacity 520ms ease;

		&.down {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.leaf,
		.stem,
		.leaf-g,
		.foliage,
		.fallen {
			transition: none;
		}
	}
</style>
