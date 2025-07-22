import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import MenuPage from './pages/MenuPage';
import Contact from './pages/Contact';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/owner/Dashboard';
import AddFood from './components/owner/AddFood';
import ManageFood from './components/owner/ManageFood';
import Orders from './components/owner/Orders';
import RestaurantSetup from './components/common/RestaurantSetup';
import './styles/App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="app-container">
            <Navbar />
            <main className="app-main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/setup-restaurant" element={<RestaurantSetup />} />
                <Route path="/owner/dashboard" element={<Dashboard />} />
                <Route path="/owner/add-food" element={<AddFood />} />
                <Route path="/owner/manage-food" element={<ManageFood />} />
                <Route path="/owner/orders" element={<Orders />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;