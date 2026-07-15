import { BoxGeometry, Group, Mesh } from "three";
import { palette } from "./materialPalette";
import { createTileBase } from "./tileScaffold";

const createDune = (x: number, z: number, width: number, height: number, depth: number) => {
  const dune = new Mesh(new BoxGeometry(width, height, depth), palette.desertSandShade);
  dune.position.set(x, 0.34 + height / 2, z);
  return dune;
};

const createDesertRock = (x: number, z: number, scale: number) => {
  const rock = new Group();

  const base = new Mesh(
    new BoxGeometry(0.16 * scale, 0.16 * scale, 0.14 * scale),
    palette.desertRock
  );
  base.position.y = 0.42;
  rock.add(base);

  const top = new Mesh(
    new BoxGeometry(0.1 * scale, 0.06 * scale, 0.08 * scale),
    palette.desertSandShade
  );
  top.position.set(0.02, 0.51, 0);
  rock.add(top);

  rock.position.set(x, 0, z);
  return rock;
};

export const createDesertTile = () => {
  const tile = createTileBase(palette.desertDirt, palette.desertSand);

  tile.add(createDune(-0.16, -0.04, 0.64, 0.16, 0.42));
  tile.add(createDune(0.18, 0.18, 0.46, 0.12, 0.34));
  tile.add(createDune(0.34, -0.24, 0.28, 0.1, 0.22));
  tile.add(createDesertRock(-0.32, 0.26, 1));
  tile.add(createDesertRock(0.08, -0.34, 0.78));

  return tile;
};
