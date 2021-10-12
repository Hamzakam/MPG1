import "./App.css";
// import { useState, useEffect } from "react";
import Login from "./Components/Login/Login";
import Navbar from "./Components/Navbar";
import PostFeed from "./Components/Post";
import { BrowserRouter as Router } from "react-router-dom";

const App = () => {
    return (
        <Router>
            <Navbar />
            <h1>PeerHub</h1>
            <PostFeed />
            <Login />
        </Router>
    );
};

export default App;
