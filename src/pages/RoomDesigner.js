import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const RoomDesigner = () => {
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Room Designer
      </Typography>
      
      <Grid container spacing={3}>
        {/* Tools Panel - Contains furniture selection buttons */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Furniture
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button variant="outlined" fullWidth>
                Sofa
              </Button>
              <Button variant="outlined" fullWidth>
                Table
              </Button>
              <Button variant="outlined" fullWidth>
                Chair
              </Button>
              <Button variant="outlined" fullWidth>
                Bed
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Design Area - Main workspace for room design */}
        <Grid item xs={12} md={9}>
          <Paper
            sx={{
              p: 2,
              height: '600px',
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: '#f5f5f5',
            }}
          >
            {/* Room Design Area with zoom scaling */}
            <Box
              sx={{
                width: '100%',
                height: '100%',
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
              }}
            >
              {/* Placeholder for room content */}
              <Typography variant="body1" align="center" sx={{ mt: 4 }}>
                Drag and drop furniture items to design your room
              </Typography>
            </Box>

            {/* Design Controls - Floating toolbar with zoom and manipulation tools */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                display: 'flex',
                gap: 1,
                backgroundColor: 'white',
                borderRadius: 1,
                p: 1,
                boxShadow: 1,
              }}
            >
              {/* Zoom In Button */}
              <Tooltip title="Zoom In">
                <IconButton onClick={handleZoomIn}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
              {/* Zoom Out Button */}
              <Tooltip title="Zoom Out">
                <IconButton onClick={handleZoomOut}>
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
              {/* Rotate Left Button */}
              <Tooltip title="Rotate Left">
                <IconButton>
                  <RotateLeftIcon />
                </IconButton>
              </Tooltip>
              {/* Rotate Right Button */}
              <Tooltip title="Rotate Right">
                <IconButton>
                  <RotateRightIcon />
                </IconButton>
              </Tooltip>
              {/* Delete Button */}
              <Tooltip title="Delete">
                <IconButton>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RoomDesigner; 