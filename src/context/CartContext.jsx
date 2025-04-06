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
      // Prepare cart items to ensure they are JSON serializable
      // Only include necessary properties and convert to proper types
      const cartItems = cart.map(item => ({
        product_id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        description: item.description || ''
      }));
      
      console.log("Prepared cart items:", cartItems);
      
      // Use ISO string format for the date
      const orderDate = new Date().toISOString();
      
      // Insert the order with properly formatted data
      const { data, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_date: orderDate,
          user_id: 2,
          total: Number(getCartTotal()),
          status: 'completed',
          items: cartItems
        })
        .select();

      if (orderError) {
        console.error('Order insert error:', orderError);
        throw orderError;
      }

      console.log('Order created successfully:', data);

      // Update inventory quantities
      for (const item of cart) {
        // Get the current quantity first
        const { data: currentItem } = await supabase
          .from('items')
          .select('quantity')
          .eq('id', item.id)
          .single();
          
        if (currentItem) {
          // Calculate new quantity
          const newQuantity = currentItem.quantity - item.quantity;
          
          if (newQuantity <= 0) {
            // If no items left, delete the item from the database
            const { error: deleteError } = await supabase
              .from('items')
              .delete()
              .eq('id', item.id);
              
            if (deleteError) throw deleteError;
            console.log(`Item ${item.name} deleted as it's now out of stock`);
          } else {
            // Otherwise, update with the new quantity
            const { error: updateError } = await supabase
              .from('items')
              .update({ quantity: newQuantity })
              .eq('id', item.id);
            
            if (updateError) throw updateError;
            console.log(`Item ${item.name} quantity updated to ${newQuantity}`);
          }
        }
      }

      // Clear the cart after successful purchase
      clearCart();
      
      return { success: true, message: 'Order completed successfully' };
    } catch (error) {
      console.error('Error completing checkout:', error);
      return { success: false, message: 'Failed to complete your order: ' + error.message };
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