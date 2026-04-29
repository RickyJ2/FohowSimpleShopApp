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
  IconButton,
  Avatar,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useGasApi } from '../hooks/useGasApi';
import type { InventoryGroup, Batch } from '../types';
import defaultImage from '../assets/DefaultImage.png';

const SalesView: React.FC = () => {
  const navigate = useNavigate();
  const { getInventory, recordSale, loading, error } = useGasApi();
  const [inventoryGroups, setInventoryGroups] = useState<InventoryGroup[]>([]);
  
  // Selection State
  const [activeStep, setActiveStep] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState<InventoryGroup | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [quantity, setQuantity] = useState<string>('1');
  const [price, setPrice] = useState<string>('');
  
  const [saleError, setSaleError] = useState<string | null>(null);
  const [saleSuccess, setSaleSuccess] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    try {
      const data = await getInventory();
      if (data) {
        setInventoryGroups(data);
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

  const handleGroupSelect = (group: InventoryGroup) => {
    setSelectedGroup(group);
    setSelectedBatch(null);
    setActiveStep(1);
  };

  const handleBatchSelect = (batch: Batch) => {
    setSelectedBatch(batch);
    setActiveStep(2);
  };

  const handleBack = () => {
    if (activeStep === 2) {
      setActiveStep(1);
      setSelectedBatch(null);
    } else if (activeStep === 1) {
      setActiveStep(0);
      setSelectedGroup(null);
    }
    setSaleError(null);
    setSaleSuccess(null);
  };

  const handleJual = async () => {
    setSaleError(null);
    setSaleSuccess(null);
    
    if (!selectedBatch) return;
    
    const qtyNum = Number(quantity);
    const priceNum = Number(price);

    if (!qtyNum || qtyNum <= 0) {
      setSaleError('Masukkan jumlah yang valid.');
      return;
    }
    if (qtyNum > selectedBatch.stock) {
      setSaleError(`Stok tidak mencukupi (Sisa: ${selectedBatch.stock}).`);
      return;
    }
    if (!priceNum || priceNum < 0) {
      setSaleError('Masukkan harga yang valid.');
      return;
    }

    try {
      const res = await recordSale({
        batchId: selectedBatch.id,
        quantity: qtyNum,
        price: priceNum
      });
      
      if (res.success) {
        setSaleSuccess('Penjualan berhasil dicatat!');
        // Reset to beginning
        setTimeout(() => {
          setSelectedGroup(null);
          setSelectedBatch(null);
          setActiveStep(0);
          setQuantity('1');
          setPrice('');
          setSaleSuccess(null);
          fetchInventory();
        }, 2000);
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
    <Box sx={{ p: 3, pb: 10, bgcolor: '#FFFFFF', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: 2, width: 60, height: 60 }}>
          <ArrowBackIcon sx={{ fontSize: 40 }} />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#000000' }}>
          Catat Penjualan
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        <Step><StepLabel>Pilih Barang</StepLabel></Step>
        <Step><StepLabel>Pilih Batch</StepLabel></Step>
        <Step><StepLabel>Jumlah & Harga</StepLabel></Step>
      </Stepper>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {saleError && <Alert severity="warning" sx={{ mb: 3, fontSize: '1.2rem' }}>{saleError}</Alert>}
      {saleSuccess && <Alert severity="success" sx={{ mb: 3, fontSize: '1.2rem' }}>{saleSuccess}</Alert>}

      {/* STEP 0: SELECT PRODUCT GROUP */}
      {activeStep === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {inventoryGroups.filter(g => g.totalStock > 0).map((group) => (
            <Card 
              key={group.baseName} 
              onClick={() => handleGroupSelect(group)}
              sx={{ 
                cursor: 'pointer', 
                borderRadius: 4, 
                border: '2px solid #E0E0E0',
                '&:hover': { borderColor: 'primary.main', bgcolor: '#F0F7FF' }
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <Avatar 
                  variant="rounded" 
                  src={group.image || defaultImage} 
                  sx={{ width: 80, height: 80, mr: 2 }} 
                />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '22px' }}>
                    {group.baseName}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" sx={{ fontSize: '18px' }}>
                    Total Stok: {group.totalStock}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* STEP 1: SELECT BATCH */}
      {activeStep === 1 && selectedGroup && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
            Pilih Batch untuk: {selectedGroup.baseName}
          </Typography>
          {selectedGroup.batches.filter(b => b.stock > 0).map((batch) => (
            <Card 
              key={batch.id} 
              onClick={() => handleBatchSelect(batch)}
              sx={{ 
                cursor: 'pointer', 
                borderRadius: 4, 
                border: '2px solid #E0E0E0',
                '&:hover': { borderColor: 'primary.main', bgcolor: '#F0F7FF' }
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '20px' }}>
                  {batch.variant}
                </Typography>
                <Typography sx={{ fontSize: '16px' }}>
                  EXP: {batch.exp} | Stok: <strong>{batch.stock}</strong>
                </Typography>
              </CardContent>
            </Card>
          ))}
          <Button variant="outlined" onClick={handleBack} sx={{ mt: 2, height: 60 }}>
            KEMBALI
          </Button>
        </Box>
      )}

      {/* STEP 2: ENTER QUANTITY & PRICE */}
      {activeStep === 2 && selectedBatch && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Card sx={{ p: 2, bgcolor: '#F5F5F5', borderRadius: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {selectedGroup?.baseName} - {selectedBatch.variant}
            </Typography>
            <Typography>Stok Tersedia: {selectedBatch.stock}</Typography>
          </Card>

          <TextField
            label="Jumlah (Unit)"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            fullWidth
            slotProps={{
              htmlInput: { min: 1, max: selectedBatch.stock, style: { fontSize: '24px', height: '40px' } },
              inputLabel: { style: { fontSize: '18px' } }
            }}
            sx={{ '& .MuiInputBase-root': { height: 80 } }}
          />

          <TextField
            label="Total Harga (Rp)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            placeholder="Masukkan harga total"
            slotProps={{
              htmlInput: { min: 0, style: { fontSize: '24px', height: '40px' } },
              inputLabel: { style: { fontSize: '18px' } }
            }}
            sx={{ '& .MuiInputBase-root': { height: 80 } }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={handleBack} 
              sx={{ flex: 1, height: 70, fontSize: '1.2rem' }}
            >
              KEMBALI
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleJual}
              disabled={loading || !quantity || !price}
              sx={{ flex: 2, height: 70, fontSize: '1.4rem', fontWeight: 'bold' }}
            >
              {loading ? <CircularProgress size={30} color="inherit" /> : 'SIMPAN'}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SalesView;
