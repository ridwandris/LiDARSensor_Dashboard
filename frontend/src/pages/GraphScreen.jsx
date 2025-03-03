import React from "react";
import LiDARView from "../components/LiDARView"; // Import the LiDARView component


const GraphScreen = () => {
  return (
    <div className="flex flex-col items-center mt-6 lg:mt-20">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
        <span className="bg-gradient-to-r from-green-500 to-green-800 text-transparent bg-clip-text">
          Sensor data Coming soon
        </span>
      </h1>
      <LiDARView /> {/* Add the LiDARView component */}


    </div>
  );
};

export default GraphScreen;