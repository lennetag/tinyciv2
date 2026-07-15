import { Group } from "three";
import { palette } from "./materialPalette";
import {
  addBox,
  createBarrel,
  createBench,
  createChimney,
  createPost,
  createSign,
} from "./settlementDetailHelpers";
import { createTileBase } from "./tileScaffold";

export const createTavernTile = () => {
  const tile = createTileBase(palette.settlementDirt, palette.settlementGrass);
  const tavern = new Group();
  tile.add(tavern);

  addBox(tavern, [0.94, 0.08, 0.84], [0.02, 0.43, -0.02], palette.settlementStoneShade);
  addBox(tavern, [0.82, 0.4, 0.7], [0.02, 0.62, -0.04], palette.settlementWood);
  addBox(tavern, [0.42, 0.22, 0.44], [-0.1, 0.86, -0.1], palette.settlementStone);
  addBox(tavern, [1.02, 0.18, 0.9], [0.02, 1.04, -0.04], palette.settlementRoofBlue, [0, 0, -0.04]);
  addBox(tavern, [0.72, 0.1, 0.58], [0.06, 1.16, -0.02], palette.settlementRoofBlue, [0, 0, -0.02]);
  addBox(tavern, [0.3, 0.08, 0.24], [0.14, 0.43, 0.36], palette.settlementWoodShade);
  addBox(tavern, [0.18, 0.28, 0.08], [0.15, 0.56, 0.28], palette.settlementWoodShade);
  addBox(tavern, [0.12, 0.16, 0.08], [-0.12, 0.58, 0.29], palette.settlementCanvas);
  addBox(tavern, [0.14, 0.18, 0.08], [0.34, 0.6, 0.22], palette.settlementWoodShade);

  const chimney = createChimney(1.05);
  chimney.position.set(0.34, 1.11, -0.21);
  tavern.add(chimney);

  const signFrame = new Group();
  signFrame.position.set(-0.42, 0.44, 0.26);
  signFrame.add(createPost([0, 0, 0], 0.46));
  const hangingSign = createSign(palette.settlementWood, palette.settlementRoofGold, 0.9);
  hangingSign.position.set(0.14, 0.28, 0);
  signFrame.add(hangingSign);
  tavern.add(signFrame);

  const frontTable = createBench(1);
  frontTable.position.set(-0.26, 0.42, 0.34);
  tavern.add(frontTable);

  const sideBench = createBench(0.82);
  sideBench.position.set(0.44, 0.42, 0.12);
  sideBench.rotation.y = 0.45;
  tavern.add(sideBench);

  const barrelA = createBarrel(0.95);
  barrelA.position.set(-0.33, 0.47, 0.31);
  tavern.add(barrelA);

  const barrelB = createBarrel(0.8);
  barrelB.position.set(0.41, 0.47, -0.24);
  tavern.add(barrelB);

  const lanternFrame = new Group();
  lanternFrame.position.set(0.33, 0.72, 0.25);
  lanternFrame.add(createPost([0, 0, 0], 0.16, palette.settlementWoodShade, 0.03));
  addBox(lanternFrame, [0.08, 0.1, 0.08], [0.07, 0.1, 0], palette.settlementRoofGold);
  tavern.add(lanternFrame);

  addBox(tavern, [0.34, 0.02, 0.18], [-0.32, 0.41, -0.34], palette.settlementPath, [0, 0.2, 0]);

  return tile;
};
