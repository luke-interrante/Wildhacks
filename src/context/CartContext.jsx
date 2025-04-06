import { createContext, useContext, useState, useEffect } from 'react';
import { UserAuth } from './AuthContext';
import supabase from '../util/supabaseClient';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { session } = UserAuth();

  // Load cart from localStorage when component mounts or user changes
  useEffect(() => {
    if (session?.user?.id) {
      const savedCart = localStorage.getItem(`cart_${session.user.id}`);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } else {
      setCart([]);
    }
  }, [session]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (session?.user?.id) {
      if (cart.length > 0) {
        localStorage.setItem(`cart_${session.user.id}`, JSON.stringify(cart));
      } else {
        // Clear localStorage when cart is empty
        localStorage.removeItem(`cart_${session.user.id}`);
      }
    }
  }, [cart, session]);

  const addToCart = async (item, quantity) => {
    // make sure user is logged in
    if (session === null) {
      console.log('null session');
      return { success: null, message: 'You must be logged in to add items to cart.' }
    }
    // Check if we have enough inventory first
    const { data, error } = await supabase
      .from('items')
      .select('quantity')
      .eq('id', item.id)
      .single();

    if (error) {
      console.error('Error checking inventory:', error);
      return { success: false, message: 'Failed to check inventory' };
    }

    const quantityAvailable = data.quantity;
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex !== -1) {
      // Item already exists in cart, check if we can add more
      const currentQuantity = cart[existingItemIndex].quantity;
      const newQuantity = currentQuantity + quantity;
      
      if (newQuantity > quantityAvailable) {
        return { 
          success: false, 
          message: `Sorry, only ${quantityAvailable} units available. You already have ${currentQuantity} in your cart.`
        };
      }

      // Update the quantity of the existing item
      const updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: newQuantity
      };
      setCart(updatedCart);
    } else {
      // Check if there's enough quantity available
      if (quantity > quantityAvailable) {
        return { 
          success: false, 
          message: `Sorry, only ${quantityAvailable} units available.`
        };
      }
      
      // Add the new item to the cart
      setCart([...cart, { ...item, quantity }]);
    }

    return { success: true };
  };

  const updateQuantity = async (itemId, newQuantity) => {
    // Check inventory first
    const { data, error } = await supabase
      .from('items')
      .select('quantity')
      .eq('id', itemId)
      .single();

    if (error) {
      console.error('Error checking inventory:', error);
      return { success: false, message: 'Failed to check inventory' };
    }

    if (newQuantity > data.quantity) {
      return { 
        success: false, 
        message: `Sorry, only ${data.quantity} units available.`
      };
    }

    if (newQuantity <= 0) {
      // Remove the item if quantity is 0 or negative
      removeFromCart(itemId);
    } else {
      // Update the quantity
      const updatedCart = cart.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCart(updatedCart);
    }

    return { success: true };
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    if (session?.user?.id) {
      localStorage.removeItem(`cart_${session.user.id}`);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const completeCheckout = async () => {
    if (!session?.user?.id || cart.length === 0) {
      return { success: false, message: 'No items in cart or user not logged in' };
    }

    try {
      // Start a transaction to ensure all updates go through
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: session.user.id,
          order_date: new Date(),
          total: getCartTotal(),
          status: 'completed',
          items: cart
        });

      if (orderError) throw orderError;

      // Update inventory quantities
      for (const item of cart) {
        const { error: updateError } = await supabase
          .from('items')
          .update({ 
            quantity_available: supabase.raw(`quantity_available - ${item.quantity}`) 
          })
          .eq('id', item.id);
        
        if (updateError) throw updateError;
      }

      // Clear the cart after successful purchase
      clearCart();
      
      return { success: true, message: 'Order completed successfully' };
    } catch (error) {
      console.error('Error completing checkout:', error);
      return { success: false, message: 'Failed to complete your order' };
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      isOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCartTotal,
      getCartCount,
      toggleCart,
      completeCheckout
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
}; 