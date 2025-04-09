import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import { 
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  Grid,
  Typography,
  Button
} from '@mui/material';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const steps = ['PLACED', 'SHIPPED', 'DELIVERED'];

export default function OrderDetails() {
  const location = useLocation();
  const order = location.state?.order;
    console.log('order...........',order);
  const [itemDetails, setItemDetails] = useState(null);  // State to store item details
  const [loading, setLoading] = useState(true);  // Loading state

  useEffect(() => {
    if (order && order[0]?.item_id) {
      const fetchItemDetails = async () => {
        try {
          const response = await axios.get(`https://thriftstorebackend-8xii.onrender.com/api/item/${order[0].item_id}`); // Adjust API endpoint as needed
          setItemDetails(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching item details:', error);
          setLoading(false);
        }
      };
      
      fetchItemDetails();
    }
  }, [order]);

  if (!order) {
    return <p>No order details available.</p>;
  }

  const orderDate = new Date(order[0].order_date).toLocaleDateString();
  const activeStep = 1;

  return (
    <Box>
      <Grid 
        container 
        justifyContent="center" 
        alignItems="center" 
        sx={{ minHeight: '100%' }}
      >
        <Grid item xs={12} sm={10} md={12} lg={12}>
          <Card>
            {/* HEADER */}
            <CardHeader
              title={
                <Box mb={3} pb={2}>
                  <Typography variant="body2" color="text.secondary" style={{ fontSize: '35px' }}>
                    Order ID <strong style={{ color: '#000' }}>{order[0].order_id}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" style={{ fontSize: '20px' }}>
                    Placed On{' '}
                    <strong style={{ color: '#000' }}>{orderDate}</strong>
                  </Typography>
                </Box>
              }
            />

            {/* BODY */}
            <CardContent sx={{ p: 2 }}>
              {order.map((item) => (
                <Box
                  key={item.item_id}
                  display="flex"
                  flexDirection={{ xs: 'column', md: 'row' }}
                  mb={3}
                  pb={2}
                  borderBottom="1px solid rgba(0,0,0,0.1)"
                >
                  <Box flex="1 1 auto" mr={{ md: 2 }} mb={{ xs: 2, md: 0 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {itemDetails ? itemDetails.name : 'Loading...'}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Brand: {itemDetails ? itemDetails.brand : 'Loading...'}
                    </Typography>
                    <Typography variant="h5" mt={1} mb={1}>
                      ${parseFloat(item.item_price).toFixed(2)}{' '}
                      <Typography variant="body2" component="span" color="text.secondary">
                        via (COD)
                      </Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tracking Status on:{' '}
                      <strong style={{ color: '#000' }}>11:30pm, Today</strong>
                    </Typography>
                  </Box>

                  {/* Image */}
                  <Box sx={{ flexShrink: 0, textAlign: 'center' }}>
                    <CardMedia
                      component="img"
                      image={itemDetails ? itemDetails.imageURL : '/placeholder.jpg'}
                      alt={itemDetails ? itemDetails.name : 'Loading...'}
                      sx={{ maxWidth: 250, margin: '0 auto' }}
                    />
                  </Box>
                </Box>
              ))}

              {/* PROGRESS BAR (MUI STEPPER) */}
              <Stepper
                alternativeLabel
                activeStep={activeStep}
                sx={{ my: 4 }}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </CardContent>

            {/* FOOTER */}
            <CardActions sx={{ p: 2, justifyContent: 'center' }}>
              <Button variant="text" size="small">
                Cancel
              </Button>
              <Button variant="text" size="small">
                Pre-pay
              </Button>
              <Button variant="text" size="small" sx={{ color: 'rgba(0,0,0,0.6)' }}>
                <i className="fas fa-ellipsis-v" />
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
