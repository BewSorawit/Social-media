import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./login.css";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    try {
      // เรียก API สำหรับ login
      const response = await axios.post("http://127.0.0.1:8000/hurry-feed/users/login/", {
        username: username,
        password: password,
      });

      if (response.status === 200 && response.data.access) {
        // เก็บ token ลง localStorage

        localStorage.setItem("id", response.data.id);//userId
        localStorage.setItem("token", response.data.access);

        // นำทางไปที่หน้า Feed
        navigate("/ProfilePage");
      } else {
        setErrorMessage("Login failed! Please check your credentials.");
      }
    } catch (error) {
      // จัดการ error ในกรณี login ไม่สำเร็จ
      setErrorMessage("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        {/* แสดงข้อความแจ้งข้อผิดพลาด */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="input-group">
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // เก็บค่า username
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // เก็บค่า password
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button className="login-button" onClick={handleLogin}>Login</button>
        <p>
          Don't have an account?
          <a className="btn-register" onClick={() => navigate("/register")}>
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;