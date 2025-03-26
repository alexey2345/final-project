import { Link, NavLink } from "react-router-dom";
import Logo from "./logo";
import { useAuth } from "../contexts/auth.context";
import { useState } from "react";

function NavBar({ setSearch, isNightMode, toggleNightMode }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={`navbar ${isNightMode ? "dark-mode" : ""}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <Logo isNightMode={isNightMode} />
        </Link>

        {/* Search Bar */}
        <input
          type="search"
          className="search-bar"
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Menu Toggle Button */}
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        {/* Links */}
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>

          {user ? (
            <>
              <li>
                <NavLink to="/favorites">Favorites</NavLink>
              </li>
              <li>
                <button onClick={logout} className="logout-btn">
                  Sign Out
                </button>
              </li>
              {user.isBusiness && (
                <>
                  <li>
                    <NavLink to="/new-card">New Card</NavLink>
                  </li>
                  <li>
                    <NavLink to="/my-cards">My Cards</NavLink>
                  </li>
                </>
              )}
            </>
          ) : (
            <>
              <li>
                <NavLink to="/sign-in">Sign In</NavLink>
              </li>
              <li>
                <NavLink to="/sign-up">Sign Up</NavLink>
              </li>
            </>
          )}

          {/* Night Mode Toggle */}
          <li>
            <button className="toggle-mode" onClick={toggleNightMode}>
              {isNightMode ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>
          </li>
        </ul>
      </div>

      <style>{`
        .navbar {
          background: ${isNightMode ? "#222" : "#f8f9fa"};
          color: ${isNightMode ? "#fff" : "#000"};
          padding: 10px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .navbar-container {
          display: flex;
          align-items: center;
          width: 100%;
        }
        .logo {
          font-size: 1.5rem;
          font-weight: bold;
        }
        .search-bar {
          flex: 1;
          padding: 5px;
          margin: 0 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .menu-toggle {
          font-size: 1.5rem;
          background: none;
          border: none;
          cursor: pointer;
          display: none;
        }
        .nav-links {
          display: flex;
          gap: 15px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nav-links li {
          display: flex;
          align-items: center;
        }
        .nav-links a,
        .logout-btn,
        .toggle-mode {
          text-decoration: none;
          padding: 8px 12px;
          border-radius: 5px;
          cursor: pointer;
          background: none;
          border: none;
        }
        .logout-btn {
          color: red;
        }
        .toggle-mode {
          font-weight: bold;
        }
        .nav-links.open {
          display: flex;
          flex-direction: column;
          position: absolute;
          top: 60px;
          right: 20px;
          background: ${isNightMode ? "#333" : "#fff"};
          padding: 10px;
          border-radius: 5px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        @media (max-width: 768px) {
          .menu-toggle {
            display: block;
          }
          .nav-links {
            display: none;
          }
          .nav-links.open {
            display: flex;
          }
        }
      `}</style>
    </nav>
  );
}

export default NavBar;
