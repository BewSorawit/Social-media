import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const EditPostModal = ({ show, onHide, post, onPostUpdated }) => {
  const [content, setContent] = useState(post.content);
  const [image, setImage] = useState(null);
  const [visibility, setVisibility] = useState(post.visibility);

  const handleSaveChanges = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();

    formData.append('content', content);
    if (image) formData.append('image', image);
    formData.append('visibility', visibility);

    try {
      await axios.put(`http://127.0.0.1:8000/hurry-feed/posts/${post.post_id}/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      onPostUpdated(); // Call this to refresh posts after updating
      onHide(); // Close the modal after saving
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post.');
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="postContent">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="postImage">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Form.Group>

          <Form.Group controlId="postVisibility">
            <Form.Label>Visibility</Form.Label>
            <Form.Control
              as="select"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditPostModal;
