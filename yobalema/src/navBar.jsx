import './navBar.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from './context/AuthContext';

function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = !darkMode;
    setDarkMode(next);
    root.setAttribute('data-theme', next ? 'dark' : 'light');
  };

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <div className="navbar-inner">
          <Link className="brand" to="/">
            <span className="brand-text">Yobalema</span>
          </Link>

          <div className="nav-links">
            <Link to="/search">Rechercher</Link>
            {isAuthenticated && <Link to="/publish">Publier</Link>}
            {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
            {isAuthenticated && <Link to="/messages">Messages</Link>}
          </div>

          <div className="nav-actions">
            <button className="btn-toggle" onClick={toggleTheme} type="button">
              {darkMode ? 'Light' : 'Dark'}
            </button>

            {isAuthenticated ? (
              <>
                <Link to={`/profile/${user?.id}`} className="signin-link">Mon profil</Link>
                <button className="signin-btn" onClick={logout} type="button">Déconnexion</button>
              </>
            ) : (
              <Link to="/auth/login" className="signin-link">
                <button className="signin-btn" type="button">Connexion</button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
