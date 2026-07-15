import type { TerrainType } from "../game/types";
import { terrainDefinitions } from "../assets/terrainTiles";
import type { TileOfferState } from "../systems/tileBag";
import type { ResourceState } from "../systems/turnResolution";
import type { TileWikiPage } from "../systems/tileWiki";
import { TileThumbnailView } from "./tileThumbnail";
import {
  TooltipView,
  type TooltipAction,
  type TooltipContent
} from "./tooltip";
import { WikiSidebarView } from "./wikiSidebar";

interface HudElements {
  root: HTMLDivElement;
  bagCount: HTMLSpanElement;
  offerTray: HTMLDivElement;
  rerollButton: HTMLButtonElement;
  endTurnButton: HTMLButtonElement;
  goldValue: HTMLSpanElement;
  harmonyValue: HTMLSpanElement;
  populationValue: HTMLSpanElement;
  turnValue: HTMLSpanElement;
  scoreValue: HTMLSpanElement;
  floatingLayer: HTMLDivElement;
}

export interface FloatingHudLabel {
  text: string;
  x: number;
  y: number;
  delayMs?: number;
}

interface HudButtonState {
  canReroll: boolean;
  canEndTurn: boolean;
}

interface DragGesture {
  index: number;
  pointerId: number;
  originCard: HTMLDivElement;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  moved: boolean;
}

interface OfferCardElements {
  card: HTMLDivElement;
  button: HTMLButtonElement;
  thumbnail: TileThumbnailView;
}

interface HudCallbacks {
  onOfferClick: (offerIndex: number, anchorElement: HTMLElement) => void;
  onOfferDragStart: (offerIndex: number, pointerX: number, pointerY: number, anchorElement: HTMLElement) => void;
  onOfferDragMove: (offerIndex: number, pointerX: number, pointerY: number) => void;
  onOfferDragEnd: (offerIndex: number, pointerX: number, pointerY: number) => void;
  onReroll: () => void;
  onEndTurn: () => void;
  onTooltipWiki: () => void;
  onTooltipClose: () => void;
  onWikiNavigate: (page: TileWikiPage["tileType"]) => void;
  onWikiClose: () => void;
}

const DRAG_THRESHOLD_PX = 10;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const createStatChip = (label: string, valueClassName: string) => {
  const chip = document.createElement("div");
  chip.className = "hud__chip";

  const chipLabel = document.createElement("span");
  chipLabel.className = "hud__chip-label";
  chipLabel.textContent = label;

  const chipValue = document.createElement("span");
  chipValue.className = valueClassName;

  chip.append(chipLabel, chipValue);
  return { chip, value: chipValue };
};

const createHudMarkup = (): HudElements => {
  const root = document.createElement("div");
  root.className = "hud";

  const topRow = document.createElement("div");
  topRow.className = "hud__top-row";

  const resources = document.createElement("section");
  resources.className = "hud__cluster hud__cluster--resources";

  const gold = createStatChip("Gold", "hud__chip-value");
  const harmony = createStatChip("Harmony", "hud__chip-value");
  const population = createStatChip("Population", "hud__chip-value");
  resources.append(gold.chip, harmony.chip, population.chip);

  const scorePanel = document.createElement("section");
  scorePanel.className = "hud__cluster hud__cluster--score";

  const turn = createStatChip("Turn", "hud__chip-value");
  const score = createStatChip("Score", "hud__chip-value");
  scorePanel.append(turn.chip, score.chip);

  topRow.append(resources, scorePanel);

  const floatingLayer = document.createElement("div");
  floatingLayer.className = "hud__floating-layer";
  floatingLayer.setAttribute("aria-hidden", "true");

  const bottomRow = document.createElement("div");
  bottomRow.className = "hud__bottom-row";

  const tray = document.createElement("section");
  tray.className = "hud__bottom-tray";

  const bag = document.createElement("div");
  bag.className = "hud__bag";
  bag.setAttribute("aria-label", "Tile bag");

  const bagIcon = document.createElement("span");
  bagIcon.className = "hud__bag-icon";
  bagIcon.setAttribute("aria-hidden", "true");

  const bagMeta = document.createElement("div");
  bagMeta.className = "hud__bag-meta";

  const bagLabel = document.createElement("span");
  bagLabel.className = "hud__bag-label";
  bagLabel.textContent = "Bag";

  const bagCount = document.createElement("span");
  bagCount.className = "hud__bag-count";

  bagMeta.append(bagLabel, bagCount);
  bag.append(bagIcon, bagMeta);

  const offerTray = document.createElement("div");
  offerTray.className = "hud__offer-tray";

  const trayActions = document.createElement("div");
  trayActions.className = "hud__tray-actions";

  const rerollButton = document.createElement("button");
  rerollButton.className = "hud__reroll-button";
  rerollButton.type = "button";
  rerollButton.textContent = "Reroll · 5 Gold";

  trayActions.append(rerollButton);
  tray.append(bag, offerTray, trayActions);

  const endTurnButton = document.createElement("button");
  endTurnButton.className = "hud__end-turn-button";
  endTurnButton.type = "button";
  endTurnButton.textContent = "End Turn";

  bottomRow.append(tray, endTurnButton);
  root.append(topRow, floatingLayer, bottomRow);

  return {
    root,
    bagCount,
    offerTray,
    rerollButton,
    endTurnButton,
    goldValue: gold.value,
    harmonyValue: harmony.value,
    populationValue: population.value,
    turnValue: turn.value,
    scoreValue: score.value,
    floatingLayer
  };
};

