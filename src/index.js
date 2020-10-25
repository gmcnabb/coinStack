import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App";
import "typeface-ubuntu-mono";
import "typeface-sahitya";

require("./mystyles.scss");

ReactDOM.render(<App />, document.querySelector("#root"));
