import React from 'react';
import { useCart } from '../../context/CartContext';
import { MapPin, Plus, Minus, ShoppingCart } from 'lucide-react';
import '../../styles/FoodCard.css';

const FoodCard = ({ food }) => {
  const { addToCart, cartItems, updateQuantity } = useCart();
  
  const cartItem = cartItems.find(item => item._id === food._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    addToCart(food);
  };

  const handleIncrement = () => {
    updateQuantity(food._id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(food._id, quantity - 1);
    } else {
      updateQuantity(food._id, 0);
    }
  };

  return (
    <div className="foodcard-container">
      <div className="foodcard-image-wrapper">
        <img 
          src={food.image 
            ? `https://food-backend-k0cm.onrender.com/uploads/${food.image}`
            : 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=600'
          }
          alt={food.name}
          className="foodcard-image"
          loading="lazy"
        />
        {food.category && (
          <div className="foodcard-category-badge">
            {food.category}
          </div>
        )}
        {!food.availability && (
          <div className="foodcard-unavailable">
            Out of Stock
          </div>
        )}
      </div>
      
      <div className="foodcard-content">
        <h3 className="foodcard-name">{food.name}</h3>
        <p className="foodcard-description">{food.description}</p>
        
        <div className="foodcard-restaurant">
          <MapPin size={16} className="foodcard-location-icon" />
          <span>{food.restaurantName}</span>
        </div>
        
        <div className="foodcard-footer">
          <div className="foodcard-price">${food.price.toFixed(2)}</div>
          
          {!food.availability ? (
            <button className="foodcard-unavailable-btn" disabled>
              Unavailable
            </button>
          ) : quantity === 0 ? (
            <button className="foodcard-add-btn" onClick={handleAddToCart}>
              <ShoppingCart size={18} />
              <span>Add to Cart</span>
            </button>
          ) : (
            <div className="foodcard-quantity-controls">
              <button 
                className="foodcard-qty-btn foodcard-qty-decrease" 
                onClick={handleDecrement}
              >
                <Minus size={16} />
              </button>
              <span className="foodcard-quantity">{quantity}</span>
              <button 
                className="foodcard-qty-btn foodcard-qty-increase" 
                onClick={handleIncrement}
              >
                <Plus size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
