import "./App.css";
import RenderChart from "./components/RenderChart";

import {useContext} from "react";
import { ChartContext } from "./ChartContext";

function App() {
  const { left, setLeft, right, setRight, setRange,  setConservador } = useContext(ChartContext);

  const handleArrows = (direction) => {
    if (direction === "left") {
      setLeft(true);
      setRight(false);
      setRange(
        "?$where=vigenciadesde between '2014-01-01T00:00:00.000' and '2018-12-01T00:00:00.000'"
      );
    } else {
      setLeft(false);
      setRight(true);
      setRange(
        "?$where=vigenciadesde between '2019-01-01T00:00:00.000' and '2022-12-18T00:00:00.000'"
      );
    }
  };

  const handleButton = (type) =>{
    if (type === "volatil") {
      setConservador(false)
    }else{
      setConservador(true)
    }
  }

  return (
    <div className="App">
      <div className="container-buttons">
        <button className="left" onClick={() => handleArrows("left")}>
          <img src="https://img.icons8.com/color/48/null/long-arrow-left.png" />
        </button>
        <button className="conservador" onClick={() => handleButton("conservador")}>
          Metodo 1 (conservador)
        </button>
        <button className="volatil" onClick={() => handleButton("volatil")}>
          Metodo 2 (volatil)
        </button>
        <button className="right" onClick={() => handleArrows("right")}>
          <img src="https://img.icons8.com/color/48/null/long-arrow-right.png" />
        </button>
      </div>

      <RenderChart />
    </div>
  );
}

export default App;
