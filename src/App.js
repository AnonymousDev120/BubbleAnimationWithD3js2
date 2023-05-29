import logo from "./logo.svg";
import "./App.css";

import BubbleChart from "./Components/Bubbles/BubbleChart";
import ThreeBubbles from "./Components/Bubbles/ThreeBubbles";
import { Canvas } from "react-three-fiber";
import Bubbles from "./Components/Bubbles/Bubbles";
import NewBubbles from "./Components/Bubbles/NewBubbles";
import ConceptBubbles from "./Components/Bubbles/ConceptBubbles";

function App() {
  return (
    <div className="App">
      {/* <h1>Concept Bubble Chart</h1> */}
      <Bubbles />
      {/* <ConceptBubbles /> */}
      {/* <NewBubbles /> */}

      {/* <BubbleChart /> */}

      {/* <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <ThreeBubbles />
      </Canvas> */}
    </div>
  );
}

export default App;
