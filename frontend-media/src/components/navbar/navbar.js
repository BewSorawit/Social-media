import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Dropdown, FormControl } from "react-bootstrap"; // นำเข้า react-bootstrap
import "./navbar.css";

function Navbar() {
  const [user, setUser] = useState({});
  const userId = localStorage.getItem('id'); // Get userId from localStorage
  const token = localStorage.getItem('token'); // Get token from localStorage
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(''); // To store the search input
  const [searchResults, setSearchResults] = useState([]); // To store search results

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token || !userId) {
          console.error('No token or userId found. Please login.');
          return;
        }

        // Fetch user data from API
        const response = await axios.get(`http://127.0.0.1:8000/hurry-feed/users/user_profile/${userId}/`, {
          headers: {
            'Authorization': `Bearer ${token}` // Send token in header
          }
        });

        setUser(response.data.data); // Store user data
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId, token]);

  // Function to navigate to FeedPage when logo is clicked
  const handleLogoClick = () => {
    navigate('/FeedPage');
  };

  const handleProfileClick = () => {
    navigate('/ProfilePage');
  };

  // Handle search input change
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/hurry-feed/users/search/?q=${query}`, {
          headers: {
            'Authorization': `Bearer ${token}` // Send token in header
          }
        });

        setSearchResults(response.data); // Store search results
      } catch (error) {
        console.error("Error searching for user:", error);
      }
    } else {
      setSearchResults([]); // Clear search results if no input
    }
  };

  // Function to handle user selection and navigate based on userId
  const handleSelectUser = (selectedUserId) => {
    if (selectedUserId === Number(userId)) {
      navigate('/ProfilePage'); // Navigate to ProfilePage if it's the current user
    } else {
      navigate('/ProfileFriendPage', { state: { userId: selectedUserId } }); // Pass userId via state to ProfileFriendPage
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        Hurry Feed
      </div>
      <div className="navbar-right">
        <Dropdown>
          <Dropdown.Toggle variant="light" id="dropdown-basic" as={FormControl} // ใช้ FormControl เป็น Toggle
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch} />

          {searchResults.length > 0 && (
            <Dropdown.Menu>
              {searchResults.map((result) => (
                <Dropdown.Item key={result.id} onClick={() => handleSelectUser(result.id)}>
                  {result.first_name} {result.last_name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          )}
        </Dropdown>

        <img
          src={user.profile_picture ? `http://127.0.0.1:8000${user.profile_picture}` : "/profileDefault.jpg"}
          alt="Profile"
          className="navbar-profile"
          onClick={handleProfileClick}
          style={{ cursor: "pointer" }}
        />
      </div>
    </nav>
  );
}

export default Navbar;
