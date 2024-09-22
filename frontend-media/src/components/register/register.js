import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    confirmPassword: "",
    date_of_birth: "",
    gender: "",
    profile_picture: null,
  });

  const [showPassword, setShowPassword] = useState(false); // สำหรับสลับการแสดงรหัสผ่าน
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // สำหรับ confirm password
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = () => {
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    axios
      .post(
        "http://127.0.0.1:8000/hurry-feed/users/user_profile/create_user/",
        formData
      )
      .then((response) => {
        // alert("Registration Successful!");
        // console.log(response.data);
        navigate("/");
      })
      .catch((error) => {
        console.error(
          "There was an error registering!",
          error.response ? error.response.data : error.message
        );
      });
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h1>Register</h1>

        <div className="form-row">
          <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              name="first_name"
              maxLength="20"
              value={formData.first_name || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              name="last_name"
              maxLength="20"
              value={formData.last_name || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            maxLength="20"
            value={formData.username || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <div className="form-row">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="btn-showhidePass"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Confirm Password:</label>
          <div className="form-row">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="password"
              name="confirmPassword"
              value={formData.confirmPassword || ""}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="btn-showhidePass"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date of Birth:</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Gender:</label>
            <select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn-register">
          Register
        </button>
        <p>
          Already have an account?
          <a className="btn-login" onClick={handleLogin}>
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

export default Register;
