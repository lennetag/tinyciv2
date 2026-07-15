import {
  BoxGeometry,
  Camera,
  EdgesGeometry,
  Group,
  MeshBasicMaterial,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  Plane,
  Raycaster,
  Vector2,
  Vector3
} from "three";
import { BOARD_SIZE, CELL_SIZE, TILE_GAP, TILE_HEIGHT } from "./constants";
import type { BoardPosition, BoardTile, FeatureType, TerrainType, TileType } from "./types";
import { palette } from "../assets/materialPalette";
import { getTileAnimationController, type TileAnimationController } from "../assets/tileAnimation";
import { getTileDefinition } from "../assets/terrainTiles";

interface CellData {
  group: Group;
  mesh: Mesh;
  tile?: BoardTile;
}

export const boardToWorld = ({ row, column }: BoardPosition) => {
  const offset = (BOARD_SIZE - 1) / 2;
  return new Vector3(
    (column - offset) * CELL_SIZE,
    0,
    (row - offset) * CELL_SIZE
  );
};

const ORTHOGONAL_DIRECTIONS = [
  { row: -1, column: 0 },
  { row: 1, column: 0 },
  { row: 0, column: -1 },
  { row: 0, column: 1 }
];

const FEATURE_TYPES: FeatureType[] = [
  "lake",
  "lake",
  "mountain",
  "mountain",
  "enemyCamp",
  "enemyCamp"
];

export class BoardView {
  readonly group = new Group();

  private readonly cells: CellData[][] = [];
  private readonly animatedTiles: TileAnimationController[] = [];
  private readonly raycaster = new Raycaster();
  private readonly pointer = new Vector2();
  private readonly plane = new Plane(new Vector3(0, 1, 0), 0);
  private readonly planePoint = new Vector3();
  private readonly selectionHighlight = this.createHighlight("#f7e9a4", 0.2, 1.18);
  private readonly placementHighlight = this.createHighlight("#f04e57", 0.14, 1.28);
  private readonly invalidPlacementHighlight = this.createHighlight("#f04e57", 0.24, 1.28);

  constructor() {
    this.group.name = "board";
    this.buildGrid();
    this.seedFeatureTiles();
    this.group.add(
      this.selectionHighlight,
      this.placementHighlight,
      this.invalidPlacementHighlight
    );
  }

  setVerticalOffset(offsetY: number) {
    this.group.position.y = offsetY;
    this.plane.constant = -offsetY;
  }

  canPlaceTerrain(position: BoardPosition) {
    const cell = this.cells[position.row]?.[position.column];
    if (!cell || cell.tile) {
      return false;
    }

    if (this.getPlayerTiles().length === 0) {
      return true;
    }

    return this.getOrthogonalNeighbors(position).some((neighbor) => Boolean(neighbor?.tile));
  }

  placeTerrain(position: BoardPosition, terrain: TerrainType) {
    const cell = this.cells[position.row]?.[position.column];
    if (!cell || cell.tile) {
      return false;
    }

    const tile = getTileDefinition(terrain).createTile();
    tile.position.copy(boardToWorld(position));
    tile.position.y = 0.01;
    this.group.add(tile);
    const animationController = getTileAnimationController(tile);
    if (animationController) {
      this.animatedTiles.push(animationController);
    }
    cell.tile = {
      kind: "player",
      type: terrain,
      position
    };
    cell.group.visible = false;
    return true;
  }

  update(elapsedMs: number) {
    let didAnimate = false;

    for (const animatedTile of this.animatedTiles) {
      didAnimate = animatedTile.update(elapsedMs) || didAnimate;
    }

    return didAnimate;
  }

