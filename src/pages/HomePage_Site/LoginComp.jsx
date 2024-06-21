import React, { useState } from 'react';
import styles from './styling/logindash.module.css';
import LoginForm from './LoginForm';
import TwoFactorAuthForm from './TwoFactorAuthForm';

export default function LoginDash({ setUserInfo }) {
    const [is2FARequired, setIs2FARequired] = useState(false);
    const [username, setUsername] = useState("");

    return (
        <div className={styles.login_box}>
            <div className={styles.top_box}>
                {/* Top section */}
                <div className={styles.top_box_title}>
                    Make it easier to find your next vehicle
                </div>
            </div>

            <div className={styles.bot_box}>
                {/* Bot section */}
                {!is2FARequired ? (
                    <LoginForm setIs2FARequired={setIs2FARequired} setUsername={setUsername} />
                ) : (
                    <TwoFactorAuthForm username={username} setUserInfo={setUserInfo} />
                )}
                <hr className={styles.linebreak}></hr>
                <p className={styles.ptxt}>Are you new to BAS World? </p>
                <a href='' className={styles.createbtn}>Create account</a>
            </div>
        </div>
    );
}
