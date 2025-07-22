import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import '../../styles/ManageFood.css';

const ManageFood = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editingFood, setEditingFood] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    availability: true
  });
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

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

  useEffect(() => {
    fetchFoods();
  }, []);

  useEffect(() => {
    const checkSetup = async () => {
      try {
        const response = await api.get('/auth/me');
        if (!response.data.user.isRestaurantSetup) {
          window.location.href = '/setup-restaurant';
        }
      } catch (error) {
        console.error('Error checking setup:', error);
      }
    };
    checkSetup();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await api.get('/food/owner/my-foods');
      setFoods(response.data);
    } catch (error) {
      console.error('Error fetching foods:', error);
      setMessage('Error fetching food items');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (food) => {
    setEditingFood(food._id);
    setEditForm({
      name: food.name,
      description: food.description,
      price: food.price,
      category: food.category,
      availability: food.availability
    });
    setEditImage(null);
    setEditImagePreview(null);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm({
      ...editForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (foodId) => {
    try {
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('description', editForm.description);
      formData.append('price', editForm.price);
      formData.append('category', editForm.category);
      formData.append('availability', editForm.availability);

      if (editImage) {
        formData.append('image', editImage);
      }

      const response = await api.put(`/food/${foodId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFoods(foods.map(food => 
        food._id === foodId ? response.data.food : food
      ));
      
      setEditingFood(null);
      setMessage('Food item updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating food item');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleCancelEdit = () => {
    setEditingFood(null);
    setEditForm({
      name: '',
      description: '',
      price: '',
      category: '',
      availability: true
    });
    setEditImage(null);
    setEditImagePreview(null);
  };

  const handleDelete = async (foodId) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await api.delete(`/food/${foodId}`);
        setFoods(foods.filter(food => food._id !== foodId));
        setMessage('Food item deleted successfully');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting food item');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const toggleAvailability = async (foodId, currentAvailability) => {
    try {
      const formData = new FormData();
      formData.append('availability', !currentAvailability);

      await api.put(`/food/${foodId}`, formData);
      
      setFoods(foods.map(food => 
        food._id === foodId 
          ? { ...food, availability: !currentAvailability }
          : food
      ));
      
      setMessage('Availability updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating availability');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="manage-food-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your delicious menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-food-container">
      <div className="manage-food-header">
        <div className="header-content">
          <h1>Manage Food Items</h1>
          <p>Edit, update, and manage your restaurant's menu</p>
        </div>
        <Link to="/owner/add-food" className="btn btn-primary add-food-btn">
          <span className="btn-icon">+</span>
          Add New Food
        </Link>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          <span className="message-icon">
            {message.includes('Error') ? '⚠️' : '✅'}
          </span>
          {message}
        </div>
      )}

      {foods.length === 0 ? (
        <div className="no-foods">
          <div className="no-foods-illustration">
            <div className="empty-plate">🍽️</div>
            <div className="floating-utensils">
              <span>🍴</span>
              <span>🥄</span>
            </div>
          </div>
          <h3>Your menu is empty</h3>
          <p>Start building your delicious menu by adding your first food item.</p>
          <Link to="/owner/add-food" className="btn btn-primary btn-large">
            <span className="btn-icon">+</span>
            Add Your First Food Item
          </Link>
        </div>
      ) : (
        <div className="foods-table-container">
          <table className="foods-table">
            <thead>
              <tr>
                <th>SL.No</th>
                <th>Image</th>
                <th>Item Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Description</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((food, index) => (
                <tr key={food._id} className={editingFood === food._id ? 'editing-row' : ''}>
                  {editingFood === food._id ? (
                    <>
                      <td>{index + 1}</td>
                      <td>
                        <div className="edit-image-container">
                          <img 
                            src={editImagePreview || `https://food-backend-k0cm.onrender.com/uploads/${food.image}`} 
                            alt={food.name}
                            className="edit-image-preview"
                          />
                          <input
                            type="file"
                            id={`edit-image-${food._id}`}
                            accept="image/*"
                            onChange={handleEditImageChange}
                            className="edit-image-input"
                          />
                          <label htmlFor={`edit-image-${food._id}`} className="edit-image-label">
                            Change Image
                          </label>
                        </div>
                      </td>
                      <td>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="price"
                          value={editForm.price}
                          onChange={handleEditChange}
                          min="0"
                          step="0.01"
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <select
                          name="category"
                          value={editForm.category}
                          onChange={handleEditChange}
                          className="edit-select"
                        >
                          {categories.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <textarea
                          name="description"
                          value={editForm.description}
                          onChange={handleEditChange}
                          rows="2"
                          className="edit-textarea"
                        />
                      </td>
                      <td>
                        <label className="edit-checkbox">
                          <input
                            type="checkbox"
                            name="availability"
                            checked={editForm.availability}
                            onChange={handleEditChange}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </td>
                      <td>
                        <div className="edit-actions">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleUpdate(food._id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{index + 1}</td>
                      <td>
                        <div className="food-image-cell">
                          <img 
                            src={`https://food-backend-k0cm.onrender.com/uploads/${food.image}`} 
                            alt={food.name}
                            onError={(e) => {
                              e.target.src = 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400';
                            }}
                          />
                        </div>
                      </td>
                      <td>{food.name}</td>
                      <td>${food.price}</td>
                      <td>{food.category}</td>
                      <td className="description-cell">{food.description}</td>
                      <td>
                        <span className={`availability ${food.availability ? 'available' : 'unavailable'}`}>
                          {food.availability ? '✅ Available' : '❌ Unavailable'}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleEdit(food)}
                          >
                            Edit
                          </button>
                          <button
                            className={`btn btn-sm ${food.availability ? 'btn-warning' : 'btn-success'}`}
                            onClick={() => toggleAvailability(food._id, food.availability)}
                          >
                            {food.availability ? 'Make Unavailable' : 'Make Available'}
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(food._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageFood;
