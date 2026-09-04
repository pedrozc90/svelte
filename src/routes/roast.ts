// The rule-based "AI". No model, no network — a scoring function plus
// hand-written fragments. Each stat contributes a sentence chosen by its own
// band, wrapped by an opening and closing line chosen by the overall tier, so
// the paragraph shifts sentence-by-sentence as the sliders move rather than
// flipping between five canned verdicts.

export type Stats = {
	moisture: number; // 0..100
	light: number; // 0..100
	vibes: number; // 0..100
};

// 4 = best, 0 = past saving.
export type Tier = 0 | 1 | 2 | 3 | 4;

export type Verdict = {
	health: number; // 0..1, drives the illustration
	tier: Tier;
	condition: string; // shown after "condition:"
	paragraph: string;
};

// --- sub-scores: each returns 0..1 -----------------------------------------

// Moisture has an ideal band. Bone-dry is bad; a waterlogged pot is worse and
// quieter about it.
function moistureScore(m: number): number {
	if (m < 40) return m / 40;
	if (m <= 65) return 1;
	return Math.max(0.08, 1 - ((m - 65) / 35) * 0.92);
}

// Too little light starves it; too much laminates it.
function lightScore(l: number): number {
	if (l < 45) return l / 45;
	if (l <= 85) return 1;
	return 1 - ((l - 85) / 15) * 0.3;
}

// Vibes move the needle least, and never all the way down.
function vibesScore(v: number): number {
	return 0.35 + 0.65 * (v / 100);
}

// --- bands for copy -------------------------------------------------------

type Band = 0 | 1 | 2;

function moistureBand(m: number): Band {
	if (m < 28) return 0; // parched
	if (m > 68) return 2; // swamp
	return 1;
}

function lightBand(l: number): Band {
	if (l < 35) return 0; // dusk
	if (l > 88) return 2; // glare
	return 1;
}

function vibesBand(v: number): Band {
	if (v < 30) return 0;
	if (v > 70) return 2;
	return 1;
}

// --- fragments ----------------------------------------------------------

const OPENING: Record<Tier, string> = {
	4: "Against the odds and your history with these things, this one is coping.",
	3: "It's alive and holding steady, which on your ledger counts as a success.",
	2: "The plant has reached the stage where it photosynthesizes mostly out of spite.",
	1: "We are well past the point a return policy would have covered.",
	0: "There's a plant-shaped gap here and a receipt somewhere with your name on it.",
};

const MOISTURE: [string, string, string] = [
	"The soil is dry to the bottom — you could hear it if the leaves still moved.",
	"Soil moisture is, somehow, inside the range a plant would have asked for.",
	"The roots are sitting in standing water with nowhere to go, which is how the quiet ones leave.",
];

const LIGHT: [string, string, string] = [
	"It's being kept in what a real estate listing would call ambient evening light.",
	"The light is adequate, the way a vending-machine sandwich is lunch.",
	"You've left it in full glare and the leaves are starting to look shrink-wrapped.",
];

const VIBES: [string, string, string] = [
	"The vibes reading is low enough that it has stopped listening for footsteps.",
	"Vibes are flat: nobody talks to it, nobody walks past it.",
	"The vibes are high, and the plant appears to know it.",
];

const CLOSING: Record<Tier, string> = {
	4: "Do less than you want to. That's the entire care guide.",
	3: "Change nothing suddenly and you may get to keep this one.",
	2: "A watering can and a window would fix most of the above, if that appeals to you.",
	1: "Intervention is still technically on the table. Narrowly. Today.",
	0: "Note the date. It's the responsible thing to do at this point.",
};

// --- assessment -------------------------------------------------------

const CONDITION: Record<Tier, string> = {
	4: "annoyingly fine",
	3: "stable, for now",
	2: "not great, thanks",
	1: "actively declining",
	0: "past tense",
};

function toTier(overall: number): Tier {
	if (overall >= 0.82) return 4;
	if (overall >= 0.62) return 3;
	if (overall >= 0.42) return 2;
	if (overall >= 0.22) return 1;
	return 0;
}

export function assess(stats: Stats): Verdict {
	const health = 0.42 * moistureScore(stats.moisture) + 0.4 * lightScore(stats.light) + 0.18 * vibesScore(stats.vibes);

	const tier = toTier(health);

	const paragraph = [
		OPENING[tier],
		MOISTURE[moistureBand(stats.moisture)],
		LIGHT[lightBand(stats.light)],
		VIBES[vibesBand(stats.vibes)],
		CLOSING[tier],
	].join(" ");

	return { health, tier, condition: CONDITION[tier], paragraph };
}
