import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Modal, Form } from 'react-bootstrap';
import './FeedPage.css';
import image from './1.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faCommentAlt, faNewspaper, faUser, faCog } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Link } from 'react-router-dom';

function FeedPage() {
    const [showPopup, setShowPopup] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [posts, setPosts] = useState([]);
    const [userProfile, setUserProfile] = useState(null); 
    const [postVisibility, setPostVisibility] = useState('public');
    const [selectedImage, setSelectedImage] = useState(null);

    const userId = localStorage.getItem('id');

    const handlePostClick = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handlePostSubmit = () => {
        const token = localStorage.getItem('token');
        console.log('Token on submit:', token);
        console.log('User ID:', userId);

        if (!token) {
            console.error('No token found');
            return;
        }

        const formData = new FormData();
        formData.append('content', postContent);
        formData.append('visibility', postVisibility);
        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        // แสดงข้อมูลที่ส่งไปยังเซิร์ฟเวอร์เพื่อการตรวจสอบ
        console.log('FormData:', formData.get('content'), formData.get('visibility'), formData.get('image'));

        axios.post('http://localhost:8000/hurry-feed/posts/create/', 
          formData,
          { headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            } 
          }
        )
        .then(response => {
            console.log('Post submitted:', response.data);
            setPostContent('');
            setSelectedImage(null);
            setPostVisibility('public');
            setShowPopup(false);
            fetchPosts();
        })
        .catch(error => {
            // เพิ่มการแสดงข้อผิดพลาดที่ละเอียดขึ้น
            if (error.response) {
                console.error('Error data:', error.response.data); // ข้อมูลที่ส่งกลับมาจากเซิร์ฟเวอร์
                console.error('Error status:', error.response.status); // สถานะ HTTP
                console.error('Error headers:', error.response.headers); // Headers
            } else if (error.request) {
                console.error('Error request:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
            console.error('There was an error posting the data!', error);
        });
    };

    const fetchPosts = () => {
        const token = localStorage.getItem('token');
        console.log('Token on fetch:', token);

        if (!token) {
            console.error('No token found');
            return;
        }

        axios.get('http://localhost:8000/hurry-feed/posts/public/', 
          { headers: { 'Authorization': `Bearer ${token}` } }
        )
        .then(response => {
            console.log('Posts fetched:', response.data);
            setPosts(response.data);
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
        });
    };

    const fetchUserProfile = () => {
        const token = localStorage.getItem('token');

        if (!token || !userId) {
            console.error('No token or user ID found');
            return;
        }

        axios.get(`http://127.0.0.1:8000/hurry-feed/users/user_profile/${userId}/`, 
          { headers: { 'Authorization': `Bearer ${token}` } }
        )
        .then(response => {
          console.log('User profile fetched:', response.data.data);
          setUserProfile(response.data.data);
        })
        .catch(error => {
          console.error('Error fetching user profile:', error);
        });
    };

    useEffect(() => {
        fetchPosts();
        fetchUserProfile();
    }, []);

    return (
        <Container>
            <Row>
                <Col md={2} className="sidebar">
                    <ul>
                        <li>
                            <Link to="/">
                                <FontAwesomeIcon icon={faNewspaper} /> Feed
                            </Link>
                        </li>
                        <li>
                            <Link to="/profile">
                                <FontAwesomeIcon icon={faUser} /> Profile
                            </Link>
                        </li>
                        <li>
                            <Link to="/settings">
                                <FontAwesomeIcon icon={faCog} /> Setting
                            </Link>
                        </li>
                    </ul>
                </Col>
                <Col md={8} className="feed-content">
                    <Card className="post">
                        <Card.Body>
                            <div className="post-header">
                                <img src={userProfile && userProfile.profile_picture ? `http://127.0.0.1:8000${userProfile.profile_picture}` : image} alt="User Avatar" className="avatar" />
                                <Form.Control type="text" placeholder="Write a comment..." />
                            </div>
                            <Button className="create-post-btn" onClick={handlePostClick}>
                                Create
                            </Button>
                        </Card.Body>
                    </Card>

                    {userProfile && (
                        <div>
                            {/* แสดงข้อมูลอื่น ๆ ที่คุณต้องการ */}
                        </div>
                    )}

{posts.map(post => (
    <Card key={post.id} className="post">
        <Card.Body>
            <div className="post-header">
                <img src={image} alt="Post User Avatar" />
                <div className="post-details">
                    <h3>{post.title || 'Untitled'}</h3>
                    <p>Posted by {post.author.username}</p>
                </div>
            </div>
            
            {/* เพิ่มการแสดงรูปของโพสต์ */}
            {post.image && (
                <div className="post-image">
                    <img 
                        src={`http://127.0.0.1:8000${post.image}`} 
                        alt="Post content" 
                        style={{ width: '100%', height: 'auto', marginTop: '10px' }}
                    />
                </div>
            )}

            <Card.Text>{post.content}</Card.Text>
            <div className="post-actions">
                <Button variant="primary"><FontAwesomeIcon icon={faThumbsUp} /></Button>
                <Form.Control type="text" placeholder="Write a comment..." />
                <Button variant="primary"><FontAwesomeIcon icon={faCommentAlt} /></Button>
            </div>
        </Card.Body>
    </Card>
))}

                </Col>
            </Row>

            <Modal show={showPopup} onHide={handleClosePopup}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="postContent">
                            <Form.Control
                                as="textarea"
                                rows={5}
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                placeholder="What's on your mind?"
                            />
                        </Form.Group>
                        <Form.Group controlId="postVisibility">
                            <Form.Label>Post Visibility</Form.Label>
                            <Form.Control 
                                as="select" 
                                value={postVisibility} 
                                onChange={(e) => setPostVisibility(e.target.value)}
                            >
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="postImage">
                            <Form.Label>Upload Image</Form.Label>
                            <Form.Control 
                                type="file" 
                                onChange={(e) => setSelectedImage(e.target.files[0])} 
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClosePopup}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handlePostSubmit}>
                        Post
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default FeedPage;
