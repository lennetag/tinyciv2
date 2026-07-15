# MVP Game Design Document (v2)

## Vision

A relaxing, turn-based settlement builder where the player creates an
efficient village by combining **terrain**, **NPCs**, and **Relics**.
The game is about discovering spatial synergies and building a
harmonious settlement rather than expanding endlessly.

Runs last approximately 20--40 minutes and end when every tile from the
bag has been placed.

------------------------------------------------------------------------

# Core Resources

## Gold

The primary economy.

Used for: - Deploying NPCs (3 Gold each) - Refreshing the tile selection
(5 Gold) - Upgrading tiles (future) - Future relic activations

Generated primarily through productive tile/NPC combinations.

## Harmony

Represents the overall quality of life of the settlement.

Harmony combines: - Health - Safety - Culture - Faith - Environmental
quality

High Harmony improves efficiency and unlocks stronger synergies. Low
Harmony reduces production.

## Population Capacity

Population is not spendable. It determines how many NPCs can exist.
Houses primarily generate Population Capacity.

------------------------------------------------------------------------

# Board

-   6 × 6 grid.
-   Board starts with six pre-filled feature tiles (Lake, Forest,
    Mountain, Swamp, Enemy Camp, etc.).
-   First player tile may be placed anywhere.
-   Every subsequent tile must touch an existing player tile.
-   Tiles cannot be removed in the MVP.
-   Game ends when all player tiles have been placed.

------------------------------------------------------------------------

# Tile Bag

-   Bag contains 10 more tiles than board capacity.
-   Draw 3 tiles.
-   Place 1.
-   Return the remainder to the bag.
-   Refresh selection costs **5 Gold**.

------------------------------------------------------------------------

# Turn Loop

1.  Draw three tiles.
2.  Place one adjacent tile.
3.  Spend Gold (NPCs, reroll, future upgrades).
4.  End Turn.
5.  Update Gold, Population Capacity, Harmony and Relics.

------------------------------------------------------------------------

# Terrain

-   House (+2 Population Capacity)
-   Farm
-   Market
-   Tavern
-   Barracks
-   Temple

------------------------------------------------------------------------

# NPC Rules

Every NPC costs **3 Gold**.

-   Citizen
-   Farmer
-   Merchant
-   Soldier

One NPC per building.

------------------------------------------------------------------------

# NPC × Terrain Interaction Matrix

  ------------------------------------------------------------------------
  Terrain       Citizen        Farmer        Merchant       Soldier
  ------------- -------------- ------------- -------------- --------------
  House         +1 Population  +1 Gold       +1 Gold        +1 Harmony
                Capacity                                    

  Farm          +1 Harmony     +3 Gold       +2 Gold        +1 Gold

  Market        +1 Harmony     +1 Gold       +3 Gold        +1 Harmony /
                                                            -1 Gold

  Tavern        +2 Harmony     +1 Harmony    +2 Gold        +2 Harmony

  Barracks      +2 Harmony     +1 Gold       +2 Gold        Removes Enemy
                after 5 turns                               Camp after 2
                                                            turns, +2
                                                            Harmony

  Temple        +2 Harmony     +1 Gold       +1 Gold        +1 Harmony
  ------------------------------------------------------------------------

------------------------------------------------------------------------

# Terrain Adjacency Matrix

  Terrain    Positive     Effect              Negative   Effect
  ---------- ------------ ------------------- ---------- ------------
  House      House        +1 Population       Barracks   -2 Harmony
             Tavern       +2 Harmony          Swamp      -1 Harmony
             Temple       +2 Harmony                     
  Farm       Water        +2 Gold             Swamp      -2 Gold
             House        +1 Gold             Barracks   -1 Harmony
             Market       +2 Gold                        
  Market     Farm         +2 Gold             Swamp      -1 Gold
             Tavern       +1 Gold                        
             House        +1 Gold                        
  Tavern     House        +2 Harmony          Barracks   -1 Harmony
             Market       +1 Gold                        
             Temple       +1 Harmony                     
  Barracks   Enemy Camp   Capture Objective   House      -2 Harmony
             Temple       +1 Harmony                     
  Temple     House        +2 Harmony          Swamp      -2 Harmony
             Forest       +2 Harmony          Barracks   -1 Harmony
             Tavern       +1 Harmony                     

Future upgrades extend adjacency to diagonals, then radius 1.

------------------------------------------------------------------------

# UI

## Top Left

-   Gold
-   Harmony
-   Population Capacity
-   On mobile these collapse into a compact safe-area status strip

## Top Right

-   Turn Counter
-   Composite Score
-   On mobile these join the same compact status strip or a second short
    chip cluster

## Bottom Centre

-   Three available terrain tiles
-   Remaining bag count
-   Refresh button (5 Gold)
-   On mobile the terrain offer becomes a horizontally swipeable tray

## Bottom Right

-   End Turn button
-   Must remain permanently visible on mobile without scrolling

## Contextual Interaction

Clicking a terrain tile shows: - Level - NPC - Bonuses - Adjacencies -
Future upgrades

On touch devices:

-   Tap an occupied board tile to inspect it
-   Tray cards show a tile image and can be dragged onto the board to
    place them
-   Dropping over a candidate board cell should show clear selection
    feedback while dragging
-   The tooltip persists until explicitly closed or until the player taps
    elsewhere

Clicking a board tile shows a compact tooltip above the tile with:

- Terrain type
- Intrinsic Gold / Population / Harmony contributions
- Active adjacency synergies from neighboring tiles
- An `Open Wiki` action
- A close control

Clicking an offered tray tile shows:

- Terrain type
- Intrinsic Gold / Population / Harmony contributions
- Potential adjacency synergies it can create when placed
- An `Open Wiki` action
- A close control

The tooltip `Open Wiki` action opens the wiki and jumps directly to that
tile's page, with a tile image and hyperlinked synergy references.

On mobile, the wiki opens from an explicit details action and should
present as a sheet or full-screen overlay rather than a narrow sidebar.

Clicking an NPC shows: - Role - Assigned building - Active bonuses

Clicking a Relic shows: - Description - Passive effects - Active
synergies

------------------------------------------------------------------------

# Relics

Players receive **2 random relics** at game start and another at **Turn
20**.

1.  Merchant Ledger
2.  Royal Charter
3.  Golden Caravan
4.  Hidden Cache
5.  Trade Licence
6.  Festival Banner
7.  Pilgrim's Map
8.  Sacred Garden
9.  Peace Treaty
10. Neighbourhood Watch
11. Sacred Seeds
12. Harvest Moon
13. Irrigation Canals
14. Fertile Soil
15. Village Orchard
16. Builder's Hammer
17. Ancient Compass
18. Stone Circle
19. Road Charter
20. Bag of Plenty
