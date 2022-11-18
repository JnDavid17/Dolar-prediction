import React, { Children, useState } from "react";
import { createContext } from "react";

export const ChartContext = createContext();

export function ChartContextProvider(props) {
  const [left, setLeft] = useState(false);
  const [right, setRight] = useState(false);
  const [range, setRange] = useState("?$where=vigenciadesde between '2019-01-01T00:00:00.000' and '2022-12-18T00:00:00.000'");
  const [conservador, setConservador] = useState(true);

  return (
    <ChartContext.Provider
      value={{ left, setLeft, right, setRight, range, setRange, conservador, setConservador }}
    >
      {props.children}
    </ChartContext.Provider>
  );
}
