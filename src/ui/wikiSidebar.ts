import type { TileType } from "../game/types";
import type { TileWikiPage, TileWikiSynergy } from "../systems/tileWiki";
import { WikiTilePreview } from "./wikiTilePreview";

const synergyFamilyTitles: Record<TileWikiSynergy["family"], string> = {
  gold: "Related to Gold",
  harmony: "Related to Harmony",
  population: "Related to Population",
  other: "Other"
};

const createSynergyDescription = (synergy: TileWikiSynergy) => {
  if (synergy.direction === "benefitsSelf") {
    return {
      prefix: "Adjacent ",
      suffix: ` grants this tile ${synergy.effect}.`
    };
  }

  return {
    prefix: "Adjacent ",
    suffix: ` gains ${synergy.effect} from this tile.`
  };
};

export class WikiSidebarView {
  readonly element: HTMLElement;

  private readonly title: HTMLHeadingElement;
  private readonly emptyState: HTMLParagraphElement;
  private readonly synergyGroups: HTMLDivElement;
  private readonly preview: WikiTilePreview;

  constructor(
    private readonly onNavigate: (tileType: TileType) => void,
    private readonly onClose: () => void
  ) {
    this.element = document.createElement("aside");
    this.element.className = "hud__wiki";
    this.element.setAttribute("aria-hidden", "true");

    const header = document.createElement("div");
    header.className = "hud__wiki-header";

    const titleWrap = document.createElement("div");
    titleWrap.className = "hud__wiki-heading";

    const eyebrow = document.createElement("p");
    eyebrow.className = "hud__wiki-eyebrow";
    eyebrow.textContent = "Settlement Wiki";

    this.title = document.createElement("h2");
    this.title.className = "hud__wiki-title";

    titleWrap.append(eyebrow, this.title);

    const closeButton = document.createElement("button");
    closeButton.className = "hud__wiki-close";
    closeButton.type = "button";
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", () => this.onClose());

    header.append(titleWrap, closeButton);

    this.preview = new WikiTilePreview();

    const section = document.createElement("section");
    section.className = "hud__wiki-section";

    const sectionTitle = document.createElement("h3");
    sectionTitle.className = "hud__wiki-section-title";
    sectionTitle.textContent = "Potential Synergies";

    this.emptyState = document.createElement("p");
    this.emptyState.className = "hud__wiki-empty";
    this.emptyState.textContent = "No linked tile synergies are defined for this page yet.";

    this.synergyGroups = document.createElement("div");
    this.synergyGroups.className = "hud__wiki-groups";

    section.append(sectionTitle, this.emptyState, this.synergyGroups);
    this.element.append(header, this.preview.element, section);
  }

  open(page: TileWikiPage) {
    this.render(page);
    this.element.dataset.open = "true";
    this.element.setAttribute("aria-hidden", "false");
  }

  close() {
    this.element.dataset.open = "false";
    this.element.setAttribute("aria-hidden", "true");
  }

  dispose() {
    this.preview.dispose();
  }

  private render(page: TileWikiPage) {
    this.title.textContent = page.title;
    this.preview.setTile(page.tileType);
    this.synergyGroups.replaceChildren();

    if (page.synergies.length === 0) {
      this.emptyState.hidden = false;
      return;
    }

    this.emptyState.hidden = true;

    const familyOrder: TileWikiSynergy["family"][] = ["gold", "harmony", "population", "other"];

    for (const family of familyOrder) {
      const familySynergies = page.synergies.filter((synergy) => synergy.family === family);
      if (familySynergies.length === 0) {
        continue;
      }

      const group = document.createElement("section");
      group.className = "hud__wiki-group";

      const groupTitle = document.createElement("h4");
      groupTitle.className = "hud__wiki-group-title";
      groupTitle.textContent = synergyFamilyTitles[family];

      const list = document.createElement("ul");
      list.className = "hud__wiki-list";

      for (const synergy of familySynergies) {
        const item = document.createElement("li");
        item.className = "hud__wiki-item";

        const text = createSynergyDescription(synergy);
        item.append(text.prefix);

        const link = document.createElement("a");
        link.className = "hud__wiki-link";
        link.href = "#";
        link.textContent = synergy.targetLabel;
        link.addEventListener("click", (event) => {
          event.preventDefault();
          this.onNavigate(synergy.targetType);
        });

        item.append(link, text.suffix);
        list.append(item);
      }

      group.append(groupTitle, list);
      this.synergyGroups.append(group);
    }
  }
}
