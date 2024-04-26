import "./App.css";
import Title from "./components/Title";
import FormComponent from "./components/Form";
import ParticlesComponent from "./components/Particles";

function App() {
  return (
    <>
      <ParticlesComponent className="particles" />
      <div className="grid-container">
        <div className="title">
          <Title className="title" />
        </div>

        <div className="form-container">
          <FormComponent />
        </div>

        <div className="canvas-container">
          <svg width="600px" height="400px" id="canvas"></svg>
        </div>
      </div>
    </>
  );
}

export default App;
