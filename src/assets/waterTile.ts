import { BoxGeometry, Group, Mesh } from "three";
import { palette } from "./materialPalette";
import { createTileBase } from "./tileScaffold";

const createWaterPatch = (x: number, z: number, width: number, depth: number, y: number) => {
  const patch = new Mesh(new BoxGeometry(width, 0.14, depth), palette.waterSurface);
  patch.position.set(x, y, z);
  return patch;
};

const createStone = (x: number, z: number, scale: number) => {
  const stone = new Mesh(
    new BoxGeometry(0.14 * scale, 0.1 * scale, 0.12 * scale),
    palette.waterSurfaceShade
  );
  stone.position.set(x, 0.42, z);
  return stone;
};

export const createWaterTile = () => {
  const tile = createTileBase(palette.waterDirt, palette.featureGrass, {
    topInset: 0.1,
    topHeight: 0.16
  });

  const bank = new Mesh(new BoxGeometry(1.02, 0.18, 0.98), palette.featureGrass);
  bank.position.y = 0.39;
  tile.add(bank);

  const water = new Group();
  water.add(createWaterPatch(-0.18, 0.06, 0.42, 0.34, 0.47));
  water.add(createWaterPatch(0.14, -0.04, 0.52, 0.38, 0.47));
  water.add(createWaterPatch(0.08, 0.18, 0.68, 0.24, 0.47));
  tile.add(water);

  tile.add(createStone(-0.34, 0.3, 1));
  tile.add(createStone(0.4, -0.26, 0.74));

  return tile;
};
