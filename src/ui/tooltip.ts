export interface TooltipStat {
  label: string;
  value: string;
}

export interface TooltipSection {
  title: string;
  lines: string[];
  emptyLabel?: string;
}

export interface TooltipContent {
  title: string;
  stats: TooltipStat[];
  sections: TooltipSection[];
}

export interface TooltipAction {
  label: string;
}

interface TooltipCallbacks {
  onAction: () => void;
  onClose: () => void;
}

export class TooltipView {
  private readonly container: HTMLElement;
  private readonly element: HTMLDivElement;
  private readonly header: HTMLDivElement;
  private readonly title: HTMLHeadingElement;
  private readonly actionButton: HTMLButtonElement;
  private readonly closeButton: HTMLButtonElement;
  private readonly stats: HTMLDivElement;
  private readonly sections: HTMLDivElement;

  constructor(container: HTMLElement, private readonly callbacks: TooltipCallbacks) {
    this.container = container;
    this.element = document.createElement("div");
    this.element.className = "hud__tooltip";
    this.element.setAttribute("aria-hidden", "true");

    this.header = document.createElement("div");
    this.header.className = "hud__tooltip-header";

    this.title = document.createElement("h3");
    this.title.className = "hud__tooltip-title";

    const controls = document.createElement("div");
    controls.className = "hud__tooltip-controls";

    this.actionButton = document.createElement("button");
    this.actionButton.className = "hud__tooltip-action";
    this.actionButton.type = "button";
    this.actionButton.addEventListener("click", () => this.callbacks.onAction());

    this.closeButton = document.createElement("button");
    this.closeButton.className = "hud__tooltip-close";
    this.closeButton.type = "button";
    this.closeButton.setAttribute("aria-label", "Close tooltip");
    this.closeButton.textContent = "X";
    this.closeButton.addEventListener("click", () => this.callbacks.onClose());

    controls.append(this.actionButton, this.closeButton);
    this.header.append(this.title, controls);

    this.stats = document.createElement("div");
    this.stats.className = "hud__tooltip-stats";

    this.sections = document.createElement("div");
    this.sections.className = "hud__tooltip-sections";

    this.element.append(this.header, this.stats, this.sections);
    container.append(this.element);
  }

  show(content: TooltipContent, x: number, y: number, action: TooltipAction | null) {
    this.title.textContent = content.title;
    this.actionButton.hidden = !action;
    this.actionButton.disabled = !action;
    this.actionButton.textContent = action?.label ?? "Open Wiki";
    this.stats.replaceChildren(...content.stats.map((stat) => this.createStat(stat)));
    this.sections.replaceChildren(...content.sections.map((section) => this.createSection(section)));
    this.reposition(x, y);
    this.element.dataset.visible = "true";
    this.element.setAttribute("aria-hidden", "false");
  }

  reposition(x: number, y: number) {
    const horizontalPadding = 12;
    const verticalPadding = 12;
    const maxX = Math.max(
      horizontalPadding,
      this.container.clientWidth - this.element.offsetWidth - horizontalPadding
    );
    const clampedX = Math.min(Math.max(x - this.element.offsetWidth / 2, horizontalPadding), maxX);
    const preferredTop = y - this.element.offsetHeight - 12;
    const placeBelow = preferredTop < verticalPadding;
    const tooltipTop = placeBelow
      ? Math.min(y + 18, this.container.clientHeight - this.element.offsetHeight - verticalPadding)
      : preferredTop;

    this.element.dataset.placement = placeBelow ? "below" : "above";
    this.element.style.transform = `translate3d(${clampedX}px, ${tooltipTop}px, 0)`;
  }

  hide() {
    this.element.dataset.visible = "false";
    this.element.setAttribute("aria-hidden", "true");
  }

  containsTarget(target: EventTarget | null) {
    return target instanceof Node && this.element.contains(target);
  }

  private createStat(stat: TooltipStat) {
    const element = document.createElement("div");
    element.className = "hud__tooltip-stat";

    const label = document.createElement("span");
    label.className = "hud__tooltip-stat-label";
    label.textContent = stat.label;

    const value = document.createElement("span");
    value.className = "hud__tooltip-stat-value";
    value.textContent = stat.value;

    element.append(label, value);
    return element;
  }

  private createSection(section: TooltipSection) {
    const element = document.createElement("section");
    element.className = "hud__tooltip-section";

    const title = document.createElement("h4");
    title.className = "hud__tooltip-section-title";
    title.textContent = section.title;

    const list = document.createElement("div");
    list.className = "hud__tooltip-list";

    const lines = section.lines.length > 0 ? section.lines : [section.emptyLabel ?? "None"];
    for (const line of lines) {
      const item = document.createElement("p");
      item.className = "hud__tooltip-line";
      item.textContent = line;
      list.append(item);
    }

    element.append(title, list);
    return element;
  }
}
