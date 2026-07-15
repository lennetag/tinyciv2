import { Group } from "three";
import { palette } from "./materialPalette";
import {
  addBox,
  createCrate,
  createPost,
} from "./settlementDetailHelpers";
import { createTileBase } from "./tileScaffold";

const createTower = (x: number, z: number) => {
  const tower = new Group();
  addBox(tower, [0.22, 0.56, 0.22], [0, 0.66, 0], palette.settlementStoneShade);
  addBox(tower, [0.28, 0.12, 0.28], [0, 1, 0], palette.settlementStone);
  addBox(tower, [0.16, 0.14, 0.04], [0, 0.66, 0.12], palette.settlementStone);

  tower.position.set(x, 0, z);
  return tower;
};

export const createBarracksTile = () => {
  const tile = createTileBase(palette.settlementDirt, palette.settlementGrass);
  const barracks = new Group();
  tile.add(barracks);

  addBox(barracks, [0.98, 0.08, 0.84], [0.02, 0.43, -0.02], palette.settlementDirt);
  addBox(barracks, [0.84, 0.44, 0.74], [0.02, 0.61, -0.02], palette.settlementStoneShade);
  addBox(barracks, [0.56, 0.22, 0.34], [0.04, 0.85, -0.1], palette.settlementStone);
  addBox(barracks, [0.24, 0.1, 0.2], [0.02, 0.43, 0.42], palette.settlementStone);
  addBox(barracks, [0.18, 0.26, 0.08], [0.02, 0.55, 0.31], palette.settlementWoodShade);

  barracks.add(createTower(-0.3, -0.24));
  barracks.add(createTower(0.34, -0.24));

  addBox(barracks, [0.74, 0.12, 0.06], [0.02, 0.78, 0.28], palette.settlementStone);

  const rack = new Group();
  rack.position.set(-0.44, 0.43, 0.22);
  rack.add(createPost([0, 0, 0], 0.28));
  rack.add(createPost([0.18, 0, 0.02], 0.26));
  addBox(rack, [0.22, 0.03, 0.03], [0.09, 0.18, 0.01], palette.settlementWoodShade);
  addBox(rack, [0.03, 0.22, 0.03], [0.04, 0.16, -0.02], palette.settlementWood, [0, 0, 0.1]);
  addBox(rack, [0.08, 0.03, 0.03], [0.04, 0.27, -0.02], palette.settlementStoneShade, [0, 0, 0.1]);
  addBox(rack, [0.03, 0.18, 0.03], [0.14, 0.13, 0.04], palette.settlementWood, [0, 0, -0.12]);
  barracks.add(rack);

  const dummy = new Group();
  dummy.position.set(0.42, 0.43, 0.3);
  dummy.add(createPost([0, 0, 0], 0.38));
  addBox(dummy, [0.22, 0.04, 0.04], [0, 0.22, 0], palette.settlementWoodShade);
  addBox(dummy, [0.12, 0.16, 0.12], [0, 0.28, 0], palette.settlementCanvas);
  barracks.add(dummy);

  const supplyCrate = createCrate(0.74);
  supplyCrate.position.set(0.46, 0.49, -0.34);
  barracks.add(supplyCrate);

  addBox(barracks, [0.025, 0.48, 0.025], [0.18, 1.08, -0.04], palette.settlementWoodShade);
  addBox(barracks, [0.18, 0.12, 0.04], [0.28, 1.12, -0.04], palette.settlementBanner);
  addBox(barracks, [0.22, 0.02, 0.14], [-0.45, 0.41, -0.28], palette.settlementPath, [0, 0.26, 0]);

  return tile;
};
