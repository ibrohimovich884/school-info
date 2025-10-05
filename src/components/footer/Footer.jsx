import "./Footer.css";
import { NavLink } from "react-router"; 

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <a href="/" className="logo">Back</a>
          <p className="tagline">Learning made simple</p>
        </div>

        <nav className="footer-nav">
          <ul>
            <li><NavLink to="/" onClick={close} end>Home</NavLink></li>
            <li><NavLink to="/about">About</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
          </ul>
        </nav>

        {/* Socials */}
        <div className="footer-socials">
          <a href="https://t.me/ibrohimovich_o1" target="_blank" rel="noreferrer">Telegram</a>
          <a href="https://instagram.com/ibrohimovich_o1" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://github.com/ibrohimovich884" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </div>

      {/* Bottom note */}
      <div className="footer-bottom">
        <p>&copy; 2025 MyApp. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
