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
            path: "/logs",
            text: "Logs"
        },
    ];

    return (
        <nav className={styles.navBar}>
            <ul>
                {links.map(link => (
                    <li key={link.id}>
                        <NavLink to={link.path} className={link.className}>
                            {link.text}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}