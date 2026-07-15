import { BoxGeometry, Group, Mesh } from "three";
import { palette } from "./materialPalette";
import { createTileBase } from "./tileScaffold";

const createPeak = (
  x: number,
  z: number,
  width: number,
  height: number,
  depth: number,
  topOffsetX = 0,
  topOffsetZ = 0
) => {
  const peak = new Group();

  const body = new Mesh(new BoxGeometry(width, height, depth), palette.mountainStone);
  body.position.y = 0.34 + height / 2;
  peak.add(body);

  const top = new Mesh(
    new BoxGeometry(width * 0.54, height * 0.22, depth * 0.54),
    palette.mountainStoneShade
  );
  top.position.set(topOffsetX, 0.34 + height + 0.02, topOffsetZ);
  peak.add(top);

  peak.position.set(x, 0, z);
  return peak;
};

export const createMountainTile = () => {
  const tile = createTileBase(palette.mountainDirt, palette.featureGrass);

  tile.add(createPeak(-0.22, 0.08, 0.46, 0.78, 0.4, -0.02, -0.02));
  tile.add(createPeak(0.12, -0.08, 0.4, 1, 0.38, 0.03, -0.01));
  tile.add(createPeak(0.34, 0.18, 0.28, 0.56, 0.26, 0.02, 0.01));
  tile.add(createPeak(-0.42, -0.18, 0.24, 0.42, 0.2));

  return tile;
};
