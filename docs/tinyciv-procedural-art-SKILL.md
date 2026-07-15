---
name: tinyciv-procedural-art
description: Upgrade TinyCiv's Three.js procedural tiles, buildings, NPCs, decorations, and map features into a richer low-poly diorama style while preserving the project's asset-free runtime, shared palette, tile footprint, camera readability, and mobile performance.
---

# TinyCiv Procedural Art Skill

## Purpose

Use this skill when creating or upgrading TinyCiv visual assets built entirely in TypeScript with Three.js primitives.

The target is a polished, readable, low-poly isometric diorama style: strong silhouettes, layered construction, asymmetrical storytelling details, chunky geometry, shared materials, and clear mobile-scale readability.

## Core Constraints

- Use Three.js primitives only.
- Use existing shared materials from `materialPalette`.
- Build assets as `Group`, `Mesh`, or `Object3D` hierarchies.
- Preserve the existing tile scaffold, footprint, origin, and vertical baseline.
- Do not embed gameplay logic in asset constructors.
- Do not add external textures, GLB files, fonts, SVGs, or image dependencies.
- Avoid transparency unless already required by the project.
- Keep assets readable from the fixed isometric game camera.
- Prioritise mobile performance and visual clarity over realism.
- Keep code deterministic unless variation is explicitly seeded.
- Return one root object compatible with the existing asset factory pattern.

## Visual Direction

Assets should look like miniature tabletop dioramas.

Each asset needs:

1. A clear primary silhouette.
2. Two or three visible height layers.
3. One dominant focal feature.
4. Supporting secondary forms.
5. Small storytelling details.
6. Controlled asymmetry.
7. A restrained material palette.
8. Chunky proportions that survive mobile display.

Avoid flat assets made from one large box and one roof. Avoid realism, tiny details, fake bevel noise, and clutter.

## Five-Layer Composition Model

### 1. Ground layer

Use paths, paving, crop rows, stepping stones, worn ground, fences, low grass, banks, puddles, or drainage channels.

Ground details should stay shallow and preserve tile boundaries.

### 2. Structural layer

Create the main mass: deck, foundation, walls, posts, roof, tower, crop bed, counter, or defensive wall.

This establishes gameplay identity.

### 3. Functional layer

Add geometry that explains the building's purpose:

- market crates and produce
- farm crops and tools
- barracks weapon racks
- tavern tables and barrels
- temple altar and bell
- house chimney and washing line

The tile should be understandable without UI.

### 4. Storytelling layer

Add two to five small, asymmetrical details:

- sacks
- leaning tools
- side crates
- signs
- baskets
- flags
- firewood
- stools
- flower boxes
- damaged planks

### 5. Accent layer

Add one upper-silhouette feature:

- flag
- chimney
- bell
- banner
- sign
- wind vane
- roof ornament
- tree canopy

## Shape Language

- Buildings: wide bases, compact walls, oversized roofs.
- Supports: thick enough to remain visible at mobile scale.
- Props: exaggerated by roughly 20–40%.
- Cylinders: usually 6–8 radial segments.
- Spheres: usually 6–8 width segments and 4–6 height segments.
- Roofs: stepped boxes, rotated boxes, cones, or low-segment cylinders.
- Foliage: clustered low-segment spheres, cones, or irregular boxes.
- Cloth: solid thin geometry, not simulated fabric.
- Curves: approximated with chunky straight pieces.

Do not add details that render below roughly two screen pixels.

## Material Rules

Use shared palette materials. A typical asset should use:

- one ground material
- one primary structural material
- one darker structural shade
- one roof or canopy material
- one accent material
- optionally one vegetation or produce material

Do not create a material per mesh.

Use darker values for supports and recesses, mid values for primary masses, and brighter colours for focal accents.

## Geometry Helpers

Prefer reusable helpers:

```ts
const addBox = (
  parent: Object3D,
  size: [number, number, number],
  position: [number, number, number],
  material: Material,
  rotation: [number, number, number] = [0, 0, 0],
) => Mesh;
```

Useful domain helpers:

- `createCrate`
- `createBarrel`
- `createBasket`
- `createFenceSection`
- `createProducePile`
- `createTree`
- `createRockCluster`
- `createSign`
- `createClothAwning`
- `createRoof`
- `createChimney`
- `createBench`

Helpers should return a `Group` centred around a local origin.

## Tile Layout Rules

- Keep the root tile centred at world origin.
- Respect `createTileBase`.
- Keep most geometry within the tile footprint.
- Small props may slightly overhang if they do not collide visually.
- Keep entrances and interaction sides obvious.
- Preserve some negative space.
- Place important details where neighbours will not always hide them.
- Check the asset from the actual game camera.

## Detail Budget

### MVP

- 12–25 visible meshes
- one main structure
- two functional props
- one accent feature
- minimal ground detail

### Standard

- 25–45 visible meshes
- layered structure
- three to six functional or storytelling props
- stronger ground treatment
- one distinctive upper silhouette

### Hero

- 45–70 visible meshes before batching
- landmarks or rare objectives only
- stronger animation and environmental detail
- must be profiled on target mobile hardware

Most normal tiles should target Standard.

