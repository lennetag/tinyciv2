import { Group } from "three";
import { palette } from "./materialPalette";
import {
  addBox,
  createPost,
} from "./settlementDetailHelpers";
import { createTileBase } from "./tileScaffold";

const createColumn = (x: number, z: number) => {
  const column = new Group();
  addBox(column, [0.1, 0.4, 0.1], [x, 0.58, z], palette.settlementStone);
  addBox(column, [0.13, 0.05, 0.13], [x, 0.33, z], palette.settlementStoneShade);
  addBox(column, [0.13, 0.05, 0.13], [x, 0.83, z], palette.settlementStoneShade);
  return column;
};

export const createTempleTile = () => {
  const tile = createTileBase(palette.settlementDirt, palette.settlementGrass);
  const temple = new Group();
  tile.add(temple);

  addBox(temple, [1.02, 0.08, 0.92], [0, 0.39, -0.02], palette.settlementPath);
  addBox(temple, [0.96, 0.18, 0.84], [0, 0.48, -0.02], palette.settlementStoneShade);
  addBox(temple, [0.74, 0.1, 0.58], [0, 0.63, -0.05], palette.settlementStone);
  addBox(temple, [0.62, 0.42, 0.5], [0, 0.86, -0.04], palette.settlementStone);
  addBox(temple, [0.8, 0.14, 0.68], [0, 1.13, -0.04], palette.settlementRoofGold);
  addBox(temple, [0.54, 0.08, 0.4], [0, 1.24, -0.04], palette.settlementRoofGold);

  temple.add(createColumn(-0.24, 0.18));
  temple.add(createColumn(0, 0.2));
  temple.add(createColumn(0.24, 0.18));

  addBox(temple, [0.3, 0.06, 0.16], [0, 0.43, 0.33], palette.settlementStone);
  addBox(temple, [0.22, 0.06, 0.12], [0, 0.49, 0.24], palette.settlementStone);
  addBox(temple, [0.18, 0.16, 0.18], [0, 0.66, -0.08], palette.settlementWater);
  addBox(temple, [0.14, 0.08, 0.14], [0, 0.78, -0.08], palette.settlementRoofGold);

  const bannerLeft = new Group();
  bannerLeft.position.set(-0.36, 0.64, 0.18);
  bannerLeft.add(createPost([0, 0, 0], 0.46, palette.settlementStoneShade, 0.04));
  addBox(bannerLeft, [0.14, 0.24, 0.03], [0.08, 0.28, 0], palette.settlementBanner);
  temple.add(bannerLeft);

  const bannerRight = new Group();
  bannerRight.position.set(0.36, 0.64, 0.18);
  bannerRight.add(createPost([0, 0, 0], 0.46, palette.settlementStoneShade, 0.04));
  addBox(bannerRight, [0.14, 0.24, 0.03], [-0.08, 0.28, 0], palette.settlementBanner);
  temple.add(bannerRight);

  addBox(temple, [0.16, 0.04, 0.12], [-0.38, 0.41, 0.34], palette.settlementShrub, [0, 0.4, 0]);
  addBox(temple, [0.18, 0.04, 0.14], [0.4, 0.41, 0.28], palette.settlementShrub, [0, -0.3, 0]);
  addBox(temple, [0.12, 0.03, 0.12], [-0.2, 0.41, -0.3], palette.settlementStone, [0, 0.2, 0]);
  addBox(temple, [0.16, 0.03, 0.12], [0.28, 0.41, -0.28], palette.settlementStone, [0, -0.18, 0]);

  return tile;
};
