import React from 'react';
import { Button, Box, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../utils/CartContext';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  React.useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom color="primary">
          Thank you for your order!
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Your order has been placed successfully. We appreciate your business!
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/products')}>
          Continue Shopping
        </Button>
      </Box>
    </Container>
  );
};

export default OrderConfirmation; 