import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { AmbientLight } from "three";

const loader = new GLTFLoader();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
window.scene = scene;
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
window.camera = camera;
camera.position.set(35, 25, -90);
const controls = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const light = new THREE.PointLight();
light.position.set(0, -100, -100);
scene.add(light);
scene.add(new AmbientLight());

const door = await loadModel("doorTest");
const handle = await loadModel("handleTest");
const rosette = await loadModel("rosetteTest");

// Move rosette onto door
const [door_mount_point, door_mount_quat] = getWorldPos(door.getObjectByName("null")!);
const [rosette_door_mount_point, rosette_door_mount_quat] = getWorldPos(
	rosette.getObjectByName("null_door")!
);
const DVquat = door_mount_quat.multiply(rosette_door_mount_quat.invert());
rosette.applyQuaternion(DVquat);
const DRvec = door_mount_point.sub(rosette_door_mount_point);
rosette.translateX(DRvec.x);
rosette.translateY(DRvec.y);
rosette.translateZ(DRvec.z);

// Move handle onto rosette
const [rosette_handle_mount_point, rosette_handle_mount_quat] = getWorldPos(
	rosette.getObjectByName("null_Rosette")!
);
const [handle_mount_point, handle_mount_quat] = getWorldPos(handle.getObjectByName("null_Handle")!);
const RHquat = handle_mount_quat
	.multiply(rosette_handle_mount_quat)
	.multiply(rosette_handle_mount_quat.invert());
handle.applyQuaternion(RHquat);
const RHvec = rosette_handle_mount_point.sub(handle_mount_point);
handle.translateX(RHvec.x);
handle.translateY(RHvec.y);
handle.translateZ(RHvec.z);

function getWorldPos(thing: THREE.Object3D) {
	thing.updateMatrixWorld();
	const vec = new THREE.Vector3();
	const quat = new THREE.Quaternion();
	thing.getWorldPosition(vec);
	thing.getWorldQuaternion(quat);
	return [vec, quat] as const;
}

function loadModel(name: string) {
	return loader.loadAsync(`/3d/${name}.gltf`).then((gltf) => {
		scene.add(gltf.scene);
		gltf.scene.name = name;
		camera.lookAt(gltf.scene.position);
		controls.update();
		return gltf.scene;
	});
}

function animate() {
	requestAnimationFrame(animate);

	// don't want to think about this and apparently it only needs to happen if these things are true
	if (controls.autoRotate || controls.enableDamping) controls.update();

	renderer.render(scene, camera);
}
animate();

declare global {
	interface Window {
		scene: THREE.Scene;
		camera: THREE.Camera;
	}
}
