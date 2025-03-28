import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';

import { LoginContext } from '../context/LoginContext';

// Inline CSS for the upgraded checkout page
const styles = {
    checkoutContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '40px 30px',
        backgroundColor: '#f4f7f9',
        minHeight: '100vh',
    },
    checkoutSteps: {
        flex: 2,
        paddingRight: '30px',
        maxWidth: '680px',
    },
    step: {
        backgroundColor: 'white',
        padding: '25px',
        marginBottom: '20px',
        borderRadius: '10px',
        boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
    },
    stepActive: {
        backgroundColor: '#eff4fb',
    },
    stepTitle: {
        fontSize: '22px',
        marginBottom: '10px',
        fontWeight: 'bold',
        color: '#333',
    },
    stepIcon: {
        width: '35px',
        height: '35px',
        borderRadius: '50%',
        backgroundColor: '#5f7c8c',
        color: 'white',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        marginRight: '15px',
        transition: 'background-color 0.3s',
    },
    stepIconCompleted: {
        backgroundColor: '#5cb85c',
    },
    cartItem: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '20px',
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    cartItemImage: {
        width: '100px',
        height: '100px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginRight: '15px',
    },
    cartItemDetails: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    cartItemName: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
    },
    cartItemInfo: {
        fontSize: '14px',
        color: '#555',
        marginBottom: '5px',
    },
    cartItemPrice: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
    },
    placeOrderBtn: {
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        padding: '15px 25px',
        borderRadius: '5px',
        cursor: 'pointer',
        width: '100%',
        fontSize: '18px',
        transition: 'background-color 0.3s, transform 0.3s',
    },
    placeOrderBtnHover: {
        backgroundColor: '#555',
        transform: 'scale(1.05)',
    },
    summary: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: '20px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
    },
    summaryTitle: {
        fontSize: '22px',
        marginBottom: '20px',
        color: '#333',
    },
    summaryDetails: {
        fontSize: '16px',
        color: '#555',
    },
    summaryDetailsParagraph: {
        marginBottom: '10px',
    },
    expandedStepContent: {
        display: 'block',
    },
    collapsedStepContent: {
        display: 'none',
    },
};

