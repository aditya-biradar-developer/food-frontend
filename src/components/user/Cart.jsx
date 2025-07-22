import React from 'react';
import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import '../../styles/Cart.css';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const handleQuantityChange = (foodId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(foodId);
    } else {
      updateQuantity(foodId, newQuantity);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">
          <ShoppingBag size={64} color="var(--orange-primary)" />
        </div>
        <h3 className="cart-empty-title">Your cart is empty</h3>
        <p className="cart-empty-text">Add some delicious food items to get started!</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2 className="cart-title">Your Cart</h2>
        <span className="cart-count">{cartItems.length} items</span>
      </div>
      
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item._id} className="cart-item">
            <div className="cart-item-image">
              <img 
                src={`http://localhost:5000/uploads/${item.image}`} 
                alt={item.name}
                onError={(e) => {
                  e.target.src = 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=200';
                }}
              />
            </div>
            
            <div className="cart-item-details">
              <h4 className="cart-item-name">{item.name}</h4>
              <p className="cart-item-restaurant">{item.restaurantName}</p>
              <p className="cart-item-price">${item.price.toFixed(2)}</p>
            </div>
            
            <div className="cart-item-actions">
              <div className="cart-quantity-controls">
                <button 
                  className="cart-qty-btn"
                  onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                >
                  <Minus size={16} />
                </button>
                <span className="cart-quantity">{item.quantity}</span>
                <button 
                  className="cart-qty-btn"
                  onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <button 
                className="cart-remove-btn"
                onClick={() => removeFromCart(item._id)}
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="cart-item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="cart-total">
          <span className="cart-total-label">Subtotal:</span>
          <span className="cart-total-amount">${getCartTotal().toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default Cart;