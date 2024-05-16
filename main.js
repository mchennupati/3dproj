import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import WebGL from 'three/addons/capabilities/WebGL.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new PointerLockControls(camera, renderer.domElement);
document.body.addEventListener('click', () => controls.lock(), false);

scene.add(controls.getObject());

// Room dimensions
const roomSize = 500;

// Floor
const floorGeometry = new THREE.PlaneGeometry(roomSize, roomSize);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); // Brown color
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Walls
const wallGeometry = new THREE.PlaneGeometry(roomSize, 100);
const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xD3D3D3 }); // Light gray color

// Back wall
const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
backWall.position.z = -roomSize / 2;
backWall.position.y = 50;
scene.add(backWall);

// Front wall
const frontWall = new THREE.Mesh(wallGeometry, wallMaterial);
frontWall.position.z = roomSize / 2;
frontWall.position.y = 50;
frontWall.rotation.y = Math.PI;
scene.add(frontWall);

// Left wall
const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
leftWall.position.x = -roomSize / 2;
leftWall.position.y = 50;
leftWall.rotation.y = Math.PI / 2;
scene.add(leftWall);

// Right wall
const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
rightWall.position.x = roomSize / 2;
rightWall.position.y = 50;
rightWall.rotation.y = -Math.PI / 2;
scene.add(rightWall);

// Ceiling
const ceilingGeometry = new THREE.PlaneGeometry(roomSize, roomSize);
const ceilingMaterial = new THREE.MeshBasicMaterial({ color: 0x0000FF }); // Blue color
const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
ceiling.position.y = 100; // Height of the ceiling
ceiling.rotation.x = Math.PI / 2;
scene.add(ceiling);

// Add a red cube
const cubeGeometry = new THREE.BoxGeometry(20, 20, 20);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 }); // Red color
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 10, 0); // Position the cube in the center of the room
scene.add(cube);

// Add a yellow cylinder
const cylinderGeometry = new THREE.CylinderGeometry(10, 10, 30, 32);
const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 }); // Yellow color
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinder.position.set(50, 15, 0); // Position the cylinder

// Set camera position in the middle of the room
camera.position.set(0, 10, 0); // Adjust y value to suit the height you want the camera at

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

const onKeyDown = (event) => {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;
    }
};

const onKeyUp = (event) => {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;
    }
};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

function animate() {
    requestAnimationFrame(animate);

    if (controls.isLocked === true) {
        const delta = 0.1; // Adjust this value to control speed
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveLeft) - Number(moveRight);
        direction.normalize(); // Ensure consistent movement in all directions

        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);
    }

    renderer.render(scene, camera);
}

if (WebGL.isWebGLAvailable()) {
    animate();
} else {
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
}
