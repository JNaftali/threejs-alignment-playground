import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const loader = new GLTFLoader();

declare global {
	interface Window {
		scene: THREE.Scene;
		camera: THREE.Camera;
	}
}

const scene = new THREE.Scene();
window.scene = scene;
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
window.camera = camera;
camera.position.z = 10;

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const light = new THREE.PointLight();
light.position.set(0, 10, 10);
scene.add(light);

loadModel("Square_Rosette");
loadModel("Coventry_Lever_newUVs");

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function loadModel(name: string) {
	loader.load(`/3d/${name}.gltf`, (gltf) => {
		camera.lookAt(gltf.scene.position);
		const group = new THREE.Group();
		group.name = name;
		for (let obj of gltf.scene.children) {
			if (isMesh(obj)) {
				group.add(obj);
			} else {
				console.log("Unknown object type: ", obj.type);
			}
		}
		scene.add(group);
	});
}

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();

function isMesh(x: THREE.Object3D): x is THREE.Mesh {
	return x.type === "Mesh";
}
