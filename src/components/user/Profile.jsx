import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import '../../styles/Profile.css';

const Profile = () => {
  const { user, currentRole } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    restaurantName: ''
  });
  const [orders, setOrders] = useState([]);
  const [currentOrders, setCurrentOrders] = useState([]);
  const [loading, setLoading] = useState({
    profile: false,
    orders: false
  });
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        restaurantName: user.restaurantName || ''
      });
      // Only fetch orders if current role is user
      if (currentRole === 'user') {
        fetchOrders();
      }
    }
  }, [user, currentRole]);

  const fetchOrders = async () => {
    try {
      setLoading(prev => ({ ...prev, orders: true }));
      const response = await api.get('/orders/my-orders');
      const allOrders = response.data;
      
      setCurrentOrders(
        allOrders.filter(order => 
          !['delivered', 'cancelled'].includes(order.status)
        )
      );
      setOrders(
        allOrders.filter(order => 
          ['delivered', 'cancelled'].includes(order.status)
        )
      );
    } catch (error) {
      console.error('Error fetching orders:', error);
      setMessage('Failed to load orders');
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, profile: true }));
    setMessage('');

    try {
      await api.put('/users/profile', profile);
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: '#f39c12',
      confirmed: '#3498db',
      preparing: '#e67e22',
      'out-for-delivery': '#9b59b6',
      delivered: '#27ae60',
      cancelled: '#e74c3c'
    };
    return statusColors[status] || '#95a5a6';
  };

  const renderOrderTable = (orderList, emptyMessage) => {
    if (loading.orders) {
      return (
        <div className="loading-orders">
          <div className="loading-spinner"></div>
          <p>Loading orders...</p>
        </div>
      );
    }
    
    if (!orderList.length) {
      return (
        <div className="empty-orders">
          <div className="empty-icon">📦</div>
          <p>{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orderList.map((order) => (
              <tr key={order._id}>
                <td>
                  <span className="order-id">
                    #{order._id.slice(-6).toUpperCase()}
                  </span>
                </td>
                <td>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </td>
                <td>
                  <div className="order-items">
                    {order.items.slice(0, 2).map((item, i) => (
                      <div key={i}>
                        {item.quantity} × {item.food?.name || 'Unknown Item'}
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div>+ {order.items.length - 2} more items</div>
                    )}
                  </div>
                </td>
                <td>
                  <span className="order-total">
                    ${order.totalAmount?.toFixed(2)}
                  </span>
                </td>
                <td>
                  <span 
                    className="order-status"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status.replace(/-/g, ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="page-header">
          <h1>My Profile</h1>
          <p>Manage your account information {currentRole === 'user' ? 'and orders' : 'and restaurant details'}</p>
        </div>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {/* Only show tabs for user role */}
        {currentRole === 'user' && (
          <div className="profile-tabs">
            <button
              className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`tab-btn ${activeTab === 'current-orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('current-orders')}
            >
              Current Orders
            </button>
            <button
              className={`tab-btn ${activeTab === 'order-history' ? 'active' : ''}`}
              onClick={() => setActiveTab('order-history')}
            >
              Order History
            </button>
          </div>
        )}

        <div className="profile-content">
          {/* Profile form - show for both user and owner, but only when profile tab is active or role is owner */}
          {(activeTab === 'profile' || currentRole === 'owner') && (
            <div className="profile-form-section">
              <h2>Profile Information</h2>
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={profile.address}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>

                {/* Show restaurant name field for both user and owner */}
                <div className="form-group">
                  <label>Restaurant Name</label>
                  <input
                    type="text"
                    name="restaurantName"
                    value={profile.restaurantName}
                    onChange={handleInputChange}
                    placeholder={currentRole === 'user' ? 'Not applicable for customers' : 'Enter restaurant name'}
                    disabled={currentRole === 'user'}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={loading.profile}
                >
                  {loading.profile ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>
          )}

          {/* Current Orders - only show for users */}
          {currentRole === 'user' && activeTab === 'current-orders' && (
            <div className="orders-section">
              <h2>Current Orders</h2>
              {renderOrderTable(
                currentOrders, 
                'No current orders found. Place an order to see it here!'
              )}
            </div>
          )}

          {/* Order History - only show for users */}
          {currentRole === 'user' && activeTab === 'order-history' && (
            <div className="orders-section">
              <h2>Order History</h2>
              {renderOrderTable(
                orders,
                'No past orders found. Your order history will appear here.'
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;