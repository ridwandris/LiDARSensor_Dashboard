import RPLiDAR from '../assets/RPLiDAR.mp4';
import DOBOT400 from '../assets/DOBOT400.mp4';

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
      </p>
      
      <div className="flex justify-center my-10">
      <a
          href="#"
          className="bg-gradient-to-r from-green-500 to-green-800 py-3 px-4 mx-3 rounded-md"
        >
          3D Visualization
        </a>

        <a
          href="#"
          className="bg-gradient-to-r from-green-500 to-green-800 py-3 px-4 mx-3 rounded-md"
        >
          Graph Visualization
        </a>
        
      </div>

      <div className="flex mt-10 justify-center">
        <video
          autoPlay
          loop
          muted
          className="rounded-lg w-1/2 border border-green-700 shadow-sm shadow-green-400 mx-2 my-4"
        >
          <source src={DOBOT400} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <video
          autoPlay
          loop
          muted
          className="rounded-lg w-1/2 border border-green-700 shadow-sm shadow-green-400 mx-2 my-4"
        >
          <source src={RPLiDAR} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

    </div>
  )
}

export default Hero