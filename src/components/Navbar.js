import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Badge,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <List>
      <ListItem button component={RouterLink} to="/">
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button component={RouterLink} to="/products">
        <ListItemText primary="Products" />
      </ListItem>
      <ListItem button component={RouterLink} to="/room-designer">
        <ListItemText primary="Room Designer" />
      </ListItem>
      <ListItem button component={RouterLink} to="/login">
        <ListItemText primary="Login" />
      </ListItem>
      <ListItem button component={RouterLink} to="/register">
        <ListItemText primary="Register" />
      </ListItem>
    </List>
  );

  return (
    <AppBar position="sticky">
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
          }}
        >
          Furniture Store
        </Typography>
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" component={RouterLink} to="/products">
              Products
            </Button>
            <Button color="inherit" component={RouterLink} to="/room-designer">
              Room Designer
            </Button>
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
            <Button color="inherit" component={RouterLink} to="/register">
              Register
            </Button>
          </Box>
        )}
        <IconButton color="inherit">
          <SearchIcon />
        </IconButton>
        <IconButton color="inherit" component={RouterLink} to="/cart">
          <Badge badgeContent={0} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Toolbar>
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar; 