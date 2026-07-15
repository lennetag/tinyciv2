import { BoxGeometry, Group, Mesh } from "three";
import { palette } from "./materialPalette";
import { createTileBase } from "./tileScaffold";

const createTent = (x: number, z: number, width: number, depth: number, height: number) => {
  const tent = new Group();

  const base = new Mesh(new BoxGeometry(width, height * 0.55, depth), palette.settlementCanvas);
  base.position.y = 0.42 + height * 0.28;
  tent.add(base);

  const ridge = new Mesh(
    new BoxGeometry(width * 0.52, height * 0.18, depth * 0.72),
    palette.settlementRoofRed
  );
  ridge.position.y = 0.42 + height * 0.66;
  tent.add(ridge);

  tent.position.set(x, 0, z);
  return tent;
};

const createStake = (x: number, z: number, scale = 1) => {
  const stake = new Mesh(
    new BoxGeometry(0.06 * scale, 0.34 * scale, 0.06 * scale),
    palette.settlementWoodShade
  );
  stake.position.set(x, 0.5, z);
  return stake;
};

const createCampfire = () => {
  const fire = new Group();

  const ember = new Mesh(new BoxGeometry(0.18, 0.08, 0.18), palette.settlementRoofGold);
  ember.position.y = 0.42;
  fire.add(ember);

  const spark = new Mesh(new BoxGeometry(0.08, 0.18, 0.08), palette.settlementRoofRed);
  spark.position.y = 0.55;
  fire.add(spark);

  return fire;
};

export const createEnemyCampTile = () => {
  const tile = createTileBase(palette.forestDirt, palette.featureGrass);

  tile.add(createTent(-0.2, 0.04, 0.52, 0.36, 0.42));
  tile.add(createTent(0.24, -0.18, 0.44, 0.32, 0.34));
  tile.add(createCampfire());

  tile.add(createStake(-0.54, -0.46, 1.1));
  tile.add(createStake(-0.54, 0.44));
  tile.add(createStake(0.56, -0.38));
  tile.add(createStake(0.54, 0.46, 1.05));

  return tile;
};
