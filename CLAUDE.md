# CLAUDE.md

Svelte playground to test and learn it.
Still do not what the project really do...

## Rules

- Do not install any dependencies.

## Stack

- Svelte 5 + typescript
- Use `SCSS` or `SASS`, nested styles rule.

## File Conventions

- `src/lib/styles/colors.scss` — every color value, one place. Two layers:
    1. **Palette** — raw hex, named by hue/shade (`$ink-900`, `$surface-0`, `$accent-500`...).
    2. **Semantic** — what components actually use (`$color-bg`, `$color-text`,
       `$color-surface-1`, `$color-surface-2`...), mapped to the palette.
       Components reference semantic names only, never raw hex or palette vars.
- `src/lib/styles/typography.scss` — font-family declarations and type scale
  (sizes, weights, line-heights) as SCSS variables.
- Both files are plain SCSS, imported once in `+layout.svelte`:
  `import '$lib/styles/colors.scss';`. No `:global()` needed — imported
  stylesheets are never scoped by Svelte. `:global()` is only for unscoping
  a rule _inside_ a component's own `<style>` block; don't use it for shared
  tokens.
- Shared types go in `src/types`, with a barrel `index.ts` re-exporting them.
  Don't barrel component files — keep components co-located with their `.ts`
  logic, not re-exported through an index.

## Design Defaults

- Keep UI extremely minimalistic.
- Avoid shadows as much as possible - keep everything flat.
- Elevation/hierarchy comes from contrast between surface tokens, not shadow or border.
- Avoid rounded corners as much as possible;
- Use colors that are easy on the eyes; reserve sharp/saturated colors for small details and accents, never large areas.
- One typeface by default. A second only if the brief clearly calls for a display/body split — and if used, the two must be clearly distinct from each other.
- No overflow X.
