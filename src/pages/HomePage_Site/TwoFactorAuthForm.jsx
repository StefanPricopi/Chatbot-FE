import React, { useState } from 'react';
import styles from './styling/logindash.module.css';
import AuthAPI from '../../api/AuthAPI';
import TokenManager from '../../api/TokenManager';
import { jwtDecode } from 'jwt-decode';

export default function TwoFactorAuthForm({ username, setUserInfo }) {
    const [twoFactorCode, setTwoFactorCode] = useState("");

    const handleVerify2FA = (e) => {
        e.preventDefault();

        AuthAPI.verify2FA(username, twoFactorCode)
            .then(response => {
                const { accessToken } = response;
                TokenManager.setAccessToken(accessToken);
                let claims = jwtDecode(accessToken);

                console.log(claims);
                setUserInfo({ id: claims.studentId, token: accessToken });
                console.log(accessToken);
                console.log("ok, so its successfull");
            })
            .catch(e => {
                console.error("2FA verification failed", e);
            });
    };

    return (
        <form onSubmit={handleVerify2FA}>
            <div className={styles.txtcontainer}>
                <label htmlFor='twoFactorCode'>2FA Code</label>
                <input
                    id="twoFactorCode"
                    placeholder="Enter the 6 digit code"
                    className={styles.txtbox}
                    type="text"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                />
            </div>
            <input
                className={styles.txtbtn}
                type="submit"
                value="Verify Code"
            />
        </form>
    );
}
