import React, { useState, useEffect } from "react";
import { Button, Card, Container, Row, Col, Image } from "react-bootstrap";
import axios from "axios";
import "./ProfilePage.css";
import PostList from "./ProfilePostPage";

const ProfilePage = () => {
    const [user, setUser] = useState({});
    const [posts, setPosts] = useState({});
    const [isFriend, setIsFriend] = useState(false);

    const handleAddFriend = () => {
        setIsFriend(!isFriend);
    };

    const handleEditProfile = () => {
        console.log();// link to page edit profile
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = localStorage.getItem('userId'); // ดึง userId จาก localStorage
                const token = localStorage.getItem('token'); // ดึง token จาก localStorage

                if (!token || !userId) {
                    console.error('No token or userId found. Please login.');
                    return;
                }

                // ดึงข้อมูล user จาก API
                const userResponse = await axios.get(`http://127.0.0.1:8000/hurry-feed/users/user_profile/${userId}/`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}` // ส่ง token ใน header
                        }
                    }
                );
                setUser(userResponse.data.user); // เก็บข้อมูล user

                // ดึงข้อมูล posts จาก API
                const postsResponse = await axios.get(`http://127.0.0.1:8000/hurry-feed/posts/public/by_author/${userId}/`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}` // ส่ง token ใน header
                        }
                    }
                );
                setPosts(postsResponse.data.posts); // เก็บข้อมูล posts
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
                            src={user.image}
                            roundedCircle
                            className="profile-photo"
                        />
                    </Col>
                    <Col xs={12} md={8}>
                        <div className="profile-details">
                            <h1 className="profile-name">{user.first_name}</h1>
                            {/* <p className="profile-bio">เพื่อน 150 คน</p> */}
                            <div className="profile-actions">
                                <Button
                                    variant={isFriend ? "danger" : "primary"}
                                    onClick={handleAddFriend}
                                    className="me-2"
                                >
                                    {isFriend ? "Unfriend" : "Add Friend"}
                                </Button>
                                <Button variant="secondary" onClick={handleEditProfile}>
                                    Edit Profile
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </header>

            <section className="profile-content mt-5">
                <h2>About</h2>
                <Row>
                    <Col md={4} className="mb-4">
                        <Card>
                            {/* <Card.Header>About</Card.Header> */}
                            <Card.Body>
                                <Card.Text>
                                    Location: Bangkok, Thailand <br />
                                    Education: Kasetsart University <br />
                                    Hobbies: Photography, Traveling, Reading
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                    <Col md={8}>
                        <h2>Posts</h2>
                        <PostList posts={posts} user={user}/> {/* ส่งข้อมูลไปที่ PostList */}

                    </Col>
            </section>
        </Container>
    );
};

export default ProfilePage;


