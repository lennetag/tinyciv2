import { Group } from "three";
import { palette } from "./materialPalette";
import {
  addBox,
  createBasket,
  createCrate,
  createPost,
  createProducePile,
  createSign,
} from "./settlementDetailHelpers";
import { createTileBase } from "./tileScaffold";

const createCanopy = () => {
  const canopy = new Group();

  // Slightly pitched stepped canopy rather than one solid box.
  addBox(
    canopy,
    [0.92, 0.075, 0.68],
    [0.04, 0.96, -0.01],
    palette.settlementCanvas,
    [0, 0, -0.035],
  );

  // Alternating stripe panels create much more visual rhythm.
  const stripePositions = [-0.3, -0.1, 0.1, 0.3];

  stripePositions.forEach((x, index) => {
    if (index % 2 === 0) {
      addBox(
        canopy,
        [0.14, 0.085, 0.7],
        [x + 0.04, 0.963, -0.01],
        palette.settlementRoofRed,
        [0, 0, -0.035],
      );
    }
  });

  // Hanging front valance.
  const valanceXs = [-0.33, -0.11, 0.11, 0.33];

  valanceXs.forEach((x, index) => {
    addBox(
      canopy,
      [0.19, 0.1, 0.035],
      [x + 0.04, 0.9, 0.34],
      index % 2 === 0
        ? palette.settlementRoofRed
        : palette.settlementCanvas,
    );
  });

  return canopy;
};

export const createMarketTile = () => {
  const tile = createTileBase(
    palette.settlementDirt,
    palette.settlementGrass,
  );

  const market = new Group();
  market.position.set(0, 0, 0);
  tile.add(market);

  // Uneven paving breaks up the broad empty ground surface.
  const paving: Array<{
    position: [number, number, number];
    size: [number, number, number];
    rotation: number;
  }> = [
    {
      position: [-0.36, 0.405, -0.3],
      size: [0.2, 0.025, 0.14],
      rotation: 0.08,
    },
    {
      position: [-0.1, 0.406, -0.34],
      size: [0.17, 0.025, 0.13],
      rotation: -0.05,
    },
    {
      position: [0.18, 0.405, -0.32],
      size: [0.2, 0.025, 0.14],
      rotation: 0.03,
    },
    {
      position: [0.38, 0.405, -0.24],
      size: [0.15, 0.025, 0.12],
      rotation: -0.1,
    },
  ];

  paving.forEach(({ position, size, rotation }) => {
    addBox(
      market,
      size,
      position,
      palette.settlementDirt,
      [0, rotation, 0],
    );
  });

  // Main raised timber deck.
  addBox(
    market,
    [0.98, 0.13, 0.78],
    [0.04, 0.47, 0],
    palette.settlementWood,
  );

  // Visible deck boards.
  for (let i = -4; i <= 4; i += 1) {
    addBox(
      market,
      [0.015, 0.018, 0.75],
      [0.04 + i * 0.105, 0.545, 0],
      palette.settlementWoodShade,
    );
  }

  // Small front step.
  addBox(
    market,
    [0.48, 0.09, 0.15],
    [0.04, 0.42, 0.46],
    palette.settlementWoodShade,
  );

  // Canopy supports.
  market.add(createPost([-0.37, 0.48, -0.27], 0.52));
  market.add(createPost([0.45, 0.48, -0.27], 0.52));
  market.add(createPost([-0.37, 0.48, 0.27], 0.52));
  market.add(createPost([0.45, 0.48, 0.27], 0.52));

  market.add(createCanopy());

  // Rear counter and front-facing display table.
  addBox(
    market,
    [0.76, 0.22, 0.18],
    [0.04, 0.64, -0.23],
    palette.settlementWoodShade,
  );

  addBox(
    market,
    [0.62, 0.075, 0.25],
    [0.09, 0.7, 0.12],
    palette.settlementWood,
  );

  addBox(
    market,
    [0.055, 0.23, 0.055],
    [-0.17, 0.575, 0.12],
    palette.settlementWoodShade,
  );

  addBox(
    market,
    [0.055, 0.23, 0.055],
    [0.35, 0.575, 0.12],
    palette.settlementWoodShade,
  );

  // Merchandise clusters.
  const frontCrate = createCrate(0.9);
  frontCrate.position.set(-0.36, 0.61, 0.14);
  market.add(frontCrate);

  const rearCrate = createCrate(0.72);
  rearCrate.position.set(0.39, 0.61, -0.12);
  market.add(rearCrate);

  const leftBasket = createBasket(0.85);
  leftBasket.position.set(-0.13, 0.77, 0.1);
  market.add(leftBasket);

  const rightBasket = createBasket(0.75);
  rightBasket.position.set(0.29, 0.77, 0.11);
  market.add(rightBasket);

  const frontProduce = createProducePile(palette.settlementCropGold, 0.9);
  frontProduce.position.set(0.08, 0.78, 0.11);
  market.add(frontProduce);

  const rearProduce = createProducePile(palette.settlementCropGold, 0.65);
  rearProduce.position.set(0.31, 0.7, -0.21);
  market.add(rearProduce);

  // Merchant sign and decorative hanging goods.
  const sign = createSign(palette.settlementWood, palette.settlementCropGold);
  sign.position.set(-0.38, 0.77, 0.29);
  sign.rotation.y = -0.08;
  market.add(sign);

  const hangingGoods = new Group();
  hangingGoods.position.set(0.38, 0.8, -0.29);

  for (let i = 0; i < 3; i += 1) {
    addBox(
      hangingGoods,
      [0.025, 0.12 + i * 0.02, 0.025],
      [i * 0.055, -i * 0.02, 0],
      palette.settlementCropGold,
      [0, 0, i % 2 === 0 ? 0.15 : -0.15],
    );
  }

  market.add(hangingGoods);

  // Loose side crates make the composition less symmetrical.
  const sideCrate = createCrate(0.7);
  sideCrate.position.set(-0.43, 0.48, -0.36);
  market.add(sideCrate);

  const sideBasket = createBasket(0.7);
  sideBasket.position.set(0.44, 0.49, 0.35);
  market.add(sideBasket);

  // A small flag gives the tile a strong upper silhouette.
  addBox(
    market,
    [0.025, 0.34, 0.025],
    [-0.4, 1.12, -0.25],
    palette.settlementWoodShade,
  );

  addBox(
    market,
    [0.2, 0.12, 0.025],
    [-0.295, 1.22, -0.25],
    palette.settlementRoofRed,
  );

  return tile;
};
