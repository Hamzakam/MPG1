import "./App.css";
import { useState, useEffect } from "react";
import Login from "./Components/Login/Login";
import Navbar from "./Components/Navbar";
import PostFeed from "./Components/Post";
import { BrowserRouter as Router , Switch , Route} from "react-router-dom";
import Home from "./Components/Pages";

const App = () => {
    return (
    
        <Router>
            <Navbar />
            <Switch>
                <Route path="/" exact component={Home} />
            </Switch>
            <h1>PeerHub</h1>

            <PostFeed />
            <Login />
           
        </Router>

    );
};

export default App;
