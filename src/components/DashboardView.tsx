import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  type SvgIconProps,
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
// import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
// import AssessmentIcon from '@mui/icons-material/Assessment';

interface MenuItem {
  title: string;
  description: string;
  icon: React.ReactElement<SvgIconProps>;
  path: string;
}

const DashboardView: React.FC = () => {
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      title: 'STOK BARANG',
      description: 'Lihat daftar barang dan sisa stok.',
      icon: <InventoryIcon sx={{ fontSize: 60, mb: 1, color: '#225E37' }} />,
      path: '/inventory',
    },
    // {
    //   title: 'PENJUALAN',
    //   description: 'Catat transaksi penjualan hari ini.',
    //   icon: <PointOfSaleIcon sx={{ fontSize: 60, mb: 1, color: '#225E37' }} />,
    //   path: '/sales',
    // },
    // {
    //   title: 'LAPORAN',
    //   description: 'Lihat riwayat dan total pendapatan.',
    //   icon: <AssessmentIcon sx={{ fontSize: 60, mb: 1, color: '#225E37' }} />,
    //   path: '/reports',
    // },
    {
      title: 'INCOMING',
      description: 'Fitur baru akan segera hadir di sini.',
      icon: <RocketLaunchIcon sx={{ fontSize: 60, mb: 1, color: '#225E37' }} />,
      path: '#',
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, pb: 10, bgcolor: '#FFFFFF' }} className="app-container">
      <Box sx={{ mb: { xs: 4, sm: 6 }, mt: 2 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            color: '#225E37', 
            fontWeight: 900, 
            mb: 1,
            fontSize: { xs: '2rem', sm: '3rem' }
          }}
        >
          Selamat Datang
        </Typography>
        <Typography 
          variant="h5" 
          color="textSecondary" 
          sx={{ 
            fontWeight: 'medium',
            fontSize: { xs: '1.1rem', sm: '1.5rem' }
          }}
        >
          Pilih menu di bawah untuk mulai:
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {menuItems.map((item) => (
          <Grid key={item.title} size={{ xs: 12 }}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                borderRadius: 5,
                border: '3px solid #E0E0E0',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#225E37',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  bgcolor: '#F0F7F3'
                }
              }}
              onClick={() => navigate(item.path)}
            >
              <CardContent 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  p: { xs: 2.5, sm: 4 }, 
                  minHeight: { xs: 100, sm: 120 } 
                }}
              >
                <Box sx={{ mr: { xs: 2.5, sm: 4 }, display: 'flex', alignItems: 'center' }}>
                  {React.cloneElement(item.icon, {
                    sx: { 
                      ...item.icon.props.sx,
                      fontSize: { xs: 45, sm: 60 } 
                    }
                  })}
                </Box>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 900, 
                      mb: 0.5, 
                      color: '#000000',
                      fontSize: { xs: '1.4rem', sm: '2.125rem' },
                      lineHeight: 1.2
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color="textSecondary" 
                    sx={{ 
                      fontSize: { xs: '0.95rem', sm: '1.25rem' },
                      lineHeight: 1.3
                    }}
                  >
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
