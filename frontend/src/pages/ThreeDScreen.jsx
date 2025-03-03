import ThreeJs from "../components/ThreeJs";

const ThreeDScreen = () => {
  return <div className="flex flex-col items-center mt-6 lg:mt-20">
  <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
    <span className="bg-gradient-to-r from-green-500 to-green-800 text-transparent bg-clip-text">
      {" "}
      3D Simulation Coming soon
    </span>
  </h1>

  <ThreeJs /> {/* Add the ThreeJs component */}

  </div>;
};

export default ThreeDScreen;