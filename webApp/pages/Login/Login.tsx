import React from "react";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";

const LoginPage: React.FC = () => {
  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <h2 className={styles.title}>Go Electric</h2>
        <p className={styles.subtitle}>Please log in to continue</p>

        <form className={styles.form}>
          <input
            type="text"
            placeholder="Enter your email"
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Enter your password"
            className={styles.input}
          />
          <button className={styles.button}>Login</button>
        </form>

        <div className={styles.linkContainer}>
          <p>Don’t have an account?</p>
          <Link to="/signup" className={styles.link}>
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
