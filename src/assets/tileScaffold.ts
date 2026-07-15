import { BoxGeometry, Group, Mesh } from "three";
import { TILE_HEIGHT } from "../game/constants";
import type { MeshStandardMaterial } from "three";

interface TileBaseOptions {
  topInset?: number;
  topHeight?: number;
}

export const createTileBase = (
  sideMaterial: MeshStandardMaterial,
  topMaterial: MeshStandardMaterial,
  options: TileBaseOptions = {}
) => {
  const tile = new Group();
  const topInset = options.topInset ?? 0.07;
  const topHeight = options.topHeight ?? 0.18;

  const base = new Mesh(new BoxGeometry(1.75, TILE_HEIGHT, 1.75), sideMaterial);
  base.position.y = TILE_HEIGHT / 2;
  tile.add(base);

  const top = new Mesh(
    new BoxGeometry(1.75 - topInset, topHeight, 1.75 - topInset),
    topMaterial
  );
  top.position.y = TILE_HEIGHT + topHeight / 2 - 0.03;
  tile.add(top);

  return tile;
};
