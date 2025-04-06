import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cart, getCartTotal, updateQuantity, removeFromCart, completeCheckout } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleQuantityChange = async (itemId, newQuantity) => {
    const result = await updateQuantity(itemId, parseInt(newQuantity));
    if (!result.success) {
      setMessage(result.message);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleRemove = (itemId) => {
    removeFromCart(itemId);
  };

  const handleCheckout = async () => {
    setLoading(true);
    const result = await completeCheckout();
    setLoading(false);
    
    if (result.success) {
      navigate('/marketplace', { state: { success: true, message: 'Your order has been placed successfully!' } });
    } else {
      setMessage(result.message);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-container app-container">
        <h1>Checkout</h1>
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <button className="continue-shopping" onClick={() => navigate('/marketplace')}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container app-container">
      <h1>Checkout</h1>
      
      {message && <div className="alert">{message}</div>}
      
      <div className="checkout-items">
        <div className="checkout-header">
          <div className="checkout-product">Product</div>
          <div className="checkout-price">Price</div>
          <div className="checkout-quantity">Quantity</div>
          <div className="checkout-total">Total</div>
          <div className="checkout-actions">Actions</div>
        </div>
        
        {cart.map(item => (
          <div className="checkout-item" key={item.id}>
            <div className="checkout-product">
              <div className="image-placeholder"></div>
              <div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
            </div>
            <div className="checkout-price">${item.price.toFixed(2)}</div>
            <div className="checkout-quantity">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
              />
            </div>
            <div className="checkout-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            <div className="checkout-actions">
              <button className="remove-btn" onClick={() => handleRemove(item.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
        
        <div className="checkout-summary">
          <div className="checkout-subtotal">
            <span>Subtotal:</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          <div className="checkout-shipping">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="checkout-total-amount">
            <span>Total:</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
        </div>
        
        <div className="checkout-buttons">
          <button 
            className="continue-shopping" 
            onClick={() => navigate('/marketplace')}
          >
            Continue Shopping
          </button>
          <button 
            className="place-order" 
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 