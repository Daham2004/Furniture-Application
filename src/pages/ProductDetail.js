import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardMedia,
  TextField,
  Rating,
  Divider,
  Chip,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { products } from '../utils/products';

// Main ProductDetail component that displays detailed information about a specific product
const ProductDetail = () => {
  // Get product ID from URL parameters
  const { id } = useParams();
  const navigate = useNavigate();
  // State for managing product quantity
  const [quantity, setQuantity] = useState(1);
  const product = products.find((p) => p.id === Number(id));

  // Handle case when product is not found
  if (!product) {
    return (
      <Container>
        <Typography variant="h4">Product not found</Typography>
      </Container>
    );
  }

  // Handle quantity input changes
  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  // Handle add to cart action
  const handleAddToCart = () => {
    // Add to cart logic would be implemented here
    console.log(`Added ${quantity} ${product.name} to cart`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4} alignItems="flex-start">
        {/* Product Image Section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: { xs: 240, sm: 320, md: 400 }, mb: 2 }}>
            <img
              src={product.image}
              alt={product.name}
              style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 12, objectFit: 'contain', width: '100%' }}
              onError={e => { e.target.onerror = null; e.target.src = '/images/products/placeholder.png'; }}
            />
          </Box>
        </Grid>
        {/* Product Information Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={product.rating} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({product.reviews} reviews)
            </Typography>
          </Box>
          <Typography
            variant="h5"
            color="primary"
            sx={{ fontWeight: 'bold', mb: 2 }}
          >
            ${product.price.toFixed(2)}
          </Typography>
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Features:
          </Typography>
          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {product.features && product.features.map((feature, index) => (
              <Chip
                key={index}
                label={feature}
                variant="outlined"
              />
            ))}
          </Box>
          <Typography variant="h6" gutterBottom>
            Dimensions:
          </Typography>
          <Typography variant="body1" paragraph>
            Width: {product.dimensions?.width}
            <br />
            Depth: {product.dimensions?.depth}
            <br />
            Height: {product.dimensions?.height}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <TextField
              type="number"
              label="Quantity"
              value={quantity}
              onChange={handleQuantityChange}
              inputProps={{ min: 1 }}
              sx={{ width: '100px' }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<ShoppingCartIcon />}
              onClick={handleAddToCart}
              sx={{ flexGrow: 1, minWidth: 180 }}
            >
              Add to Cart
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FavoriteBorderIcon />}
              sx={{ minWidth: 120 }}
            >
              Wishlist
            </Button>
          </Box>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/room-designer')}
            sx={{ mt: 1 }}
          >
            Try Room Designer
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail; 