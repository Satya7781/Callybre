import * as THREE from 'three';

if (window.innerWidth >= 768) {
    init3DScene();
}

window.addEventListener('resize', () => {
    const container = document.getElementById('canvas-container');
    if (window.innerWidth >= 768 && !container.hasChildNodes()) {
        init3DScene();
    }
});

function init3DScene() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 10;
    camera.position.x = 2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const dashboardGroup = new THREE.Group();
    scene.add(dashboardGroup);

    // Modern SaaS Light Glass
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.2,
        transparent: true,
        opacity: 0.8,
        transmission: 0.6,
        clearcoat: 1.0,
        side: THREE.DoubleSide
    });

    const glowMaterialPrimary = new THREE.MeshBasicMaterial({ 
        color: 0x2563eb, // Professional Blue
        transparent: true,
        opacity: 0.9
    });
    
    const glowMaterialSecondary = new THREE.MeshBasicMaterial({ 
        color: 0x0d9488, // Teal Accent
        transparent: true,
        opacity: 0.9
    });

    // 1. Main Dashboard UI Card
    const cardGeometry = new THREE.BoxGeometry(4, 2.5, 0.1);
    const mainCard = new THREE.Mesh(cardGeometry, glassMaterial);
    
    // Clean corporate border
    const edges = new THREE.EdgesGeometry(cardGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xcbd5e1, transparent: true, opacity: 0.6 });
    const cardOutline = new THREE.LineSegments(edges, lineMaterial);
    mainCard.add(cardOutline);
    
    mainCard.position.set(0, 0, 0);
    dashboardGroup.add(mainCard);

    // Card UI details
    const uiLineGeo1 = new THREE.BoxGeometry(3.5, 0.05, 0.12);
    const uiLine1 = new THREE.Mesh(uiLineGeo1, glowMaterialPrimary);
    uiLine1.position.set(0, 0.9, 0);
    mainCard.add(uiLine1);

    const uiLineGeo2 = new THREE.BoxGeometry(2, 0.05, 0.12);
    const uiLine2 = new THREE.Mesh(uiLineGeo2, glowMaterialSecondary);
    uiLine2.position.set(-0.75, 0.6, 0);
    mainCard.add(uiLine2);

    // 2. 3D Floating Smartphone
    const phoneGeo = new THREE.BoxGeometry(1.2, 2.4, 0.15);
    const phone = new THREE.Mesh(phoneGeo, glassMaterial);
    
    const phoneEdges = new THREE.EdgesGeometry(phoneGeo);
    const phoneOutline = new THREE.LineSegments(phoneEdges, lineMaterial);
    phone.add(phoneOutline);

    phone.position.set(-2.5, -0.5, 1);
    phone.rotation.y = Math.PI / 6;
    dashboardGroup.add(phone);

    // Phone screen
    const screenGeo = new THREE.BoxGeometry(1.0, 2.2, 0.16);
    const phoneScreen = new THREE.Mesh(screenGeo, new THREE.MeshBasicMaterial({ color: 0xf8fafc }));
    phone.add(phoneScreen);
    
    const phoneUI = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.17), glowMaterialPrimary);
    phoneUI.position.set(0, 0.5, 0);
    phone.add(phoneUI);

    // 3. 3D Bar Charts
    const chartGroup = new THREE.Group();
    chartGroup.position.set(1.5, -1, 1.5);
    dashboardGroup.add(chartGroup);

    const barHeights = [0.5, 1.2, 0.8, 1.5, 1.0];
    barHeights.forEach((h, i) => {
        const barGeo = new THREE.BoxGeometry(0.2, h, 0.2);
        const color = new THREE.Color().lerpColors(
            new THREE.Color(0x2563eb), 
            new THREE.Color(0x0d9488), 
            i / (barHeights.length - 1)
        );
        const barMat = new THREE.MeshStandardMaterial({ 
            color: color,
            emissive: color,
            emissiveIntensity: 0.1,
            roughness: 0.2,
            metalness: 0.1
        });
        const bar = new THREE.Mesh(barGeo, barMat);
        bar.position.set(i * 0.4 - 0.8, h/2 - 0.5, 0);
        chartGroup.add(bar);
    });

    // 4. Floating Nodes
    const nodes = [];
    const nodeGeo = new THREE.IcosahedronGeometry(0.12, 0);
    
    for(let i=0; i<4; i++) {
        const nodeMat = new THREE.MeshStandardMaterial({
            color: i % 2 === 0 ? 0x2563eb : 0x0d9488,
            roughness: 0.2,
            metalness: 0.1
        });
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        
        node.position.set(
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 3
        );
        
        node.userData = {
            baseY: node.position.y,
            speed: 0.01 + Math.random() * 0.02,
            offset: Math.random() * Math.PI * 2
        };
        
        dashboardGroup.add(node);
        nodes.push(node);
    }

    dashboardGroup.rotation.x = 0.2;
    dashboardGroup.rotation.y = -0.3;

    // Lighting for a clean, corporate 3D look
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(5, 10, 7);
    scene.add(mainLight);

    const blueLight = new THREE.PointLight(0x2563eb, 8, 20);
    blueLight.position.set(5, 0, 5);
    scene.add(blueLight);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.0005;
        mouseY = (event.clientY - windowHalfY) * 0.0005;
    });

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        
        const time = clock.getElapsedTime();

        targetX = mouseX * 0.5;
        targetY = mouseY * 0.5;
        
        dashboardGroup.rotation.y += 0.05 * (targetX - dashboardGroup.rotation.y) - 0.001;
        dashboardGroup.rotation.x += 0.05 * (targetY - dashboardGroup.rotation.x);

        mainCard.position.y = Math.sin(time * 0.5) * 0.1;
        
        phone.position.y = Math.sin(time * 0.7 + 1) * 0.15 - 0.5;
        phone.rotation.x = Math.sin(time * 0.3) * 0.05;

        chartGroup.position.y = Math.sin(time * 0.6 + 2) * 0.1 - 1;

        nodes.forEach(node => {
            node.position.y = node.userData.baseY + Math.sin(time * 2 * node.userData.speed + node.userData.offset) * 0.3;
            node.rotation.x += 0.01;
            node.rotation.y += 0.02;
        });

        renderer.render(scene, camera);
    }

    animate();
}
