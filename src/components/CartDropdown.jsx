import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartDropdown = () => {
  const { cart, isOpen, toggleCart, getCartTotal, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    toggleCart(); // Close the dropdown
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <div className="cart-dropdown">
      <div className="cart-dropdown-header">
        <h3>Your Cart</h3>
        <button className="close-btn" onClick={toggleCart}>×</button>
      </div>
      
      {cart.length === 0 ? (
        <div className="empty-cart-message">
          Your cart is empty
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map(item => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-image">
                  <div className="image-placeholder"></div>
                </div>
                <div className="cart-item-details">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </div>
                </div>
                <button 
                  className="remove-item" 
                  onClick={() => removeFromCart(item.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckoutClick}>
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartDropdown; 