export class HudView {
  readonly root: HTMLDivElement;
  private readonly offerTray: HTMLDivElement;
  private readonly rerollButton: HTMLButtonElement;
  private readonly endTurnButton: HTMLButtonElement;
  private readonly bagCount: HTMLSpanElement;
  private readonly goldValue: HTMLSpanElement;
  private readonly harmonyValue: HTMLSpanElement;
  private readonly populationValue: HTMLSpanElement;
  private readonly turnValue: HTMLSpanElement;
  private readonly scoreValue: HTMLSpanElement;
  private readonly floatingLayer: HTMLDivElement;
  private readonly tooltip: TooltipView;
  private readonly wikiSidebar: WikiSidebarView;
  private readonly offerCards: OfferCardElements[] = [];
  private currentOfferedTiles: TerrainType[] = [];
  private activeDrag: DragGesture | null = null;
  private isLocked = false;

  constructor(container: HTMLElement, private readonly callbacks: HudCallbacks) {
    const elements = createHudMarkup();
    this.root = elements.root;
    this.offerTray = elements.offerTray;
    this.rerollButton = elements.rerollButton;
    this.endTurnButton = elements.endTurnButton;
    this.bagCount = elements.bagCount;
    this.goldValue = elements.goldValue;
    this.harmonyValue = elements.harmonyValue;
    this.populationValue = elements.populationValue;
    this.turnValue = elements.turnValue;
    this.scoreValue = elements.scoreValue;
    this.floatingLayer = elements.floatingLayer;
    this.tooltip = new TooltipView(this.root, {
      onAction: () => this.callbacks.onTooltipWiki(),
      onClose: () => this.callbacks.onTooltipClose()
    });
    this.wikiSidebar = new WikiSidebarView(this.callbacks.onWikiNavigate, this.callbacks.onWikiClose);

    this.rerollButton.addEventListener("click", () => {
      if (!this.isLocked && this.currentOfferedTiles.length > 0) {
        this.callbacks.onReroll();
      }
    });

    this.endTurnButton.addEventListener("click", () => {
      if (!this.isLocked) {
        this.callbacks.onEndTurn();
      }
    });

    container.append(this.root, this.wikiSidebar.element);
  }

  setTileOffer(offerState: TileOfferState) {
    this.disposeOfferCards();
    this.currentOfferedTiles = [...offerState.offeredTiles];
    this.offerTray.replaceChildren();

    for (const [index, terrain] of this.currentOfferedTiles.entries()) {
      const card = document.createElement("div");
      card.className = "hud__offer-card";
      card.dataset.terrain = terrain;

      const button = document.createElement("button");
      button.className = "hud__tile-button";
      button.type = "button";
      button.dataset.terrain = terrain;

      const thumbnail = new TileThumbnailView();
      thumbnail.setTile(terrain);

      const label = document.createElement("span");
      label.className = "hud__tile-button-label";
      label.textContent = terrainDefinitions[terrain].label;

      button.append(thumbnail.element, label);
      card.append(button);
      this.offerTray.append(card);
      this.offerCards.push({ card, button, thumbnail });

      button.addEventListener("pointerdown", (event) => {
        if (this.isLocked) {
          return;
        }

        event.preventDefault();
        this.beginOfferGesture(index, card, event);
      });
    }

    this.bagCount.textContent = `${offerState.remainingInBag}/${offerState.totalTiles}`;
    this.isLocked = false;
    this.updateActionState({
      canReroll: true,
      canEndTurn: false
    });
  }

  setResources(resourceState: ResourceState) {
    this.goldValue.textContent = `${resourceState.gold}`;
    this.harmonyValue.textContent = `${resourceState.harmony}`;
    this.populationValue.textContent = `${resourceState.population}`;
    this.turnValue.textContent = `${resourceState.turn}`;
    this.scoreValue.textContent = `${resourceState.score}`;
  }

  setActionState(nextState: HudButtonState) {
    this.updateActionState(nextState);
  }

