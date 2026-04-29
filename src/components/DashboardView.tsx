import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AssessmentIcon from '@mui/icons-material/Assessment';

const DashboardView: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'STOK',
      description: 'Lihat dan pantau jumlah stok barang Anda.',
      icon: <InventoryIcon sx={{ fontSize: 50, mb: 1, color: 'primary.main' }} />,
      path: '/inventory',
      color: '#225E37'
    },
    {
      title: 'PENJUALAN',
      description: 'Catat transaksi penjualan barang ke pelanggan.',
      icon: <PointOfSaleIcon sx={{ fontSize: 50, mb: 1, color: 'primary.main' }} />,
      path: '/sales',
      color: '#225E37'
    },
    {
      title: 'LAPORAN',
      description: 'Lihat ringkasan dan riwayat pendapatan toko.',
      icon: <AssessmentIcon sx={{ fontSize: 50, mb: 1, color: 'primary.main' }} />,
      path: '/reports',
      color: '#225E37'
    },
  ];

  return (
    <Box sx={{ p: 3, pb: 10 }} className="app-container">
      <Box sx={{ mb: 4, mt: 2 }}>
        <Typography variant="h4" sx={{ color: '#225E37', fontWeight: 'bold' }}>
          Selamat Datang
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Pilih menu di bawah untuk mengelola toko Anda
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {menuItems.map((item) => (
          <Grid key={item.title} size={{ xs: 12 }}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                borderRadius: 4,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                }
              }}
              onClick={() => navigate(item.path)}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                <Box sx={{ mr: 3 }}>
                  {item.icon}
                </Box>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {item.description}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardView;
