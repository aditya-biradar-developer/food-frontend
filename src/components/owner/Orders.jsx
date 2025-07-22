import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import '../../styles/Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    // Check if user has restaurant setup
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
  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setMessage('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, status: newStatus }
          : order
      ));
      
      setMessage('Order status updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating order status');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'confirmed': return '#3498db';
      case 'preparing': return '#e67e22';
      case 'delivered': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  if (loading) {
    return <div className="orders-loading">Loading orders...</div>;
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>Order Management</h1>
        <p>Manage and track all customer orders</p>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="orders-filter">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All Orders ({orders.length})
        </button>
        <button 
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Pending ({orders.filter(o => o.status === 'pending').length})
        </button>
        <button 
          className={filter === 'confirmed' ? 'active' : ''}
          onClick={() => setFilter('confirmed')}
        >
          Confirmed ({orders.filter(o => o.status === 'confirmed').length})
        </button>
        <button 
          className={filter === 'preparing' ? 'active' : ''}
          onClick={() => setFilter('preparing')}
        >
          Preparing ({orders.filter(o => o.status === 'preparing').length})
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="no-orders">
          <div className="no-orders-icon">📋</div>
          <h3>No orders found</h3>
          <p>No orders match the selected filter.</p>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order._id.slice(-6)}</h3>
                  <p className="customer-name">Customer: {order.user.name}</p>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()} at {' '}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                
                <div className="order-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="order-items">
                <h4>Items:</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <span className="item-name">{item.food.name}</span>
                    <span className="item-quantity">Qty: {item.quantity}</span>
                    <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="order-details">
                <div className="order-address">
                  <strong>Delivery Address:</strong> {order.deliveryAddress}
                </div>
                <div className="order-phone">
                  <strong>Phone:</strong> {order.phoneNumber}
                </div>
                <div className="order-payment">
                  <strong>Payment:</strong> {order.paymentMethod}
                </div>
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <strong>Total: ${order.totalAmount.toFixed(2)}</strong>
                </div>
                
                <div className="order-actions">
                  {order.status === 'pending' && (
                    <>
                      <button 
                        className="btn btn-success"
                        onClick={() => updateOrderStatus(order._id, 'confirmed')}
                      >
                        Confirm
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => updateOrderStatus(order._id, 'cancelled')}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  
                  {order.status === 'confirmed' && (
                    <button 
                      className="btn btn-warning"
                      onClick={() => updateOrderStatus(order._id, 'preparing')}
                    >
                      Start Preparing
                    </button>
                  )}
                  
                  {order.status === 'preparing' && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => updateOrderStatus(order._id, 'delivered')}
                    >
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;