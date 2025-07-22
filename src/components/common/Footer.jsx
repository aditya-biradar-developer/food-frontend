import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Footer.css';

const Footer = () => {
  const { currentRole } = useAuth();

  return (
    <footer className="orange-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <h3 className="footer-logo">
              <span className="logo-text">FoodEase</span>
              <span className="logo-dot"></span>
            </h3>
            <p className="footer-tagline">Delivering culinary happiness to your doorstep</p>
            
            <div className="footer-newsletter">
              <h4>Stay Updated</h4>
              <form className="newsletter-form">
                <input type="email" placeholder="Your email address" required />
                <button type="submit">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </form>
            </div>
          </div>
          
          {/* Links Column - Changes based on currentRole */}
          <div className="footer-links">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-menu">
              {currentRole === 'owner' ? (
                <>
                  <li><Link to="/owner/dashboard">Dashboard</Link></li>
                  <li><Link to="/owner/add-food">Add Food</Link></li>
                  <li><Link to="/owner/manage-food">Manage Food</Link></li>
                  <li><Link to="/owner/orders">Orders</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/menu">Our Menu</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                </>
              )}
            </ul>
          </div>
          
          {/* Contact Column */}
          <div className="footer-links">
            <h4 className="footer-heading">Contact Us</h4>
            <ul className="footer-menu">
              <li><a href="tel:+12345678900">Phone: +1 (234) 567-8900</a></li>
              <li><a href="mailto:info@foodease.com">Email: info@foodease.com</a></li>
              <li><span>Address: 123 Food Street, Culinary City</span></li>
            </ul>
          </div>
          
          {/* Social Column */}
          <div className="footer-social">
            <h4 className="footer-heading">Follow Us</h4>
            <div className="social-icons">
              <a href="#" aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M23 3C22.0424 3.67548 20.9821 4.19211 19.86 4.53C19.2577 3.83751 18.4573 3.34669 17.567 3.12393C16.6767 2.90116 15.7395 2.9572 14.8821 3.28445C14.0247 3.61171 13.2884 4.1944 12.773 4.95372C12.2575 5.71303 11.9877 6.61234 12 7.53V8.53C10.2426 8.57557 8.50127 8.18581 6.93101 7.39545C5.36074 6.60508 4.01032 5.43864 3 4C3 4 -1 13 8 17C5.94053 18.398 3.48716 19.0989 1 19C10 24 21 19 21 7.5C20.9991 7.22145 20.9723 6.94359 20.92 6.67C21.9406 5.66349 22.6608 4.39271 23 3V3Z" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5772 15.7723 9.80976 15.3801 9.21484 14.7852C8.61992 14.1902 8.22773 13.4228 8.09406 12.5922C7.96039 11.7616 8.09206 10.9099 8.47032 10.1584C8.84858 9.40685 9.45419 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87658 12.63 8C13.4789 8.12588 14.2648 8.52146 14.8717 9.1283C15.4785 9.73515 15.8741 10.5211 16 11.37Z" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17.5 6.5H17.51" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/cookies">Cookie Policy</Link>
          </div>
          <p className="copyright">&copy; {new Date().getFullYear()} FoodEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;