## Performance Rules

- Reuse geometry where practical.
- Reuse material instances.
- Use `InstancedMesh` for repeated props where architecture permits.
- Merge static repeated geometry only after art direction stabilises.
- Do not cast shadows from every small prop.
- Avoid transparency and unnecessary nested groups.
- Keep constructors free of per-frame work.
- Dispose assets through the project's lifecycle, not inside constructors.

## Animation Direction

Suitable procedural animation:

- flag or awning sway
- sign swing
- chimney smoke bob
- lantern pulse
- crop sway
- water wheel rotation
- forge hammer movement
- windmill rotation
- NPC idle bounce
- campfire flicker

Rules:

- Animation state belongs in the renderer, not simulation.
- Constructors may expose moving parts through `userData`.
- Never create an independent `requestAnimationFrame`.
- Keep idle motion subtle.
- Avoid moving the entire tile.
- Support reduced-motion and low-quality modes.

Example:

```ts
root.userData.animatedParts = { sign, flag };
```

## Asset-Specific Direction

### House

Use a compact home, oversized roof, chimney, and visible doorway. Add a path, flower box, firewood, bench, washing line, or fenced side garden.

### Farm

Use clear crop rows, field boundaries, irrigation, sacks, tools, a scarecrow, or a small shed. Crop patterns must read from above.

### Market

Use a striped canopy, raised deck, counters, crates, produce, baskets, hanging goods, uneven paving, and a sign or flag.

### Tavern

Use a broad doorway, chimney, hanging sign, barrels, outdoor tables, stools, lanterns, firewood, and a side awning.

### Barracks

Use a defensive silhouette, watch platform, wall, weapon rack, training dummy, supply crates, flag, and gate. Keep it stylised and non-grim.

### Temple

Use a vertical landmark, steps, columns, altar or bell, shrine garden, stones, banners, and calm open frontage. It should communicate Harmony rather than wealth.

### Forest

Use uneven clusters of varied tree sizes and preserve one readable clearing.

### Mountain

Use layered rock masses and a ridge direction, not one cone.

### Lake

Use opaque water, shoreline geometry, reeds, stones, and an inlet. Avoid transparency for the MVP.

### Swamp

Use dark ground, raised pools, dead branches, reeds, and irregular vegetation.

### Enemy Camp

Use tents, barricades, fire, flag, weapon racks, and disturbed ground.

## NPC Direction

All NPCs should share one body system:

- oversized head
- compact torso
- short limbs
- clear role prop
- strong colour block
- simple face or no face

Differentiate silhouette:

- Citizen: neutral clothing and satchel
- Farmer: hat, hoe, or produce basket
- Merchant: bag, ledger, apron, or cap
- Soldier: helmet, shield, spear, or standard

Use one shared hierarchy for procedural animation.

## Upgrade-Level Rules

### Level 1

Core function only.

### Level 2

Add one structural improvement and richer props.

### Level 3

Add a landmark feature such as a tower, banner, annex, water channel, or ceremonial tree.

Preserve identity across levels.

## Code Quality Rules

- Use descriptive helper names.
- Group magic numbers by feature.
- Prefer tuples for size and position.
- Avoid mutation outside the returned hierarchy.
- Keep constructors deterministic.
- Extract subassemblies from long functions.
- Comment visual intent, not obvious syntax.
- Preserve strict TypeScript compatibility.
- Do not use `any`.
- Do not change shared APIs without checking call sites.

## Codex Workflow

1. Inspect the asset, `materialPalette`, `tileScaffold`, and nearby assets.
2. Identify footprint, vertical baseline, camera-facing side, and current silhouette.
3. Preserve the exported factory and return type.
4. Build large forms before details.
5. Add functional props, ground storytelling, asymmetry, and one upper accent.
6. Verify that the gameplay identity reads without UI.
7. Check from the real isometric camera.
8. Run TypeScript checks and project tests.
9. Report mesh count, helpers added, and optimisation opportunities.

## Completion Checklist

- [ ] Three.js primitives and shared materials only
- [ ] Existing footprint, origin, scaffold, and public factory preserved
- [ ] Clear primary silhouette
- [ ] At least three visible height layers
- [ ] Gameplay function visually legible
- [ ] Controlled asymmetry
- [ ] At least two storytelling details
- [ ] Readable from the game camera
- [ ] No tiny invisible geometry
- [ ] No independent animation loop
- [ ] No gameplay state in the renderer
- [ ] Strict TypeScript compiles
- [ ] Intended mesh budget respected
- [ ] Materials and geometries reused where practical
- [ ] No external art assets

## Prompt Template

> Upgrade `[asset file]` to match the TinyCiv procedural low-poly diorama style defined in this skill. Preserve the exported factory, tile scaffold, footprint, palette, and gameplay-facing identity. Use only Three.js primitives and existing shared materials. Add layered structure, functional props, controlled asymmetry, ground storytelling, and one distinctive upper-silhouette feature. Keep mobile readability and the Standard mesh budget. Do not add external assets, textures, gameplay logic, or independent animation loops. Inspect adjacent asset files first. Run TypeScript checks and summarise the visual changes and performance implications.
