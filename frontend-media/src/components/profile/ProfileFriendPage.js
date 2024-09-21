import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button, Container, Row, Col, Image } from "react-bootstrap";
import axios from "axios";
import "./ProfileFriendPage.css";

const ProfileFriendPage = () => {
  const location = useLocation();
  const { userId } = location.state || {}; // Retrieve userId from passed state
  const [user, setUser] = useState({});
  const [isFollowing, setIsFollowing] = useState(false); // Track following status
  const token = localStorage.getItem('token'); // Get token from localStorage

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token || !userId) {
          console.error('No token or userId found. Please login.');
          return;
        }

        // Fetch user data by userId
        const userResponse = await axios.get(
          `http://127.0.0.1:8000/hurry-feed/users/user_profile/${userId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send token in header
            },
          }
        );

        setUser(userResponse.data.data); // Store user data

        // ตรวจสอบสถานะการติดตาม
        const followingResponse = await axios.get(
          `http://127.0.0.1:8000/hurry-feed/userfollow/${userId}/followers/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // เช็คว่าผู้ใช้ติดตามอยู่หรือไม่
        setIsFollowing(followingResponse.data.includes(userId)); // ปรับให้เหมาะสมกับ API ของคุณ
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUserData();
  }, [userId, token]);

  const handleFollow = async () => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/hurry-feed/userfollow/${userId}/follow/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsFollowing(true); // Update following status
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  return (
    <Container className="profile-container">
      <header className="profile-header">
        <Row className="justify-content-center">
          <Col xs={12} md={4} className="text-center">
            <Image
              src={user.profile_picture ? `http://127.0.0.1:8000${user.profile_picture}` : "/profileDefault.jpg"}
              roundedCircle
              className="profile-photo"
            />
          </Col>
          <Col xs={12} md={8}>
            <div className="profile-details">
              <h1 className="profile-name">{user.first_name} {user.last_name}</h1>
              <div className="profile-actions">
                <Button 
                  variant={isFollowing ? "secondary" : "primary"}
                  onClick={handleFollow}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </header>
    </Container>
  );
};

export default ProfileFriendPage;
