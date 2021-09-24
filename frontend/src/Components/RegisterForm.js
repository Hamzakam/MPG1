import { useState } from "react";
import { register } from "../services";

const RegisterForm = (props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        const userObj = await register({ username, password, email });
        console.log(userObj);
        setUsername("");
        setPassword("");
        setEmail("");
    };
    return (
        <div className="loginForm">
            <form onSubmit={handleRegisterSubmit}>
                <div>
                    <label htmlFor="email">email</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="text"
                        name="email"
                        id="email"
                    />
                </div>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        name="username"
                        id="username"
                    />
                </div>
                <div>
                    <label htmlFor="password">password</label>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        name="password"
                        id="login-password"
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterForm;
