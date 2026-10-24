import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { RGBELoader } from "three-stdlib";

export async function parseHDR(buffer) {
  return new Promise((resolve, reject) => {
    try {
      const blob = new Blob([buffer], { type: "image/vnd.radiance" });
      const url = URL.createObjectURL(blob);

      new RGBELoader().load(
        url,
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          texture.colorSpace = THREE.LinearSRGBColorSpace;
          URL.revokeObjectURL(url);
          resolve(texture);
        },
        undefined,
        (err) => {
          URL.revokeObjectURL(url);
          reject(err);
        }
      );
    } catch (err) {
      console.error("[parseHDR] Exception:", err);
      reject(err);
    }
  });
}

export async function parseGLTF(buffer) {
  return new Promise(async (resolve, reject) => {
    try {
      let finalBuffer = buffer;
      if (buffer instanceof Blob) {
        console.log("[parseGLTF] Converting Blob to ArrayBuffer");
        finalBuffer = await buffer.arrayBuffer();
      }

      const loader = new GLTFLoader();
      loader.parse(
        finalBuffer,
        "",
        (gltf) => {
          // Extract nodes from the scene
          const nodes = {};
          const materials = {};

          if (gltf.scene) {
            gltf.scene.traverse((child) => {
              if (child.name) {
                nodes[child.name] = child;
              }
              if (child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach((mat) => {
                    if (mat.name) materials[mat.name] = mat;
                  });
                } else if (child.material.name) {
                  materials[child.material.name] = child.material;
                }
              }
            });
          }

          const result = {
            ...gltf,
            nodes,
            materials,
          };

          resolve(result);
        },
        (err) => {
          console.error("[parseGLTF] Failed:", err);
          reject(err);
        }
      );
    } catch (err) {
      console.error("[parseGLTF] Exception:", err);
      reject(err);
    }
  });
}

export async function parseFBX(buffer) {
  try {
    let finalBuffer = buffer;
    if (buffer instanceof Blob) {
      console.log("[parseFBX] Converting Blob to ArrayBuffer");
      finalBuffer = await buffer.arrayBuffer();
    }

    const loader = new FBXLoader();
    const fbx = loader.parse(finalBuffer, "");

    console.log("[parseFBX] Success, animations:", fbx.animations?.length || 0);

    return fbx;
  } catch (err) {
    console.error("[parseFBX] Exception:", err);
    throw err;
  }
}
