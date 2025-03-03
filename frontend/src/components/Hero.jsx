import { Link } from "react-router-dom";
import LidarA1 from '../assets/LidarA1.mp4';
import Dobot from '../assets/Dobot.mp4';

const Hero = () => {
  return (
    <div className="flex flex-col items-center mt-6 lg:mt-20">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
        Real-time Sensor data
        <span className="bg-gradient-to-r from-green-500 to-green-800 text-transparent bg-clip-text">
          {" "}
          for Human Safety Robot
        </span>
      </h1>
      <p className="mt-10 text-lg text-center text-neutral-500 max-w-4xl">
        The Safety Sensor Project is a web-interface that allows you to monitor the real-time sensor data from a Human Safety Robot Sensor. 
        On the Left hand side is DOBOT MG400, the Robot used. On the right hand side is RPLiDAR A1, the sensor used.
      </p>
      
      <div className="flex justify-center my-10">
        <Link to="/3d-visualization" className="bg-gradient-to-r from-green-500 to-green-800 py-3 px-4 mx-3 rounded-md">
          3D Visualization
        </Link>
        <Link to="/graph-visualization" className="bg-gradient-to-r from-green-500 to-green-800 py-3 px-4 mx-3 rounded-md">
          Graph Visualization
        </Link>
      </div>

      <div className="flex mt-10 justify-center">
        <div className="relative w-1/2 mx-2 my-4 aspect-w-16 aspect-h-9">
          <video
            autoPlay
            loop
            muted
            className="rounded-lg border border-green-500 shadow-sm shadow-green-400 w-full h-full object-cover"
          >
            <source src={Dobot} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-2">
            ROBOT: DOBOT MG400
          </div>
        </div>
        <div className="relative w-1/2 mx-2 my-4 aspect-w-16 aspect-h-9">
          <video
            autoPlay
            loop
            muted
            className="rounded-lg border border-green-700 shadow-sm shadow-green-400 w-full h-full object-cover"
          >
            <source src={LidarA1} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-2">
            SENSOR: RPLiDAR A1
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;