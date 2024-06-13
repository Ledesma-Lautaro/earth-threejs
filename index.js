import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import getStarfield from './src/getStarfield.js';
import { getFresnelMat } from './src/getFresnelMat.js'; 

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
// THREE.ColorManagement.enabled = true;

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);
new OrbitControls(camera, renderer.domElement);
const detail = 16;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshStandardMaterial({
  map: loader.load('/textures/8k_earth_daymap.jpg'),
})
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load('/textures/8k_earth_nightmap.jpg'),
  blending: THREE.AdditiveBlending,
  
});
const lightsMesh = new THREE.Mesh(
  geometry,
  lightsMat
);
earthGroup.add(lightsMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load('/textures/8k_earth_clouds.jpg'),
  blending: THREE.AdditiveBlending,
});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.001);
earthGroup.add(cloudsMesh);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.001);
earthGroup.add(glowMesh);

const stars = getStarfield({
  numStars: 10000,
});
scene.add(stars);





const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(5, 5, 5);
scene.add(sunLight);



function animate() {
  requestAnimationFrame(animate);
  earthMesh.rotation.y += 0.0001;
  lightsMesh.rotation.y += 0.0001;
  cloudsMesh.rotation.y += 0.0002;
  glowMesh.rotation.y += 0.0002;
  renderer.render(scene, camera);
}

animate();

function handleWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);