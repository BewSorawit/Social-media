import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button, Container, Row, Col, Image } from "react-bootstrap";
import axios from "axios";
import PostList from "./ProfilePostPage";
import "./ProfileFriendPage.css";

const ProfileFriendPage = () => {
  const location = useLocation();
  const { userId } = location.state || {}; // Retrieve userId from passed state
  const [user, setUser] = useState({});
  const [isFollowing, setIsFollowing] = useState(false); // Track following status
  const token = localStorage.getItem('token'); // Get token from localStorage
  const loggedInUserId = localStorage.getItem('id'); // User ID ของคนที่ล็อกอิน

  const [posts, setPosts] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token || !userId || !loggedInUserId) {
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

        // ดึงรายชื่อคนที่ผู้ใช้ล็อกอินติดตาม
        const followingResponse = await axios.get(
          `http://127.0.0.1:8000/hurry-feed/userfollow/${loggedInUserId}/following/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const postsResponse = await axios.get(`http://127.0.0.1:8000/hurry-feed/posts/users/${userId}/profile_posts/`,
          {
            headers: {
              'Authorization': `Bearer ${token}` // ส่ง token ใน header
            }
          }
        );
        setPosts(postsResponse.data);
        // ตรวจสอบว่าคนที่เราดูโปรไฟล์ (userId) อยู่ในรายชื่อที่เราติดตามหรือไม่
        const isFollowingUser = followingResponse.data.some(
          (followedUser) => followedUser.id === userId
        );
        setIsFollowing(isFollowingUser); // อัปเดตสถานะการติดตาม
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUserData();
  }, [userId, loggedInUserId, token]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        // ถ้าติดตามอยู่ ให้ Unfollow ด้วย DELETE request
        await axios.delete(
          `http://127.0.0.1:8000/hurry-feed/userfollow/${userId}/unfollow/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsFollowing(false); // อัปเดตสถานะเป็น Unfollow
      } else {
        // ถ้ายังไม่ได้ติดตาม ให้ Follow ด้วย POST request
        await axios.post(
          `http://127.0.0.1:8000/hurry-feed/userfollow/${userId}/follow/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsFollowing(true); // อัปเดตสถานะเป็น Follow
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
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
                  variant={isFollowing ? "danger" : "primary"} // เปลี่ยนเป็น "danger" เมื่อ Unfollow
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </header>

      <section className="profile-content mt-5">
        <Col md={8} className="mx-auto">
          <h2 className="text-center">Posts</h2>
          <PostList posts={posts} user={user} />
        </Col>
      </section>
    </Container>
  );
};

export default ProfileFriendPage;
