import React, { useState } from 'react';
import { Link } from "react-router-dom";
import "./signup.css";
import { useNavigate } from "react-router-dom";

export default function Signup() {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();  

  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); 

    
    const userData = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phoneNumber,
    };

    
    try {
      const response = await fetch("http://localhost:3000/auth/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      

      if (!response.ok) {
        throw new Error("Sign-up failed");
      }

      const data = await response.json();
      console.log("Sign-up successful:", data);
      
      localStorage.setItem('userId', data._id);
    
      navigate("/Home");  

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Sign-up</h1>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)} 
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        <button type="submit">Signup</button>
        <Link to="/">already have an account?</Link>
      </form>
    </div>
  );
}
