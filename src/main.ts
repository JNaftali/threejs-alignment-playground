import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const loader = new GLTFLoader();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
window.scene = scene;
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
window.camera = camera;
camera.position.z = 10;
const controls = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const light = new THREE.PointLight();
light.position.set(0, 10, 10);
scene.add(light);

loadModel("Square_Rosette");
loadModel("Coventry_Lever_newUVs");

function loadModel(name: string) {
	loader.load(`/3d/${name}.gltf`, (gltf) => {
		camera.lookAt(gltf.scene.position);
		controls.update();
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

	// don't want to think about this and apparently it only needs to happen if these things are true
	if (controls.autoRotate || controls.enableDamping) controls.update();

	renderer.render(scene, camera);
}
animate();

function isMesh(x: THREE.Object3D): x is THREE.Mesh {
	return x.type === "Mesh";
}

declare global {
	interface Window {
		scene: THREE.Scene;
		camera: THREE.Camera;
	}
}
