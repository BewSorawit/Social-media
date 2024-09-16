import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Modal, Form } from 'react-bootstrap';
import './FeedPage.css';
import image from './1.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faCommentAlt, faNewspaper, faUser, faCog } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function FeedPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState([]); // State สำหรับเก็บโพสต์ที่ดึงมา

  const handlePostClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handlePostSubmit = () => {
    const token = localStorage.getItem('token');
    console.log('Token on submit:', token); // แสดง token ในคอนโซล

    if (!token) {
      console.error('No token found');
      return;
    }

    axios.post('http://localhost:8000/hurry-feed/posts/create/', 
      { content: postContent },
      { headers: { 'Authorization': `Bearer ${token}` } }
    )
    .then(response => {
      console.log('Post submitted:', response.data);
      setPostContent('');
      setShowPopup(false);
      fetchPosts(); // ดึงข้อมูลโพสต์ใหม่หลังจากสร้างโพสต์
    })
    .catch(error => {
      console.error('There was an error posting the data!', error);
    });
  };

  const fetchPosts = () => {
    const token = localStorage.getItem('token');
    console.log('Token on fetch:', token); // แสดง token ในคอนโซล

    if (!token) {
      console.error('No token found');
      return;
    }

    axios.get('http://localhost:8000/hurry-feed/posts/public/', 
      { headers: { 'Authorization': `Bearer ${token}` } }
    )
    .then(response => {
      console.log('Posts fetched:', response.data); // ตรวจสอบข้อมูลโพสต์ที่ได้รับ
      setPosts(response.data); // เก็บโพสต์ที่ดึงมาลงใน state
    })
    .catch(error => {
      console.error('Error fetching posts:', error);
    });
  };

  // ดึงข้อมูลโพสต์เมื่อโหลดคอมโพเนนต์
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Container>
      <Row>
        <Col md={2} className="sidebar">
          <ul>
            <li>
              <a href="/">
                <FontAwesomeIcon icon={faNewspaper} /> Feed
              </a>
            </li>
            <li>
              <a href="/">
                <FontAwesomeIcon icon={faUser} /> Profile
              </a>
            </li>
            <li>
              <a href="/">
                <FontAwesomeIcon icon={faCog} /> Setting
              </a>
            </li>
          </ul>
        </Col>
        <Col md={8} className="feed-content">
          <Card className="post">
            <Card.Body>
              <div className="post-header">
                <img src={image} alt="User Avatar" className="avatar" />
                <Form.Control type="text" placeholder="Write a comment..." />
              </div>
              <Button className="create-post-btn" onClick={handlePostClick}>
                Create
              </Button>
            </Card.Body>
          </Card>

          {/* แสดงโพสต์ทั้งหมดที่ดึงมาจาก API */}
          {posts.map(post => (
            <Card key={post.id} className="post">
              <Card.Body>
                <div className="post-header">
                  <img src={image} alt="User Avatar" className="avatar" />
                  <div className="post-details">
                    <h3>{post.title}</h3>
                    <p>Posted by {post.author.username}</p>
                  </div>
                </div>
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
