import "./App.css";
// import { useState, useEffect } from "react";
import Login from "./Components/Login/Login";
import PostFeed from "./Components/Post";

const App = () => {
    return (
        <div className="App">
            <h1>PeerHub</h1>
            <PostFeed />
            <Login />
        </div>
    );
};

export default App;