  pickCell(
    clientX: number,
    clientY: number,
    canvasBounds: DOMRect,
    camera: Camera
  ): BoardPosition | null {
    this.pointer.x = ((clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
    this.pointer.y = -((clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, camera);

    if (!this.raycaster.ray.intersectPlane(this.plane, this.planePoint)) {
      return null;
    }

    const offset = (BOARD_SIZE - 1) / 2;
    const column = Math.round(this.planePoint.x / CELL_SIZE + offset);
    const row = Math.round(this.planePoint.z / CELL_SIZE + offset);

    if (row < 0 || row >= BOARD_SIZE || column < 0 || column >= BOARD_SIZE) {
      return null;
    }

    return { row, column };
  }

  getTile(position: BoardPosition) {
    return this.cells[position.row]?.[position.column]?.tile ?? null;
  }

  getPlayerTiles() {
    return this.cells.flatMap((row) =>
      row
        .map((cell) => cell.tile)
        .filter((tile): tile is BoardTile & { kind: "player"; type: TerrainType } => tile?.kind === "player")
    );
  }

  getAllTiles() {
    return this.cells.flatMap((row) => row.map((cell) => cell.tile).filter((tile): tile is BoardTile => Boolean(tile)));
  }

  getTileWorldPosition(position: BoardPosition) {
    return boardToWorld(position).add(this.group.position).setY(0.94 + this.group.position.y);
  }

  getOrthogonalNeighbors(position: BoardPosition) {
    return ORTHOGONAL_DIRECTIONS.map(({ row, column }) => {
      const nextRow = position.row + row;
      const nextColumn = position.column + column;

      if (nextRow < 0 || nextRow >= BOARD_SIZE || nextColumn < 0 || nextColumn >= BOARD_SIZE) {
        return null;
      }

      return this.cells[nextRow]?.[nextColumn] ?? null;
    });
  }

  setSelectedCell(position: BoardPosition | null) {
    this.setHighlightPosition(this.selectionHighlight, position);
  }

  setPlacementPreview(position: BoardPosition | null, isValid = true) {
    this.setHighlightPosition(this.placementHighlight, isValid ? position : null);
    this.setHighlightPosition(this.invalidPlacementHighlight, isValid ? null : position);
  }

  private buildGrid() {
    const cellGeometry = new BoxGeometry(CELL_SIZE - TILE_GAP, 0.08, CELL_SIZE - TILE_GAP);
    const cellOutline = new EdgesGeometry(cellGeometry);
    const outlineMaterial = new LineBasicMaterial({ color: palette.boardOutline.color });

    for (let row = 0; row < BOARD_SIZE; row += 1) {
      const currentRow: CellData[] = [];

      for (let column = 0; column < BOARD_SIZE; column += 1) {
        const cellGroup = new Group();
        cellGroup.position.copy(boardToWorld({ row, column }));

        const base = new Mesh(cellGeometry, palette.boardTop);
        base.position.y = 0.04;
        cellGroup.add(base);

        const outline = new LineSegments(cellOutline, outlineMaterial);
        outline.position.y = 0.04;
        cellGroup.add(outline);

        const footing = new Mesh(
          new BoxGeometry(CELL_SIZE - TILE_GAP + 0.02, TILE_HEIGHT, CELL_SIZE - TILE_GAP + 0.02),
          palette.boardSide
        );
        footing.position.y = -0.15;
        cellGroup.add(footing);

        this.group.add(cellGroup);
        currentRow.push({ group: cellGroup, mesh: base });
      }

      this.cells.push(currentRow);
    }
  }

  private seedFeatureTiles() {
    const availablePositions: BoardPosition[] = [];

    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let column = 0; column < BOARD_SIZE; column += 1) {
        availablePositions.push({ row, column });
      }
    }

    for (const featureType of FEATURE_TYPES) {
      const positionIndex = Math.floor(Math.random() * availablePositions.length);
      const [position] = availablePositions.splice(positionIndex, 1);
      if (!position) {
        continue;
      }

      const tile = getTileDefinition(featureType as TileType).createTile();
      tile.position.copy(boardToWorld(position));
      tile.position.y = 0.01;
      this.group.add(tile);

      const cell = this.cells[position.row]?.[position.column];
      if (!cell) {
        continue;
      }

      cell.tile = {
        kind: "feature",
        type: featureType,
        position
      };
      cell.group.visible = false;
    }
  }

  private createHighlight(color: string, fillOpacity: number, scale: number) {
    const group = new Group();
    group.visible = false;

    const highlightGeometry = new BoxGeometry(
      CELL_SIZE - TILE_GAP + 0.26,
      0.16,
      CELL_SIZE - TILE_GAP + 0.26
    );
    const outline = new LineSegments(
      new EdgesGeometry(highlightGeometry),
      new LineBasicMaterial({ color, transparent: true, opacity: 0.95 })
    );
    outline.position.y = 0.14;

    const fill = new Mesh(
      new BoxGeometry(CELL_SIZE - TILE_GAP + 0.08, 0.04, CELL_SIZE - TILE_GAP + 0.08),
      new MeshBasicMaterial({ color, transparent: true, opacity: fillOpacity })
    );
    fill.position.y = 0.1;
    fill.scale.setScalar(scale);

    group.add(fill, outline);
    return group;
  }

  private setHighlightPosition(group: Group, position: BoardPosition | null) {
    if (!position) {
      group.visible = false;
      return;
    }

    group.visible = true;
    group.position.copy(boardToWorld(position));
  }
}
