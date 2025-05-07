// Import React and ReactDOM for rendering the application
import React from 'react';
import ReactDOM from 'react-dom/client';
// Import global styles and main App component
import './index.css';
import App from './App';
// Import performance monitoring utility
import reportWebVitals from './reportWebVitals';

// Create a root element for React to render into
const root = ReactDOM.createRoot(document.getElementById('root'));
// Render the main App component wrapped in StrictMode for additional development checks
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance monitoring configuration
// To enable performance monitoring, uncomment and configure the following line:
// reportWebVitals(console.log);
// For more information about performance monitoring, visit: https://bit.ly/CRA-vitals
reportWebVitals();
