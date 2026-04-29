import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, IconButton, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ReportsView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3, pb: 10 }} className="app-container">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Laporan</Typography>
      </Box>

      <Card sx={{ elevation: 3, borderRadius: 3 }}>
        <CardContent sx={{ p: 5, textAlign: 'center' }}>
          <Alert severity="info" sx={{ mb: 2 }}>Fitur Laporan segera hadir!</Alert>
          <Typography variant="body1" color="textSecondary">
            Halaman ini akan menampilkan riwayat penjualan dan statistik toko Anda.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReportsView;
