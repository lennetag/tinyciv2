# Turn Economy Slice

## Scope

This slice implements the first end-to-end settlement loop for the MVP:

- top-left resource HUD for `Gold`, `Harmony`, and `Population`
- top-right HUD for `Turn` and `Score`
- bottom-right `End Turn` control
- turn-end resolution for terrain adjacency effects
- floating per-tile feedback labels

## Current Rules

### Starting State

- `Gold`: `10`
- `Harmony`: `0`
- `Population Capacity`: `0`
- `Turn`: `1`
- `Score`: `gold + harmony + population capacity + placed tile count * 2`

### Feature Tile Seeding

- The board spawns six randomised feature positions on boot.
- The current feature mix is fixed to:
  - `2 Lake`
  - `2 Mountain`
  - `2 Enemy Camp`

### Placement

- The first settlement tile may be placed on any empty cell.
- Every later settlement tile must touch an existing player tile or a seeded world tile in one of the four orthogonal directions.
- Diagonals do not count in this slice.

### Resolution Model

- `Gold` is cumulative and increases by the current turn's production.
- `Harmony` is recalculated from the current board state each turn.
- `Population Capacity` is recalculated from the current board state each turn and is currently `2 × number of houses`.
- Houses provide `+1 Gold` every resolved turn.
- A newly placed house surfaces `+2 Population` feedback on the first `End Turn` after placement.
- Implemented adjacency effects follow the current MVP matrix for the currently available terrain and feature set.
- `Barracks` adjacent to an `Enemy Camp` currently surfaces as feedback text only.

## Intentional Omissions

- NPC assignment and NPC-driven yields
- Forest and swamp feature tiles
- Harmony efficiency modifiers
- Objective scoring for captured enemy camps
- Relics and turn-20 relic reward
