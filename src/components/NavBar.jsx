import React from 'react';
import styles from './NavBar.module.css'; 
import { NavLink } from "react-router-dom";

export default function NavBar() {
    const links = [
        {
            id: 1,
            path: "/",
            text: "Main",
        },
        {
            id: 2,
            path: "/home",
            text: "Home", 
        },
        {
            id: 3,
            path: "/logs",
            text: "Logs"
        },
    ];

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
            </ul>
        </nav>
    );
}
