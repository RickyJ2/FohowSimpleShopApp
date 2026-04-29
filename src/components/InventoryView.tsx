import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  IconButton,
  Avatar,
  Divider,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import { useGasApi } from '../hooks/useGasApi';
import type { InventoryGroup } from '../types';
import defaultImage from '../assets/DefaultImage.png';

const InventoryView: React.FC = () => {
  const navigate = useNavigate();
  const { getInventory, loading, error } = useGasApi();
  const [inventoryGroups, setInventoryGroups] = useState<InventoryGroup[]>([]);

  const fetchInventory = useCallback(async () => {
    try {
      const data = await getInventory();
      if (data) {
        setInventoryGroups(data);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'SESSION_EXPIRED') {
        navigate('/', { state: { message: 'HP lain sudah masuk. Silakan masuk kembali.' } });
      } else {
        console.error('Fetch error:', err);
      }
    }
  }, [getInventory, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInventory();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchInventory]);

  return (
    <Box sx={{ p: 3, pb: 10, bgcolor: '#FFFFFF', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton 
          onClick={() => navigate('/dashboard')} 
          sx={{ mr: 2, width: 60, height: 60 }}
        >
          <ArrowBackIcon sx={{ fontSize: 40 }} />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#000000' }}>
          Stok Barang
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, fontSize: '1.2rem' }}>{error}</Alert>}

      {loading && inventoryGroups.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {inventoryGroups.map((group) => (
            <Grid key={group.baseName} size={{ xs: 12 }}>
              <Card 
                sx={{ 
                  borderRadius: 4, 
                  border: '2px solid #E0E0E0',
                  boxShadow: 'none',
                  '&:hover': { borderColor: 'primary.main' }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      variant="rounded"
                      src={group.image || defaultImage}
                      sx={{ 
                        width: 100, 
                        height: 100, 
                        mr: 3, 
                        bgcolor: 'grey.100',
                        border: '1px solid #EEE'
                      }}
                    >
                      <Inventory2OutlinedIcon sx={{ fontSize: 50, color: 'grey.400' }} />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 900, 
                          fontSize: '24px', 
                          color: '#000000',
                          lineHeight: 1.2
                        }}
                      >
                        {group.baseName}
                      </Typography>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: 'primary.main', 
                          fontWeight: 'bold',
                          fontSize: '20px'
                        }}
                      >
                        Total: {group.totalStock} Unit
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ pl: { xs: 0, sm: 13 } }}>
                    {group.batches.map((batch) => (
                      <Box 
                        key={batch.id} 
                        sx={{ 
                          mb: 1.5, 
                          p: 2, 
                          bgcolor: '#F9F9F9', 
                          borderRadius: 2,
                          borderLeft: '5px solid',
                          borderColor: batch.stock > 0 ? 'success.main' : 'error.main'
                        }}
                      >
                        <Typography 
                          sx={{ 
                            fontSize: '18px', 
                            fontWeight: 'bold', 
                            color: '#333333' 
                          }}
                        >
                          {batch.variant}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 0.5 }}>
                          <Typography sx={{ fontSize: '16px', color: '#666666' }}>
                            <strong>PD:</strong> {batch.pd}
                          </Typography>
                          <Typography sx={{ fontSize: '16px', color: '#666666' }}>
                            <strong>EXP:</strong> {batch.exp}
                          </Typography>
                          <Typography 
                            sx={{ 
                              fontSize: '16px', 
                              fontWeight: 'bold', 
                              color: batch.stock > 0 ? 'success.dark' : 'error.main' 
                            }}
                          >
                            <strong>Sisa:</strong> {batch.stock}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
          
          {inventoryGroups.length === 0 && !loading && (
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" align="center" color="textSecondary" sx={{ mt: 5 }}>
                Tidak ada data stok.
              </Typography>
            </Grid>
          )}
        </Grid>
      )}

      <Box sx={{ mt: 5 }}>
        <Button 
          variant="outlined" 
          fullWidth 
          onClick={fetchInventory}
          disabled={loading}
          sx={{ height: 60, fontSize: '1.2rem', fontWeight: 'bold', borderRadius: 3 }}
        >
          Refresh Data Stok
        </Button>
      </Box>
    </Box>
  );
};

export default InventoryView;
