import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import Cart from '../components/user/Cart';
import { ArrowLeft, CreditCard } from 'lucide-react';
import '../styles/CartPage.css';

const CartPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [orderData, setOrderData] = useState({
    deliveryAddress: '',
    phoneNumber: '',
    paymentMethod: 'cash'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  const handleInputChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      setMessage('Your cart is empty');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const orderItems = cartItems.map(item => ({
        foodId: item._id,
        quantity: item.quantity
      }));

      const orderPayload = {
        items: orderItems,
        deliveryAddress: orderData.deliveryAddress,
        phoneNumber: orderData.phoneNumber,
        paymentMethod: orderData.paymentMethod
      };

      await api.post('/orders', orderPayload);
      
      clearCart();
      setMessage('Order placed successfully! We will contact you soon.');
      setShowCheckout(false);
      
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error placing order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cartpage-container">
      <div className="cartpage-content">
        {message && (
          <div className={`cartpage-message ${message.includes('Error') || message.includes('empty') ? 'cartpage-error' : 'cartpage-success'}`}>
            {message}
          </div>
        )}

        <Cart />

        {cartItems.length > 0 && (
          <div className="cartpage-checkout-section">
            {!showCheckout ? (
              <div className="cartpage-summary">
                <div className="cartpage-summary-content">
                  <h3 className="cartpage-summary-title">Order Summary</h3>
                  <div className="cartpage-breakdown">
                    <div className="cartpage-line">
                      <span>Subtotal:</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="cartpage-line">
                      <span>Delivery Fee:</span>
                      <span>$2.99</span>
                    </div>
                    <div className="cartpage-line cartpage-total">
                      <span>Total:</span>
                      <span>${(getCartTotal() + 2.99).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  className="cartpage-checkout-btn btn-orange"
                  onClick={() => setShowCheckout(true)}
                >
                  <CreditCard size={20} />
                  Proceed to Checkout
                </button>
              </div>
            ) : (
              <div className="cartpage-form-section">
                <div className="cartpage-form-header">
                  <button 
                    className="cartpage-back-btn"
                    onClick={() => setShowCheckout(false)}
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h3>Delivery Information</h3>
                </div>
                
                <form onSubmit={handlePlaceOrder} className="cartpage-form">
                  <div className="form-group">
                    <label className="form-label" htmlFor="deliveryAddress">Delivery Address *</label>
                    <textarea
                      id="deliveryAddress"
                      name="deliveryAddress"
                      value={orderData.deliveryAddress}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className="form-textarea"
                      placeholder="Enter your complete delivery address"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="phoneNumber">Phone Number *</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={orderData.phoneNumber}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="paymentMethod">Payment Method</label>
                    <select
                      id="paymentMethod"
                      name="paymentMethod"
                      value={orderData.paymentMethod}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="cash">Cash on Delivery</option>
                      <option value="online">Online Payment</option>
                    </select>
                  </div>

                  <div className="cartpage-form-actions">
                    <button 
                      type="button" 
                      className="btn-secondary"
                      onClick={() => setShowCheckout(false)}
                    >
                      Back to Cart
                    </button>
                    <button 
                      type="submit" 
                      className="btn-orange"
                      disabled={loading}
                    >
                      {loading ? 'Placing Order...' : `Place Order - $${(getCartTotal() + 2.99).toFixed(2)}`}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;