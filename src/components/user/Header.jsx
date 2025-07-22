import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Star, Truck } from 'lucide-react';
import '../../styles/Header.css';

const Header = () => {
  return (
    <header className="header-hero">
      <div className="header-pattern"></div>
      <div className="header-floating-orbs">
        <div className="header-orb header-orb-1"></div>
        <div className="header-orb header-orb-2"></div>
        <div className="header-orb header-orb-3"></div>
      </div>

      <div className="header-container">
        <div className="header-content">
          <div className="header-tagline">
            <span><Star className="header-icon" size={16} /> Hot & Fresh</span>
            <span><Truck className="header-icon" size={16} /> Fast Delivery</span>
          </div>
          <h1 className="header-title">
            <span className="header-title-line">Savor the</span>
            <span className="header-title-line header-highlight">Orange Crush</span>
            <span className="header-title-line">Experience</span>
          </h1>
          <p className="header-description">
            We don't just deliver food, we deliver culinary happiness straight to your door. 
            Our partner chefs craft each dish with passion and the freshest ingredients.
          </p>
          
          <div className="header-actions">
            <Link to="/menu" className="header-cta-button header-primary">
              <span>Explore Menu</span>
              <ArrowRight size={20} />
            </Link>
            <div className="header-delivery-option">
              <div className="header-delivery-icon">
                <Clock size={20} />
              </div>
              <span>30-min delivery guarantee</span>
            </div>
          </div>
        </div>

        <div className="header-visual">
          <div className="header-food-card">
            <img 
              src="https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=800" 
              alt="Gourmet burger"
            />
            <div className="header-food-badge">
              <Star size={16} fill="#FF6B00" color="#FF6B00" />
              <span>Chef's Choice</span>
            </div>
          </div>
          <div className="header-food-card header-small">
            <img 
              src="https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=800" 
              alt="Fresh salad"
            />
          </div>
          <div className="header-food-card header-small">
            <img 
              src="https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=800" 
              alt="Delicious pizza"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;