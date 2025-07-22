import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import FoodCard from './FoodCard';
import { Search, Filter } from 'lucide-react';
import '../../styles/Menu.css';

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const categories = [
    { value: 'all', label: 'All Items', icon: '🍽️' },
    { value: 'appetizer', label: 'Appetizers', icon: '🥗' },
    { value: 'main-course', label: 'Main Course', icon: '🍖' },
    { value: 'dessert', label: 'Desserts', icon: '🍰' },
    { value: 'beverages', label: 'Beverages', icon: '🥤' },
    { value: 'chinese', label: 'Chinese', icon: '🥡' },
    { value: 'indian', label: 'Indian', icon: '🍛' },
    { value: 'italian', label: 'Italian', icon: '🍝' },
    { value: 'mexican', label: 'Mexican', icon: '🌮' }
  ];

  useEffect(() => {
    fetchFoods();
  }, [selectedCategory]);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const url = selectedCategory === 'all' 
        ? '/food' 
        : `/food?category=${selectedCategory}`;
      
      const response = await api.get(url);
      setFoods(response.data);
    } catch (error) {
      setError('Failed to fetch food items');
      console.error('Error fetching foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="menu-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <p>Loading delicious menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-error">
        <div className="menu-error-icon">😕</div>
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <button onClick={fetchFoods} className="btn-orange">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="menu-section">
      <div className="container">
        <div className="menu-header">
          <h2 className="menu-title">Our Menu</h2>
          <p className="menu-subtitle">Discover our carefully crafted dishes made with love</p>
        </div>

        <div className="menu-controls">
          <div className="menu-search">
            <Search className="menu-search-icon" size={20} />
            <input
              type="text"
              placeholder="Search for dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="menu-search-input"
            />
          </div>
          
          <div className="menu-filter-toggle">
            <Filter size={20} />
            <span>Filter</span>
          </div>
        </div>

        <div className="menu-categories">
          {categories.map((category) => (
            <button
              key={category.value}
              className={`menu-category-btn ${selectedCategory === category.value ? 'menu-active' : ''}`}
              onClick={() => setSelectedCategory(category.value)}
            >
              <span className="menu-category-icon">{category.icon}</span>
              <span className="menu-category-label">{category.label}</span>
            </button>
          ))}
        </div>

        {filteredFoods.length === 0 ? (
          <div className="menu-no-items">
            <div className="menu-no-items-icon">🔍</div>
            <h3>No dishes found</h3>
            <p>Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        ) : (
          <div className="menu-grid">
            {filteredFoods.map((food) => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Menu;