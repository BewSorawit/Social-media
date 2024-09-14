import { useNavigate } from "react-router-dom";
import React from "react";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/register");
  };
  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <div className="input-group">
          <input type="text" placeholder="username" />
        </div>
        <div className="input-group">
          <input type="password" placeholder="password" />
        </div>
        <button className="login-button">Login</button>
        <p>
          Don't have an account?
          <a className="btn-register" onClick={handleRegister}>Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
