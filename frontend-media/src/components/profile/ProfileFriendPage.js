import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // ใช้ useParams เพื่อดึง userId จาก URL
import { Button, Container, Row, Col, Image } from "react-bootstrap";
import axios from "axios";
import "./ProfileFriendPage.css";

const ProfileFriendPage = () => {
    const { userId } = useParams(); // ดึง userId จาก URL
    const [user, setUser] = useState({});
    const token = localStorage.getItem('token'); // ดึง token จาก localStorage

    const handleFollow = () => {
        // ฟังก์ชัน follow เพื่อน
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!token || !userId) {
                    console.error('No token or userId found. Please login.');
                    return;
                }

                // ดึงข้อมูล user จาก API โดยใช้ userId ที่ถูกกดมาจากการค้นหา
                const userResponse = await axios.get(`http://127.0.0.1:8000/hurry-feed/users/user_profile/${userId}/`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}` // ส่ง token ใน header เพื่อยืนยันตัวตน
                        }
                    }
                );

                setUser(userResponse.data.data); // เก็บข้อมูล user ที่ถูกเลือกจากการค้นหา
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchUserData();
    }, [userId, token]); // เมื่อ userId เปลี่ยน ให้ดึงข้อมูลผู้ใช้ใหม่

    return (
        <Container className="profile-container">
            <header className="profile-header">
                <Row className="justify-content-center">
                    <Col xs={12} md={4} className="text-center">
                        <Image
                            src={`http://127.0.0.1:8000${user.profile_picture}`}
                            roundedCircle
                            className="profile-photo"
                        />
                    </Col>
                    <Col xs={12} md={8}>
                        <div className="profile-details">
                            <h1 className="profile-name">{user.first_name} {user.last_name}</h1>
                            <div className="profile-actions">
                                <Button variant="secondary" onClick={handleFollow}>
                                    Follow
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
