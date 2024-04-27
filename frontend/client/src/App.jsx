import "./App.css";
import { useState } from "react";
import Title from "./components/Title";
import FormComponent from "./components/Form";
import ParticlesComponent from "./components/Particles";
import kuru2 from "./assets/kuru2.gif";

function App() {
  const [isLoading, setLoading] = useState(false);
  return (
    <div className="app-container">
      <ParticlesComponent className="particles" />

      <div className="grid-container">
        <div className="title">
          <Title className="title" />
        </div>

        <div className="form-container">
          <FormComponent isLoading={isLoading} setLoading={setLoading} />
        </div>

        <div className="canvas-container">
          <svg width="400px" height="400px" id="canvas"></svg>
          {isLoading && (
            <div className="loading-overlay">
              <img src={kuru2} alt="Loading GIF" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
