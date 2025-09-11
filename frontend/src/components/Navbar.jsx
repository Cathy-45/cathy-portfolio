import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className="navbar">
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
          />
        </svg>
      </button>
      <ul className={`nav-list ${isOpen ? 'open' : ''}`}>
        <li className="nav-item">
          <NavLink to="/" className="nav-link" data-active={location.pathname === '/'}>
            Home
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/products" className="nav-link" data-active={location.pathname === '/products'}>
            Products
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/portfolio" className="nav-link" data-active={location.pathname === '/portfolio'}>
            Portfolio
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/consultation" className="nav-link" data-active={location.pathname === '/consultation'}>
            Consultation
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/contact" className="nav-link" data-active={location.pathname.startsWith('/contact')}>
            Contact
          </NavLink>
        </li>

         <li className="nav-item">
          <NavLink to="/success" className="nav-link" data-active={location.pathname.startsWith('/contact')}>
            Payment Confirmation
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;