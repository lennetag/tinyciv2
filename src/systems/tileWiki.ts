import { getTileDefinition } from "../assets/terrainTiles";
import type { TerrainType, TileType } from "../game/types";
import { adjacencyEffects, type ResourceDelta } from "./tileRules";

export interface TileWikiSynergy {
  id: string;
  targetType: TileType;
  targetLabel: string;
  direction: "benefitsSelf" | "benefitsNeighbor";
  effect: string;
  family: "gold" | "harmony" | "population" | "other";
}

export interface TileWikiPage {
  tileType: TileType;
  title: string;
  synergies: TileWikiSynergy[];
}

const WATER_TILE_TYPE: TileType = "lake";

const terrainTileTypes: TerrainType[] = [
  "house",
  "farm",
  "market",
  "tavern",
  "barracks",
  "temple"
];

const featureTileTypes: TileType[] = ["lake", "mountain", "enemyCamp"];

const toWikiTileType = (tileType: TileType | "water"): TileType =>
  tileType === "water" ? WATER_TILE_TYPE : tileType;

const describeDelta = (delta: ResourceDelta) => {
  const parts: string[] = [];

  if (delta.gold) {
    parts.push(`${delta.gold > 0 ? "+" : ""}${delta.gold} Gold`);
  }

  if (delta.population) {
    parts.push(`${delta.population > 0 ? "+" : ""}${delta.population} Population`);
  }

  if (delta.harmony) {
    parts.push(`${delta.harmony > 0 ? "+" : ""}${delta.harmony} Harmony`);
  }

  if (delta.objective) {
    parts.push("Capture Objective");
  }

  return parts.join(" · ");
};

const getSynergyFamily = (delta: ResourceDelta): TileWikiSynergy["family"] => {
  if (delta.gold) {
    return "gold";
  }

  if (delta.harmony) {
    return "harmony";
  }

  if (delta.population) {
    return "population";
  }

  return "other";
};

const createOutgoingSynergies = (tileType: TileType): TileWikiSynergy[] => {
  if (!terrainTileTypes.includes(tileType as TerrainType)) {
    return [];
  }

  const effects = adjacencyEffects[tileType as TerrainType];
  if (!effects) {
    return [];
  }

  return Object.entries(effects).map(([rawTargetType, delta]) => {
    const targetType = toWikiTileType(rawTargetType as TileType | "water");
    return {
      id: `outgoing:${tileType}:${targetType}`,
      targetType,
      targetLabel: getTileDefinition(targetType).label,
      direction: "benefitsSelf",
      effect: describeDelta(delta ?? {}),
      family: getSynergyFamily(delta ?? {})
    };
  });
};

const createIncomingSynergies = (tileType: TileType): TileWikiSynergy[] => {
  const incoming: TileWikiSynergy[] = [];

  for (const sourceType of terrainTileTypes) {
    const sourceEffects = adjacencyEffects[sourceType];
    if (!sourceEffects) {
      continue;
    }

    const sourceEffect =
      sourceEffects[tileType] ??
      (tileType === WATER_TILE_TYPE ? sourceEffects.water : undefined);

    if (!sourceEffect) {
      continue;
    }

    incoming.push({
      id: `incoming:${tileType}:${sourceType}`,
      targetType: sourceType,
      targetLabel: getTileDefinition(sourceType).label,
      direction: "benefitsNeighbor",
      effect: describeDelta(sourceEffect),
      family: getSynergyFamily(sourceEffect)
    });
  }

  return incoming;
};

const sortSynergies = (left: TileWikiSynergy, right: TileWikiSynergy) => {
  const familyOrder: TileWikiSynergy["family"][] = ["gold", "harmony", "population", "other"];
  const familyDelta = familyOrder.indexOf(left.family) - familyOrder.indexOf(right.family);
  if (familyDelta !== 0) {
    return familyDelta;
  }

  if (left.direction !== right.direction) {
    return left.direction === "benefitsSelf" ? -1 : 1;
  }

  return left.targetLabel.localeCompare(right.targetLabel);
};

const dedupeSynergies = (synergies: TileWikiSynergy[]) => {
  const unique = new Map<string, TileWikiSynergy>();

  for (const synergy of synergies) {
    const key = `${synergy.family}:${synergy.targetType}:${synergy.effect}`;
    const existing = unique.get(key);

    // Prefer the direct wording that explains what the current tile gains or loses.
    if (!existing || existing.direction === "benefitsNeighbor") {
      unique.set(key, synergy);
    }
  }

  return [...unique.values()];
};

export const getWikiTileTypes = () => [...terrainTileTypes, ...featureTileTypes];

export const getTileWikiPage = (tileType: TileType): TileWikiPage => ({
  tileType,
  title: getTileDefinition(tileType).label,
  synergies: dedupeSynergies([
    ...createOutgoingSynergies(tileType),
    ...createIncomingSynergies(tileType)
  ]).sort(sortSynergies)
});
