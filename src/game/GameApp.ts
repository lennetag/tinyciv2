import {
  AmbientLight,
  Color,
  DirectionalLight,
  OrthographicCamera,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer
} from "three";
import { BoardView, boardToWorld } from "./board";
import { createIsometricCamera, resizeIsometricCamera } from "./camera";
import type { BoardPosition, TerrainType, TileType } from "./types";
import { BOARD_SIZE } from "./constants";
import { HudView, type FloatingHudLabel } from "../ui/hud";
import { getTileDefinition } from "../assets/terrainTiles";
import { TileBag } from "../systems/tileBag";
import { TileThumbnailView } from "../ui/tileThumbnail";
import { calculateScore, resolveTurn, type ResourceState } from "../systems/turnResolution";
import {
  createBoardTileTooltipContent,
  createTerrainTooltipContent
} from "../systems/tileTooltip";
import { getTileWikiPage } from "../systems/tileWiki";
import type { TooltipAction, TooltipContent } from "../ui/tooltip";

const INITIAL_GOLD = 10;
const REROLL_COST = 5;
const BOARD_VERTICAL_OFFSET_RATIO = 0.05;
const MOBILE_BOARD_VERTICAL_OFFSET_RATIO = 0.14;
const MOBILE_CAMERA_FRUSTUM_MULTIPLIER = 1.22;
const MOBILE_BREAKPOINT = 760;

interface TooltipSnapshot {
  content: TooltipContent;
  x: number;
  y: number;
  wikiTarget: TileType | null;
}

interface ActiveTooltipTarget {
  key: string;
  resolve: () => TooltipSnapshot | null;
}

interface ActiveDragState {
  offerIndex: number;
  terrain: TerrainType;
}

