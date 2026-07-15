import type { BoardPosition, BoardTile, TerrainType } from "../game/types";
import { adjacencyEffects, getAdjacencyKey } from "./tileRules";

export interface ResourceState {
  gold: number;
  harmony: number;
  population: number;
  turn: number;
  score: number;
}

export interface TileFeedback {
  position: BoardPosition;
  labels: string[];
}

interface TurnResolutionContext {
  playerTiles: Array<BoardTile & { kind: "player"; type: TerrainType }>;
  getOrthogonalNeighbors: (position: BoardPosition) => Array<BoardTile | null>;
  placedThisTurnPosition?: BoardPosition | null;
}

const formatSignedValue = (value: number, label: string) => `${value > 0 ? "+" : ""}${value} ${label}`;

export const calculateScore = (
  state: Pick<ResourceState, "gold" | "harmony" | "population">,
  placedTileCount: number
) => state.gold + state.harmony + state.population + placedTileCount * 2;

export const resolveTurn = (
  currentState: ResourceState,
  context: TurnResolutionContext
) => {
  let goldIncome = 0;
  let harmony = 0;
  const population = context.playerTiles.filter((tile) => tile.type === "house").length * 2;
  const populationIncrease = Math.max(0, population - currentState.population);

  const tileFeedback: TileFeedback[] = [];

  for (const tile of context.playerTiles) {
    let tileGold = 0;
    let tileHarmony = 0;
    let capturedObjective = false;

    if (tile.type === "house") {
      tileGold += 1;
    }

    const neighbors = context.getOrthogonalNeighbors(tile.position);
    for (const neighbor of neighbors) {
      if (!neighbor) {
        continue;
      }

      const adjacencyKey = getAdjacencyKey(neighbor);
      const effect = adjacencyEffects[tile.type]?.[adjacencyKey];
      if (!effect) {
        continue;
      }

      tileGold += effect.gold ?? 0;
      tileHarmony += effect.harmony ?? 0;
      capturedObjective = capturedObjective || Boolean(effect.objective);
    }

    goldIncome += tileGold;
    harmony += tileHarmony;

    const labels: string[] = [];
    if (tileGold !== 0) {
      labels.push(formatSignedValue(tileGold, "Gold"));
    }
    if (tileHarmony !== 0) {
      labels.push(formatSignedValue(tileHarmony, "Harmony"));
    }
    const isPlacedHouseThisTurn =
      populationIncrease > 0 &&
      tile.type === "house" &&
      tile.position.row === context.placedThisTurnPosition?.row &&
      tile.position.column === context.placedThisTurnPosition?.column;

    if (isPlacedHouseThisTurn) {
      labels.push(formatSignedValue(populationIncrease, "Population"));
    }
    if (capturedObjective) {
      labels.push("Objective Secured");
    }

    if (labels.length > 0) {
      tileFeedback.push({
        position: tile.position,
        labels
      });
    }
  }

  const nextState: ResourceState = {
    gold: currentState.gold + goldIncome,
    harmony,
    population,
    turn: currentState.turn + 1,
    score: 0
  };
  nextState.score = calculateScore(nextState, context.playerTiles.length);

  return {
    nextState,
    goldIncome,
    tileFeedback
  };
};
