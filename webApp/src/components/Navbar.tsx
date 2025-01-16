// import React from "react";
import styles from "./Navbar.module.css";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    console.log("refreshToken:", refreshToken);

    if (!refreshToken) {
      console.error("No refresh token found");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");


      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

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

          <button onClick={handleLogout} className={styles.navLink}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
