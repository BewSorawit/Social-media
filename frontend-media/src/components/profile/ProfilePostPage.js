import React from 'react';
import { Card, Image, Row, Col, Dropdown } from 'react-bootstrap';
import { format } from 'date-fns';
import axios from 'axios';
import "./ProfilePost.css";

const PostList = ({ posts, user }) => {
  // ดึง id ของผู้ใช้ที่ล็อกอินจาก localStorage
  const loggedInUserId = localStorage.getItem('id');
  // ฟังก์ชันสำหรับลบโพสต์
  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem('token'); // Get token from localStorage

    try {
      await axios.delete(`http://127.0.0.1:8000/hurry-feed/posts/${postId}/`, {
        headers: {
          'Authorization': `Bearer ${token}` // ส่ง token ใน header
        }
      });
      alert('Post deleted successfully!');
      // คุณสามารถทำให้หน้านี้รีเฟรชหรืออัปเดตโพสต์ได้ที่นี่ หลังจากการลบสำเร็จ
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post.');
    }
  };

  return (
    <>
      {posts.length > 0 ? (
        posts.map((post, index) => {
          // แปลงวันที่และเวลา
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
                  <div className="ml-2"> {/* เพิ่มระยะห่างระหว่างรูปกับชื่อ */}
                    <span>{user.first_name} {user.last_name}</span>
                    <br />
                    <small className="text-muted">{formattedDate}</small>
                  </div>
                </div>
                {/* จัดให้ Dropdown อยู่ด้านขวา */}
                {Number(post.author) === Number(loggedInUserId) && (
                  <Dropdown align="end">
                    <Dropdown.Toggle variant="link" id="dropdown-basic">
                      ...
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleDeletePost(post.post_id)}>Delete</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </Card.Header>
              <Card.Body>
                <Card.Text>{post.content}</Card.Text>
                {/* แสดงรูปภาพถ้ามี */}
                {post.image && <Image src={`http://127.0.0.1:8000${post.image}`} fluid className="mb-3" />}
              </Card.Body>
            </Card>
          );
        })
      ) : (
        <p>No posts available.</p>
      )}
    </>
  );
};

export default PostList;
