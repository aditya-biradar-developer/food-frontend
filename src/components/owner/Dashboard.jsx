import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalFoods: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Check if user has restaurant setup
      const userResponse = await api.get('/auth/me');
      if (!userResponse.data.user.isRestaurantSetup) {
        window.location.href = '/setup-restaurant';
        return;
      }

      const [foodsResponse, ordersResponse] = await Promise.all([
        api.get('/food/owner/my-foods'),
        api.get('/orders')
      ]);
      const foods = foodsResponse.data;
      const orders = ordersResponse.data;

      const pendingOrders = orders.filter(order => order.status === 'pending');
      const revenue = orders
        .filter(order => order.status === 'delivered')
        .reduce((total, order) => total + order.totalAmount, 0);

      setStats({
        totalFoods: foods.length,
        totalOrders: orders.length,
        pendingOrders: pendingOrders.length,
        revenue: revenue
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.data?.requiresSetup) {
        window.location.href = '/setup-restaurant';
      }
    } finally {
      setLoading(false);
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

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Restaurant Dashboard</h1>
        <p>Manage your restaurant and track your performance</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">🍽️</div>
          <div className="stat-content">
            <h3>{stats.totalFoods}</h3>
            <p>Total Food Items</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pendingOrders}</h3>
            <p>Pending Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>${stats.revenue.toFixed(2)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/owner/add-food" className="action-card">
          <div className="action-icon">➕</div>
          <h3>Add New Food</h3>
          <p>Add new food items to your menu</p>
        </Link>

        <Link to="/owner/manage-food" className="action-card">
          <div className="action-icon">🛠️</div>
          <h3>Manage Food</h3>
          <p>Edit or remove existing food items</p>
        </Link>

        <Link to="/owner/orders" className="action-card">
          <div className="action-icon">📦</div>
          <h3>View Orders</h3>
          <p>Manage and track all orders</p>
        </Link>
      </div>

      <div className="recent-orders">
        <h2>Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p>No recent orders found.</p>
        ) : (
          <div className="orders-table">
            <div className="table-header">
              <span>Order ID</span>
              <span>Customer</span>
              <span>Items</span>
              <span>Total</span>
              <span>Status</span>
              <span>Date</span>
            </div>
            {recentOrders.map((order) => (
              <div key={order._id} className="table-row">
                <span>#{order._id.slice(-6)}</span>
                <span>{order.user.name}</span>
                <span>{order.items.length} items</span>
                <span>${order.totalAmount}</span>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status}
                </span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;