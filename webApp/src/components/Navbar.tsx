import styles from "./Navbar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUser, FaHome } from "react-icons/fa";
import { MdExitToApp } from "react-icons/md";
import { useState, useEffect } from "react";


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken) {
      console.error("No access token found");
      return;
    }
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
        throw new Error(`Logout failed with status: ${response.status}`);
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Logout failed. Please try again later.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.clear();
    }
  };

  
  useEffect(() => {
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");
    const email = localStorage.getItem("email");

    if (firstName === "admin" &&lastName === "master" && email === "adminmaster@gmail.com"
    ) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false); 
    }
  }, []); 

  return (
    <nav className={styles.navbar}>
      <div className={styles.hamburger} onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <ul className={`${styles.navList} ${isMenuOpen ? styles.active : ""}`}>
        {isAdmin && ( // Only show "Admin" if isAdmin is true
          <li className={styles.navItem}>
            <NavLink
              to="/Admin"
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.navLink
              }
              onClick={closeMenu}
            >
              Admin
            </NavLink>
          </li>
        )}
        <li className={styles.navItem}>
          <NavLink
            to="/Home"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.navLink
            }
            onClick={closeMenu}
          >
            <FaHome style={{ marginRight: "8px" }} />
            Home
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink
            to="/newChargingStation"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.navLink
            }
            onClick={closeMenu}
          >
            Add my own charging station
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink
            to="/ActivityHistory"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.navLink
            }
            onClick={closeMenu}
          >
            Activity history
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink
            to="/PersonalArea"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.navLink
            }
            onClick={closeMenu}
          >
            <FaUser style={{ marginRight: "8px" }} />
            Personal area
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <button
            onClick={() => {
              handleLogout();
              closeMenu();
            }}
            className={styles.navLink}
          >
            <MdExitToApp style={{ marginRight: "8px" }} />
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}