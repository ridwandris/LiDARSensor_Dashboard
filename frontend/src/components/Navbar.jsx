import logo from "../assets/logo.png";
import './Navbar.css'; // Import the CSS file for the animation

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <img className="h-8 w-10 mr-1 spin-logo" src={logo} alt="Logo" />
            <span className="text-xl tracking-tight">The Safety Sensor Project</span>
          </div>
          
          <div className="hidden lg:flex justify-center space-x-12 items-center">
            <a href="#" className="py-2 px-3 border rounded-md">
              Github Repo
            </a>
            <a
              href="#"
              className="bg-gradient-to-r from-green-500 to-green-800 py-2 px-3 rounded-md"
            >
              See Docmentation
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;