import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChartContextProvider } from "./ChartContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChartContextProvider>
      <App />
    </ChartContextProvider>
  </React.StrictMode>
);
