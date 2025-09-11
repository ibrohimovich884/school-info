import { useState } from "react";
import { NavLink } from "react-router"; 
import "./Header.css";

function Header() {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(prev => !prev);
  const close = () => setOpen(false);

  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand" onClick={close} role="button" tabIndex={0}>
          <h1 className="logo">MyApp</h1>
          <span className="tagline">Bilim. Ijod. Jamiyat.</span>
        </div>

        <button
          className={`burger ${open ? "open" : ""}`}
          onClick={toggle}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav ${open ? "open" : ""}`}>
          <ul>
            <li><NavLink to="/" onClick={close} end>Home</NavLink></li>
            <li><NavLink to="/about" onClick={close}>About</NavLink></li>
            <li><NavLink to="/contact" onClick={close}>Contact</NavLink></li>
            <li><NavLink to="/grade" onClick={close}>Grade</NavLink></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