export class GameApp {
  private readonly renderer: WebGLRenderer;
  private readonly scene: Scene;
  private readonly camera: OrthographicCamera;
  private readonly cameraFrustum: number;
  private readonly hasCoarsePointer =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: none), (pointer: coarse)").matches;
  private readonly board: BoardView;
  private readonly hud: HudView;
  private readonly tileBag = new TileBag();
  private readonly floatingProjection = new Vector3();
  private readonly dragGhost: HTMLDivElement;
  private readonly dragGhostThumbnail: TileThumbnailView;
  private readonly dragGhostLabel: HTMLSpanElement;
  private animationFrameId: number | null = null;
  private tooltipTarget: ActiveTooltipTarget | null = null;
  private activeTooltipKey: string | null = null;
  private tooltipWikiTarget: TileType | null = null;
  private activeDrag: ActiveDragState | null = null;
  private hasPlacedThisTurn = false;
  private lastPlacedPosition: BoardPosition | null = null;
  private resourceState: ResourceState = {
    gold: INITIAL_GOLD,
    harmony: 0,
    population: 0,
    turn: 1,
    score: INITIAL_GOLD
  };

  constructor(private readonly root: HTMLDivElement) {
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(new Color("#0b141d"));
    this.renderer.domElement.className = "game-canvas";
    this.root.append(this.renderer.domElement);

    this.dragGhost = document.createElement("div");
    this.dragGhost.className = "hud__drag-ghost";
    this.dragGhost.setAttribute("aria-hidden", "true");
    this.dragGhostThumbnail = new TileThumbnailView();
    this.dragGhostThumbnail.element.classList.add("hud__drag-ghost-thumbnail");
    this.dragGhostLabel = document.createElement("span");
    this.dragGhostLabel.className = "hud__drag-ghost-label";
    this.dragGhost.append(this.dragGhostThumbnail.element, this.dragGhostLabel);
    this.root.append(this.dragGhost);

    this.scene = new Scene();
    this.scene.background = new Color("#0f1824");

    const { camera, frustum } = createIsometricCamera(1);
    this.camera = camera;
    this.cameraFrustum = frustum;

    this.board = new BoardView();
    this.board.setVerticalOffset(this.cameraFrustum * BOARD_VERTICAL_OFFSET_RATIO);
    this.scene.add(this.board.group);

    this.addLights();
    this.hud = new HudView(this.root, {
      onOfferClick: (offerIndex, anchorElement) => {
        this.openOfferTooltip(offerIndex, anchorElement);
      },
      onOfferDragStart: (offerIndex, pointerX, pointerY) => {
        this.beginOfferDrag(offerIndex, pointerX, pointerY);
      },
      onOfferDragMove: (offerIndex, pointerX, pointerY) => {
        this.updateOfferDrag(offerIndex, pointerX, pointerY);
      },
      onOfferDragEnd: (offerIndex, pointerX, pointerY) => {
        void this.finishOfferDrag(offerIndex, pointerX, pointerY);
      },
      onReroll: async () => {
        this.clearTooltip();
        this.clearDragPreview();
        if (this.resourceState.gold < REROLL_COST || this.hasPlacedThisTurn) {
          return;
        }

        this.resourceState = {
          ...this.resourceState,
          gold: this.resourceState.gold - REROLL_COST
        };
        this.updateScore();
        this.hud.setResources(this.resourceState);
        this.hud.setTileOffer(this.tileBag.rerollOffer());
        this.syncHudActions();
      },
      onEndTurn: async () => {
        this.clearTooltip();
        this.clearDragPreview();
        await this.handleEndTurn();
      },
      onTooltipWiki: () => {
        this.openTooltipWiki();
      },
      onTooltipClose: () => {
        this.clearTooltip();
      },
      onWikiNavigate: (tileType) => {
        this.clearTooltip();
        this.hud.openWiki(getTileWikiPage(tileType));
      },
      onWikiClose: () => {
        this.hud.closeWiki();
      }
    });
    this.hud.setResources(this.resourceState);
    this.hud.setTileOffer(this.tileBag.drawOffer());
    this.syncHudActions();

    this.renderer.domElement.addEventListener("pointerdown", this.handleBoardPointerDown);
    document.addEventListener("pointerdown", this.handleDocumentPointerDown, true);
    window.addEventListener("resize", this.handleResize);
    window.visualViewport?.addEventListener("resize", this.handleResize);
    window.visualViewport?.addEventListener("scroll", this.handleResize);
    this.handleResize();
    this.render();
    this.startAnimationLoop();
  }

  dispose() {
    this.renderer.domElement.removeEventListener("pointerdown", this.handleBoardPointerDown);
    document.removeEventListener("pointerdown", this.handleDocumentPointerDown, true);
    window.removeEventListener("resize", this.handleResize);
    window.visualViewport?.removeEventListener("resize", this.handleResize);
    window.visualViewport?.removeEventListener("scroll", this.handleResize);
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.hud.dispose();
    this.dragGhostThumbnail.dispose();
    this.renderer.dispose();
  }

  private readonly handleBoardPointerDown = (event: PointerEvent) => {
    const bounds = this.renderer.domElement.getBoundingClientRect();
    const cell = this.board.pickCell(event.clientX, event.clientY, bounds, this.camera);
    const tile = cell ? this.board.getTile(cell) : null;

    this.clearDragPreview();

    if (!cell || !tile) {
      this.clearTooltip();
      this.board.setSelectedCell(null);
      return;
    }

    this.board.setSelectedCell(cell);
    this.showBoardTileTooltip(cell);
  };

  private readonly handleDocumentPointerDown = (event: PointerEvent) => {
    if (!this.activeTooltipKey) {
      return;
    }

    if (this.hud.containsTooltipTarget(event.target)) {
      return;
    }

    this.clearTooltip();
  };

  private readonly handleResize = () => {
    this.updateViewportHeight();
    const size = new Vector2(this.root.clientWidth, this.root.clientHeight);
    const aspect = size.x / Math.max(size.y, 1);
    const isMobileLayout = this.isMobileLayout(size.x);
    const frustum = this.cameraFrustum * (isMobileLayout ? MOBILE_CAMERA_FRUSTUM_MULTIPLIER : 1);

    resizeIsometricCamera(this.camera, frustum, aspect);
    this.board.setVerticalOffset(
      frustum * (isMobileLayout ? MOBILE_BOARD_VERTICAL_OFFSET_RATIO : BOARD_VERTICAL_OFFSET_RATIO)
    );
    this.renderer.setSize(size.x, size.y, false);
    this.refreshTooltip();
    this.render();
  };

  private addLights() {
    const ambient = new AmbientLight("#ffffff", 2.6);
    this.scene.add(ambient);

    const sun = new DirectionalLight("#fff6dc", 2.2);
    sun.position.set(8, 14, 10);
    this.scene.add(sun);
  }

  private render = () => {
    this.refreshTooltip();
    this.renderer.render(this.scene, this.camera);
  };

  private syncHudActions() {
    const hasOffer = this.tileBag.getOfferState().offeredTiles.length > 0;
    this.hud.setActionState({
      canReroll: hasOffer && !this.hasPlacedThisTurn && this.resourceState.gold >= REROLL_COST,
      canEndTurn: this.hasPlacedThisTurn
    });
  }

  private openOfferTooltip(offerIndex: number, anchorElement: HTMLElement) {
    const terrain = this.tileBag.getOfferState().offeredTiles[offerIndex];
    if (!terrain) {
      this.clearTooltip();
      return;
    }

    const key = `offer:${offerIndex}:${terrain}`;
    const resolve = () => {
      const rect = anchorElement.getBoundingClientRect();
      return {
        content: createTerrainTooltipContent(terrain),
        x: rect.left + rect.width / 2,
        y: rect.top,
        wikiTarget: terrain
      };
    };

    this.tooltipTarget = { key, resolve };
    this.activeTooltipKey = key;
    this.showTooltipSnapshot(resolve());
  }

  private showBoardTileTooltip(cell: BoardPosition) {
    const key = `board:${cell.row}:${cell.column}`;
    const resolve = () => {
      const currentTile = this.board.getTile(cell);
      if (!currentTile) {
        return null;
      }

      const currentBounds = this.renderer.domElement.getBoundingClientRect();
      const position = this.projectWorldToViewport(this.board.getTileWorldPosition(cell), currentBounds);
      return {
        content: createBoardTileTooltipContent(
          currentTile,
          this.board.getOrthogonalNeighbors(cell).map((neighbor) => neighbor?.tile ?? null)
        ),
        x: position.x,
        y: position.y - 8,
        wikiTarget: currentTile.type
      };
    };

    this.tooltipTarget = { key, resolve };
    this.activeTooltipKey = key;
    this.showTooltipSnapshot(resolve());
  }

  private showTooltipSnapshot(snapshot: TooltipSnapshot | null) {
    if (!snapshot) {
      this.clearTooltip();
      return;
    }

    this.tooltipWikiTarget = snapshot.wikiTarget;
    const action: TooltipAction | null = snapshot.wikiTarget
      ? { label: "Open Wiki" }
      : null;
    this.hud.showTooltip(snapshot.content, snapshot.x, snapshot.y, action);
  }

  private refreshTooltip() {
    if (!this.tooltipTarget || this.activeTooltipKey !== this.tooltipTarget.key) {
      return;
    }

    this.showTooltipSnapshot(this.tooltipTarget.resolve());
  }

  private clearTooltip() {
    this.tooltipTarget = null;
    this.activeTooltipKey = null;
    this.tooltipWikiTarget = null;
    this.hud.hideTooltip();
  }

  private openTooltipWiki() {
    if (!this.tooltipWikiTarget) {
      return;
    }

    this.hud.openWiki(getTileWikiPage(this.tooltipWikiTarget));
  }

  private beginOfferDrag(offerIndex: number, pointerX: number, pointerY: number) {
    if (this.hasPlacedThisTurn) {
      return;
    }

    const terrain = this.tileBag.getOfferState().offeredTiles[offerIndex];
    if (!terrain) {
      return;
    }

    this.clearTooltip();
    this.board.setSelectedCell(null);
    this.activeDrag = { offerIndex, terrain };
    this.dragGhostThumbnail.setTile(terrain);
    this.dragGhostLabel.textContent = getTileDefinition(terrain).label;
    this.dragGhost.dataset.visible = "true";
    this.updateDragGhost(pointerX, pointerY);
  }

  private updateOfferDrag(offerIndex: number, pointerX: number, pointerY: number) {
    if (!this.activeDrag || this.activeDrag.offerIndex !== offerIndex) {
      return;
    }

    this.updateDragGhost(pointerX, pointerY);

    const cell = this.pickNearestPlaceableCellAtViewport(pointerX, pointerY);
    if (!cell) {
      this.board.setPlacementPreview(null);
      return;
    }

    this.board.setPlacementPreview(cell, true);
  }

  private async finishOfferDrag(offerIndex: number, pointerX: number, pointerY: number) {
    const dragState = this.activeDrag;
    this.activeDrag = null;
    this.dragGhost.dataset.visible = "false";

    if (!dragState || dragState.offerIndex !== offerIndex) {
      this.clearDragPreview();
      return;
    }

    const cell = this.pickNearestPlaceableCellAtViewport(pointerX, pointerY);
    if (!cell) {
      this.clearDragPreview();
      return;
    }

    const didPlace = this.board.placeTerrain(cell, dragState.terrain);
    this.clearDragPreview();
    if (!didPlace) {
      return;
    }

    this.tileBag.selectOfferedTile(dragState.offerIndex);
    this.hasPlacedThisTurn = true;
    this.lastPlacedPosition = cell;
    await this.hud.animatePlacedTileClear(dragState.offerIndex);
    this.hud.setTileOffer(this.tileBag.getOfferState());
    this.syncHudActions();
    this.render();
  }

  private clearDragPreview() {
    this.dragGhost.dataset.visible = "false";
    this.board.setPlacementPreview(null);
  }

  private updateDragGhost(pointerX: number, pointerY: number) {
    const bounds = this.root.getBoundingClientRect();
    this.dragGhost.style.transform = `translate3d(${pointerX - bounds.left}px, ${pointerY - bounds.top}px, 0)`;
  }

  private pickNearestPlaceableCellAtViewport(viewportX: number, viewportY: number) {
    const bounds = this.renderer.domElement.getBoundingClientRect();
    if (
      viewportX < bounds.left ||
      viewportX > bounds.right ||
      viewportY < bounds.top ||
      viewportY > bounds.bottom
    ) {
      return null;
    }

    let bestCell: BoardPosition | null = null;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let column = 0; column < BOARD_SIZE; column += 1) {
        const position = { row, column };
        if (!this.board.canPlaceTerrain(position)) {
          continue;
        }

        const viewportPosition = this.projectWorldToViewport(
          boardToWorld(position).add(this.board.group.position).setY(0.94 + this.board.group.position.y),
          bounds
        );
        const distance = Math.hypot(viewportPosition.x - viewportX, viewportPosition.y - viewportY);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestCell = position;
        }
      }
    }

    return bestCell;
  }
  private updateScore() {
    this.resourceState = {
      ...this.resourceState,
      score: calculateScore(this.resourceState, this.board.getPlayerTiles().length)
    };
  }

  private async handleEndTurn() {
    if (!this.hasPlacedThisTurn) {
      return;
    }

    const resolution = resolveTurn(this.resourceState, {
      playerTiles: this.board.getPlayerTiles(),
      getOrthogonalNeighbors: (position) =>
        this.board.getOrthogonalNeighbors(position).map((neighbor) => neighbor?.tile ?? null),
      placedThisTurnPosition: this.lastPlacedPosition
    });

    this.resourceState = resolution.nextState;
    this.hud.setResources(this.resourceState);
    this.showResolutionFeedback(resolution.tileFeedback);

    this.hasPlacedThisTurn = false;
    this.lastPlacedPosition = null;

    const nextOffer = this.tileBag.drawOffer();
    this.hud.setTileOffer(nextOffer);
    this.syncHudActions();
  }

  private showResolutionFeedback(
    tileFeedback: Array<{
      position: BoardPosition;
      labels: string[];
    }>
  ) {
    const canvasBounds = this.renderer.domElement.getBoundingClientRect();
    const labels: FloatingHudLabel[] = [];

    for (const tile of tileFeedback) {
      const screenPosition = this.projectWorldToScreen(
        this.board.getTileWorldPosition(tile.position),
        canvasBounds
      );
      const baseDelay = 80 + Math.floor(Math.random() * 180);

      tile.labels.forEach((text, index) => {
        labels.push({
          text,
          x: screenPosition.x + (Math.random() * 16 - 8),
          y: screenPosition.y - 30 - index * 22,
          delayMs: baseDelay + index * 140 + Math.floor(Math.random() * 120)
        });
      });
    }

    this.hud.showFloatingLabels(labels);
  }

  private projectWorldToScreen(worldPosition: Vector3, bounds: DOMRect) {
    this.floatingProjection.copy(worldPosition).project(this.camera);
    return {
      x: ((this.floatingProjection.x + 1) / 2) * bounds.width,
      y: ((-this.floatingProjection.y + 1) / 2) * bounds.height
    };
  }

  private projectWorldToViewport(worldPosition: Vector3, bounds: DOMRect) {
    const screen = this.projectWorldToScreen(worldPosition, bounds);
    return {
      x: bounds.left + screen.x,
      y: bounds.top + screen.y
    };
  }

  private updateViewportHeight() {
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    this.root.style.setProperty("--app-height", `${viewportHeight}px`);
  }

  private isMobileLayout(viewportWidth: number) {
    return this.hasCoarsePointer || viewportWidth <= MOBILE_BREAKPOINT;
  }

  private startAnimationLoop() {
    const tick = (timestamp: number) => {
      if (this.board.update(timestamp)) {
        this.render();
      }

      this.animationFrameId = window.requestAnimationFrame(tick);
    };

    this.animationFrameId = window.requestAnimationFrame(tick);
  }
}
