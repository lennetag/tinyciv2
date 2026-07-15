import { OrthographicCamera, Vector3 } from "three";

export const createIsometricCamera = (aspect: number) => {
  const frustum = 20;
  const camera = new OrthographicCamera(
    (-frustum * aspect) / 2,
    (frustum * aspect) / 2,
    frustum / 2,
    -frustum / 2,
    0.1,
    100
  );

  // A true isometric camera looks toward the origin from equal world-axis distance.
  camera.position.set(14, 14, 14);
  camera.up.set(0, 1, 0);
  camera.lookAt(new Vector3(0, 0, 0));

  return { camera, frustum };
};

export const resizeIsometricCamera = (
  camera: OrthographicCamera,
  frustum: number,
  aspect: number
) => {
  camera.left = (-frustum * aspect) / 2;
  camera.right = (frustum * aspect) / 2;
  camera.top = frustum / 2;
  camera.bottom = -frustum / 2;
  camera.updateProjectionMatrix();
};
