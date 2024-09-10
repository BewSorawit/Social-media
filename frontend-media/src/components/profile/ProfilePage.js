// import React, { useState, useEffect } from "react";
// import { Button, Card, Container, Row, Col, Image } from "react-bootstrap";
// import EditProfileModal from "./EditProfileModal"; // นำเข้า Modal สำหรับแก้ไขโปรไฟล์
// import "./ProfilePage.css";

// const ProfilePage = () => {
//     const [profile, setProfile] = useState({
//         name: "",
//         abouts: "",
//         profilePhoto: "",
//     });
//     const [posts, setPosts] = useState([]); // แยก state สำหรับโพสต์
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     // ฟังก์ชันดึงข้อมูลโปรไฟล์จาก API
//     useEffect(() => {
//         const fetchProfileData = async () => {
//             try {
//                 const response = await fetch("https://api.example.com/profile/A"); // แทนที่ด้วย API จริง
//                 const data = await response.json();

//                 // อัปเดตข้อมูลโปรไฟล์
//                 setProfile({
//                     name: data.name,
//                     abouts: data.abouts,
//                     profilePhoto: data.profilePhoto,
//                 });

//                 // อัปเดตโพสต์
//                 setPosts(data.posts); // แยกโพสต์ออกมาเก็บใน state ต่างหาก
//             } catch (error) {
//                 console.error("Error fetching profile data:", error);
//             }
//         };

//         fetchProfileData();
//     }, []);

//     // เปิด Modal แก้ไขโปรไฟล์
//     const handleEditProfile = () => {
//         setIsModalOpen(true);
//     };

//     // ฟังก์ชันอัปเดตโปรไฟล์หลังจากแก้ไขข้อมูล
//     const handleUpdateProfile = (updatedProfile) => {
//         setProfile(updatedProfile); // อัปเดตข้อมูลในหน้า ProfilePage
//     };

//     return (
//         <Container className="profile-container">
//             <header className="profile-header">
//                 <Row className="justify-content-center">
//                     <Col xs={12} md={4} className="text-center">
//                         <Image
//                             src={profile.profilePhoto || "https://via.placeholder.com/150"}
//                             roundedCircle
//                             className="profile-photo"
//                         />
//                     </Col>
//                     <Col xs={12} md={8}>
//                         <div className="profile-details">
//                             <h1 className="profile-name">{profile.name}</h1>
//                             <p className="profile-abouts">{profile.abouts}</p>
//                             <div className="profile-actions">
//                                 <Button variant="secondary" onClick={handleEditProfile}>
//                                     Edit Profile
//                                 </Button>
//                             </div>
//                         </div>
//                     </Col>
//                 </Row>
//             </header>

//             <section className="profile-content mt-5">
//                 <h2>About</h2>
//                 <Row>
//                     <Col md={4} className="mb-4">
//                         <Card>
//                             <Card.Body>
//                                 <Card.Text>
//                                     Location: Bangkok, Thailand <br />
//                                     Education: Kasetsart University <br />
//                                     Hobbies: Photography, Traveling, Reading
//                                 </Card.Text>
//                             </Card.Body>
//                         </Card>
//                     </Col>

//                     <Col md={8}>
//                         <h2>Posts</h2>
//                         {/* แสดงโพสต์ */}
//                         {posts.length > 0 ? (
//                             posts.map((post, index) => (
//                                 <Card key={index} className="mb-3">
//                                     <Card.Header>
//                                         <Row>
//                                             <Col xs={2}>
//                                                 <Image
//                                                     src="https://via.placeholder.com/50"
//                                                     roundedCircle
//                                                 />
//                                             </Col>
//                                             <Col>
//                                                 <span>{profile.name}</span>
//                                                 <br />
//                                                 <small className="text-muted">{post.time}</small>
//                                             </Col>
//                                         </Row>
//                                     </Card.Header>
//                                     <Card.Body>
//                                         {post.image && (
//                                             <Image
//                                                 src={post.image}
//                                                 fluid
//                                                 className="mb-3"
//                                             />
//                                         )}
//                                         <Card.Text>{post.details}</Card.Text>
//                                     </Card.Body>
//                                 </Card>
//                             ))
//                         ) : (
//                             <p>No posts available.</p>
//                         )}
//                     </Col>
//                 </Row>
//             </section>

