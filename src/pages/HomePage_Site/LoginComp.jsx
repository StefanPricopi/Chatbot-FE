import React, { useState } from 'react'
import styles from './styling/logindash.module.css'
import AuthAPI from '../../api/AuthAPI';
import TokenManager from '../../api/TokenManager';

export default function LoginDash({setUserInfo}) {

    const [email, SetEmail] = useState("");
    const [pwd, SetPwd] = useState("");
    const [userId, setUserId] = useState(0);
    const [authToken, setAuthToken] = useState("");

    const handleLogin = (e) => 
    {
        e.preventDefault();

        SetEmail("");
        SetPwd("");
        
        try
        {
            AuthAPI.login(email, pwd)
            .then(resp => {
                setUserId(resp.studentId);
                //console.log(`Token ${TokenManager.getAccessToken()}`);
                setAuthToken(TokenManager.getAccessToken());

                let payload = {id: resp.studentId, token: TokenManager.getAccessToken()}
                setUserInfo(payload);
            })
            .catch(e => {
                console.log("Unauthorized");
            });

        }  
        catch(e)
        {
            console.log("login failed");
        }
    }




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
            <form>
                <div className={styles.txtcontainer}>
                    <label htmlFor='email'>Email address</label>
                    <input id="email" placeholder="Enter your email address" className={styles.txtbox} type="text" value={email} onChange={(e) => {SetEmail(e.target.value);}}/>
                </div>
                
                <div className={styles.txtcontainer}>
                    <label htmlFor='email'>Password</label>
                    <input id="password" placeholder="Enter your password" className={styles.txtbox} type="password" value={pwd} onChange={(e) => {SetPwd(e.target.value)}} />
                </div>

                <input className={styles.txtbtn} type="submit" value={"Login"} onClick={handleLogin}/>
            </form>
            <hr className={styles.linebreak}></hr>
            <p className={styles.ptxt}>Are you new to BAS World? </p>
            <a href='' className={styles.createbtn}>Create account</a>
        </div>
    </div>
  )
}
