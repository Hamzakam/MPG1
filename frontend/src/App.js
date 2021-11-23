import "./App.css";
import { useState, useEffect } from "react";
import Navbar from "./Components/Navbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Components/Pages";
import Modal from "./Components/Community/Login/Modal/Modal";
import { Community } from "./Components/Community/Community";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Home} />
      </Switch>
      <Switch >
        <Modal path="/signin" exact component={Home}/>
      </Switch>
      <Switch>
        <Route path="/community" exact component={Community} />
      </Switch>
    </Router>
  );
};

export default App;
