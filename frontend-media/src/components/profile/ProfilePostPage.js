import React from 'react';
import { Card, Image, Row, Col } from 'react-bootstrap';
import { format } from 'date-fns';
import "./ProfilePost.css";

const PostList = ({ posts, user }) => {
  return (
    <>
      {posts.length > 0 ? (
        posts.map((post, index) => {
          // แปลงวันที่และเวลา
          const formattedDate = format(new Date(post.created_at), 'dd/MM/yyyy HH:mm');

          return (
            <Card key={index} className="mb-3">
              <Card.Header>
                <Row>
                  <Col xs={2}>
                    <Image
                      src={`http://127.0.0.1:8000${user.profile_picture}`}
                      roundedCircle
                      className="profile-post-photo"
                    />
                  </Col>
                  <Col>
                    <span>{user.first_name} {user.last_name}</span>
                    <br />
                    <small className="text-muted">{formattedDate}</small>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <Card.Text>{post.content}</Card.Text>
                {/* ประกอบ URL ของรูปภาพโพสต์ */}
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
