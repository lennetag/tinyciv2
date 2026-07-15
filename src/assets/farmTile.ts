import { BoxGeometry, Group, Mesh } from "three";
import { palette } from "./materialPalette";
import {
  addBox,
  createCrate,
  createPost,
  createProducePile,
} from "./settlementDetailHelpers";
import { setTileAnimationController } from "./tileAnimation";
import { createTileBase } from "./tileScaffold";

const createFencePost = (x: number, z: number, height = 0.2) => {
  const post = new Mesh(new BoxGeometry(0.06, height, 0.06), palette.settlementWoodShade);
  post.position.set(x, 0.33 + height / 2, z);
  return post;
};

const createFenceRail = (x: number, z: number, width: number, depth: number) => {
  const rail = new Mesh(new BoxGeometry(width, 0.05, depth), palette.settlementWood);
  rail.position.set(x, 0.47, z);
  return rail;
};

const createCropBed = (x: number, z: number, width: number, depth: number) => {
  const bed = new Group();
  const soil = new Mesh(new BoxGeometry(width, 0.05, depth), palette.settlementWoodShade);
  soil.position.set(x, 0.39, z);
  bed.add(soil);

  const stemCount = Math.max(2, Math.floor(width / 0.18));
  for (let index = 0; index < stemCount; index += 1) {
    const stem = new Mesh(new BoxGeometry(0.08, 0.08, 0.08), palette.settlementCrop);
    const offset = stemCount === 1 ? 0 : (index / (stemCount - 1) - 0.5) * (width - 0.16);
    stem.position.set(x + offset, 0.455, z + (index % 2 === 0 ? -0.02 : 0.02));
    bed.add(stem);
  }

  return bed;
};

const createHayStack = (x: number, z: number) => {
  const hay = new Mesh(new BoxGeometry(0.16, 0.11, 0.16), palette.settlementCropGold);
  hay.position.set(x, 0.435, z);
  return hay;
};

const createShrub = (x: number, z: number, size = 0.14) => {
  const shrub = new Mesh(new BoxGeometry(size, 0.1, size), palette.settlementShrub);
  shrub.position.set(x, 0.43, z);
  return shrub;
};

const createFieldMarker = (x: number, z: number) => {
  const post = new Mesh(new BoxGeometry(0.06, 0.18, 0.06), palette.settlementWoodShade);
  post.position.set(x, 0.42, z);
  return post;
};

