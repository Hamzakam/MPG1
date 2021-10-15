import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { login, register } from "./services";
const Login = () => {
    const [submitting, setSubmitting] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const submitTimeOut = () => {
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
        }, 3000);
    };
    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        const userObj = await register({ username, password, email });
        console.log(userObj);
        setUsername("");
        setPassword("");
        setEmail("");
        submitTimeOut();
    };
    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        const userObj = await login({ username, password });
        // setUser(userObj);
        console.log("In LoginForm", userObj);
        setUsername("");
        setPassword("");
        submitTimeOut();
    };
    return (
        <div className="login-wrapper">
            <div className="loginForm wrapper">
                <form onSubmit={handleLoginSubmit}>
                    {submitting && <div>Logging you in....</div>}
                    <fieldset disabled={submitting}>
                        <label htmlFor="username">
                            <p>Username</p>
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                type="text"
                                name="username"
                                id="username"
                            />
                        </label>
                        <label htmlFor="password">
                            <p>Password</p>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                name="password"
                                id="login-password"
                            />
                        </label>
                    </fieldset>
                    <button disabled={submitting} type="submit">
                        Login
                    </button>
                </form>
            </div>
            {/* <LoginForm
                username={username}
                password={password}
                handleLoginSubmit={handleLoginSubmit}
                submitting={submitting}
            />
            <RegisterForm
                password={password}
                handleRegisterSubmit={handleRegisterSubmit}
                submitting={submitting}
            /> */}
        </div>
    );
};

export default Login;
