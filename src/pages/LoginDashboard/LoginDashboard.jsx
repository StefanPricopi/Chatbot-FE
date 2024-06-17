import React, {useState} from 'react'
import style from './styling/LoginDash.module.css';
import AuthAPI from '../../api/AuthAPI';
import TokenManager from '../../api/TokenManager';
import { Navigate, useNavigate } from 'react-router-dom';


export default function LoginDashboard({handleLogin}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
                
        try
        {   
            handleLogin(username, password);

            AuthAPI.dashLogin(username, password)
            .then(data => {
                navigate("/logs");
            })

            //handleLogin(username, password);
        }   
        catch(e)
        {
            console.log(e);
        }
        finally
        {
            setUsername("");
            setPassword("");
        }
    }

    return (
    <div className={style.main}>
        {/* */}

        <div className={style.center}>
            {/* center piece */}

            <h2>Basworld Login</h2>

            <form>
                <div className={style.centerInputs}>
                    <div className={style.txtcontainer}>
                        <label>Username</label>
                        <input type="text" placeholder='Please enter your name' value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </div>

                    <div className={style.txtcontainer}>
                        <label>Password</label>
                        <input type="password" placeholder='Please enter your password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                </div>

                <input type="submit" value={"Login"} className={style.loginbtn} onClick={handleSubmit}/>
            </form>
        </div>
    </div>
  )
}
