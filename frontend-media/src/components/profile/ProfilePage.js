import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col, Image } from "react-bootstrap";
import axios from "axios";
import "./ProfilePage.css";
import PostList from "./ProfilePostPage";

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [posts, setPosts] = useState({});
    const [isFriend, setIsFriend] = useState(false);

    const handleAddFriend = () => {
        setIsFriend(!isFriend);
    };

    const handleEditProfile = () => {
        navigate("/ProfilePage");
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const id = localStorage.getItem('id'); // ดึง userId จาก localStorage
                const token = localStorage.getItem('token'); // ดึง token จาก localStorage

                console.log(id)//อย่าลืมลบ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                console.log(token)//อย่าลืมลบ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

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
                console.log(userResponse.data);
                // ดึงข้อมูล posts จาก API
                const postsResponse = await axios.get(`http://127.0.0.1:8000/hurry-feed/posts/public/by_author/${id}/`,
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
                            src={user.profile_picture}
                            roundedCircle
                            className="profile-photo"
                        />
                    </Col>
                    <Col xs={12} md={8}>
                        <div className="profile-details">
                            <h1 className="profile-name">{user.first_name} {user.last_name}</h1>
                            {/* <p className="profile-bio">เพื่อน 150 คน</p> */}
                            <div className="profile-actions">
                                {/* <Button
                                    variant={isFriend ? "danger" : "primary"}
                                    onClick={handleAddFriend}
                                    className="me-2"
                                >
                                    {isFriend ? "Unfriend" : "Add Friend"}
                                </Button> */}
                                <Button variant="secondary" onClick={handleEditProfile}>
                                    Edit Profile
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </header>

            <section className="profile-content mt-5">
                {/* <h2>About</h2> */}
                <Row>
                    <Col md={4} className="mb-4">
                        {/* <Card>
                            <Card.Header>About</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    Location: Bangkok, Thailand <br />
                                    Education: Kasetsart University <br />
                                    Hobbies: Photography, Traveling, Reading
                                </Card.Text>
                            </Card.Body>
                        </Card> */}
                    </Col>
                </Row>
                <Col md={8} className="mx-auto"> {/* ใช้ mx-auto เพื่อจัดกลางแนวนอน */}
                    <h2 className="text-center">Posts</h2> {/* ใช้ text-center เพื่อจัดกลางข้อความ */}
                    <PostList posts={posts} user={user} /> {/* ส่งข้อมูลไปที่ PostList */}
                </Col>
            </section>
        </Container>
    );
};

export default ProfilePage;


