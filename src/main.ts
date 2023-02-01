import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const loader = new GLTFLoader();

const scene = new THREE.Scene();
(window as any).scene = scene;
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
(window as any).camera = camera;
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
const light = new THREE.PointLight();
light.position.set(0, 10, 10);
scene.add(light);

camera.position.z = 10;

const renderer = new THREE.WebGLRenderer();
loader.load("/3d/Square_Rosette.gltf", (gltf) => {
	(window as any).gltf = gltf;
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
