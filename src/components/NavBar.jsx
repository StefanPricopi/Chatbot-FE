import React from 'react';
import styles from './NavBar.module.css'; 
import { NavLink, useNavigate } from "react-router-dom";
import TokenManager from '../api/TokenManager';

export default function NavBar() {
    const links = [
        {
            id: 1,
            path: "/home",
            text: "Main",
        },  
        {
            id: 2,
            path: "/logs",
            text: "Logs"
        }
    ];

    const navigate = useNavigate();

    const handleLogout = () => {
        TokenManager.clear();
        navigate("/login");
    }

    return (
        <nav className={styles.navBar}>
            <ul>
                {links.map(link => (
                    <li key={link.id}>
                        <NavLink to={link.path} className={styles.navLink}>
                            {link.text}
                        </NavLink>
                    </li>
                ))}
                <li className={styles.logout} onClick={handleLogout}>
                    Logout
                </li>
            </ul>
        </nav>
    );
}
