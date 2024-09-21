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
    const [userProfiles, setUserProfiles] = useState({});
    const [postFilter, setPostFilter] = useState('all'); 

    const userId = localStorage.getItem('id');

    const handlePostClick = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setPostContent('');
        setSelectedImage(null);
        setPostVisibility('public');
    };

    const handlePostSubmit = () => {
        const token = localStorage.getItem('token');
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

        axios.post('http://localhost:8000/hurry-feed/posts/create/', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            console.log('Post created successfully:', response.data);
            fetchPosts(); // Refresh the posts after creating a new one
            handleClosePopup();
        })
        .catch(error => {
            console.error('Error creating post:', error);
        });
    };

    const fetchPosts = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        const endpoint = postFilter === 'friends' 
            ? 'http://localhost:8000/hurry-feed/posts/private/' 
            : 'http://localhost:8000/hurry-feed/posts/public/';
    
        axios.get(endpoint, { headers: { 'Authorization': `Bearer ${token}` } })
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
            return;
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
    }, [postFilter]); 

    return (
        <Container>
            <Row>
                <Col md={2} className="sidebar">
                    <ul>
                        <Form.Group controlId="postFilter">
                            <Form.Label>Filter Posts</Form.Label>
                            <Form.Control 
                                as="select" 
                                value={postFilter} 
                                onChange={(e) => setPostFilter(e.target.value)}
                            >
                                <option value="all">ทั้งหมด</option>
                                <option value="friends">เพื่อน</option>
                            </Form.Control>
                        </Form.Group>
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
                                <img src={userProfile && userProfile.profile_picture ? `http://127.0.0.1:8000${userProfile.profile_picture}` : "/profileDefault.jpg"} alt="User Avatar" className="avatar" />
                                <Form.Control type="text" placeholder="Write a comment..." />
                            </div>
                            <Button className="create-post-btn" onClick={handlePostClick}>
                                Create
                            </Button>
                        </Card.Body>
                    </Card>

                    {posts.map(post => (
                        <Card className="post" key={post.id}>
                            <Card.Body>
                                <div className="post-header">
                                    <img 
                                        src={userProfiles[post.author]?.profile_picture 
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

            {/* Modal สำหรับสร้างโพสต์ */}
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
