// src/components/FeedPage.js

import React, { useState } from 'react';
import './FeedPage.css';
import image from './1.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faCommentAlt, faNewspaper, faUser, faCog } from '@fortawesome/free-solid-svg-icons';



function FeedPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [postContent, setPostContent] = useState('');

  const handlePostClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handlePostSubmit = () => {
    // Handle post submission logic here
    setShowPopup(false);
    setPostContent('');
  };
  
  return (
    <div className="feed-container">
      <div className="sidebar">
      <ul>
          <li>
            <a href="/">
              <FontAwesomeIcon icon={faNewspaper} /> Feed </a>
          </li>
          <li>
            <a href="/">
              <FontAwesomeIcon icon={faUser} /> Profile </a>
          </li>
          <li>
            <a href="/">
              <FontAwesomeIcon icon={faCog} /> Setting</a>
          </li>
        </ul>
      </div>     

      <div className="feed-content">
        
      <div className="post">
          <div className="post-header">
            <img src={image} alt="Jeffrey" className="avatar"/>
            <input type="text" placeholder="Write a comment..." />
          </div>
          <button className="create-post-btn" onClick={handlePostClick}>
            Create
          </button>
        </div>
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h2>Create a Post</h2>
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What's on your mind?"
              />
              <button onClick={handlePostSubmit}>Post</button>
              <button onClick={handleClosePopup} className="close-btn">Close</button>
            </div>
          </div>
        )}

        <div className="post">
          <div className="post-header">
         <img src={image} alt="Jeffrey"  className="avatar"/>
            <div className="post-details">
              <h3>Project</h3>
              <p>Posted by username</p>
            </div>
          </div>
          <div className="post-actions"> 
            <button><FontAwesomeIcon icon={faThumbsUp} /> </button> {/* ไอคอน Like */}
            <input type="text" placeholder="Write a comment..." />
            <button><FontAwesomeIcon icon={faCommentAlt} /></button> {/* ไอคอน Comment */}
          </div>
        </div>

        <div className="post">
          <div className="post-header">
         <img src={image} alt="Jeffrey"  className="avatar"/>
            <div className="post-details">
              <h3>Project</h3>
              <p>Posted by username</p>
            </div>
          </div>
          <div className="post-actions"> 
            <button><FontAwesomeIcon icon={faThumbsUp} /> </button> 
            <input type="text" placeholder="Write a comment..." />
            <button><FontAwesomeIcon icon={faCommentAlt} /></button> 
          </div>
        </div>


        <div className="post">
          <div className="post-header">
         <img src={image} alt="Jeffrey"  className="avatar"/>
            <div className="post-details">
              <h3>Project</h3>
              <p>Posted by username</p>
            </div>
          </div>
          <div className="post-actions"> 
            <button><FontAwesomeIcon icon={faThumbsUp} /> </button> {/* ไอคอน Like */}
            <input type="text" placeholder="Write a comment..." />
            <button><FontAwesomeIcon icon={faCommentAlt} /></button> {/* ไอคอน Comment */}
          </div>
        </div>
        
        
        {/* คุณสามารถเพิ่มโพสต์อื่น ๆ ได้ที่นี่ */}
      </div>
    </div>
  );
}

export default FeedPage;