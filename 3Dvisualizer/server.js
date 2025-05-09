// Import required modules
const express = require('express'); // Express framework for server
const path = require('path'); // Node.js path module for handling file paths
const app = express(); // Create an Express application instance

// Serve the e-commerce React app static files from the build directory
app.use(express.static(path.join(__dirname, 'ecommerce/build')));

// Serve the Blueprint3D project static files from the example directory
app.use('/blueprint3d', express.static(path.join(__dirname, 'example')));
app.use('/textures', express.static(path.join(__dirname, 'example/textures')));
app.use('/js', express.static(path.join(__dirname, 'example/js')));
app.use('/css', express.static(path.join(__dirname, 'example/css')));
app.use('/models', express.static(path.join(__dirname, 'example/models')));
app.use('/rooms', express.static(path.join(__dirname, 'example/rooms')));
app.use('/fonts', express.static(path.join(__dirname, 'example/fonts')));

// Handle React routing: for any route not matched above, send back the React app's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'ecommerce/build', 'index.html'));
});

// Set the port for the server to listen on (default to 3000 if not specified in environment)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 