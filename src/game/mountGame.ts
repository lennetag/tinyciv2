import { GameApp } from "./GameApp";

export const mountGame = (root: HTMLDivElement | null) => {
  if (!root) {
    throw new Error("Expected #app root element to mount the game.");
  }

  root.className = "app-shell";
  const game = new GameApp(root);

  window.addEventListener("beforeunload", () => game.dispose(), { once: true });
};
