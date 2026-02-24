import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/weather.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // Strict mode is useful for dev to debug stuff, it also causes double requests only in dev
  // Read https://react.dev/reference/react/StrictMode#enabling-strict-mode-for-entire-app
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
