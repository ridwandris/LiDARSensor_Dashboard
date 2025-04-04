import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import githubLogo from "../assets/github.png";
import './Navbar.css';

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
            <a href="https://github.com/ridwandris/LiDARSensor_Dashboard" className="py-2 px-3 border rounded-md flex items-center" target="_blank" rel="noopener noreferrer">
              <img src={githubLogo} alt="GitHub Logo" className="h-5 w-5 mr-2" />
              Github Repo
            </a>
            <Link
              to="/documentation"
              className="bg-gradient-to-r from-green-500 to-green-800 py-2 px-3 rounded-md"
            >
              Documentation
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;