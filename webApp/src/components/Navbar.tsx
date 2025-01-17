import styles from "./Navbar.module.css";
import { NavLink } from "react-router-dom";
import { FaUser, FaHome } from "react-icons/fa";
import { MdExitToApp } from "react-icons/md";
export default function Navbar() {
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
            Logout
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
