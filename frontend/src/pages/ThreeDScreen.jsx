import React from 'react';
import ThreeJs from "../components/ThreeJs";

const ThreeDScreen = () => {
  return (
    <div className="flex flex-col items-center mt-6 lg:mt-20">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
        <span className="bg-gradient-to-r from-green-500 to-green-800 text-transparent bg-clip-text">
          3D Visualization
        </span>
        
      </h1>

      <div style={{ width: '100%', height: '600px' }}>
        <ThreeJs /> {/* 3D visualization component */}
      </div>
    </div>
  );
};

export default ThreeDScreen;