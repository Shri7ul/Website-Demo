import * as THREE from "three";

/** The camera framing declared in components/rover-scene.tsx. */
const CAMERA = [2.15, 1.5, 2.35];
const TARGET = [0, 0.4, 0];
const FOV = 38;

/**
 * Projects a world position to canvas CSS pixels, so tests can click a 3D
 * marker without hard-coding screen coordinates.
 */
export function projectMarker(world, width, height) {
  const cam = new THREE.PerspectiveCamera(FOV, width / height, 0.1, 200);
  cam.position.set(...CAMERA);
  cam.lookAt(new THREE.Vector3(...TARGET));
  cam.updateMatrixWorld(true);
  cam.updateProjectionMatrix();

  const v = new THREE.Vector3(...world).project(cam);
  return {
    x: (v.x * 0.5 + 0.5) * width,
    y: (-v.y * 0.5 + 0.5) * height,
    z: v.z,
  };
}
