import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useGasApi } from '../hooks/useGasApi';
import type { InventoryItem } from '../types';

// Lazy load the dialog
const InventoryDialog = lazy(() => import('./InventoryDialog'));

const InventoryView: React.FC = () => {
  const navigate = useNavigate();
  const { getInventory, updateInventory, loading, error } = useGasApi();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // Minimized State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Partial<InventoryItem> | null>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    try {
      const data = await getInventory();
      if (data) {
        setInventory(data);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'SESSION_EXPIRED') {
        navigate('/', { state: { message: 'HP lain sudah masuk. Silakan masuk kembali.' } });
      }
    }
  }, [getInventory, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInventory();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchInventory]);

  const handleOpenCreate = () => {
    setSelectedItem({});
    setDialogError(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setDialogError(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedItem(null);
  };

  const handleFormSubmit = async (data: { name: string; stock: number }) => {
    setDialogError(null);

    const payload: Partial<InventoryItem> = {
      name: data.name.trim(),
      stock: Number(data.stock),
    };

    if (selectedItem?.id) {
      payload.id = selectedItem.id;
    }

    try {
      const res = await updateInventory(payload);
      if (res.success) {
        setIsDialogOpen(false);
        setSelectedItem(null);
        fetchInventory();
      } else {
        setDialogError(res.message || 'Gagal menyimpan barang.');
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'SESSION_EXPIRED') {
        navigate('/', { state: { message: 'HP lain sudah masuk. Silakan masuk kembali.' } });
      } else {
        setDialogError('Terjadi kesalahan koneksi saat menyimpan.');
      }
    }
  };

  return (
    <Box sx={{ p: 3, pb: 10 }} className="app-container">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Stok Barang</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleOpenCreate}
        fullWidth
        sx={{ mb: 3, py: 2, fontSize: '1.1rem', fontWeight: 'bold', borderRadius: 2 }}
      >
        Tambah Stok Baru
      </Button>

      <Card sx={{ elevation: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Daftar Stok Saat Ini
          </Typography>
          
          {loading && Array.isArray(inventory) && inventory.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {Array.isArray(inventory) && inventory.map((item) => (
                <Grid key={item.id} size={{ xs: 12, sm: 6 }}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      border: 1, 
                      borderColor: 'grey.200', 
                      borderRadius: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      bgcolor: 'background.default'
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 'bold', flexGrow: 1, textAlign: 'left' }}>
                      {item.name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" color={item.stock > 0 ? 'primary' : 'error'} sx={{ fontWeight: 'bold' }}>
                        {item.stock}
                      </Typography>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleOpenEdit(item)}
                        disabled={loading}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
              ))}
              {Array.isArray(inventory) && inventory.length === 0 && !loading && (
                <Grid key="empty-inventory" size={{ xs: 12 }}>
                  <Typography variant="body1" color="textSecondary" align="center">
                    Tidak ada data barang.
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              variant="outlined" 
              size="large"
              onClick={fetchInventory} 
              disabled={loading}
              fullWidth
              sx={{ py: 1.5 }}
            >
              Refresh Data Stok
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Lazy loaded Dialog */}
      <Suspense fallback={null}>
        {isDialogOpen && (
          <InventoryDialog
            open={isDialogOpen}
            onClose={handleCloseDialog}
            onSubmit={handleFormSubmit}
            initialData={selectedItem}
            loading={loading}
            error={dialogError}
          />
        )}
      </Suspense>
    </Box>
  );
};

export default InventoryView;

