// import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar";
import Books from "./components/books/Books";
import Members from "./components/members/Members";
import Transactions from "./components/Transactions";
import BookTransactions from './components/books/BookTransactions'
// import MemberTransactions from './components/members/MemberTransactions'

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
              <Members />
            </Route>
            <Route exact path="/transactions">
              <Transactions />
            </Route>
            {/* <Route exact path={`/books/:id/transactions`}>
              <BookTransactions />
            </Route> */}
            <Route path={`/books/:id/transactions`} render={(props) => <BookTransactions {...props}/>}/>
              {/* <MemberTransactions />
            </Route> */}
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
