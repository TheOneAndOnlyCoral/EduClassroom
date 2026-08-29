// Game Configuration
const config = {
    ballSpeed: 0.5,
    ballRadius: 1,
    trackWidth: 10,
    trackSegmentLength: 20,
    generationDistance: 100, // How far ahead to generate
    colors: {
        ball: 0x00ff00,
        track: 0x0093f7,
        obstacle: 0xff0000
    }
};

let scene, camera, renderer;
let ball, trackSegments = [], obstacles = [];
let score = 0;
let isGameOver = false;
let moveLeft = false, moveRight = false;

// Initialize the game
function init() {
    // Scene Setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 20);
    camera.lookAt(0, 0, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // Create Ball
    const ballGeometry = new THREE.SphereGeometry(config.ballRadius, 32, 32);
    const ballMaterial = new THREE.MeshPhongMaterial({ color: config.colors.ball });
    ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.y = 2;
    scene.add(ball);

    // Initial Track Generation
    for (let i = 0; i < 10; i++) {
        createTrackSegment(-i * config.trackSegmentLength);
    }

    // Event Listeners
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onWindowResize);

    // Start Loop
    animate();
}

// Create a segment of the track
function createTrackSegment(zPos) {
    const geometry = new THREE.BoxGeometry(config.trackWidth, 1, config.trackSegmentLength);
    const material = new THREE.MeshPhongMaterial({ color: config.colors.track });
    const segment = new THREE.Mesh(geometry, material);
    segment.position.set(0, -0.5, zPos);
    scene.add(segment);
    trackSegments.push(segment);

    // Randomly add obstacles
    if (Math.random() > 0.7 && zPos < -20) {
        const obsWidth = 2;
        const obsGeometry = new THREE.BoxGeometry(obsWidth, 2, 2);
        const obsMaterial = new THREE.MeshPhongMaterial({ color: config.colors.obstacle });
        const obstacle = new THREE.Mesh(obsGeometry, obsMaterial);
        
        // Random X position within track bounds
        const xPos = (Math.random() - 0.5) * (config.trackWidth - obsWidth - 1);
        obstacle.position.set(xPos, 0.5, zPos);
        scene.add(obstacle);
        obstacles.push(obstacle);
    }
}

// Handle Key Presses
function onKeyDown(event) {
    if (event.code === 'ArrowLeft') moveLeft = true;
    if (event.code === 'ArrowRight') moveRight = true;
}

function onKeyUp(event) {
    if (event.code === 'ArrowLeft') moveLeft = false;
    if (event.code === 'ArrowRight') moveRight = false;
}

// Update Game State
function update() {
    if (isGameOver) return;

    // Move Ball Forward
    ball.position.z -= config.ballSpeed;
    
    // Move Ball Left/Right
    if (moveLeft && ball.position.x > -config.trackWidth / 2) {
        ball.position.x -= 0.3;
    }
    if (moveRight && ball.position.x < config.trackWidth / 2) {
        ball.position.x += 0.3;
    }

    // Rotate Ball for visual effect
    ball.rotation.x -= 0.1;

    // Camera Follow
    camera.position.z = ball.position.z + 20;
    camera.position.x = ball.position.x * 0.5; // Slight lag for dynamic feel

    // Update Score
    score = Math.floor(Math.abs(ball.position.z));
    document.getElementById('score').innerText = `Score: ${score}`;

    // Generate New Track
    const lastSegmentZ = trackSegments[trackSegments.length - 1].position.z;
    if (lastSegmentZ > ball.position.z - config.generationDistance) {
        createTrackSegment(lastSegmentZ - config.trackSegmentLength);
    }

    // Remove Old Segments (Optimization)
    if (trackSegments[0].position.z > ball.position.z + 50) {
        scene.remove(trackSegments[0]);
        trackSegments.shift();
    }

    // Collision Detection with Obstacles
    const ballBox = new THREE.Box3().setFromObject(ball);
    for (let obs of obstacles) {
        const obsBox = new THREE.Box3().setFromObject(obs);
        if (ballBox.intersectsBox(obsBox)) {
            gameOver();
        }
    }
}

// Game Over Logic
function gameOver() {
    isGameOver = true;
    document.getElementById('gameOver').style.display = 'block';
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
}

// Handle Window Resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start the game
init();   
