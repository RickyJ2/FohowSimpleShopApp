import React, { useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { useForm } from 'react-hook-form';
import type { InventoryItem } from '../types';

type FormData = {
  name: string;
  stock: number;
};

interface InventoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  initialData: Partial<InventoryItem> | null;
  loading: boolean;
  error: string | null;
}

const InventoryDialog: React.FC<InventoryDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading,
  error
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name || '',
        stock: initialData?.stock || 0
      });
    }
  }, [open, initialData, reset]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 'bold', color: '#225E37' }}>
        {initialData?.id ? 'Edit Barang' : 'Tambah Barang'}
      </DialogTitle>
      <DialogContent>
        {error && <Alert severity="warning" sx={{ mb: 2, mt: 1 }}>{error}</Alert>}
        
        <Box component="form" id="inventory-form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          <TextField
            label="Nama Barang"
            fullWidth
            {...register('name', { required: 'Nama barang tidak boleh kosong.' })}
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={loading}
          />
          <TextField
            label="Jumlah Stok"
            type="number"
            fullWidth
            {...register('stock', { 
              required: 'Stok tidak boleh kosong.',
              min: { value: 0, message: 'Stok harus 0 atau lebih.' }
            })}
            error={!!errors.stock}
            helperText={errors.stock?.message}
            disabled={loading}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button variant="contained" onClick={onClose} disabled={loading} fullWidth color="error">
          Batal
        </Button>
        <Button 
          type="submit"
          form="inventory-form"
          variant="contained" 
          disabled={loading}
          fullWidth
          sx={{ px: 4, fontWeight: 'bold' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Simpan'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InventoryDialog;
