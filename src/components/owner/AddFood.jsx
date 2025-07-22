import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import '../../styles/AddFood.css';

const AddFood = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main-course',
    availability: true
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has restaurant setup
    const checkSetup = async () => {
      try {
        const response = await api.get('/auth/me');
        if (!response.data.user.isRestaurantSetup) {
          navigate('/setup-restaurant');
        }
      } catch (error) {
        console.error('Error checking setup:', error);
      }
    };
    checkSetup();
  }, [navigate]);
  
  useEffect(() => {
    // Check if user has restaurant setup
    const checkSetup = async () => {
      try {
        const response = await api.get('/auth/me');
        if (!response.data.user.isRestaurantSetup) {
          navigate('/setup-restaurant');
        }
      } catch (error) {
        console.error('Error checking setup:', error);
      }
    };
    checkSetup();
  }, [navigate]);
  const categories = [
    { value: 'appetizer', label: 'Appetizer' },
    { value: 'main-course', label: 'Main Course' },
    { value: 'dessert', label: 'Dessert' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'indian', label: 'Indian' },
    { value: 'italian', label: 'Italian' },
    { value: 'mexican', label: 'Mexican' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!image) {
      setMessage('Please select an image for the food item.');
      setLoading(false);
      return;
    }

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('description', formData.description);
    submitData.append('price', formData.price);
    submitData.append('category', formData.category);
    submitData.append('availability', formData.availability);
    submitData.append('image', image);

    try {
      await api.post('/food', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setMessage('Food item added successfully!');
      setTimeout(() => {
        navigate('/owner/manage-food');
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error adding food item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-food-container">
      <div className="add-food-header">
        <h1>Add New Food Item</h1>
        <p>Add a new delicious item to your menu</p>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="add-food-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Food Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter food name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price ($) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="3"
            placeholder="Describe your delicious food item"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="availability"
                checked={formData.availability}
                onChange={handleChange}
              />
              Available for order
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="image">Food Image *</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Food preview" />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/owner/manage-food')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Food Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFood;