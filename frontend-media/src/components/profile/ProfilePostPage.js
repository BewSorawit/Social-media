import React, { useState } from 'react';
import { Card, Image, Dropdown } from 'react-bootstrap';
import { format } from 'date-fns';
import axios from 'axios';
import "./ProfilePost.css";
import EditPostModal from './EditPostModal'; // นำเข้า EditPostModal

const PostList = ({ posts, user }) => {
  const loggedInUserId = localStorage.getItem('id');
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem('token');

    try {
      await axios.delete(`http://127.0.0.1:8000/hurry-feed/posts/${postId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      alert('Post deleted successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post.');
    }
  };

  const handleEditPost = (post) => {
    setCurrentPost(post);
    setShowEditModal(true); // เปิด modal เมื่อคลิกปุ่ม Edit
  };

  const handlePostUpdated = () => {
    // ทำการรีเฟรชโพสต์หลังจากอัปเดตสำเร็จ
    window.location.reload();
  };

  return (
    <>
      {posts.length > 0 ? (
        posts.map((post, index) => {
          const formattedDate = format(new Date(post.created_at), 'dd/MM/yyyy HH:mm');
          return (
            <Card key={index} className="mb-3">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <Image
                    src={user.profile_picture ? `http://127.0.0.1:8000${user.profile_picture}` : "/profileDefault.jpg"}
                    roundedCircle
                    className="profile-post-photo"
                  />
                  <div className="ml-2">
                    <span>{user.first_name} {user.last_name}</span>
                    <br />
                    <small className="text-muted">{formattedDate}</small>
                  </div>
                </div>
                {Number(post.author) === Number(loggedInUserId) && (
                  <Dropdown align="end">
                    <Dropdown.Toggle variant="link" id="dropdown-basic">
                      More
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleDeletePost(post.post_id)}>Delete</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleEditPost(post)}>Edit</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </Card.Header>
              <Card.Body>
                <Card.Text>{post.content}</Card.Text>
                {post.image && <Image src={`http://127.0.0.1:8000${post.image}`} fluid className="mb-3" />}
              </Card.Body>
            </Card>
          );
        })
      ) : (
        <p>No posts available.</p>
      )}

      {currentPost && (
        <EditPostModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          post={currentPost}
          onPostUpdated={handlePostUpdated} // ส่ง callback เพื่ออัปเดตโพสต์
        />
      )}
    </>
  );
};

export default PostList;
