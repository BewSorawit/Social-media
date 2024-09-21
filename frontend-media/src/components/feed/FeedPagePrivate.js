import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Modal, Form } from 'react-bootstrap';
import './FeedPage.css';
import image from './1.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faCommentAlt, faNewspaper, faUser, faCog } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Link } from 'react-router-dom';

function FeedPagePrivate() {
    const [showPopup, setShowPopup] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [posts, setPosts] = useState([]);
    const [userProfile, setUserProfile] = useState(null); 
    const [selectedImage, setSelectedImage] = useState(null);
    const [creationTime, setCreationTime] = useState(null);
    const [userProfiles, setUserProfiles] = useState({});

    const userId = localStorage.getItem('id');

    const handlePostClick = () => {
        setShowPopup(true);
        setCreationTime(new Date().toLocaleString());
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handlePostSubmit = () => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('No token found');
            return;
        }

        const formData = new FormData();
        formData.append('content', postContent);
        formData.append('visibility', 'private'); // ตั้งให้เป็น private
        if (selectedImage) {
            formData.append('image', selectedImage);
        }

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
            setCreationTime(null);
            setShowPopup(false);
            fetchPosts(); // เรียกใช้เพื่อดึงโพสต์ใหม่
        })
        .catch(error => {
            console.error('There was an error posting the data!', error);
        });
    };

    const fetchPosts = () => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('No token found');
            return;
        }

        axios.get('http://localhost:8000/hurry-feed/posts/private/', 
          { headers: { 'Authorization': `Bearer ${token}` } }
        )
        .then(response => {
            setPosts(response.data);
            response.data.forEach(post => {
                fetchUserProfileById(post.author);
            });
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
            setUserProfile(response.data.data);
        })
        .catch(error => {
            console.error('Error fetching user profile:', error);
        });
    };

    const fetchUserProfileById = (authorId) => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('No token found');
            return;
        }

        if (userProfiles[authorId]) {
            return; // ถ้าข้อมูลผู้ใช้มีอยู่แล้วไม่ต้องดึงซ้ำ
        }

        axios.get(`http://127.0.0.1:8000/hurry-feed/users/user_profile/${authorId}/`, 
          { headers: { 'Authorization': `Bearer ${token}` } }
        )
        .then(response => {
            setUserProfiles(prevProfiles => ({
                ...prevProfiles,
                [authorId]: response.data.data
            }));
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

                    {posts.map(post => (
                        <Card className="post" key={post.post_id}>
                            <Card.Body>
                                <div className="post-header">
                                    <img 
                                        src={userProfiles[post.author] && userProfiles[post.author].profile_picture 
                                            ? `http://127.0.0.1:8000${userProfiles[post.author].profile_picture}` 
                                            : image} 
                                        alt="Post User Avatar" 
                                        className="avatar" 
                                    />
                                    <div className="post-details">
                                        <h3>{userProfiles[post.author] 
                                            ? `${userProfiles[post.author].first_name} ${userProfiles[post.author].last_name}` 
                                            : 'Unknown User'}</h3>
                                        <p className="post-date">
                                            {new Date(post.created_at).toLocaleDateString()} {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>

                                {post.image && (
                                    <div className="post-image">
                                        <img 
                                            src={`http://127.0.0.1:8000${post.image}`} 
                                            alt="Post content" 
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
                                value="private" 
                                readOnly
                            >
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
                        <Form.Group controlId="creationTime">
                            <Form.Label>Created At</Form.Label>
                            <Form.Control
                                type="text"
                                value={creationTime || ''}
                                readOnly
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

export default FeedPagePrivate;
