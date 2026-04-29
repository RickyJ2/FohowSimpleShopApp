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
  CircularProgress,
  Autocomplete
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import type { InventoryItem } from '../types';

type FormData = {
  baseName: string;
  variant: string;
  pd: string;
  exp: string;
  stock: number;
  image: string;
};

interface InventoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  initialData: Partial<InventoryItem> | null;
  loading: boolean;
  error: string | null;
  baseNameOptions: string[];
}

const DEFAULT_IMAGE = "https://raw.githubusercontent.com/RickyJ2/FohowSimpleShopApp/refs/heads/main/img/DefaultImage.png";

const InventoryDialog: React.FC<InventoryDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading,
  error,
  baseNameOptions
}) => {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    if (open) {
      reset({
        baseName: initialData?.baseName || '',
        variant: initialData?.variant || 'Standard',
        pd: initialData?.pd || '',
        exp: initialData?.exp || '',
        stock: initialData?.stock || 0,
        image: initialData?.image || DEFAULT_IMAGE
      });
    }
  }, [open, initialData, reset]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 'bold', color: '#225E37', fontSize: '1.5rem' }}>
        {initialData?.id ? 'Edit Varian Barang' : 'Tambah Stok/Barang Baru'}
      </DialogTitle>
      <DialogContent>
        {error && <Alert severity="warning" sx={{ mb: 2, mt: 1, fontSize: '1.2rem' }}>{error}</Alert>}
        
        <Box component="form" id="inventory-form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          
          <Controller
            name="baseName"
            control={control}
            rules={{ required: 'Nama barang (Base Name) tidak boleh kosong.' }}
            render={({ field }) => (
              <Autocomplete
                freeSolo
                options={baseNameOptions}
                disabled={loading || !!initialData?.id} 
                value={field.value}
                onChange={(_, data) => field.onChange(data)}
                onInputChange={(_, newInputValue) => {
                  field.onChange(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Nama Barang Utama"
                    error={!!errors.baseName}
                    helperText={errors.baseName?.message}
                    sx={{ '& .MuiInputBase-root': { fontSize: '1.2rem' } }}
                  />
                )}
              />
            )}
          />

          <TextField
            label="Nama Varian"
            fullWidth
            {...register('variant')}
            disabled={loading}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ '& .MuiInputBase-root': { fontSize: '1.2rem' } }}
          />
            <TextField
              label="Tgl Produksi (PD)"
              type="date"
              fullWidth
              {...register('pd')}
              disabled={loading}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ '& .MuiInputBase-root': { fontSize: '1.2rem' } }}
            />
            <TextField
              label="Tgl Kedaluwarsa (EXP)"
              type="date"
              fullWidth
              {...register('exp')}
              disabled={loading}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ '& .MuiInputBase-root': { fontSize: '1.2rem' } }}
            />
          

          <TextField
            label="Jumlah Stok"
            type="number"
            fullWidth
            {...register('stock', { 
              min: { value: 0, message: 'Stok harus 0 atau lebih.' }
            })}
            error={!!errors.stock}
            helperText={errors.stock?.message}
            disabled={loading}
            sx={{ '& .MuiInputBase-root': { fontSize: '1.2rem' } }}
          />

          <TextField
            label="URL Gambar (GitHub)"
            fullWidth
            {...register('image')}
            disabled={loading}
            placeholder={DEFAULT_IMAGE}
            sx={{ '& .MuiInputBase-root': { fontSize: '1.2rem' } }}
          />

        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button 
          variant="outlined" 
          onClick={onClose} 
          disabled={loading} 
          fullWidth 
          color="inherit"
          sx={{ height: 60, fontSize: '1.2rem' }}
        >
          Batal
        </Button>
        <Button 
          type="submit"
          form="inventory-form"
          variant="contained" 
          color="primary"
          disabled={loading}
          fullWidth
          sx={{ height: 60, fontSize: '1.2rem', fontWeight: 'bold' }}
        >
          {loading ? <CircularProgress size={28} color="inherit" /> : 'Simpan'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InventoryDialog;
