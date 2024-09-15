import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';
import ProfilePage from './components/profile/ProfilePage.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import EditProfileModal from './components/profile/EditProfileModal.js';
import './components/feed/FeedPage.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import FeedPage from './components/feed/FeedPage.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