//             {/* Modal แก้ไขโปรไฟล์ */}
//             <EditProfileModal
//                 show={isModalOpen}
//                 onHide={() => setIsModalOpen(false)}
//                 profile={profile}
//                 onUpdateProfile={handleUpdateProfile}
//             />
//         </Container>
//     );
// };

// export default ProfilePage;


// ProfilePage.js
import React, { useState } from "react";
import { Button, Card, Container, Row, Col, Image } from "react-bootstrap";
import "./ProfilePage.css";
import ProfileImg from './ProfileImg.jpeg';
import ProfileImg2 from './ProfileImg2.jpg';

const ProfilePage = () => {
    const [isFriend, setIsFriend] = useState(false);

    const handleAddFriend = () => {
        setIsFriend(!isFriend);
    };

    const handleEditProfile = () => {
        // link to page edit profile
        console.log();
    };

    return (
        <Container className="profile-container">
            <header className="profile-header">
                <Row className="justify-content-center">
                    <Col xs={12} md={4} className="text-center">
                        <Image
                            src={ProfileImg}
                            roundedCircle
                            className="profile-photo"
                        />
                    </Col>
                    <Col xs={12} md={8}>
                        <div className="profile-details">
                            <h1 className="profile-name">Surachi Sonkrasae</h1>
                            <p className="profile-bio">เพื่อน 150 คน</p>
                            <div className="profile-actions">
                                <Button
                                    variant={isFriend ? "danger" : "primary"}
                                    onClick={handleAddFriend}
                                    className="me-2"
                                >
                                    {isFriend ? "Unfriend" : "Add Friend"}
                                </Button>
                                <Button variant="secondary" onClick={handleEditProfile}>
                                    Edit Profile
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </header>

            <section className="profile-content mt-5">
                <h2>About</h2>
                <Row>
                    <Col md={4} className="mb-4">
                        <Card>
                            {/* <Card.Header>About</Card.Header> */}
                            <Card.Body>
                                <Card.Text>
                                    Location: Bangkok, Thailand <br />
                                    Education: Kasetsart University <br />
                                    Hobbies: Photography, Traveling, Reading
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={8}>
                        <h2>Posts</h2>
                        <Card className="mb-3">
                            <Card.Header>
                                <Row>
                                    <Col xs={2}>
                                        <Image
                                            src={ProfileImg}
                                            roundedCircle
                                            className="profile-post-photo"
                                        />
                                    </Col>
                                    <Col>
                                        <span>Surachi Sonkrasae</span>
                                        <br />
                                        <small className="text-muted">1 hour ago</small>
                                    </Col>
                                </Row>
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    Throughout Heaven and Earth, I alone am the honored one.
                                </Card.Text>
                                <Image
                                    src={ProfileImg}
                                    fluid
                                    className="post-photo"
                                />
                            </Card.Body>
                        </Card>

                        <Card className="mb-3">
                            <Card.Header>
                                <Row>
                                    <Col xs={2}>
                                        <Image
                                            src={ProfileImg}
                                            roundedCircle
                                            className="profile-post-photo"
                                        />
                                    </Col>
                                    <Col>
                                        <span>Surachi Sonkrasae</span>
                                        <br />
                                        <small className="text-muted">3 hours ago</small>
                                    </Col>
                                </Row>
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    Those who shoot must be prepared to get shot!
                                </Card.Text>
                                <Image
                                    src={ProfileImg2}
                                    fluid
                                    className="post-photo"
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </section>
        </Container>
    );
};

export default ProfilePage;


