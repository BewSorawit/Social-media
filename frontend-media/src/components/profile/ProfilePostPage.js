import { Card, Image, Row, Col } from "react-bootstrap";
import "./ProfilePost.css"

const PostList = ({posts,user}) => {
    return (
        <>
            {posts.length > 0 ? (
                posts.map((post, index) => (
                    <Card key={index} className="mb-3">
                        <Card.Header>
                            <Row>
                                <Col xs={2}>
                                    <Image
                                        src={user.profile_picture}
                                        roundedCircle
                                        className="profile-post-photo"
                                    />
                                </Col>
                                <Col>
                                    <span>{user.first_name}{user.last_name}</span>
                                    <br />
                                    <small className="text-muted">{post.created_at}</small>
                                </Col>
                            </Row>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>{post.content}</Card.Text>
                            {post.image && <Image src={post.image} fluid className="mb-3" />}
                        </Card.Body>
                    </Card>
                ))
            ) : (
                <p>No posts available.</p>
            )}
        </>
    );
};

export default PostList;
