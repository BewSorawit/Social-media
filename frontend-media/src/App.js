import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/navbar/navbar';
import Login from './components/login/login';
import Register from './components/register/register';
import FeedPage from './components/feed/FeedPage.js';
import ProfilePage from './components/profile/ProfilePage.js';
import PostList from './components/profile/ProfilePostPage.js';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* <Navbar /> */}
        <Routes>
<<<<<<< HEAD
          {/* <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} /> */}
           <Route path="/" element={<Login />} />
           <Route path="/FeedPage" element={<FeedPage />} />

=======
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/FeedPage" element={<FeedPage />} />
          <Route path="/ProfilePage" element={<ProfilePage />} />
>>>>>>> main
        </Routes>
      </div>
    </Router>
  );
}

export default App;