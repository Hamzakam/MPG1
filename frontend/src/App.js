import "./App.css";
// import { useState, useEffect } from "react";
import LoginForm from "./Components/LoginForm";
import RegisterForm from "./Components/RegisterForm";
import PostFeed from "./Components/Post";

const App = () => {
    return (
        <div className="App">
            <h1>PeerHub</h1>
            <PostFeed />
            <LoginForm />
            <RegisterForm />
        </div>
    );
};

export default App;
