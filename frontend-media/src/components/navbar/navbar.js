import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Dropdown, FormControl, Image } from "react-bootstrap"; // นำเข้า react-bootstrap และ Image
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

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/hurry-feed/users/logout/`, null, {
        headers: {
          'Authorization': `Bearer ${token}` // Send token in header
        }
      });

      // Clear localStorage and navigate to login page
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
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
                  <Image
                    src={result.profile_picture ? result.profile_picture : "/profileDefault.jpg"}
                    className="navbar-profile"
                    alt="Profile"
                    roundedCircle
                    style={{ width: "30px", height: "30px", marginRight: "10px" }}
                  />
                  {result.first_name} {result.last_name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          )}
        </Dropdown>

        <Dropdown align="end"> {/* Add dropdown for user menu */}
          <Dropdown.Toggle as={Image}
            src={user.profile_picture ? `http://127.0.0.1:8000${user.profile_picture}` : "/profileDefault.jpg"}
            alt="Profile"
            className="navbar-profile"
            style={{ cursor: "pointer", width: "40px", height: "40px" }}
          />

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleProfileClick}>Profile</Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item> {/* Add Logout option */}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </nav>
  );
}

export default Navbar;
