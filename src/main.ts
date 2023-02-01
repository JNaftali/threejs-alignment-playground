import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const loader = new GLTFLoader();

declare var scene: THREE.Scene;
declare var camera: THREE.Camera;
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const light = new THREE.PointLight();
light.position.set(0, 10, 10);
scene.add(light);

loader.load("/3d/Square_Rosette.gltf", (gltf) => {
	camera.lookAt(gltf.scene.position);
	const group = new THREE.Group();
	for (let obj of gltf.scene.children) {
		if (isMesh(obj)) {
			group.add(obj);
		} else {
			console.log("Unknown object type: ", obj.type);
		}
	}
	scene.add(group);
});

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();

function isMesh(x: THREE.Object3D): x is THREE.Mesh {
	return x.type === "Mesh";
}
