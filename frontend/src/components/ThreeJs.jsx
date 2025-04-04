import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { fetchLidarData } from '../utils/fetchLidarData';
import eyesNasaTexture from '../assets/eyes_nasa.png'; // Import the texture for the points, i got this from the NASA Eyes on the Solar System website

const ThreeJs = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    // Create the scene, camera, and renderer
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

   // Add a grid helper for reference
    const gridHelper = new THREE.GridHelper(100, 100);
    scene.add(gridHelper);

    // Create points geometry and material
    const geometry = new THREE.BufferGeometry();
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(eyesNasaTexture); // Load the texture
    const material = new THREE.PointsMaterial({
      map: texture,
      size: 5, // Increase the size of the points
      transparent: true,
      depthWrite: false,
      color: 0x00aaff, // Apply a unifying blue color
    });

    // Create the points object
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Set the camera position
    camera.position.set(0, 0, 150); // Move the camera further back

    // Fetch and render LiDAR data
    const renderLidarData = async () => {
      const data = await fetchLidarData();
      console.log('Fetched LiDAR data:', data); // Debugging: Log fetched data
      if (data.distances && data.angles) {
        const positions = new Float32Array(data.distances.length * 3);

        data.distances.forEach((distance, index) => {
          const angle = data.angles[index] * (Math.PI / 180); // Convert to radians
          const x = distance * Math.cos(angle);
          const y = distance * Math.sin(angle);
          const z = 0; // Assuming 2D data, set z to 0

          // Set position
          positions[index * 3] = x;
          positions[index * 3 + 1] = y;
          positions[index * 3 + 2] = z;
        });

        // Update the geometry with the new positions
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.attributes.position.needsUpdate = true;
      } else {
        console.error('Invalid data:', data);
      }
    };

    renderLidarData(); // Fetch and render the data

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on component unmount
    return () => {
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default ThreeJs;