import React from "react";
import Root from "./Root.js";
import "./../node_modules/modern-normalize/modern-normalize.css";

function App() {
  return (
    <div className="App container">
      <div className="row justify-content-center">
        <div className="col-auto">
          <img
            src={process.env.PUBLIC_URL + "/ic-logo.svg"}
            alt="počítej sám"
            className="logo"
          />
        </div>
      </div>
      <Root />
    </div>
  );
}

export default App;
