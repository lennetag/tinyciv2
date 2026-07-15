import {
  BoxGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  SphereGeometry
} from "three";
import { TILE_HEIGHT } from "../game/constants";
import { palette } from "./materialPalette";

const createTree = (x: number, z: number, scale: number) => {
  const tree = new Group();

  const trunk = new Mesh(new CylinderGeometry(0.07, 0.09, 0.5, 6), palette.forestTrunk);
  trunk.position.y = TILE_HEIGHT + 0.28;
  tree.add(trunk);

  const canopy = new Mesh(new SphereGeometry(0.28 * scale, 7, 6), palette.forestLeafA);
  canopy.scale.set(0.9, 1.2, 0.9);
  canopy.position.y = TILE_HEIGHT + 0.7 * scale;
  canopy.position.x = -0.02;
  tree.add(canopy);

  const canopyTop = new Mesh(new SphereGeometry(0.2 * scale, 7, 6), palette.forestLeafB);
  canopyTop.scale.set(0.82, 1.05, 0.82);
  canopyTop.position.y = TILE_HEIGHT + 0.98 * scale;
  canopyTop.position.x = 0.04;
  tree.add(canopyTop);

  tree.position.set(x, 0, z);
  return tree;
};

export const createForestTile = () => {
  const tile = new Group();

  const base = new Mesh(new BoxGeometry(1.75, TILE_HEIGHT, 1.75), palette.forestDirt);
  base.position.y = TILE_HEIGHT / 2;
  tile.add(base);

  const grass = new Mesh(new BoxGeometry(1.68, 0.18, 1.68), palette.forestGrass);
  grass.position.y = TILE_HEIGHT + 0.02;
  tile.add(grass);

  tile.add(createTree(-0.35, -0.18, 1.2));
  tile.add(createTree(0.15, 0.08, 1.05));
  tile.add(createTree(0.42, -0.32, 0.9));
  tile.add(createTree(-0.05, 0.38, 0.82));

  return tile;
};
