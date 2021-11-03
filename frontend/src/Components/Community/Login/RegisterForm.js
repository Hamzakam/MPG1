import { useState } from "react";

const RegisterForm = (props) => {
    return (
        <div className="loginForm wrapper">
            <form onSubmit={props.handleRegisterSubmit}>
                {props.submitting && <div>Signing you Up....</div>}
                <fieldset disabled={props.submitting}>
                    <label htmlFor="email">
                        <p>Email</p>
                        <input
                            value={props.email}
                            onChange={(e) => props.setEmail(e.target.value)}
                            type="text"
                            name="email"
                            id="email"
                        />
                    </label>

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
                </fieldset>
                <button disabled={props.submitting} type="submit">
                    Register
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;
