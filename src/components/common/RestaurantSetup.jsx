import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RestaurantSetup = () => {
  const [restaurantName, setRestaurantName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setupRestaurant } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!restaurantName.trim()) {
      setError('Restaurant name is required');
      return;
    }

    setLoading(true);
    setError('');

    const result = await setupRestaurant(restaurantName.trim());
    
    if (result.success) {
      navigate('/owner/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Setup Your Restaurant</h2>
          <p>Complete your restaurant profile to start managing your business</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="restaurantName">Restaurant Name *</label>
            <input
              type="text"
              id="restaurantName"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              required
              placeholder="Enter your restaurant name"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="auth-btn"
            disabled={loading}
          >
            {loading ? 'Setting up...' : 'Complete Setup'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Want to go back? 
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="auth-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Return to Home
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantSetup;