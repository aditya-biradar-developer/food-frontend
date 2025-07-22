import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Menu, X, ShoppingCart, User, LogOut, ChevronDown } from 'lucide-react';
import '../../styles/Navbar.css';

const Navbar = () => {
  const { user, logout, currentRole, toggleRole } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleToggleRole = () => {
    const newRole = toggleRole();
    setShowDropdown(false);
    
    if (newRole === 'user') {
      navigate('/');
    } else {
      navigate('/owner/dashboard');
    }
  };

  const isActive = (path) => location.pathname === path ? 'navbar-active' : '';

  return (
    <nav className={`navbar-container ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-content">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-text">FoodEase</span>
          <span className="navbar-logo-dot"></span>
        </Link>

        <div className={`navbar-links ${isMenuOpen ? 'navbar-mobile-open' : ''}`}>
          {currentRole === 'owner' ? (
            <>
              <Link to="/owner/dashboard" className={`navbar-link ${isActive('/owner/dashboard')}`}>
                Dashboard
              </Link>
              <Link to="/owner/add-food" className={`navbar-link ${isActive('/owner/add-food')}`}>
                Add Food
              </Link>
              <Link to="/owner/manage-food" className={`navbar-link ${isActive('/owner/manage-food')}`}>
                Manage Food
              </Link>
              <Link to="/owner/orders" className={`navbar-link ${isActive('/owner/orders')}`}>
                Orders
              </Link>
            </>
          ) : (
            <>
              <Link to="/" className={`navbar-link ${isActive('/')}`}>
                Home
              </Link>
              <Link to="/menu" className={`navbar-link ${isActive('/menu')}`}>
                Menu
              </Link>
              <Link to="/contact" className={`navbar-link ${isActive('/contact')}`}>
                Contact
              </Link>
              <Link to="/cart" className="navbar-link navbar-cart-link">
                <ShoppingCart size={18} />
                Cart
                {getCartCount() > 0 && (
                  <span className="navbar-cart-badge">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </>
          )}

          {user ? (
            <div className="navbar-profile" ref={dropdownRef}>
              <button 
                className="navbar-profile-btn" 
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <User size={18} />
                <span className="navbar-profile-name">{user.name}</span>
                <ChevronDown size={16} />
              </button>
              
              {showDropdown && (
                <div className="navbar-dropdown">
                  <div className="navbar-dropdown-header">
                    Switch Role
                  </div>
                  <button className="navbar-dropdown-item" onClick={handleToggleRole}>
                    Switch to {currentRole === 'user' ? 'Owner' : 'User'}
                  </button>
                  <Link 
                    to="/profile" 
                    className="navbar-dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <User size={16} />
                    Profile
                  </Link>
                  <button className="navbar-dropdown-item navbar-logout" onClick={handleLogout}>
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar-auth-links">
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-register-btn">
                Register
              </Link>
            </div>
          )}
        </div>

        <button 
          className={`navbar-mobile-toggle ${isMenuOpen ? 'navbar-mobile-active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;