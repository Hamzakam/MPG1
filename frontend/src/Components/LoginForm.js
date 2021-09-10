import axios from "axios";
import { useState } from "react";
import { login } from "../services";

const LoginForm = (props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        const userObj = await login({ username, password });
        setUser(userObj);
        console.log("In LoginForm", userObj);
        setUsername("");
        setPassword("");
    };
    return (
        <div className="loginForm">
            <form onSubmit={handleLoginSubmit}>
                <label htmlFor="username">Username</label>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    name="username"
                    id="username"
                />
                <label htmlFor="password">password</label>
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    name="password"
                    id="login-password"
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
