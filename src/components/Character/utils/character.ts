import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        const encryptedBlob = await decryptFile(
          "/models/character.enc",
          "Character3D#@"
        );
        const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

        let character: THREE.Object3D;
        loader.load(
          blobUrl,
          async (gltf) => {
            character = gltf.scene;

            // Matte black clothes (#121115) & Fair skin tone (#FFCCAA from reference palette)
            const clothesMaterial = new THREE.MeshStandardMaterial({
              color: new THREE.Color("#121115"),
              roughness: 0.85,
              metalness: 0.0,
            });

            const skinMaterial = new THREE.MeshStandardMaterial({
              color: new THREE.Color("#FFCCAA"),
              roughness: 0.5,
              metalness: 0.0,
            });

            const skinMeshNames = [
              "Plane007",
              "Plane.007",
              "Ear001",
              "Ear.001",
              "Neck",
              "Hand",
              "Face002",
              "Face.002",
            ];
            const clothesMeshNames = [
              "BODYSHIRT",
              "BODY.SHIRT",
              "Pant",
            ];

            character.traverse((child: any) => {
              console.log("TRAVERSE CHILD:", child.name, "isMesh:", child.isMesh);
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;
                if (skinMeshNames.includes(mesh.name)) {
                  if (mesh.geometry) {
                    if (mesh.geometry.attributes.color) mesh.geometry.deleteAttribute("color");
                    if (mesh.geometry.attributes.color_0) mesh.geometry.deleteAttribute("color_0");
                    if (mesh.geometry.attributes.color_1) mesh.geometry.deleteAttribute("color_1");
                  }
                  mesh.material = skinMaterial;
                } else if (clothesMeshNames.includes(mesh.name)) {
                  mesh.material = clothesMaterial;
                }
                child.castShadow = true;
                child.receiveShadow = true;
                mesh.frustumCulled = true;
              }
            });
            await renderer.compileAsync(character, camera, scene);
            resolve(gltf);
            setCharTimeline(character, camera);
            setAllTimeline();
            character!.getObjectByName("footR")!.position.y = 3.36;
            character!.getObjectByName("footL")!.position.y = 3.36;
            dracoLoader.dispose();
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
