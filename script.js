// Scene
const scene = new THREE.Scene();

// Texture Loader
const loader = new THREE.TextureLoader();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 30;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 🌌 SPACE BACKGROUND
const spaceGeometry = new THREE.SphereGeometry(200, 64, 64);
const spaceMaterial = new THREE.MeshBasicMaterial({
  map: loader.load('textures/space.jpg'),
  side: THREE.BackSide
});
const spaceMesh = new THREE.Mesh(spaceGeometry, spaceMaterial);
scene.add(spaceMesh);

// 💡 Light (Sunlight)
const light = new THREE.PointLight(0xffffff, 2);
scene.add(light);

// 🌞 Sun
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(2, 64, 64),
  new THREE.MeshBasicMaterial({
    map: loader.load('textures/sun.jpg')
  })
);
scene.add(sun);

// Light at sun position
light.position.set(0, 0, 0);

// 🪐 Planets Data
const planets = [
  { name: "Mercury", size: 0.38, distance: 4, speed: 0.04, texture: 'textures/mercury.jpg'},
  { name: "Venus", size: 0.95, distance: 6, speed: 0.03, texture: 'textures/venus.jpg'},
  { name: "Earth", size: 1.0, distance: 8, speed: 0.02, texture: 'textures/earth.jpg'},
  { name: "Mars", size: 0.53, distance: 10, speed: 0.018, texture: 'textures/mars.jpg'},
  { name: "Jupiter", size: 2.2, distance: 14, speed: 0.01, texture: 'textures/jupiter.jpg'},
  { name: "Saturn", size: 1.9, distance: 18, speed: 0.008, texture: 'textures/saturn.jpg'},
  { name: "Uranus", size: 1.4, distance: 22, speed: 0.006, texture: 'textures/uranus.jpg'},
  { name: "Neptune", size: 1.4, distance: 26, speed: 0.005, texture: 'textures/neptune.jpg'}
];

const planetMeshes = [];

// 🪐 Create Planets
planets.forEach((planet) => {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(planet.size, 64, 64),
    new THREE.MeshStandardMaterial({
      map: loader.load(planet.texture)
    })
  );

  scene.add(mesh);

  planet.mesh = mesh;
  planet.angle = 0;
  planetMeshes.push(planet);

  // 🪐 Saturn Ring
  if (planet.name === "Saturn") {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(planet.size * 1.5, planet.size * 1.25, 64),
      new THREE.MeshBasicMaterial({
        map: loader.load('textures/saturn_ring.png'), // use transparent PNG
        side: THREE.DoubleSide,
        transparent: true
      })
    );
    ring.rotation.x = Math.PI / 2.5; // tilt for realism
    mesh.add(ring);
  }
});

// 🔄 Animation Loop
function animate() {
  requestAnimationFrame(animate);

  planetMeshes.forEach((planet) => {
    // Revolution
    planet.angle += planet.speed;
    planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
    planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;

    // Rotation
    planet.mesh.rotation.y += 0.02;
  });

  renderer.render(scene, camera);
}
animate();

// 📱 Resize Handling
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});