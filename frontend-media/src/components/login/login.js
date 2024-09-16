import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./login.css";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/hurry-feed/users/login/", {
        username,
        password,
      });

      if (response.status === 200) {
        navigate("/FeedPage");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setError("An error occurred during login.");
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };
  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <div className="input-group">
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button className="login-button" onClick={handleLogin}>Login</button>
        <p>
          Don't have an account?
          <a className="btn-register" onClick={handleRegister}>Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;