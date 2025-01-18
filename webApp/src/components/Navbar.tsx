import styles from "./Navbar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUser, FaHome } from "react-icons/fa";
import { MdExitToApp } from "react-icons/md";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("accessToken");
    console.log("accessToken:", accessToken);

    if (!accessToken) {
      console.error("No refresh token found");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken }),
      });

      if (!response.ok) {
        throw new Error(`Logout failed with status: ${response.status}`);
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);

      localStorage.removeItem("accessToken");

      alert("Logout failed. Please try again later.");
    }
  };

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <NavLink
            to="/Admin"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.navLink
            }
          >
            Admin
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink
            to="/Home"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.navLink
            }
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
          >
            <FaUser style={{ marginRight: "8px" }} />
            Personal area
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.navLink
            }
          >
            <MdExitToApp />
            <button
              onClick={handleLogout}
              className={styles.navLink}
              style={{
                padding: "8px 16px",
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
