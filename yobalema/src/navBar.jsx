import './navBar.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <div className="navbar-container">
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/">
        <a className="brand" href="">
          <span className="brand-text">Yobalema</span>
        </a>
        </Link>
        <Link to="/login" className="signin-link">
        <button className='signin-btn'>     
              sign in
        </button>
        </Link>
      </div>
    </nav>
    </div>
  );
}

export default NavBar;
