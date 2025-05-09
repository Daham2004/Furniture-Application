import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Mock data for featured products
const featuredProducts = [
  {
    id: 1,
    name: 'Modern Sofa',
    price: 899.99,
    image: '/images/products/grey sofa.png',
  },
  {
    id: 2,
    name: 'Dining Table',
    price: 599.99,
    image: '/images/products/round table.png',
  },
  {
    id: 3,
    name: 'Coffee Table',
    price: 299.99,
    image: '/images/products/table drawer.png',
  },
];

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
      {/* Hero Section with modern design */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        sx={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(/images/banner.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'linear-gradient(to top, #fff, transparent)',
          },
        }}
      >
        <Container>
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              maxWidth: '800px',
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            <Typography
              variant={isMobile ? 'h3' : 'h1'}
              gutterBottom
              sx={{
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                mb: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              Transform Your Space
            </Typography>
            <Typography
              variant={isMobile ? 'h6' : 'h4'}
              gutterBottom
              sx={{
                mb: 4,
                opacity: 0.9,
                fontStyle: 'italic',
              }}
            >
              Discover premium furniture and design your perfect room
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/room-designer')}
              sx={{
                mt: 2,
                px: 4,
                py: 1.5,
                borderRadius: '30px',
                fontSize: '1.1rem',
                textTransform: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 25px rgba(0,0,0,0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Start Designing
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Products Section with modern card design */}
      <Container sx={{ py: 8 }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 6,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '4px',
              background: theme.palette.primary.main,
              borderRadius: '2px',
            },
          }}
        >
          Featured Products
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {featuredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Card
                component={motion.div}
                whileHover={{ y: -10 }}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                  },
                }}
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={product.image}
                  alt={product.name}
                  sx={{
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
                <CardContent
                  sx={{
                    flexGrow: 1,
                    p: 3,
                    background: 'linear-gradient(to bottom, #fff, #f8f9fa)',
                  }}
                >
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    sx={{ fontWeight: 600 }}
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{
                      fontWeight: 700,
                      fontSize: '1.25rem',
                    }}
                  >
                    ${product.price.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => navigate('/products')}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: '30px',
              fontSize: '1.1rem',
              textTransform: 'none',
              borderWidth: '2px',
              '&:hover': {
                borderWidth: '2px',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            View All Products
          </Button>
        </Box>
      </Container>

      {/* Room Designer Section with modern layout */}
      <Paper
        sx={{
          py: 8,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), url(/assets/design-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h3"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -10,
                      left: 0,
                      width: '60px',
                      height: '4px',
                      background: theme.palette.primary.main,
                      borderRadius: '2px',
                    },
                  }}
                >
                  Design Your Perfect Room
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    color: 'text.secondary',
                    mb: 4,
                  }}
                >
                  Use our interactive room designer to visualize how furniture will
                  look in your space. Experiment with different layouts, colors,
                  and styles to create your dream room.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/room-designer')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: '30px',
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 25px rgba(0,0,0,0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Try Room Designer
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};

export default Home; 