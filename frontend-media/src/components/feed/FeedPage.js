import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, Modal, Form } from 'react-bootstrap';
import './FeedPage.css';
import image from './1.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faCommentAlt, faNewspaper, faUser, faCog } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function FeedPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [postContent, setPostContent] = useState('');

  const handlePostClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handlePostSubmit = () => {
    // ส่งคำขอ POST ไปยัง API
    axios.post('http://localhost:8000/api/posts/', { content: postContent })
      .then(response => {
        console.log('Post submitted:', response.data);
        // ล้างข้อมูลในฟอร์มหลังจากส่งสำเร็จ
        setPostContent('');
        setShowPopup(false);
      })
      .catch(error => {
        console.error('There was an error posting the data!', error);
      });
  };

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

          {/* Repeat this for each post */}
          <Card className="post">
            <Card.Body>
              <div className="post-header">
                <img src={image} alt="User Avatar" className="avatar" />
                <div className="post-details">
                  <h3>Project</h3>
                  <p>Posted by username</p>
                </div>
              </div>
              <div className="post-actions">
                <Button variant="primary"><FontAwesomeIcon icon={faThumbsUp} /></Button>
                <Form.Control type="text" placeholder="Write a comment..." />
                <Button variant="primary"><FontAwesomeIcon icon={faCommentAlt} /></Button>
              </div>
            </Card.Body>
          </Card>

          {/* Add more posts as needed */}
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
