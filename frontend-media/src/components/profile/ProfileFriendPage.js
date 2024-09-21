import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Use useLocation to get passed state
import { Container, Row, Col, Image } from "react-bootstrap";
import axios from "axios";
import "./ProfileFriendPage.css";

const ProfileFriendPage = () => {
  const location = useLocation();
  const { userId } = location.state || {}; // Retrieve userId from passed state
  const [user, setUser] = useState({});
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
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUserData();
  }, [userId, token]);

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
              <h1 className="profile-name">
                {user.first_name} {user.last_name}
              </h1>
            </div>
          </Col>
        </Row>
      </header>
    </Container>
  );
};

export default ProfileFriendPage;
