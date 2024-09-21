import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./navbar.css";

function Navbar() {
  const [user, setUser] = useState({});
  const userId = localStorage.getItem('id'); // ดึง userId จาก localStorage
  const token = localStorage.getItem('token'); // ดึง token จาก localStorage
  const navigate = useNavigate();
  const [searchUsername, setSearchUsername] = useState({ q: '' });

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

  // ฟังก์ชันสำหรับคลิกที่โลโก้เพื่อกลับไปหน้า FeedPage
  const handleLogoClick = () => {
    navigate('/FeedPage');
  };

  // ฟังก์ชันเมื่อพิมพ์ในช่องค้นหา
  const handleSearch = (e) => {
    setSearchUsername({ q: e.target.value });
  };

  // ฟังก์ชันเมื่อกด Enter เพื่อค้นหา
  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && searchUsername.q) {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/hurry-feed/users/search/?q=${searchUsername.q}`, {
          headers: {
            'Authorization': `Bearer ${token}` // ส่ง token ใน header
          }
        });

        if (response.data.length > 0) {
          const foundUser = response.data[0];
          navigate(`/profile/${foundUser.username}`); // เปลี่ยนเส้นทางไปยังหน้า ProfilePage ของผู้ใช้  เปลี่ยนนนนนนนน
        } else {
          alert("No user found");
        }
      } catch (error) {
        console.error("Error searching for user:", error);
      }
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        Hurry Feed
      </div>
      <div className="navbar-right">
        <input 
          type="text" 
          className="navbar-search" 
          placeholder="Search" 
          value={searchUsername.q}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
        />
        <img
          src={user.profile_picture ? `http://127.0.0.1:8000${user.profile_picture}` : "/profileDefault.jpg"}
          alt="Profile"
          className="navbar-profile"
        />
      </div>
    </nav>
  );
}

export default Navbar;