export const createFarmTile = () => {
  const tile = createTileBase(palette.settlementDirt, palette.settlementGrass);
  const farm = new Group();
  tile.add(farm);
  const animatedPlants: Array<{ mesh: Mesh; baseY: number; baseZ: number; sway: number }> = [];
  const animatedHayStacks: Array<{ mesh: Mesh; baseY: number }> = [];

  const yard = new Mesh(new BoxGeometry(1.18, 0.08, 1.02), palette.settlementPath);
  yard.position.set(-0.02, 0.38, 0.05);
  farm.add(yard);

  const fieldPatch = new Mesh(new BoxGeometry(0.92, 0.04, 0.78), palette.settlementDirt);
  fieldPatch.position.set(-0.12, 0.41, 0.18);
  farm.add(fieldPatch);

  addBox(farm, [0.08, 0.03, 0.76], [-0.06, 0.42, 0.18], palette.settlementWater);
  addBox(farm, [0.52, 0.03, 0.08], [0.24, 0.42, 0.42], palette.settlementWater);

  for (const bed of [
    createCropBed(-0.36, -0.02, 0.34, 0.14),
    createCropBed(-0.08, 0.08, 0.4, 0.14),
    createCropBed(0.22, 0.18, 0.42, 0.14),
    createCropBed(-0.26, 0.26, 0.34, 0.14),
    createCropBed(0.04, 0.34, 0.42, 0.14),
    createCropBed(0.34, -0.06, 0.26, 0.14)
  ]) {
    farm.add(bed);
    for (const child of bed.children) {
      if (!(child instanceof Mesh) || child.material !== palette.settlementCrop) {
        continue;
      }

      animatedPlants.push({
        mesh: child,
        baseY: child.position.y,
        baseZ: child.position.z,
        sway: child.position.x >= 0 ? 1 : -1
      });
    }
  }

  const shed = new Group();
  const shedBody = new Mesh(new BoxGeometry(0.44, 0.28, 0.34), palette.settlementWood);
  shedBody.position.set(0.33, 0.52, -0.34);
  shed.add(shedBody);
  const shedRoof = new Mesh(new BoxGeometry(0.56, 0.14, 0.44), palette.settlementRoofRed);
  shedRoof.position.set(0.33, 0.73, -0.34);
  shed.add(shedRoof);
  const shedDoor = new Mesh(new BoxGeometry(0.11, 0.18, 0.08), palette.settlementWoodShade);
  shedDoor.position.set(0.33, 0.46, -0.13);
  shed.add(shedDoor);
  addBox(shed, [0.1, 0.16, 0.08], [0.15, 0.59, -0.14], palette.settlementWoodShade);
  addBox(shed, [0.08, 0.1, 0.04], [0.47, 0.54, -0.16], palette.settlementCanvas);
  farm.add(shed);

  const porch = new Mesh(new BoxGeometry(0.34, 0.06, 0.22), palette.settlementStone);
  porch.position.set(0.33, 0.41, -0.11);
  farm.add(porch);

  const path = new Mesh(new BoxGeometry(0.22, 0.03, 0.54), palette.settlementStoneShade);
  path.position.set(0.14, 0.42, 0.02);
  farm.add(path);

  for (const hayStack of [createHayStack(-0.5, -0.18), createHayStack(-0.44, -0.4)]) {
    farm.add(hayStack);
    animatedHayStacks.push({ mesh: hayStack, baseY: hayStack.position.y });
  }
  farm.add(createShrub(-0.56, 0.38, 0.18));
  farm.add(createShrub(0.56, 0.26, 0.16));

  farm.add(createFencePost(-0.58, -0.46, 0.22));
  farm.add(createFencePost(-0.58, -0.14, 0.22));
  farm.add(createFencePost(-0.58, 0.18, 0.22));
  farm.add(createFencePost(-0.58, 0.5, 0.22));
  farm.add(createFenceRail(-0.58, -0.3, 0.06, 0.26));
  farm.add(createFenceRail(-0.58, 0.02, 0.06, 0.26));
  farm.add(createFenceRail(-0.58, 0.34, 0.06, 0.26));

  farm.add(createFencePost(-0.34, -0.46, 0.18));
  farm.add(createFencePost(0, -0.46, 0.18));
  farm.add(createFencePost(0.34, -0.46, 0.18));
  farm.add(createFenceRail(-0.17, -0.46, 0.28, 0.06));
  farm.add(createFenceRail(0.17, -0.46, 0.28, 0.06));

  farm.add(createFieldMarker(-0.46, 0.5));
  farm.add(createFieldMarker(-0.16, 0.5));
  farm.add(createFieldMarker(0.14, 0.5));
  farm.add(createFieldMarker(0.44, 0.5));

  const toolRack = new Group();
  toolRack.position.set(0.52, 0.42, -0.02);
  toolRack.add(createPost([0, 0, 0], 0.24));
  toolRack.add(createPost([0.18, 0, 0.02], 0.2));
  addBox(toolRack, [0.22, 0.02, 0.02], [0.09, 0.18, 0.01], palette.settlementWoodShade);
  addBox(toolRack, [0.03, 0.16, 0.03], [0.04, 0.09, -0.02], palette.settlementWood, [0, 0, 0.35]);
  addBox(toolRack, [0.09, 0.025, 0.025], [0.07, 0.16, -0.02], palette.settlementStoneShade, [0, 0, 0.35]);
  addBox(toolRack, [0.03, 0.14, 0.03], [0.13, 0.08, 0.03], palette.settlementWood, [0, 0, -0.3]);
  farm.add(toolRack);

  const scarecrow = new Group();
  scarecrow.position.set(-0.06, 0.42, -0.18);
  scarecrow.add(createPost([0, 0, 0], 0.48));
  addBox(scarecrow, [0.24, 0.03, 0.03], [0, 0.28, 0], palette.settlementWoodShade);
  addBox(scarecrow, [0.14, 0.14, 0.05], [0.02, 0.2, 0], palette.settlementCanvas, [0, 0, 0.1]);
  addBox(scarecrow, [0.09, 0.09, 0.09], [0, 0.4, 0], palette.settlementCropGold);
  farm.add(scarecrow);

  const harvestCrate = createCrate(0.7);
  harvestCrate.position.set(0.51, 0.49, 0.38);
  farm.add(harvestCrate);

  const producePile = createProducePile(palette.settlementCrop, 0.72);
  producePile.position.set(0.48, 0.57, 0.39);
  farm.add(producePile);

  const cropLiftFrames = [0, 0.012, 0.026, 0.018, 0.008, 0.004];
  const cropSwayFrames = [0, 0.01, 0.018, 0.008, -0.01, -0.016];
  const hayLiftFrames = [0, 0.004, 0.008, 0.004, 0, -0.003];
  let activeFrame = -1;

  setTileAnimationController(tile, {
    update: (elapsedMs) => {
      const frame = Math.floor(elapsedMs / 180) % 6;
      if (frame === activeFrame) {
        return false;
      }

      activeFrame = frame;
      for (const [index, plant] of animatedPlants.entries()) {
        const phasedFrame = (frame + index) % 6;
        plant.mesh.position.y = plant.baseY + cropLiftFrames[phasedFrame];
        plant.mesh.position.z = plant.baseZ + cropSwayFrames[phasedFrame] * plant.sway;
      }

      for (const [index, hayStack] of animatedHayStacks.entries()) {
        const phasedFrame = (frame + index * 2) % 6;
        hayStack.mesh.position.y = hayStack.baseY + hayLiftFrames[phasedFrame];
      }

      return true;
    }
  });

  return tile;
};
