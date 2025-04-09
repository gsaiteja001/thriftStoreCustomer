import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Styles for the component
const styles = {
  container: {
    margin: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#333',
  },
  orderCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  orderInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
    color: '#555',
  },
  orderStatus: {
    fontWeight: 'bold',
    color: '#28a745', // green for completed
  },
  itemList: {
    listStyleType: 'none',
    padding: '0',
  },
  itemCard: {
    borderBottom: '1px solid #f1f1f1',
    padding: '10px 0',
  },
  itemTitle: {
    fontSize: '1.2rem',
    fontWeight: '500',
    color: '#333',
  },
  itemDetails: {
    fontSize: '0.9rem',
    color: '#777',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },

  cartItemImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginRight: '15px',
},
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemDetails, setItemDetails] = useState({}); // Store item details by item_id
  const navigate = useNavigate();

  // Fetch orders from the backend
  const fetchOrders = async () => {
    const customer_id = localStorage.getItem('customerId');
    if (!customer_id) {
      alert('Customer ID not found');
      return;
    }

    try {
      const response = await axios.get(`https://thriftstorebackend-8xii.onrender.com/api/orders/${customer_id}`);
      const groupedOrders = response.data;

      // Log the response to verify the structure
      console.log('Fetched orders:', groupedOrders);

      // Check if the response is an object and convert to an array of values
      if (typeof groupedOrders === 'object') {
        // Convert object to array of orders
        const ordersArray = Object.values(groupedOrders);
        setOrders(ordersArray);
        setLoading(false);
        fetchItemDetails(ordersArray); // After fetching orders, fetch item details
      } else {
        console.error('Expected orders to be an object, but got:', typeof groupedOrders);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  // Fetch additional item details
  const fetchItemDetails = async (ordersArray) => {
    const itemIds = [];

    // Collect all item IDs from orders
    ordersArray.forEach((order) => {
      order.forEach((item) => {
        if (!itemIds.includes(item.item_id)) {
          itemIds.push(item.item_id);
        }
      });
    });

    try {
      const details = await Promise.all(
        itemIds.map((id) =>
          axios.get(`https://thriftstorebackend-8xii.onrender.com/api/item/${id}`).then((res) => res.data)
        )
      );

      // Map the item details by item_id
      const itemDetailsMap = details.reduce((acc, detail) => {
        acc[detail.item_id] = detail;
        return acc;
      }, {});

      setItemDetails(itemDetailsMap); // Store item details in the state
    } catch (error) {
      console.error('Error fetching item details:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <h1 style={styles.heading}>Loading Your Orders...</h1>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div style={styles.container}>
        <h1 style={styles.heading}>No Orders Found</h1>
        <p style={{ color: '#777' }}>It looks like you don't have any orders yet.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>My Orders</h1>
      {orders.map((order) => {
        const orderDate = new Date(order[0].order_date).toLocaleDateString();

        return (
          <div key={order[0].order_id} style={styles.orderCard}>
            <div style={styles.orderInfo}>
              <div>
                <strong>Order ID:</strong> {order[0].order_id}
              </div>
              {/* <div>
                <strong>Order Date:</strong> {orderDate}
              </div> */}
              <div style={styles.orderStatus}>
                <strong>Status:</strong> {order[0].order_status}
              </div>
            </div>

            <div style={styles.itemList}>
              {order.map((item) => {
                const itemDetail = itemDetails[item.item_id]; // Get item details from state
                console.log('item........',itemDetail );
                return (
                  <div key={item.item_id} style={styles.itemCard}>
                    <div style={styles.itemTitle}>{item.item_name}</div>
                    <img
                        src={itemDetail?.imageURL || 'path/to/default-image.jpg'} // Fallback to default image if imageURL is undefined
                        alt={itemDetail?.item_name || 'Item Image'}  // Use item name as fallback for alt text
                        style={styles.cartItemImage}
                        />
                    <div style={styles.itemDetails}>
                      <span>Quantity: {item.item_quantity}</span> |
                      <span> Price: ${(parseFloat(item.item_price).toFixed(2))}</span> |

                    </div>
                  </div>
                );
              })}
            </div>

            <div>
            <button
                style={styles.button}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = styles.button.backgroundColor)
                }
                // On click navigate and pass the order details in state
                onClick={() => navigate('/orderDetails', { state: { order } })}
              >
                View Order Details
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyOrders;
