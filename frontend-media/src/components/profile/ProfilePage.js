import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col, Image } from "react-bootstrap";
import axios from "axios";
import "./ProfilePage.css";
import PostList from "./ProfilePostPage";
import EditProfileModal from "./EditProfileModal"; // นำเข้า Modal

const ProfilePage = () => {
    // const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [posts, setPosts] = useState({});
    // const [isFriend, setIsFriend] = useState(false);
    const [showModal, setShowModal] = useState(false); // State สำหรับ Modal

    // const handleAddFriend = () => {
    //     setIsFriend(!isFriend);
    // };

    const handleEditProfile = () => {
        setShowModal(true); // เปิด Modal
    };

    const handleCloseModal = () => {
        setShowModal(false); // ปิด Modal
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const id = localStorage.getItem('id'); // ดึง userId จาก localStorage
                const token = localStorage.getItem('token'); // ดึง token จาก localStorage

                console.log(id)
                console.log(token)

                if (!token || !id) {
                    console.error('No token or userId found. Please login.');
                    return;
                }

                // ดึงข้อมูล user จาก API
                const userResponse = await axios.get(`http://127.0.0.1:8000/hurry-feed/users/user_profile/${id}/`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}` // ส่ง token ใน header
                        }
                    }
                );

                setUser(userResponse.data.data); // เก็บข้อมูล user

                // ดึงข้อมูล posts จาก API
                const postsResponse = await axios.get(`http://127.0.0.1:8000/hurry-feed/posts/public_and_private/by_author/${id}/`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}` // ส่ง token ใน header
                        }
                    }
                );
                setPosts(postsResponse.data); // เก็บข้อมูล posts
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchUserData();
    }, []);

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
                                <Button variant="secondary" onClick={handleEditProfile}>
                                    Edit Profile
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

            {/* Modal สำหรับแก้ไขข้อมูลโปรไฟล์ */}
            <EditProfileModal 
                show={showModal} 
                handleClose={handleCloseModal} 
                user={user} 
                setUser={setUser} 
            />
        </Container>
    );
};

export default ProfilePage;
