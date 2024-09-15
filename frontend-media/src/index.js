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
    <App/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();