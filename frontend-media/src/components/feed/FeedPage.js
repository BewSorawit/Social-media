import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Modal, Form } from 'react-bootstrap';
import './FeedPage.css';
import image from './1.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faCommentAlt, faNewspaper, faUser } from '@fortawesome/free-solid-svg-icons';
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
    const [filter, setFilter] = useState('all');
    const userId = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    const handlePostClick = () => {
        setShowPopup(true);
        setPostContent('');
        setSelectedImage(null);
        setPostVisibility('public');
    };

    const handleClosePopup = () => setShowPopup(false);

    const handlePostSubmit = () => {
        if (!token) return console.error('No token found');

        const formData = new FormData();
        formData.append('content', postContent);
        formData.append('visibility', postVisibility);
        if (selectedImage) formData.append('image', selectedImage);

        axios.post('http://localhost:8000/hurry-feed/posts/create/', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                setShowPopup(false);
                fetchPostsByFilter();
            })
            .catch(error => console.error('Error posting data!', error));
    };

    const fetchPostsByFilter = () => {
        const fetchPosts = filter === 'all' ? fetchPublicPosts : fetchPrivatePosts;
        fetchPosts();
    };

    const fetchPublicPosts = () => {
        if (!token) return console.error('No token found');

        axios.get('http://localhost:8000/hurry-feed/posts/public/', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {

                const postsWithLikes = response.data.map(post => ({
                    ...post,
                    likes: post.like_count || 0,  // ตั้งค่าจำนวนไลค์จาก API ตั้งแต่ตอนดึงโพสต์
                    likedUserIds: post.liked_user_ids || []  // ข้อมูลผู้ใช้ที่ไลค์
                }));
                setPosts(postsWithLikes);
                fetchUserProfilesForPosts(postsWithLikes);
            })
            .catch(error => console.error('Error fetching public posts:', error));
    };


    const fetchPrivatePosts = () => {
        if (!token) return console.error('No token found');

        axios.get(`http://localhost:8000/hurry-feed/posts/users/${userId}/followed_posts/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                const postsWithLikes = response.data.map(post => ({
                    ...post,
                    likes: post.like_count || 0, // ใช้จำนวนไลค์จาก API
                    likedUserIds: post.liked_user_ids || []  // ข้อมูลผู้ใช้ที่ไลค์
                }));
                setPosts(postsWithLikes);
                fetchUserProfilesForPosts(postsWithLikes);
            })
            .catch(error => console.error('Error fetching private posts:', error));
    };




    const fetchUserProfilesForPosts = (posts) => {
        const uniqueUserIds = [...new Set(posts.map(post => post.author))];
        uniqueUserIds.forEach(id => fetchUserProfileById(id));
    };

    const fetchUserProfileById = (id) => {
        if (!token) return console.error('No token found');

        axios.get(`http://localhost:8000/hurry-feed/users/user_profile/${id}/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                setUserProfiles(prev => ({ ...prev, [id]: response.data.data }));
            })
            .catch(error => console.error('Error fetching user profile:', error));
    };

    const fetchUserProfile = () => {
        if (!token || !userId) return console.error('No token or user ID found');

        axios.get(`http://localhost:8000/hurry-feed/users/user_profile/${userId}/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => setUserProfile(response.data.data))
            .catch(error => console.error('Error fetching user profile:', error));
    };

    const handleLikePost = (postId) => {
        axios.post('http://localhost:8000/hurry-feed/likes/like_unlike/', { post_id: postId }, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                // หลังจากที่กด like สำเร็จ ให้ fetch ข้อมูล like count
                fetchLikeCount(postId);
            })
            .catch(error => console.error('Error liking post:', error));
    };
    const fetchLikeCount = (postId) => {
        axios.get(`http://localhost:8000/hurry-feed/likes/${postId}/like_count/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                setPosts(prevPosts =>
                    prevPosts.map(post => {
                        if (post.post_id === postId) {
                            return {
                                ...post,
                                likes: response.data.like_count,
                                likedUserIds: response.data.liked_user_ids // อัปเดต likedUserIds
                            };
                        }
                        return post;
                    })
                );
            })
            .catch(error => console.error('Error fetching like count:', error));
    };


    useEffect(() => {
        fetchPostsByFilter();
        fetchUserProfile();
    }, [filter]);

    return (
        <Container>
            <Row>
                <Col md={2} className="sidebar">
                    <ul>
                        <Form.Group controlId="filterDropdown">
                            <Form.Label>Show Posts From</Form.Label>
                            <Form.Control
                                as="select"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="all">All</option>
                                <option value="private">Friends</option>
                            </Form.Control>
                        </Form.Group>
                        <li>
                            <Link to="/FeedPage">
                                <FontAwesomeIcon icon={faNewspaper} /> Feed
                            </Link>
                        </li>
                        <li>
                            <Link to="/ProfilePage">
                                <FontAwesomeIcon icon={faUser} /> Profile
                            </Link>
                        </li>
                    </ul>
                </Col>
                <Col md={8} className="feed-content">
                    <Card className="post">
                        <Card.Body>
                            <div className="post-header">
                                <img src={userProfile?.profile_picture ? `http://127.0.0.1:8000${userProfile.profile_picture}` : image} alt="User Avatar" className="avatar" />
                                <Form.Control type="text" placeholder="Write a Post..." />
                            </div>
                            <Button className="create-post-btn" onClick={handlePostClick}>
                                Create
                            </Button>
                        </Card.Body>
                    </Card>

                    {posts.map(post => (
                        <Card key={post.post_id} className="post">
                            <Card.Body>
                                <div className="post-header">
                                    <img
                                        src={userProfiles[post.author]?.profile_picture ? `http://127.0.0.1:8000${userProfiles[post.author].profile_picture}` : image}
                                        alt="Post User Avatar"
                                        className="avatar"
                                    />
                                    <div className="post-details">
                                        <h3>{userProfiles[post.author] ? `${userProfiles[post.author].first_name} ${userProfiles[post.author].last_name}` : 'Unknown User'}</h3>
                                        <p className="post-date">
                                            {new Date(post.created_at).toLocaleDateString('en-GB')} {new Date(post.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                                <Card.Text>{post.content}</Card.Text>
                                {post.image && (
                                    <div className="post-image">
                                        <img src={`http://127.0.0.1:8000${post.image}`} alt="Post content" />
                                    </div>
                                )}
                                <div className="post-actions">
                                    <Button variant="primary" onClick={() => handleLikePost(post.post_id)}>
                                        <FontAwesomeIcon icon={faThumbsUp} />
                                    </Button>
                                    <span>{post.likes} Likes</span>
                                    {/* <div>
                                        {post.likedUserIds && post.likedUserIds.map(userId => (
                                            <span key={userId}>User ID: {userId}</span>
                                        ))}
                                    </div> */}
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
                            <Form.Control
                                as="select"
                                value={postVisibility}
                                onChange={(e) => setPostVisibility(e.target.value)}
                            >
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formFile">
                            <Form.Label>Upload Image</Form.Label>
                            <Form.Control type="file" onChange={(e) => setSelectedImage(e.target.files[0])} />
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
