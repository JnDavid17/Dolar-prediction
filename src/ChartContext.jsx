import React, { Children, useState } from "react";
import { createContext } from "react";

export const ChartContext = createContext();

export function ChartContextProvider(props) {
  const [left, setLeft] = useState(false);
  const [right, setRight] = useState(false);
  const [range, setRange] = useState("");

  return (
    <ChartContext.Provider
      value={{ left, setLeft, right, setRight, range, setRange }}
    >
      {props.children}
    </ChartContext.Provider>
  );
}
