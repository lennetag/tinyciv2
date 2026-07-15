import { getTileDefinition } from "../assets/terrainTiles";
import type { BoardTile, TerrainType, TileType } from "../game/types";
import { adjacencyEffects, getAdjacencyKey, intrinsicEffects, type ResourceDelta } from "./tileRules";
import type { TooltipContent } from "../ui/tooltip";

const formatSignedStat = (value: number) => `${value > 0 ? "+" : ""}${value}`;

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
    parts.push("Secure Objective");
  }

  return parts.join(" · ");
};

const getTileLabel = (tileType: TileType | "water") =>
  tileType === "water" ? "Lake" : getTileDefinition(tileType).label;

const createContributionStats = (tileType: TileType) => {
  const intrinsic = intrinsicEffects[tileType];
  return [
    { label: "Gold", value: formatSignedStat(intrinsic?.gold ?? 0) },
    { label: "Population", value: formatSignedStat(intrinsic?.population ?? 0) },
    { label: "Harmony", value: formatSignedStat(intrinsic?.harmony ?? 0) }
  ];
};

const getPotentialSynergyLines = (terrain: TerrainType) => {
  const effects = adjacencyEffects[terrain];
  if (!effects) {
    return [];
  }

  return Object.entries(effects).map(([adjacencyKey, delta]) => {
    const description = describeDelta(delta ?? {});
    return `Adjacent ${getTileLabel(adjacencyKey as TileType | "water")}: ${description}`;
  });
};

const pushActiveLine = (
  lines: string[],
  prefix: string,
  tileType: TileType | "water",
  delta: ResourceDelta | undefined
) => {
  if (!delta) {
    return;
  }

  lines.push(`${prefix} ${getTileLabel(tileType)}: ${describeDelta(delta)}`);
};

const getActiveSynergyLines = (tile: BoardTile, neighbors: Array<BoardTile | null>) => {
  const lines: string[] = [];

  if (tile.kind === "player") {
    const playerTerrain = tile.type as TerrainType;

    for (const neighbor of neighbors) {
      if (!neighbor) {
        continue;
      }

      pushActiveLine(
        lines,
        "From",
        getAdjacencyKey(neighbor),
        adjacencyEffects[playerTerrain]?.[getAdjacencyKey(neighbor)]
      );
    }
  }

  for (const neighbor of neighbors) {
    if (!neighbor || neighbor.kind !== "player") {
      continue;
    }

    const neighborTerrain = neighbor.type as TerrainType;
    pushActiveLine(
      lines,
      "To",
      neighborTerrain,
      adjacencyEffects[neighborTerrain]?.[getAdjacencyKey(tile)]
    );
  }

  return lines;
};

export const createTerrainTooltipContent = (terrain: TerrainType): TooltipContent => ({
  title: getTileDefinition(terrain).label,
  stats: createContributionStats(terrain),
  sections: [
    {
      title: "Potential Synergies",
      lines: getPotentialSynergyLines(terrain),
      emptyLabel: "No adjacency synergies yet."
    }
  ]
});

export const createBoardTileTooltipContent = (
  tile: BoardTile,
  neighbors: Array<BoardTile | null>
): TooltipContent => ({
  title: getTileDefinition(tile.type).label,
  stats: createContributionStats(tile.type),
  sections: [
    {
      title: "Active Synergies",
      lines: getActiveSynergyLines(tile, neighbors),
      emptyLabel: "No active synergies."
    }
  ]
});
