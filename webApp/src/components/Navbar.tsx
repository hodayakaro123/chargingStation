import styles from "./Navbar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUser, FaHome } from "react-icons/fa";
import { MdExitToApp } from "react-icons/md";

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
            <FaUser style={{ marginRight: "8px" }} /> {/* Icon with margin */}
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
            <MdExitToApp style={{ marginRight: "8px" }} />
          </NavLink>
          <button onClick={handleLogout} className={styles.navLink}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
