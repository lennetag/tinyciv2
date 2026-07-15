import {
  BoxGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  Object3D,
  SphereGeometry,
  type Material,
} from "three";
import { palette } from "./materialPalette";

type BoxRotation = [number, number, number];
type BoxPosition = [number, number, number];
type BoxSize = [number, number, number];

export const addBox = (
  parent: Object3D,
  size: BoxSize,
  position: BoxPosition,
  material: Material,
  rotation: BoxRotation = [0, 0, 0],
) => {
  const mesh = new Mesh(new BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  parent.add(mesh);
  return mesh;
};

export const createPost = (
  position: BoxPosition,
  height: number,
  material: Material = palette.settlementWoodShade,
  width = 0.055,
) => {
  const post = new Mesh(new BoxGeometry(width, height, width), material);
  post.position.set(position[0], position[1] + height / 2, position[2]);
  return post;
};

export const createCrate = (scale = 1) => {
  const crate = new Group();
  crate.scale.setScalar(scale);

  addBox(crate, [0.2, 0.16, 0.18], [0, 0, 0], palette.settlementWoodShade);
  addBox(crate, [0.21, 0.025, 0.025], [0, 0.055, -0.07], palette.settlementWood);
  addBox(crate, [0.21, 0.025, 0.025], [0, 0.055, 0.07], palette.settlementWood);
  addBox(crate, [0.025, 0.17, 0.025], [-0.08, 0, 0.07], palette.settlementWood);
  addBox(crate, [0.025, 0.17, 0.025], [0.08, 0, 0.07], palette.settlementWood);

  return crate;
};

export const createBarrel = (scale = 1) => {
  const barrel = new Group();
  barrel.scale.setScalar(scale);

  const body = new Mesh(
    new CylinderGeometry(0.075, 0.082, 0.14, 8),
    palette.settlementWood,
  );
  barrel.add(body);

  addBox(barrel, [0.16, 0.022, 0.022], [0, 0.045, 0], palette.settlementWoodShade);
  addBox(barrel, [0.16, 0.022, 0.022], [0, -0.045, 0], palette.settlementWoodShade);

  return barrel;
};

export const createBasket = (scale = 1) => {
  const basket = new Group();
  basket.scale.setScalar(scale);

  const body = new Mesh(
    new CylinderGeometry(0.08, 0.065, 0.1, 8),
    palette.settlementWoodShade,
  );
  basket.add(body);

  addBox(basket, [0.025, 0.11, 0.025], [-0.065, 0.075, 0], palette.settlementWood);
  addBox(basket, [0.025, 0.11, 0.025], [0.065, 0.075, 0], palette.settlementWood);
  addBox(basket, [0.15, 0.025, 0.025], [0, 0.125, 0], palette.settlementWood);

  return basket;
};

export const createProducePile = (
  material: Material = palette.settlementCropGold,
  scale = 1,
) => {
  const pile = new Group();
  pile.scale.setScalar(scale);

  const positions: BoxPosition[] = [
    [-0.045, 0, -0.025],
    [0.04, 0, -0.035],
    [-0.015, 0.015, 0.035],
    [0.055, 0.012, 0.04],
    [0.005, 0.06, 0],
  ];

  for (const position of positions) {
    const produce = new Mesh(new SphereGeometry(0.045, 6, 4), material);
    produce.position.set(...position);
    produce.scale.y = 0.8;
    pile.add(produce);
  }

  return pile;
};

export const createBench = (scale = 1) => {
  const bench = new Group();
  bench.scale.setScalar(scale);

  addBox(bench, [0.26, 0.04, 0.1], [0, 0.08, 0], palette.settlementWood);
  addBox(bench, [0.26, 0.04, 0.04], [0, 0.18, -0.03], palette.settlementWood);
  addBox(bench, [0.04, 0.16, 0.04], [-0.08, 0, 0], palette.settlementWoodShade);
  addBox(bench, [0.04, 0.16, 0.04], [0.08, 0, 0], palette.settlementWoodShade);

  return bench;
};

export const createChimney = (scale = 1) => {
  const chimney = new Group();
  chimney.scale.setScalar(scale);

  addBox(chimney, [0.14, 0.28, 0.14], [0, 0, 0], palette.settlementStoneShade);
  addBox(chimney, [0.18, 0.05, 0.18], [0, 0.16, 0], palette.settlementStone);

  return chimney;
};

export const createSign = (
  boardMaterial: Material,
  accentMaterial: Material,
  scale = 1,
) => {
  const sign = new Group();
  sign.scale.setScalar(scale);

  addBox(sign, [0.22, 0.13, 0.025], [0, 0, 0], boardMaterial);
  addBox(sign, [0.025, 0.18, 0.025], [0, -0.14, 0], palette.settlementWoodShade);
  addBox(sign, [0.12, 0.025, 0.03], [0, 0.015, 0.016], accentMaterial);

  return sign;
};
