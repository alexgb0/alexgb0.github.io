
import {
	BufferGeometry,
	Color,
	DirectionalLight,
	DoubleSide,
	Float32BufferAttribute,
	Group,
	IcosahedronGeometry,
	LineSegments,
	LineBasicMaterial,
	Mesh,
	MeshPhongMaterial,
	PerspectiveCamera,
	Scene,
	WireframeGeometry,
	WebGLRenderer
} from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
function updateGroupGeometry(mesh, geometry) {

	mesh.children[0].geometry.dispose();
	mesh.children[1].geometry.dispose();

	mesh.children[0].geometry = new WireframeGeometry(geometry);
	mesh.children[1].geometry = geometry;

	// these do not update nicely together if shared

}

const scene = new Scene();
scene.background = new Color(0x111111);

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
camera.position.z = 30;

const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableZoom = false;

const lights = [];
lights[0] = new DirectionalLight(0xffffff, 3);
lights[1] = new DirectionalLight(0xffffff, 3);
lights[2] = new DirectionalLight(0xffffff, 3);

lights[0].position.set(0, 200, 0);
lights[1].position.set(100, 200, 100);
lights[2].position.set(- 100, - 200, - 100);

scene.add(lights[0]);
scene.add(lights[1]);
scene.add(lights[2]);

const group = new Group();

const geometry = new BufferGeometry();
geometry.setAttribute('position', new Float32BufferAttribute([], 3));

const lineMaterial = new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
const meshMaterial = new MeshPhongMaterial({ color: 0x000, emissive: 0x000, side: DoubleSide, flatShading: true });

group.add(new LineSegments(geometry, lineMaterial));
group.add(new Mesh(geometry, meshMaterial));

updateGroupGeometry(group,
	new IcosahedronGeometry(
		10, 1
	)
);

scene.add(group);

function change_color_lights(color) {
	for (const light of lights) {
		light.color.set(color)
	}
}

function render() {

	const link_github = document.querySelector("#github");
	const link_evil = document.querySelector("#evil");
	if (link_github.matches(":hover")) {
		change_color_lights(0xff00ff);
	} else if (link_evil.matches(":hover")) {
		change_color_lights(0xff0000);
	} else {
		change_color_lights(0xffffff);
	}

	requestAnimationFrame(render);

	group.rotation.x += 0.005;
	group.rotation.y += 0.005;

	renderer.render(scene, camera);

}

window.addEventListener('resize', function () {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}, false);

render();

