// Health (0..1) -> pose. Geometry constants live here; Plant.svelte only draws.
// Colour is composed with color-mix() over the semantic tokens so no hex
// escapes colors.scss.
//
// Angle convention: 0deg points straight up, positive rotates clockwise
// (toward the right). Healthy leaves fan out; as health falls every leaf
// swings toward hanging straight down.

type LeafDef = {
	attachX: number;
	attachY: number;
	healthy: number; // angle when thriving
	drooped: number; // angle when past saving
	length: number;
};

const LEAVES: LeafDef[] = [
	{ attachX: 100, attachY: 150, healthy: -96, drooped: -158, length: 44 }, // low left
	{ attachX: 100, attachY: 150, healthy: 96, drooped: 158, length: 44 }, // low right
	{ attachX: 100, attachY: 136, healthy: -54, drooped: -150, length: 40 }, // mid left
	{ attachX: 100, attachY: 136, healthy: 54, drooped: 150, length: 40 }, // mid right
	{ attachX: 100, attachY: 123, healthy: 5, drooped: 40, length: 38 }, // crown
];

export type LeafPose = {
	transform: string;
	scale: number;
};

export type PlantPose = {
	leaves: LeafPose[];
	foliageTransform: string;
	foliageColor: string;
	fallenLeaf: boolean;
};

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
// 0 at full health, 1 when dead — biased so decline shows early.
const decline = (h: number) => Math.pow(1 - h, 1.25);

export function poseFor(health: number): PlantPose {
	const h = clamp01(health);
	const d = decline(h);

	const leaves: LeafPose[] = LEAVES.map((leaf) => {
		const angle = leaf.healthy + (leaf.drooped - leaf.healthy) * d;
		const scale = 1 - 0.12 * d; // a little shrivel
		return {
			transform: `translate(${leaf.attachX}px, ${leaf.attachY}px) rotate(${angle.toFixed(2)}deg)`,
			scale,
		};
	});

	const lean = 8 * Math.pow(1 - h, 1.6);

	return {
		leaves,
		foliageTransform: `rotate(${lean.toFixed(2)}deg)`,
		foliageColor: foliageColor(h),
		fallenLeaf: h < 0.12,
	};
}

// 1.0 healthy green, 0.5 stressed amber, 0.0 dead brown.
function foliageColor(h: number): string {
	if (h >= 0.5) {
		const t = Math.round((h - 0.5) * 2 * 100);
		return `color-mix(in oklab, var(--leaf-fair), var(--leaf-well) ${t}%)`;
	}
	const t = Math.round(h * 2 * 100);
	return `color-mix(in oklab, var(--leaf-poor), var(--leaf-fair) ${t}%)`;
}
