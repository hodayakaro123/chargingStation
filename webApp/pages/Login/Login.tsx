import React from "react";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";

const LoginPage: React.FC = () => {
  return (
    <div className={styles.loginPage}>
      <h2>Login</h2>

      <form>
        <input type="text" />
        <input type="text" />
        <button>Login</button>

        <Link to="/signup">Don't have account yet?</Link>
      </form>
    </div>
  );
};

export default LoginPage;
