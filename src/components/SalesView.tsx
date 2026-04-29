import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  TextField,
  MenuItem,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useGasApi } from '../hooks/useGasApi';
import type { InventoryItem } from '../types';

const SalesView: React.FC = () => {
  const navigate = useNavigate();
  const { getInventory, recordSale, loading, error } = useGasApi();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [saleError, setSaleError] = useState<string | null>(null);
  const [saleSuccess, setSaleSuccess] = useState<string | null>(null);

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

  const handleJual = async () => {
    setSaleError(null);
    setSaleSuccess(null);
    
    if (!selectedItem) {
      setSaleError('Pilih barang terlebih dahulu.');
      return;
    }
    
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setSaleError('Masukkan harga yang valid.');
      return;
    }

    const numPrice = Number(price);
    try {
      const res = await recordSale(selectedItem, numPrice);
      
      if (res.success) {
        setSaleSuccess('Penjualan berhasil dicatat!');
        setSelectedItem('');
        setPrice('');
        fetchInventory();
      } else {
        setSaleError(res.message || 'Gagal mencatat penjualan.');
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'SESSION_EXPIRED') {
        navigate('/', { state: { message: 'HP lain sudah masuk. Silakan masuk kembali.' } });
      } else {
        setSaleError('Terjadi kesalahan saat mencatat penjualan.');
      }
    }
  };

  return (
    <Box sx={{ p: 3, pb: 10 }} className="app-container">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Catat Penjualan</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Card sx={{ elevation: 3, borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          {saleError && <Alert severity="warning" sx={{ mb: 3 }}>{saleError}</Alert>}
          {saleSuccess && <Alert severity="success" sx={{ mb: 3 }}>{saleSuccess}</Alert>}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <TextField
              select
              label="Pilih Barang"
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              fullWidth
              disabled={loading}
              sx={{ '& .MuiInputBase-root': { fontSize: '1.2rem' } }}
            >
              {Array.isArray(inventory) && inventory.filter(i => i.stock > 0).map((item) => (
                <MenuItem key={item.id} value={item.name} sx={{ py: 2 }}>
                  {item.name} (Sisa: {item.stock})
                </MenuItem>
              ))}
              {(!Array.isArray(inventory) || inventory.filter(i => i.stock > 0).length === 0) && (
                <MenuItem key="no-stock" disabled value="">
                  Stok Habis
                </MenuItem>
              )}
            </TextField>

            <TextField
              label="Harga Jual (Rp)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
              disabled={loading}
              placeholder="Contoh: 15000"
              slotProps={{
                htmlInput: { min: 0, style: { fontSize: '1.2rem' } }
              }}
            />

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleJual}
              disabled={loading || !selectedItem || !price}
              sx={{ py: 2, fontSize: '1.2rem', fontWeight: 'bold' }}
            >
              {loading ? <CircularProgress size={28} color="inherit" /> : 'CATAT PENJUALAN'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SalesView;
