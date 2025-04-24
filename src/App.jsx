import { useState } from "react";
import "./App.css";
import Weather from "./components/Weather";

function App() {
  return (
    <div className="flex flex-col justify-center mt-10">
        <Weather />
    </div>
  );
}

export default App;
