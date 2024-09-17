import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const EditProfileModal = ({ show, handleClose, user, setUser }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: null,
    gender: '',
  });

  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        date_of_birth: user.date_of_birth ? new Date(user.date_of_birth) : null,
        gender: user.gender || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date_of_birth: date,
    });
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const id = user.id;
      const token = localStorage.getItem('token');

      const formDataToSend = new FormData();
      if (formData.first_name !== user.first_name) {
        formDataToSend.append('first_name', formData.first_name);
      }
      if (formData.last_name !== user.last_name) {
        formDataToSend.append('last_name', formData.last_name);
      }
      if (formData.date_of_birth && format(formData.date_of_birth, 'yyyy-MM-dd') !== user.date_of_birth) {
        formDataToSend.append('date_of_birth', format(formData.date_of_birth, 'yyyy-MM-dd')); // ใช้ yyyy-MM-dd
      }
      if (formData.gender !== user.gender) {
        formDataToSend.append('gender', formData.gender);
      }

      if (profilePicture) {
        formDataToSend.append('profile_picture', profilePicture);
      }

      // ตรวจสอบว่ามีข้อมูลใน formDataToSend หรือไม่
      if (formDataToSend.entries().next().done) {
        console.log("No data to update");
        handleClose(); // ปิด Modal เมื่อไม่มีข้อมูลเพื่ออัปเดต
        return;
      }

      const response = await axios.put(
        `http://127.0.0.1:8000/hurry-feed/users/user_profile/update/${id}/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log("Response received:", response.data);
      setUser(response.data.data); // อัปเดตข้อมูลใน state ใช้ response.data.data
      handleClose(); // ปิด Modal เมื่อสำเร็จ
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDOB">
            <Form.Label>Date of Birth (yyyy/mm/dd)</Form.Label>
            <DatePicker
              selected={formData.date_of_birth}
              onChange={handleDateChange}
              dateFormat="yyyy/MM/dd"
              className="form-control"
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGender">
            <Form.Label>Gender</Form.Label>
            <Form.Control
              as="select"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option> {/* ให้มีตัวเลือกว่าง */}
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formProfilePicture">
            <Form.Label>Profile Picture</Form.Label>
            <Form.Control
              type="file"
              name="profile_picture"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProfileModal;
