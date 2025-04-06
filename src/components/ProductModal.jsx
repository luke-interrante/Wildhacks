import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { UserAuth } from '../context/AuthContext'

const ProductModal = ({ item, farmer, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const { addToCart } = useCart();

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= item.quantity_available) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < item.quantity_available) {
      setQuantity(prevQuantity => prevQuantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  const handleAddToCart = async () => {
    const result = await addToCart(item, quantity);

    if (result.success === true) {
      setMessage('Added to cart successfully!');
      setTimeout(() => {
        setMessage('');
        onClose();
      }, 1500);
    } else if (result.success === null) {
      setMessage('Must be logged in to add items to cart');
      setTimeout(() => {
        setMessage('');
        onClose();
      }, 1500);
    } else {
      setMessage(result.message);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={e => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>×</button>
        
        <div className="product-modal-content">
          <div className="product-modal-image">
            {/* Placeholder for product image */}
            <div className="modal-image-placeholder"></div>
          </div>
          
          <div className="product-modal-details">
            <h2>{item.name}</h2>
            <p className="product-modal-price">${item.price.toFixed(2)}</p>
            
            {farmer && (
              <p className="product-modal-farmer">
                By: {farmer.first_name} {farmer.last_name}
              </p>
            )}
            
            <div className="product-modal-description">
              <h3>Description</h3>
              <p>{item.description}</p>
            </div>
            
            <div className="product-modal-availability">
              <span className={item.quantity_available > 10 ? 'in-stock' : 'low-stock'}>
                {item.quantity_available > 0 
                  ? `${item.quantity_available} available` 
                  : 'Out of stock'}
              </span>
            </div>
            
            {message && (
              <div className="product-modal-message">{message}</div>
            )}
            
            <div className="product-modal-actions">
              <div className="quantity-selector">
                <button 
                  className="quantity-btn" 
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={item.quantity_available}
                  value={quantity}
                  onChange={handleQuantityChange}
                />
                <button 
                  className="quantity-btn" 
                  onClick={incrementQuantity}
                  disabled={quantity >= item.quantity_available}
                >
                  +
                </button>
              </div>
              
              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={item.quantity_available === 0}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal; 