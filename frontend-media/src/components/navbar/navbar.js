import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./navbar.css";

function Navbar() {
  const [user, setUser] = useState({});
  const userId = localStorage.getItem('id');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(`/ProfilePage`);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token || !userId) {
          console.error('No token or userId found. Please login.');
          return;
        }

        // ดึงข้อมูล user จาก API
        const response = await axios.get(`http://127.0.0.1:8000/hurry-feed/users/user_profile/${userId}/`, {
          headers: {
            'Authorization': `Bearer ${token}` // ส่ง token ใน header
          }
        });

        setUser(response.data.data); // เก็บข้อมูล user
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId, token]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">Hurry Feed</div>
      <div className="navbar-right">
        <input type="text" className="navbar-search" placeholder="Search" />
        <img
          src={user.profile_picture ? `http://127.0.0.1:8000${user.profile_picture}` : "/profileDefault.jpg"}
          alt="Profile"
          className="navbar-profile"
          onClick={handleProfileClick}
          style={{ cursor: "pointer" }}
        />
      </div>
    </nav>
  );
}

export default Navbar;
