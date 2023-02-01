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
light.position.z = 10;
scene.add(light);

camera.position.z = 10;

const renderer = new THREE.WebGLRenderer();
loader.load("/3d/Square_Rosette.gltf", (gltf) => {
	(window as any).gltf = gltf;
	// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	// const thing = new THREE.Mesh((gltf.scene.children[0] as any).geometry, material);
	// scene.add(thing);
	scene.add(gltf.scene);
	const obj = gltf.scene.children[0];
	camera.lookAt(obj.position);
	light.position.set(obj.position.x, obj.position.y + 10, obj.position.z + 10);
	// for (let obj of gltf.scene.children) {
	// 	const thing = new THREE.Mesh(obj.)
	// }
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();
