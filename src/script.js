import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import gsap from 'gsap';
/**
 * Base
 */
// Debug
const gui = new dat.GUI();
let obsid;
let model;
const loader = new GLTFLoader();
loader.load('/model1/scene.gltf', (gltf) => {

    //traverse the gltf object
    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            model = child;
            model.material = matCapMaterial;
            model.scale.set(0.05, 0.05, 0.05);
            model.rotateX(-Math.PI / 2);
            model.rotateZ(-Math.PI / 2);
            scene.add(child);
            obsid = model.geometry.clone();
        }
    }
    );

    let sampler = new MeshSurfaceSampler(model)
        .setWeightAttribute('weight')
        .build();

    let geometry = new THREE.BufferGeometry();
    let number = 10000;
    let positions = new Float32Array(number * 3);
    for (let i = 0; i < number; i++) {
        let _position = new THREE.Vector3();
        let _normal = new THREE.Vector3();
        sampler.sample(_position, _normal);

        positions.set([_position.x, _position.y, _position.z], i * 3);

    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    let points = new THREE.Points(geometry, material);
    points.scale.set(0.0505, 0.0505, 0.0505);
    points.rotateX(-Math.PI / 2);
    points.rotateZ(-Math.PI / 2);
    scene.add(points);

    // let mesh = gltf.scene;
    // mesh.material = material;
    // console.log(mesh);
    // mesh.scale.set(0.05, 0.05, 0.05);
    // scene.add(mesh);
});

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32);

// Material
const material = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uMouse: { value: 0 },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
    // depthWrite: false,
    // depthTest: false,
    // blending: THREE.AdditiveBlending,
});

// Mesh
const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);
const matCapMaterial = new THREE.MeshMatcapMaterial({
    matcap: new THREE.TextureLoader().load('/mc.png'),
});
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const pointer = new THREE.Vector2();

let test = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1.2, 1.7),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
    })
);
scene.add(test);
function onPointerMove(event) {

    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // update the picking ray with the camera and pointer position
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects([test]);

    if (intersects.length > 0) {
        // console.log(intersects);
        pointer.x = intersects[0].point.x;
        pointer.y = intersects[0].point.y;
        console.log(intersects[0].point);
    }
}
window.addEventListener('pointermove', onPointerMove);

/**
 * Camera
 */
// Orthographic camera
// const camera = new THREE.OrthographicCamera(-1/2, 1/2, 1/2, -1/2, 0.1, 100)

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x111111, 1);
// ambient light
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);
// // directional light
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
// directionalLight.position.set(0, 0, 1);
// scene.add(directionalLight);
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    // Update controls
    controls.update();

    // Get elapsedtime
    const elapsedTime = clock.getElapsedTime();

    // Update uniforms
    material.uniforms.uTime.value = elapsedTime;
    if (pointer) {
        material.uniforms.uMouse.value = pointer;

    }

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();