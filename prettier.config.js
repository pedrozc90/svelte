/** @type {import("prettier").Config} */
const config = {
	printWidth: 128,
	tabWidth: 4,
	useTabs: true,
	singleQuote: false,
	semi: true,
	trailingComma: "all",
	bracketSpacing: true,
	endOfLine: "lf",
	plugins: ["prettier-plugin-svelte"],
	overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
};

export default config;
