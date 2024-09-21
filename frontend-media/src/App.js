import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Login from './components/login/login';
import Register from './components/register/register';
import FeedPage from './components/feed/FeedPage.js';
import ProfilePage from './components/profile/ProfilePage.js';
import PostList from './components/profile/ProfilePostPage.js';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const location = useLocation();

  return (
      <div className="App">
        {location.pathname === "/FeedPage" && <Navbar />}        
        <Routes>
          {/* <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} /> */}
           <Route path="/" element={<Login />} />
           <Route path="/FeedPage" element={<FeedPage />} />

          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/FeedPage" element={<FeedPage />} />
          <Route path="/ProfilePage" element={<ProfilePage />} />
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