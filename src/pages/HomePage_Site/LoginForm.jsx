import React, { useState } from 'react';
import styles from './styling/logindash.module.css';
import AuthAPI from '../../api/AuthAPI';

export default function LoginForm({ setIs2FARequired, setUsername }) {
    const [localUsername, setLocalUsername] = useState("");
    const [pwd, setPwd] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        AuthAPI.login("hhh", "hhh")
            .then(response => {
                console.log("Tried logging in.");
                setIs2FARequired(true); // Trigger 2FA form
                setUsername(localUsername);  // Pass username to parent component
            })
            .catch(e => {
                console.error("Unauthorized");
            });
    };

    return (
        <form onSubmit={handleLogin}>
            <div className={styles.txtcontainer}>
                <label htmlFor='username'>Username</label>
                <input
                    id="username"
                    placeholder="Enter your username"
                    className={styles.txtbox}
                    type="text"
                    value={localUsername}
                    onChange={(e) => setLocalUsername(e.target.value)}
                />
            </div>
            <div className={styles.txtcontainer}>
                <label htmlFor='password'>Password</label>
                <input
                    id="password"
                    placeholder="Enter your password"
                    className={styles.txtbox}
                    type="password"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                />
            </div>
            <input
                className={styles.txtbtn}
                type="submit"
                value="Login"
            />
        </form>
    );
}
