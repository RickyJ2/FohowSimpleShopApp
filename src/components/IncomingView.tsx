import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, IconButton, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const IncomingView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3, pb: 10 }} className="app-container">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Segera Hadir</Typography>
      </Box>

      <Card sx={{ elevation: 3, borderRadius: 3 }}>
        <CardContent sx={{ p: 5, textAlign: 'center' }}>
          <Alert severity="info" sx={{ mb: 2 }}>Fitur baru sedang dalam pengembangan!</Alert>
          <Typography variant="body1" color="textSecondary">
            Segera Hadir
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default IncomingView;
