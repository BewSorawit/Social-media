// import React, { useState } from "react";
// import { Modal, Button, Form } from "react-bootstrap";

// const EditProfileModal = ({ show, onHide, profile, onUpdateProfile }) => {
//     const [updatedProfile, setUpdatedProfile] = useState({
//         name: profile.name,
//         abouts: profile.abouts,
//         profilePhoto: profile.profilePhoto,
//     });

//     // handle การเปลี่ยนแปลงข้อมูลในฟอร์ม
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setUpdatedProfile((prev) => ({ ...prev, [name]: value }));
//     };

//     // ฟังก์ชันส่งข้อมูลไปอัปเดตใน API
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch("https://api.example.com/profile/A", {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(updatedProfile),
//             });

//             if (response.ok) {
//                 onUpdateProfile(updatedProfile); // อัปเดตข้อมูลใน ProfilePage
//                 onHide(); // ปิด Modal
//             }
//         } catch (error) {
//             console.error("Error updating profile:", error);
//         }
//     };

//     return (
//         <Modal show={show} onHide={onHide}>
//             <Modal.Header closeButton>
//                 <Modal.Title>Edit Profile</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <Form onSubmit={handleSubmit}>
//                     <Form.Group controlId="formName">
//                         <Form.Label>Name</Form.Label>
//                         <Form.Control
//                             type="text"
//                             name="name"
//                             value={updatedProfile.name}
//                             onChange={handleChange}
//                         />
//                     </Form.Group>

//                     <Form.Group controlId="formAbouts">
//                         <Form.Label>Abouts</Form.Label>
//                         <Form.Control
//                             as="textarea"
//                             rows={3}
//                             name="abouts"
//                             value={updatedProfile.abouts}
//                             onChange={handleChange}
//                         />
//                     </Form.Group>

//                     <Form.Group controlId="formProfilePhoto">
//                         <Form.Label>Profile Photo URL</Form.Label>
//                         <Form.Control
//                             type="text"
//                             name="profilePhoto"
//                             value={updatedProfile.profilePhoto}
//                             onChange={handleChange}
//                         />
//                     </Form.Group>

//                     <Button variant="primary" type="submit">
//                         Save Changes
//                     </Button>
//                 </Form>
//             </Modal.Body>
//         </Modal>
//     );
// };

// export default EditProfileModal;
