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

// Mock data for product details - In a real application, this would come from an API
const productDetails = {
  1: {
    name: 'Modern Sofa',
    price: 899.99,
    description:
      'A luxurious modern sofa designed for ultimate comfort and style. Features premium fabric upholstery, deep seating, and elegant design elements.',
    features: [
      'Premium fabric upholstery',
      'Deep seating for maximum comfort',
      'Modern design with clean lines',
      'Durable hardwood frame',
      'Easy to clean and maintain',
    ],
    dimensions: {
      width: '84 inches',
      depth: '36 inches',
      height: '32 inches',
    },
    images: [
      '/assets/sofa-1.jpg',
      '/assets/sofa-2.jpg',
      '/assets/sofa-3.jpg',
    ],
    rating: 4.5,
    reviews: 128,
  },
  2: {
    name: 'Dining Table',
    price: 599.99,
    description:
      'A beautiful dining table that combines functionality with modern design. Perfect for family gatherings and dinner parties.',
    features: [
      'Solid wood construction',
      'Seats up to 6 people',
      'Modern minimalist design',
      'Easy to assemble',
      'Scratch-resistant surface',
    ],
    dimensions: {
      width: '72 inches',
      depth: '36 inches',
      height: '30 inches',
    },
    images: [
      '/assets/dining-table-1.jpg',
      '/assets/dining-table-2.jpg',
      '/assets/dining-table-3.jpg',
    ],
    rating: 4.2,
    reviews: 95,
  },
};

// Main ProductDetail component that displays detailed information about a specific product
const ProductDetail = () => {
  // Get product ID from URL parameters
  const { id } = useParams();
  const navigate = useNavigate();
  // State for managing product quantity
  const [quantity, setQuantity] = useState(1);
  const product = productDetails[id];

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
      <Grid container spacing={4}>
        {/* Product Images Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={product.images[0]}
              alt={product.name}
            />
          </Card>
          {/* Thumbnail Images */}
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            {product.images.slice(1).map((image, index) => (
              <Card key={index} sx={{ width: '100px' }}>
                <CardMedia
                  component="img"
                  height="100"
                  image={image}
                  alt={`${product.name} view ${index + 2}`}
                />
              </Card>
            ))}
          </Box>
        </Grid>

        {/* Product Information Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          {/* Rating and Reviews */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={product.rating} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({product.reviews} reviews)
            </Typography>
          </Box>
          {/* Price */}
          <Typography
            variant="h5"
            color="primary"
            sx={{ fontWeight: 'bold', mb: 2 }}
          >
            ${product.price.toFixed(2)}
          </Typography>
          {/* Description */}
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          <Divider sx={{ my: 2 }} />
          {/* Features */}
          <Typography variant="h6" gutterBottom>
            Features:
          </Typography>
          <Box sx={{ mb: 2 }}>
            {product.features.map((feature, index) => (
              <Chip
                key={index}
                label={feature}
                sx={{ mr: 1, mb: 1 }}
                variant="outlined"
              />
            ))}
          </Box>
          {/* Dimensions */}
          <Typography variant="h6" gutterBottom>
            Dimensions:
          </Typography>
          <Typography variant="body1" paragraph>
            Width: {product.dimensions.width}
            <br />
            Depth: {product.dimensions.depth}
            <br />
            Height: {product.dimensions.height}
          </Typography>
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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
              sx={{ flexGrow: 1 }}
            >
              Add to Cart
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FavoriteBorderIcon />}
            >
              Wishlist
            </Button>
          </Box>
          {/* Room Designer Button */}
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/room-designer')}
          >
            Try in Room Designer
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail; 