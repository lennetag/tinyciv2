import type { Group } from "three";

export interface TileAnimationController {
  update: (elapsedMs: number) => boolean;
}

interface AnimatedTileUserData {
  animationController?: TileAnimationController;
}

export const setTileAnimationController = (
  tile: Group,
  animationController: TileAnimationController
) => {
  const userData = tile.userData as AnimatedTileUserData;
  userData.animationController = animationController;
};

export const getTileAnimationController = (tile: Group) =>
  (tile.userData as AnimatedTileUserData).animationController;
