import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { login, register } from "./services";
import './Login.css'
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
                <div className="loginForm-wrapper">
                    <form onSubmit={handleLoginSubmit}>
                        {submitting && <div>Logging you in....</div>}
                            <label htmlFor="username">
                                <p className="user">Username</p>
                                <div className="userinput">
                                        <input
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            type="text"
                                            name="username"
                                            height={11}
                                            id="username"
                                        />
                                 </div>      
                            </label>
                            <label htmlFor="password">
                                <p className="pass">Password</p>
                                <div className="passinput">
                                    <input
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        type="password"
                                        name="password"
                                        id="login-password"
                                    />
                                </div>
                            </label>
                        <div className="btn">
                            <button disabled={submitting} type="submit">
                            Login
                            </button>
                        </div>
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