  async animatePlacedTileClear(selectedIndex: number) {
    const selectedCard = this.offerCards[selectedIndex]?.card;
    if (!selectedCard) {
      return;
    }

    if (prefersReducedMotion()) {
      selectedCard.style.opacity = "0";
      return;
    }

    await selectedCard
      .animate(
        [
          { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
          { transform: "translate3d(0, -18px, 0) scale(0.92)", opacity: 0 }
        ],
        {
          duration: 220,
          easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
          fill: "forwards"
        }
      )
      .finished.catch(() => undefined);
  }

  showFloatingLabels(labels: FloatingHudLabel[]) {
    for (const label of labels) {
      const element = document.createElement("span");
      element.className = "hud__floating-label";
      element.textContent = label.text;
      element.style.left = `${label.x}px`;
      element.style.top = `${label.y}px`;
      this.floatingLayer.append(element);

      if (prefersReducedMotion()) {
        window.setTimeout(() => element.remove(), 1200 + (label.delayMs ?? 0));
        continue;
      }

      element
        .animate(
          [
            { transform: "translate(-50%, -10px) scale(0.94)", opacity: 0 },
            { transform: "translate(-50%, -28px) scale(1)", opacity: 1, offset: 0.16 },
            { transform: "translate(-50%, -92px) scale(1.04)", opacity: 0 }
          ],
          {
            duration: 1800,
            delay: label.delayMs ?? 0,
            easing: "cubic-bezier(0.18, 0.84, 0.24, 1)",
            fill: "forwards"
          }
        )
        .finished.then(() => element.remove())
        .catch(() => element.remove());
    }
  }

  showTooltip(content: TooltipContent, viewportX: number, viewportY: number, action?: TooltipAction | null) {
    const bounds = this.root.getBoundingClientRect();
    this.tooltip.show(content, viewportX - bounds.left, viewportY - bounds.top, action ?? null);
  }

  updateTooltipPosition(viewportX: number, viewportY: number) {
    const bounds = this.root.getBoundingClientRect();
    this.tooltip.reposition(viewportX - bounds.left, viewportY - bounds.top);
  }

  hideTooltip() {
    this.tooltip.hide();
  }

  containsTooltipTarget(target: EventTarget | null) {
    return this.tooltip.containsTarget(target);
  }

  openWiki(page: TileWikiPage) {
    this.wikiSidebar.open(page);
  }

  closeWiki() {
    this.wikiSidebar.close();
  }

  dispose() {
    this.cleanupActiveDrag();
    this.disposeOfferCards();
    this.wikiSidebar.dispose();
  }

  private updateActionState(nextState: HudButtonState) {
    for (const { button } of this.offerCards) {
      button.disabled = this.isLocked;
    }

    this.rerollButton.disabled =
      this.isLocked || !nextState.canReroll || this.offerCards.length === 0;
    this.endTurnButton.disabled = this.isLocked || !nextState.canEndTurn;
  }

  private beginOfferGesture(index: number, card: HTMLDivElement, event: PointerEvent) {
    this.activeDrag = {
      index,
      pointerId: event.pointerId,
      originCard: card,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      moved: false
    };

    card.dataset.dragging = "false";
    window.addEventListener("pointermove", this.handleGlobalPointerMove);
    window.addEventListener("pointerup", this.handleGlobalPointerUp);
    window.addEventListener("pointercancel", this.handleGlobalPointerCancel);
  }

  private readonly handleGlobalPointerMove = (event: PointerEvent) => {
    if (!this.activeDrag || event.pointerId !== this.activeDrag.pointerId) {
      return;
    }

    this.activeDrag.lastX = event.clientX;
    this.activeDrag.lastY = event.clientY;

    if (!this.activeDrag.moved) {
      const deltaX = event.clientX - this.activeDrag.startX;
      const deltaY = event.clientY - this.activeDrag.startY;
      if (Math.hypot(deltaX, deltaY) < DRAG_THRESHOLD_PX) {
        return;
      }

      this.activeDrag.moved = true;
      this.activeDrag.originCard.dataset.dragging = "true";
      this.callbacks.onOfferDragStart(
        this.activeDrag.index,
        event.clientX,
        event.clientY,
        this.activeDrag.originCard
      );
    }

    this.callbacks.onOfferDragMove(this.activeDrag.index, event.clientX, event.clientY);
  };

  private readonly handleGlobalPointerUp = (event: PointerEvent) => {
    if (!this.activeDrag || event.pointerId !== this.activeDrag.pointerId) {
      return;
    }

    const drag = this.activeDrag;
    this.cleanupActiveDrag();

    if (!drag.moved) {
      this.callbacks.onOfferClick(drag.index, drag.originCard);
      return;
    }

    this.callbacks.onOfferDragEnd(drag.index, event.clientX, event.clientY);
  };

  private readonly handleGlobalPointerCancel = (event: PointerEvent) => {
    if (!this.activeDrag || event.pointerId !== this.activeDrag.pointerId) {
      return;
    }

    const drag = this.activeDrag;
    this.cleanupActiveDrag();
    this.callbacks.onOfferDragEnd(drag.index, event.clientX, event.clientY);
  };

  private cleanupActiveDrag() {
    if (this.activeDrag) {
      this.activeDrag.originCard.dataset.dragging = "false";
    }

    this.activeDrag = null;
    window.removeEventListener("pointermove", this.handleGlobalPointerMove);
    window.removeEventListener("pointerup", this.handleGlobalPointerUp);
    window.removeEventListener("pointercancel", this.handleGlobalPointerCancel);
  }

  private disposeOfferCards() {
    for (const offerCard of this.offerCards) {
      offerCard.thumbnail.dispose();
    }
    this.offerCards.length = 0;
  }
}
