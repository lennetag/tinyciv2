export type TerrainType =
  | "house"
  | "farm"
  | "market"
  | "tavern"
  | "barracks"
  | "temple";

export type FeatureType = "lake" | "mountain" | "enemyCamp";

export type TileType = TerrainType | FeatureType;

export type OccupantKind = "player" | "feature";

export interface BoardPosition {
  row: number;
  column: number;
}

export interface BoardTile {
  kind: OccupantKind;
  type: TileType;
  position: BoardPosition;
}
