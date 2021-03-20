// import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar";
import Books from "./components/books/Books";
import MembersList from "./components/MembersList";
import TransactionsList from "./components/TransactionsList";

function App() {

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Switch>
            <Route exact path="/">
              <HomePage />
            </Route>
            <Route exact path="/books">
              <Books />
            </Route>
            <Route exact path="/members">
              <MembersList />
            </Route>
            <Route exact path="/transactions">
              <TransactionsList />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
