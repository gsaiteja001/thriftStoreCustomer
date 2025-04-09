import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { LoginContext } from '../context/LoginContext';

const PageContainer = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProductGrid = styled.div`
  display: grid;
  gap: 20px;
  padding: 10px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
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

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlist, cartItems, setCartItems, handleWishlistToggle,handleReduceQuantity, handleAddToCart } = useContext(LoginContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://thriftstorebackend-8xii.onrender.com/api/item/items');
        console.log('allresponse....',response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/product-detail/${productId}`);
  };

  const filteredProducts = products.filter(product => 
    wishlist.includes(product.item_id)
  );

console.log('filteredProducts.....',filteredProducts);

  return (
    <PageContainer>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {filteredProducts.length > 0 ? (
            <ProductGrid>
              {filteredProducts.map((product) => {
                const isProductInCart = cartItems.some(
                  (item) => item.item_id === product.item_id
                );
                const quantityInCart = isProductInCart
                  ? cartItems.find((item) => item.item_id === product.item_id)
                      .quantity
                  : 0;

                const isInWishlist = wishlist.includes(product.item_id);
                const wishlistIconSrc = isInWishlist
                  ? 'https://i.ibb.co/TqkzdJ83/wishlist-2.png'
                  : 'https://i.ibb.co/m55kHHVN/wishlist-1.png';

                return (
                  <ProductCard key={product.id} onClick={() => handleProductClick(product.item_id)}>
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
            <div>No products in your wishlist.</div>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default WishlistPage;
