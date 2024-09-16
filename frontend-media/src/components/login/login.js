import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import "./login.css";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    axios.post('http://localhost:8000/hurry-feed/users/login/', { username, password })
      .then(response => {
        const token = response.data.access; // ใช้ 'access' จาก API ของคุณ
        console.log('Token from login:', token); // ตรวจสอบว่า token ได้รับมาหรือไม่
        localStorage.setItem('token', token); // เก็บ token ใน localStorage
        navigate("/feedPage"); // นำทางไปยังหน้าที่คุณต้องการหลังจากล็อกอินสำเร็จ
      })
      .catch(error => {
        console.error('Error logging in:', error);
        // แสดงข้อความแสดงข้อผิดพลาด
      });
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
