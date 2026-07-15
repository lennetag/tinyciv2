import { BoxGeometry, Group, Mesh } from "three";
import { palette } from "./materialPalette";
import { createTileBase } from "./tileScaffold";

const createHillLump = (width: number, height: number, depth: number, y: number) => {
  const lump = new Mesh(new BoxGeometry(width, height, depth), palette.hillGrass);
  lump.position.y = y;
  return lump;
};

const createStone = (x: number, z: number, scale: number) => {
  const stone = new Group();
  const base = new Mesh(
    new BoxGeometry(0.18 * scale, 0.18 * scale, 0.16 * scale),
    palette.hillStone
  );
  base.position.y = 0.52;
  stone.add(base);

  const cap = new Mesh(
    new BoxGeometry(0.1 * scale, 0.08 * scale, 0.1 * scale),
    palette.hillStoneShade
  );
  cap.position.set(0.02, 0.61, -0.02);
  stone.add(cap);

  stone.position.set(x, 0, z);
  return stone;
};

export const createHillTile = () => {
  const tile = createTileBase(palette.hillDirt, palette.hillGrass);

  tile.add(createHillLump(1.08, 0.22, 0.96, 0.44));
  tile.add(createHillLump(0.78, 0.18, 0.72, 0.58));
  tile.add(createStone(-0.12, 0.06, 1));
  tile.add(createStone(0.22, -0.18, 0.76));
  tile.add(createStone(-0.36, -0.22, 0.64));

  return tile;
};
