import type { Group } from "three";
import { createBarracksTile } from "./barracksTile";
import { createEnemyCampTile } from "./enemyCampTile";
import { createFarmTile } from "./farmTile";
import { createHouseTile } from "./houseTile";
import { createMountainTile } from "./mountainTile";
import { createMarketTile } from "./marketTile";
import { createTavernTile } from "./tavernTile";
import { createTempleTile } from "./templeTile";
import { createWaterTile } from "./waterTile";
import type { FeatureType, TerrainType, TileType } from "../game/types";

export interface TerrainDefinition {
  label: string;
  buttonLabel: string;
  createTile: () => Group;
}

export const terrainDefinitions: Record<TerrainType, TerrainDefinition> = {
  house: {
    label: "House",
    buttonLabel: "House Tile",
    createTile: createHouseTile
  },
  farm: {
    label: "Farm",
    buttonLabel: "Farm Tile",
    createTile: createFarmTile
  },
  market: {
    label: "Market",
    buttonLabel: "Market Tile",
    createTile: createMarketTile
  },
  tavern: {
    label: "Tavern",
    buttonLabel: "Tavern Tile",
    createTile: createTavernTile
  },
  barracks: {
    label: "Barracks",
    buttonLabel: "Barracks Tile",
    createTile: createBarracksTile
  },
  temple: {
    label: "Temple",
    buttonLabel: "Temple Tile",
    createTile: createTempleTile
  }
};

export const terrainOrder: TerrainType[] = [
  "house",
  "farm",
  "market",
  "tavern",
  "barracks",
  "temple"
];

export const featureDefinitions: Record<FeatureType, TerrainDefinition> = {
  lake: {
    label: "Lake",
    buttonLabel: "Lake",
    createTile: createWaterTile
  },
  mountain: {
    label: "Mountain",
    buttonLabel: "Mountain",
    createTile: createMountainTile
  },
  enemyCamp: {
    label: "Enemy Camp",
    buttonLabel: "Enemy Camp",
    createTile: createEnemyCampTile
  }
};

export const getTileDefinition = (tileType: TileType) =>
  tileType in terrainDefinitions
    ? terrainDefinitions[tileType as TerrainType]
    : featureDefinitions[tileType as FeatureType];
