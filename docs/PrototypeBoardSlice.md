# Prototype Board Slice

## Goal

Create the first playable board slice for tinyCiv2:

- 6x6 board with six seeded feature tiles
- Locked isometric camera
- Draw three settlement tiles each turn
- Place one settlement tile
- Resolve adjacency-driven gold, harmony, and population on end turn

## Rendering Direction

- Runtime stack: Vite + TypeScript + Three.js
- Camera behavior isolated in its own module for future extension
- Terrain art built from low-poly code-generated meshes
- Materials stay matte, pastel, and texture-light to match the style guide

## Current Terrain Slice

- Placeable terrain set:
  - `House`
  - `Farm`
  - `Market`
  - `Tavern`
  - `Barracks`
  - `Temple`
- Seeded feature set for the current MVP slice:
  - `Lake`
  - `Mountain`
  - `Enemy Camp`
- Tiles are composed from:
  - layered dirt and grass tile blocks
  - low-poly silhouette props per building type
  - matte pastel materials with minimal texture detail

## Current Turn Flow

- The board starts with two `Lake`, two `Mountain`, and two `Enemy Camp` tiles in random cells.
- Turn 1 allows the first player tile to be placed on any empty cell.
- Later turns require the placed tile to touch an existing player tile or seeded world tile orthogonally.
- The offer tray draws three tiles at the start of a turn.
- Rerolling the offer costs `5 Gold`.
- End turn resolves:
  - adjacency gold income
  - derived harmony total
  - derived population capacity total
  - floating per-tile feedback labels
  - score update
  - next turn draw
- Hovering a placed board tile for 1 second shows a tooltip above the
  tile with intrinsic contributions and active adjacency synergies.
- Double-clicking any occupied board tile opens a left-side wiki panel
  for that tile type, including its rendered tile image and linked
  synergy references.
- Hovering an offered tray tile for 1 second shows a tooltip with
  intrinsic contributions and potential adjacency synergies.

## Near-Term Extension Points

- Additional feature tile modules such as `Forest` and `Swamp`
- NPC deployment and per-building assignments
- Camera pan and zoom
- Richer tooltip content such as relic effects and NPC modifiers
