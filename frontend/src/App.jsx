import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import ThreeDScreen from "./pages/ThreeDScreen";
import GraphScreen from "./pages/GraphScreen";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="max-w-7xl mx-auto pt-20 px-6">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/3d-visualization" element={<ThreeDScreen />} />
          <Route path="/graph-visualization" element={<GraphScreen />} />
        </Routes>
      </div>
      <div className="max-w-7xl mx-auto pt-20 px-6">
        <Footer />
      </div>
    </Router>
  );
};

export default App;