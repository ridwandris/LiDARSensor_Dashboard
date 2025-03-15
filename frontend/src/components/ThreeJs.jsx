import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { fetchLidarData } from '../utils/fetchLidarData';
import eyesNasaTexture from '../assets/eyes_nasa.png'; // Import the texture

const ThreeJs = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    // Add lights to the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Add a grid helper
    const gridHelper = new THREE.GridHelper(100, 100);
    scene.add(gridHelper);

    const geometry = new THREE.BufferGeometry();
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(eyesNasaTexture); // Load the texture from the imported path
    const material = new THREE.PointsMaterial({ map: texture, size: 0.5, transparent: true });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const lineMaterial = new THREE.LineBasicMaterial({ vertexColors: true });
    const lineGeometry = new THREE.BufferGeometry();
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);

    camera.position.set(0, 0, 10);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const updateLidarData = async () => {
      const data = await fetchLidarData();
      console.log('Fetched LiDAR data:', data); // Debugging: Log fetched data
      if (data.distances && data.distances.length > 0) {
        const positions = new Float32Array(data.distances.length * 3);
        const colors = new Float32Array(data.distances.length * 3);
        data.distances.forEach((distance, index) => {
          const angle = (index * Math.PI * 2) / data.distances.length;
          positions[index * 3] = distance * Math.cos(angle);
          positions[index * 3 + 1] = distance * Math.sin(angle);
          positions[index * 3 + 2] = 0; // Assuming 2D data, set z to 0

          // Set color based on safety zone
          const safetyZone = data.safety_zones[index];
          let color;
          if (safetyZone === 'green') {
            color = new THREE.Color(0x00ff00); // Green
          } else if (safetyZone === 'yellow') {
            color = new THREE.Color(0xffff00); // Yellow
          } else {
            color = new THREE.Color(0xff0000); // Red
          }
          colors[index * 3] = color.r;
          colors[index * 3 + 1] = color.g;
          colors[index * 3 + 2] = color.b;
        });
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        lineGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      } else {
        console.error('Invalid data:', data);
      }
    };

    updateLidarData();
    const interval = setInterval(updateLidarData, 1000); // Update every second

    return () => {
      clearInterval(interval);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default ThreeJs;