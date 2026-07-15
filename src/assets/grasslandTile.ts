import { BoxGeometry, Group, Mesh } from "three";
import { palette } from "./materialPalette";
import { createTileBase } from "./tileScaffold";

const createRock = (x: number, z: number, scale: number) => {
  const rock = new Group();

  const base = new Mesh(
    new BoxGeometry(0.22 * scale, 0.14 * scale, 0.18 * scale),
    palette.grasslandRock
  );
  base.position.y = 0.38;
  rock.add(base);

  const cap = new Mesh(
    new BoxGeometry(0.14 * scale, 0.08 * scale, 0.12 * scale),
    palette.grasslandRockShade
  );
  cap.position.set(0.02, 0.46, -0.01);
  rock.add(cap);

  rock.position.set(x, 0, z);
  return rock;
};

const createTuft = (x: number, z: number, height: number) => {
  const tuft = new Mesh(new BoxGeometry(0.07, height, 0.07), palette.forestLeafB);
  tuft.position.set(x, 0.33 + height / 2, z);
  return tuft;
};

export const createGrasslandTile = () => {
  const tile = createTileBase(palette.grasslandDirt, palette.grasslandGrass);

  tile.add(createRock(-0.34, -0.14, 1));
  tile.add(createRock(0.26, 0.18, 0.78));
  tile.add(createTuft(-0.08, 0.34, 0.16));
  tile.add(createTuft(0.18, -0.28, 0.12));
  tile.add(createTuft(0.36, -0.18, 0.14));

  return tile;
};
