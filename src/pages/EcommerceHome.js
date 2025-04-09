import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { toast } from 'react-toastify';

import { LoginContext } from '../context/LoginContext';

// Styled Components
const PageContainer = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 15px;
  font-size: 18px;
  border-radius: 10px;
  border: 1px solid #ddd;
  margin-bottom: 30px;
`;

const FilterContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const FilterSelect = styled.select`
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
  border: 1px solid #ddd;
`;

/*
  We'll limit the width and center it (max 1200px),
  with auto-fitting columns of at most 4 per row when space allows.
*/
const ProductGrid = styled.div`
  display: grid;
  gap: 20px;
  padding: 10px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  /*
    We'll allow auto-fill with a minimum of 250px. This typically
    fits up to 4 columns as space permits (4x250 = 1000px plus gap).
  */
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  justify-items: center;
`;

const ProductCard = styled.div`
  background-color: #fff;
  padding: 20px;
  width: 100%;
  max-width: 250px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  position: relative;
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 15px;
`;

const ProductTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const ProductPrice = styled.p`
  font-size: 16px;
  color: #4caf50;
  margin-bottom: 10px;
`;

const WishlistIcon = styled.img`
  width: 25px;
  height: 25px;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const AddToCartButton = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #45a049;
  }
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
`;

const EcommerceHome = () => {
  const navigate = useNavigate();

  // Destructure everything you need from context:
  const {
    wishlist,
    cartItems,
    setCartItems,
    handleWishlistToggle,
    handleAddToCart,
    token,
    setCustomerId,
    customer_id,
    handleReduceQuantity
  } = useContext(LoginContext);

  // Local states for product listing & searching:
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://thriftstorebackend-8xii.onrender.com/api/item/items');
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle search input
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = products.filter((product) => {
      const name = product.name?.toLowerCase() || '';
      const category = product.category?.toLowerCase() || '';
      return name.includes(query) || category.includes(query);
    });
    setFilteredProducts(filtered);
  };

  // Navigate to product details
  const handleProductClick = (productId) => {
    navigate(`/product-detail/${productId}`);
  };

  // Sort logic
  const handleSortChange = (event) => {
    const selectedSort = event.target.value;
    setSortBy(selectedSort);

    let sorted = [...filteredProducts];
    if (selectedSort === 'price') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating);
    }
    setFilteredProducts(sorted);
  };

  // Increase / decrease quantity
  const handleAddQuantity = (itemId) => {
    const updatedCartItems = cartItems.map(item =>
      item.item_id === itemId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCartItems(updatedCartItems);
    localStorage.setItem('cart-items', JSON.stringify(updatedCartItems));
  };

  // const handleReduceQuantity = (itemId) => {
  //   const updatedCartItems = cartItems.map(item =>
  //     item.item_id === itemId && item.quantity > 1
  //       ? { ...item, quantity: item.quantity - 1 }
  //       : item
  //   );
  //   setCartItems(updatedCartItems);
  //   localStorage.setItem('cart-items', JSON.stringify(updatedCartItems));
  // };

  return (
    <PageContainer>
      <SearchBar
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={handleSearch}
      />
      <FilterContainer>
        <FilterSelect onChange={handleSortChange} value={sortBy}>
          <option value="price">Sort by Price</option>
          <option value="rating">Sort by Rating</option>
        </FilterSelect>
      </FilterContainer>

      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {filteredProducts.length > 0 ? (
            <ProductGrid>
              {filteredProducts.map((product) => {
                // Check if it's in the cart, find quantity:
                const isProductInCart = cartItems.some(
                  (item) => item.item_id === product.item_id
                );
                const quantityInCart = isProductInCart
                  ? cartItems.find((item) => item.item_id === product.item_id)
                      .quantity
                  : 0;

                // Check wishlist status
                const isInWishlist = wishlist.includes(product.item_id);
                const wishlistIconSrc = isInWishlist
                  ? 'https://i.ibb.co/TqkzdJ83/wishlist-2.png'
                  : 'https://i.ibb.co/m55kHHVN/wishlist-1.png';

                return (
                  <ProductCard
                    key={product.id}
                    onClick={() => handleProductClick(product.item_id)}
                  >
                    <ProductImage src={product.imageURL} alt={product.name} />

                    <WishlistIcon
                      src={wishlistIconSrc}
                      alt="Wishlist Icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlistToggle(product.item_id);
                      }}
                    />
                    <ProductTitle>{product.name}</ProductTitle>
                    <ProductPrice>₹{product.selling_price}</ProductPrice>

                    {isProductInCart ? (
                      <div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReduceQuantity(product.item_id);
                          }}
                        >
                          -
                        </button>
                        <span style={{ margin: '0 10px' }}>
                          {quantityInCart}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <AddToCartButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                      >
                        Add to Cart
                      </AddToCartButton>
                    )}
                  </ProductCard>
                );
              })}
            </ProductGrid>
          ) : (
            <div>No products found.</div>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default EcommerceHome;
