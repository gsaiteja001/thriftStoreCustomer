import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  const [customer_id, setCustomerId] = useState(() => {
    return localStorage.getItem('customerId') || null;
  });
  const [cart_id, setCartId] = useState(() => {
    return localStorage.getItem('cartId') || null;
  });
  const [wishlist_id, setWishIdlist] = useState(() => {
    return localStorage.getItem('wishlistId') || null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
  });
  
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem('cart-items')) || [];
  });

  const [sellerInfoFetched, setSellerInfoFetched] = useState(false);

  const [customer, setCustomer] = useState(null);

  // Save login state, username, token, wishlist, and cart-items to localStorage
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
    if (username) localStorage.setItem('username', username);
    if (token) localStorage.setItem('token', token);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    localStorage.setItem('cart-items', JSON.stringify(cartItems));
  }, [isLoggedIn, username, token, wishlist, cartItems]);

  useEffect(() => {
    const fetchSellerInfo = async () => {
      if (isLoggedIn && customer_id && token && !sellerInfoFetched) {
        setLoading(true);
        
        try {
          const customer_id = localStorage.getItem('customerId');
          const response = await axios.get(`https://thriftstorebackend-8xii.onrender.com/api/customer/${customer_id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          setCustomer(response.data);
          setError(null);
        } catch (err) {
          console.error('Failed to fetch seller info:', err);
          setError('Failed to fetch seller information.');
          setCustomerId(null);
        } finally {
          setSellerInfoFetched(true);
          setLoading(false);
        }
      } else {
        setCustomerId(null);
      }
    };
    fetchSellerInfo();
  }, [isLoggedIn, customer_id, token]);

  const fetchCartItems = async () => {
    if (cart_id && isLoggedIn) {
      try {
        const response = await axios.get(`https://thriftstorebackend-8xii.onrender.com/api/cart/${cart_id}/items`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log('cartItems....',response.data);
        setCartItems(response.data); // Update cart items with backend data
      } catch (err) {
        console.error('Failed to fetch cart items:', err);
        setError('Failed to fetch cart items.');
      }
    }
  };

    const fetchWishlistItems = async () => {
      if (wishlist_id && isLoggedIn) {
        try {
          const response = await axios.get(`https://thriftstorebackend-8xii.onrender.com/api/wishlist/${wishlist_id}/items`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          console.log('wishlist....',response.data);
          setWishlist(response.data); // Update wishlist with backend data
        } catch (err) {
          console.error('Failed to fetch wishlist items:', err);
          setError('Failed to fetch wishlist items.');
        }
      }
    };
  
    // Fetch Wishlist Items from the backend
    useEffect(() => {
      fetchCartItems();
      fetchWishlistItems();
    }, [cart_id, wishlist_id, isLoggedIn, token]);


 
  console.log('wishlist_id....',wishlist_id);
  console.log('customer_id....',customer_id);

// In LoginContext.js
const handleWishlistToggle = async (productId) => {
  try {
    const isInWishlist = wishlist.includes(productId);
    if (isInWishlist) {
      // Remove from wishlist
      await axios.delete(`https://thriftstorebackend-8xii.onrender.com/api/wishlist/${wishlist_id}/remove`, {
        data: { item_id: productId },
      });
      setWishlist(prev => {
        const newList = prev.filter(id => id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(newList));
        return newList;
      });
    } else {
      // Add to wishlist
      await axios.post(`https://thriftstorebackend-8xii.onrender.com/api/wishlist/${wishlist_id}/add`, {
        item_id: productId,
      });
      setWishlist(prev => {
        const newList = [...prev, productId];
        localStorage.setItem('wishlist', JSON.stringify(newList));
        return newList;
      });
    }
  } catch (error) {
    console.error('Error toggling wishlist:', error);
  }
};

 // Handle Add to Cart
 const handleAddToCart = async (product) => {
  try {
    const existingItem = cartItems.find(
      (item) => item.item_id === product.item_id
    );

    if (existingItem) {
      // Increment quantity by 1
      await axios.post(`https://thriftstorebackend-8xii.onrender.com/api/cart/${cart_id}/addexistingitem`, {
        item_id: product.item_id,
        quantity: 1,
      });
      setCartItems((prevCart) => {
        const newCart = prevCart.map((item) =>
          item.item_id === product.item_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        localStorage.setItem('cart-items', JSON.stringify(newCart));
        return newCart;
      });
    } else {
      // Add as a new item
      await axios.post(`https://thriftstorebackend-8xii.onrender.com/api/cart/${cart_id}/add`, {
        item_id: product.item_id,
        quantity: 1,
      });
      setCartItems((prevCart) => {
        const newCart = [...prevCart, { ...product, quantity: 1 }];
        localStorage.setItem('cart-items', JSON.stringify(newCart));
        return newCart;
      });
    }
  } catch (error) {
    console.error('Error adding item to cart:', error);
  }
};

// Handle Reduce Quantity
const handleReduceQuantity = async (itemId) => {
  try {
    const item = cartItems.find((item) => item.item_id === itemId);
    if (item && item.quantity === 1) {
      // If quantity is 1, remove the item entirely from cart
      await axios.delete(`https://thriftstorebackend-8xii.onrender.com/api/cart/${cart_id}/remove`, {
        data: { item_id: itemId },
      });
      setCartItems((prevCart) =>
        prevCart.filter((item) => item.item_id !== itemId)
      );
    } else {
      // Otherwise decrement the quantity by 1
      await axios.post(`https://thriftstorebackend-8xii.onrender.com/api/cart/${cart_id}/removeexistingitem`, {
        item_id: itemId,
        quantity: -1,
      });
      setCartItems((prevCart) =>
        prevCart.map((item) =>
          item.item_id === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    }
  } catch (error) {
    console.error('Error removing item from cart:', error);
  }
};

  return (
    <LoginContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        username,
        setUsername,
        token,
        setToken,
        customer_id,
        wishlist_id,
        setCartId,
        setWishIdlist,
        loading,
        error,
        wishlist,
        handleWishlistToggle,
        handleReduceQuantity,
        cartItems,
        setCartItems,
        handleAddToCart
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
