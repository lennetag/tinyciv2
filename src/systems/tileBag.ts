import type { TerrainType } from "../game/types";

export interface TileOfferState {
  offeredTiles: TerrainType[];
  remainingInBag: number;
  totalTiles: number;
}

const TILE_BAG_COUNTS: Record<TerrainType, number> = {
  house: 16,
  barracks: 3,
  market: 6,
  farm: 10,
  tavern: 6,
  temple: 3
};

const OFFER_SIZE = 3;

const createDrawPile = () => {
  const tiles: TerrainType[] = [];

  for (const [terrain, count] of Object.entries(TILE_BAG_COUNTS) as Array<[TerrainType, number]>) {
    for (let index = 0; index < count; index += 1) {
      tiles.push(terrain);
    }
  }

  return tiles;
};

export class TileBag {
  private readonly drawPile: TerrainType[];
  private currentOffer: TerrainType[] = [];
  private readonly totalTiles: number;

  constructor(private readonly random: () => number = Math.random) {
    this.drawPile = createDrawPile();
    this.totalTiles = this.drawPile.length;
  }

  drawOffer() {
    this.currentOffer = this.drawTiles();
    return this.getOfferState();
  }

  rerollOffer() {
    return this.drawOffer();
  }

  selectOfferedTile(selectedIndex: number) {
    const selectedTerrain = this.currentOffer[selectedIndex];

    if (!selectedTerrain) {
      throw new Error(`Invalid offered tile index: ${selectedIndex}`);
    }

    const drawPileIndex = this.drawPile.indexOf(selectedTerrain);
    if (drawPileIndex === -1) {
      throw new Error(`Selected tile is no longer available in the bag: ${selectedTerrain}`);
    }

    this.drawPile.splice(drawPileIndex, 1);
    this.currentOffer = [];
    return selectedTerrain;
  }

  getOfferState(): TileOfferState {
    return {
      offeredTiles: [...this.currentOffer],
      remainingInBag: this.drawPile.length,
      totalTiles: this.totalTiles
    };
  }

  private drawTiles() {
    const nextOffer: TerrainType[] = [];
    const drawCount = Math.min(OFFER_SIZE, this.drawPile.length);
    const availableTiles = [...this.drawPile];

    for (let index = 0; index < drawCount; index += 1) {
      const randomIndex = Math.floor(this.random() * availableTiles.length);
      const [tile] = availableTiles.splice(randomIndex, 1);
      if (tile) {
        nextOffer.push(tile);
      }
    }

    return nextOffer;
  }
}
