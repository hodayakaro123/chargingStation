// import React from "react";
import styles from "./Navbar.module.css";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <NavLink
            to="/newChargingStation"
            className={({ isActive }: { isActive: boolean }) =>
              isActive ? styles.activeLink : styles.navLink
            }
          >
            Add my own charging station
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink
            to="/ActivityHistory"
            className={({ isActive }: { isActive: boolean }) =>
              isActive ? styles.activeLink : styles.navLink
            }
          >
            Activity history
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink
            to="/PersonalArea"
            className={({ isActive }: { isActive: boolean }) =>
              isActive ? styles.activeLink : styles.navLink
            }
          >
            Personal area
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink
            to="/Home"
            className={({ isActive }: { isActive: boolean }) =>
              isActive ? styles.activeLink : styles.navLink
            }
          >
            Home
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink
            to="/"
            className={({ isActive }: { isActive: boolean }) =>
              isActive ? styles.activeLink : styles.navLink
            }
          >
            Logout
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
