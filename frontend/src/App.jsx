import { useState } from 'react';
import projectLogo from './assets/ProjectLogo.png'; // Import the new logo
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <nav className="navbar">
        <a href="https://www.leuphana.de/" target="_blank" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={projectLogo} className="logo project" alt="Project logo" />
          <span className="project-title">DOBOT Safety Sensor Project</span>
        </a>
        <div className="nav-links">
          <a href="#info">Info</a>
          <a href="https://github.com/your-github-repo" target="_blank">GitHub</a>
        </div>
      </nav>
      <header className="App-header">
        <h1>Sensor Data coming soon</h1>
      </header>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Test count is {count}
        </button>
        <p>
          <code>Things would shape up here very soon</code>
        </p>
      </div>
      <p className="read-the-docs">
        So we've started a web-interface Project. Well i hope we do finishes it soon. Or at least learn from it😉✌️
      </p>
    </div>
  );
}

export default App;
