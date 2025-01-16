import React, { useState } from "react";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (!isValidEmail(value)) {
      setError("Please enter a valid email address.");
    } else {
      setError("");
    }
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!email || !password) {
      setError("Username or password is incorrect.");
      return;
    }

    setError("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <h2 className={styles.title}>Go Electric</h2>
        <p className={styles.subtitle}>Please log in to continue</p>

        <form className={styles.form} onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter your email"
            className={styles.input}
            value={email}
            onChange={handleEmailChange}
          />
          <input
            type="password"
            placeholder="Enter your password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className={styles.button}>
            Login
          </button>
          <p
            className={`${styles.error} ${
              error ? styles.visible : styles.hidden
            }`}
          >
            {error || " "}
          </p>
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
