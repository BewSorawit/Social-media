import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Login from './components/login/login';
import Register from './components/register/register';
import FeedPage from './components/feed/FeedPage.js';
import ProfilePage from './components/profile/ProfilePage.js';
import ProfileFriendPage from './components/profile/ProfileFriendPage.js';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Get token from localStorage

  // Redirect to login if there's no token
  useEffect(() => {
    if (!token && location.pathname !== "/" && location.pathname !== "/register") {
      navigate('/'); // Redirect to login page if not logged in
    }
  }, [token, location.pathname, navigate]);

  return (
    <div className="App">
      {/* Show Navbar on all pages except Login and Register */}
      {location.pathname !== "/" && location.pathname !== "/register" && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/FeedPage" element={<FeedPage />} />
        <Route path="/ProfilePage" element={<ProfilePage />} />
        <Route path="/ProfileFriendPage" element={<ProfileFriendPage />} />
      </Routes>
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
