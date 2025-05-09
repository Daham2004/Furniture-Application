import React from 'react';
import { Box, Typography } from '@mui/material';

const RoomDesigner = () => (
  <Box sx={{ width: '100vw', minHeight: '100vh', py: 2, background: '#f8fafc' }}>
    <Typography variant="h4" gutterBottom align="center">
      Room Designer
    </Typography>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        mt: 2,
      }}
    >
      <iframe
        title="3D Room Designer"
        src="/visualizer/index.html"
        style={{
          width: '99vw',
          height: '85vh',
          border: 'none',
          background: 'transparent',
          display: 'block',
          borderRadius: '12px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        }}
        allowFullScreen
      />
    </Box>
  </Box>
);

export default RoomDesigner; 