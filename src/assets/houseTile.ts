import { Group } from "three";
import { palette } from "./materialPalette";
import {
  addBox,
  createBench,
  createChimney,
  createCrate,
  createPost,
} from "./settlementDetailHelpers";
import { createTileBase } from "./tileScaffold";

export const createHouseTile = () => {
  const tile = createTileBase(palette.settlementDirt, palette.settlementGrass);
  const house = new Group();
  tile.add(house);

  const steppingStones: Array<[number, number, number]> = [
    [-0.07, 0.395, 0.5],
    [0.03, 0.397, 0.35],
    [0.08, 0.399, 0.18],
  ];

  steppingStones.forEach((position, index) => {
    addBox(
      house,
      [0.12, 0.03, 0.12],
      position,
      palette.settlementPath,
      [0, index % 2 === 0 ? 0.18 : -0.12, 0],
    );
  });

  addBox(house, [0.3, 0.04, 0.34], [-0.28, 0.4, 0.34], palette.settlementGrass);
  addBox(house, [0.2, 0.04, 0.18], [0.44, 0.4, 0.28], palette.settlementPath);
  addBox(house, [0.76, 0.08, 0.66], [0.02, 0.44, -0.02], palette.settlementStoneShade);
  addBox(house, [0.62, 0.44, 0.54], [0.03, 0.66, -0.02], palette.settlementWood);
  addBox(house, [0.26, 0.26, 0.24], [-0.27, 0.62, 0.22], palette.settlementWood);
  addBox(house, [0.78, 0.16, 0.7], [0.03, 0.98, -0.02], palette.settlementRoofRed, [0, 0, -0.05]);
  addBox(house, [0.52, 0.12, 0.46], [0.02, 1.09, -0.03], palette.settlementRoofRed, [0, 0, -0.03]);
  addBox(house, [0.16, 0.24, 0.08], [0.15, 0.56, 0.26], palette.settlementWoodShade);
  addBox(house, [0.24, 0.06, 0.22], [0.12, 0.43, 0.36], palette.settlementStone);
  addBox(house, [0.14, 0.12, 0.08], [-0.17, 0.59, 0.35], palette.settlementWoodShade);
  addBox(house, [0.11, 0.08, 0.08], [0.25, 0.69, 0.25], palette.settlementRoofBlue);

  const chimney = createChimney(1);
  chimney.position.set(0.29, 1.08, -0.18);
  house.add(chimney);

  const bench = createBench(0.88);
  bench.position.set(-0.42, 0.41, 0.2);
  house.add(bench);

  const firewood = createCrate(0.66);
  firewood.position.set(0.42, 0.47, -0.28);
  house.add(firewood);

  const clothesline = new Group();
  clothesline.position.set(-0.45, 0.42, -0.28);
  clothesline.add(createPost([0, 0, 0], 0.34));
  clothesline.add(createPost([0.24, 0, 0.06], 0.3));
  addBox(clothesline, [0.3, 0.02, 0.02], [0.12, 0.3, 0.03], palette.settlementWoodShade);
  addBox(clothesline, [0.15, 0.08, 0.03], [0.09, 0.23, 0.03], palette.settlementCanvas);
  house.add(clothesline);

  return tile;
};
