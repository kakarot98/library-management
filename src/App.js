import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  const [ra, setRa] = useState(0);

  useEffect(() => {
    fetch("/books")
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);

  return <div className="App"></div>;
}

export default App;
