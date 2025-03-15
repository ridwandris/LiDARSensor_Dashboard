import * as THREE from 'three';

class LIDARPoints {
  constructor(numPoints) {
    this.numPoints = numPoints;

    // Create buffers for positions, colors, and sizes
    this.positions = new Float32Array(numPoints * 3);
    this.colors = new Float32Array(numPoints * 3);
    this.sizes = new Float32Array(numPoints);

    // Create buffer geometry and attributes
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
    this.geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));

    // Create material with custom shader
    this.material = new THREE.PointsMaterial({
      vertexColors: true,
      size: 1.0,
      onBeforeCompile: (shader) => {
        shader.vertexShader = `
          attribute float size;
          varying vec3 vColor;
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        ` + shader.vertexShader;

        shader.fragmentShader = `
          varying vec3 vColor;
          void main() {
            gl_FragColor = vec4(vColor, 1.0);
          }
        ` + shader.fragmentShader;
      }
    });

    // Create points
    this.points = new THREE.Points(this.geometry, this.material);
  }

  setPosIdx(idx, x, y, z) {
    this.positions[idx * 3] = x;
    this.positions[idx * 3 + 1] = y;
    this.positions[idx * 3 + 2] = z;
    this.geometry.attributes.position.needsUpdate = true;
  }

  setColorIdx(idx, r, g, b) {
    this.colors[idx * 3] = r;
    this.colors[idx * 3 + 1] = g;
    this.colors[idx * 3 + 2] = b;
    this.geometry.attributes.color.needsUpdate = true;
  }

  setSizeIdx(idx, size) {
    this.sizes[idx] = size;
    this.geometry.attributes.size.needsUpdate = true;
  }
}

export default LIDARPoints;