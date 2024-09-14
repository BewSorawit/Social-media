import "./navbar.css";
function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Hurry Feed</div>
      <div className="navbar-right">
        <input type="text" className="navbar-search" placeholder="Search" />
        <img src="/logo512.png" alt="Profile" className="navbar-profile" />
      </div>
    </nav>
  );
}

export default Navbar;
