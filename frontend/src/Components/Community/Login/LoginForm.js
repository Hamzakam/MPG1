// import axios from "axios";
import { useState } from "react";

const LoginForm = (props) => {
    return (
        <div className="loginForm wrapper">
            <form onSubmit={props.handleLoginSubmit}>
                {props.submitting && <div>Logging you in....</div>}
                <div disabled={props.submitting}>
                    <label htmlFor="username">
                        <p>Username</p>
                        <input
                            value={props.username}
                            onChange={(e) => props.setUsername(e.target.value)}
                            type="text"
                            name="username"
                            id="username"
                        />
                    </label>
                    <label htmlFor="password">
                        <p>Password</p>
                        <input
                            value={props.password}
                            onChange={(e) => props.setPassword(e.target.value)}
                            type="password"
                            name="password"
                            id="login-password"
                        />
                    </label>
                </div>
                <button disabled={props.submitting} type="submit">
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