const Checkout = () => {
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

    const [address, setAddress] = useState(null);
    const [itemsDetails, setItemsDetails] = useState([]);
    const [expandedStep, setExpandedStep] = useState(1);  // Tracks the currently expanded step

    useEffect(() => {
        const storedCartItems = JSON.parse(localStorage.getItem('cart-items')) || [];
        setCartItems(storedCartItems);

        const storedAddress = JSON.parse(localStorage.getItem('selectedAddress')) || null;
        setAddress(storedAddress);

        const fetchItemDetails = async () => {
            const itemIds = storedCartItems.map(item => item.item_id);
            const details = await Promise.all(
                itemIds.map(id => axios.get(`http://localhost:3000/api/item/${id}`).then(res => res.data))
            );
            setItemsDetails(details);
        };

        fetchItemDetails();
    }, []);



    const handlePlaceOrder = async () => {
        // Gather order details
        const orderDate = new Date().toISOString(); 
        const shippingAddress = address; 
        const orderStatus = 'placed';  
        const paymentStatus = 'paid';  
      
        // Collect items details (item_id, quantity, price)
        const orderItems = cartItems.map(item => {
          const itemDetails = itemsDetails.find(detail => detail.item_id === item.item_id);
          return {
            item_id: item.item_id,
            item_quantity: item.quantity,
            item_price: itemDetails ? itemDetails.selling_price : 0,
          };
        });
      
        // Make an API request for each item in the cart
        try {
          const orderRequests = orderItems.map(item => {
            return axios.post('http://localhost:3000/api/order', {
              customer_id: customer_id, 
              order_date: orderDate,
              order_status: orderStatus,
              payment_status: paymentStatus,
              shipping_address: JSON.stringify(shippingAddress),  
              shipping_id: shippingAddress ? shippingAddress.addressId : null, 
              item_id: item.item_id,
              item_quantity: item.item_quantity,
              item_price: item.item_price,
            });
          });
      
          // Wait for all orders to be placed
          await Promise.all(orderRequests);
          alert('Order placed successfully!');
        } catch (error) {
          console.error('Error placing order:', error);
          alert('There was an error placing the order. Please try again.');
        }
      };
      

    const handleStepClick = (stepNumber) => {
        setExpandedStep(expandedStep === stepNumber ? null : stepNumber);
    };
    const renderCartItems = () => {
        return cartItems.map(item => {
            const itemDetails = itemsDetails.find(detail => detail.item_id === item.item_id);
            if (!itemDetails) return null;
    
            return (
                <div key={item.item_id} style={styles.cartItem}>
                    <img src={itemDetails.imageURL} alt={itemDetails.name} style={styles.cartItemImage} />
                    <div style={styles.cartItemDetails}>
                        <p style={styles.cartItemName}>{itemDetails.name}</p>
                        <p style={styles.cartItemInfo}>Brand: {itemDetails.brand}</p>
                        <p style={styles.cartItemInfo}>Size: {itemDetails.size}</p>
                        <p style={styles.cartItemInfo}>Color: {itemDetails.color}</p>
                        <p style={styles.cartItemPrice}>${itemDetails.selling_price}</p>
                        
                        {/* Quantity Control */}
                        <div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleReduceQuantity(item.item_id);
                                }}
                            >
                                -
                            </button>
                            <span style={{ margin: '0 10px' }}>
                                {item.quantity}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(itemDetails);
                                }}
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            );
        });
    };
    

    return (
        <div style={styles.checkoutContainer}>
            <div style={styles.checkoutSteps}>
            {[1, 2, 3, 4].map(step => (
                        <div
                            key={step}
                            style={{
                                ...styles.step,
                                ...(expandedStep === step ? styles.stepActive : {}),
                            }}
                            onClick={() => handleStepClick(step)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div
                                    style={{
                                        ...styles.stepIcon,
                                        ...(expandedStep > step ? styles.stepIconCompleted : {}),
                                    }}
                                >
                                    {step}
                                </div>
                                <h2 style={styles.stepTitle}>
                                    {/* Updated Titles for each Step */}
                                    {step === 1 && "Review"}
                                    {step === 2 && "Shipping Method"}
                                    {step === 3 && "Payment Method"}
                                    {step === 4 && "Shipping Address"}
                                </h2>
                            </div>
                            <div style={expandedStep === step ? styles.expandedStepContent : styles.collapsedStepContent}>
                                {step === 1 && (
                                    <div>
                                            {renderCartItems()}
                                            <p>
                                                <strong>Total: $
                                                    {cartItems.reduce((total, item) => total + (itemsDetails.find(detail => detail.item_id === item.item_id)?.selling_price || 0) * item.quantity, 0)}
                                                </strong>
                                            </p>
                                        </div>
                                )}
                                {step === 2 && <p>Standard Shipping - Free</p>}
                                {step === 3 && <p>Payment method placeholder</p>}
                                {step === 4 && (
                                        <div>
                                            {address ? (
                                                <div>
                                                    <p>{address.name}</p>
                                                    <p>{address.addressLine1}</p>
                                                    <p>{address.addressLine2}</p>
                                                    <p>{address.region}, {address.state} {address.pincode}</p>
                                                    <p>{address.country}</p>
                                                </div>
                                            ) : (
                                            <p>No address selected</p>
                                        )}
                                </div>
                                )}
                            </div>
                        </div>
                    ))}

            </div>

            <div style={styles.summary}>
    <h3 style={styles.summaryTitle}>Order Summary</h3>
    <div style={styles.summaryDetails}>
        {cartItems.map(item => {
            const itemDetails = itemsDetails.find(detail => detail.item_id === item.item_id);
            return itemDetails ? (
                <div key={item.item_id} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <img src={itemDetails.imageURL} alt={itemDetails.name} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                    <div style={{ flex: 1 }}>
                        <p style={styles.cartItemName}>{itemDetails.name}</p>
                        <p style={styles.cartItemInfo}>Quantity: {item.quantity}</p>
                        <p style={styles.cartItemInfo}>Price: ${itemDetails.selling_price}</p>
                    </div>
                </div>
            ) : null;
        })}
        <p style={styles.summaryDetailsParagraph}><strong>Subtotal:</strong> $
            {cartItems.reduce((total, item) => total + (itemsDetails.find(detail => detail.item_id === item.item_id)?.selling_price || 0) * item.quantity, 0)}
        </p>
        <p style={styles.summaryDetailsParagraph}><strong>Shipping:</strong> Free</p>
        <p style={styles.summaryDetailsParagraph}><strong>Estimated Tax:</strong> $0.00</p>
        <p style={styles.summaryDetailsParagraph}><strong>Total:</strong> $
            {cartItems.reduce((total, item) => total + (itemsDetails.find(detail => detail.item_id === item.item_id)?.selling_price || 0) * item.quantity, 0)}
        </p>
        <button
                                                style={styles.placeOrderBtn}
                                                onClick={handlePlaceOrder}
                                            >
                                                Place Order
                                            </button>
    </div>
</div>

        </div>
    );
};

export default Checkout;
