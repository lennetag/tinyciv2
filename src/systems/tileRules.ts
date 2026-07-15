import type { BoardTile, TerrainType, TileType } from "../game/types";

export interface ResourceDelta {
  gold?: number;
  harmony?: number;
  population?: number;
  objective?: boolean;
}

export const intrinsicEffects: Partial<Record<TileType, ResourceDelta>> = {
  house: {
    gold: 1,
    population: 2
  }
};

export const adjacencyEffects: Partial<Record<TerrainType, Partial<Record<TileType | "water", ResourceDelta>>>> = {
  house: {
    tavern: { harmony: 2 },
    temple: { harmony: 2 },
    barracks: { harmony: -2 }
  },
  farm: {
    water: { gold: 2 },
    house: { gold: 1 },
    market: { gold: 2 },
    barracks: { harmony: -1 }
  },
  market: {
    farm: { gold: 2 },
    tavern: { gold: 1 },
    house: { gold: 1 }
  },
  tavern: {
    house: { harmony: 2 },
    market: { gold: 1 },
    temple: { harmony: 1 },
    barracks: { harmony: -1 }
  },
  barracks: {
    enemyCamp: { objective: true },
    temple: { harmony: 1 },
    house: { harmony: -2 }
  },
  temple: {
    house: { harmony: 2 },
    tavern: { harmony: 1 },
    barracks: { harmony: -1 }
  }
};

export const getAdjacencyKey = (neighbor: BoardTile): TileType | "water" => {
  if (neighbor.type === "lake") {
    return "water";
  }

  return neighbor.type;
};
