import React, { useEffect, useState, useCallback, Suspense, lazy, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,  
  Alert,
  Card,
  CardContent,
  Grid,
  IconButton,
  Avatar,
  Divider,
  Button,
  Collapse,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from '@mui/icons-material/Search';
import { useGasApi } from '../hooks/useGasApi';
import type { InventoryGroup, InventoryItem, Batch, UpdateInventoryItem } from '../types';
import defaultImage from '../assets/DefaultImage.png';

const InventoryDialog = lazy(() => import('./InventoryDialog'));

// --- Helper functions ---

const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return '-';
  
  // Handle ISO strings with time (e.g. 2024-01-01T00:00:00.000Z)
  if (dateStr.includes('T')) {
    const splitT = dateStr.split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(splitT)) return splitT;
  }

  // If it's already exactly YYYY-MM-DD, return it
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  
  // Try to parse DD-MM-YYYY or DD/MM/YYYY or D/M/YYYY
  const parts = dateStr.split(/[-/]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      // YYYY-MM-DD (but maybe not zero padded)
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].substring(0, 2).padStart(2, '0')}`;
    } else if (parts[2].length === 4) {
      // DD-MM-YYYY or D-M-YYYY
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }
  
  // Final fallback using standard Date parsing
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }

  return dateStr;
};

// --- Sub-components for better performance and maintenance ---

const InventoryHeader = memo(({ onBack }: { onBack: () => void }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
    <IconButton 
      onClick={onBack} 
      sx={{ mr: 2, width: { xs: 50, sm: 60 }, height: { xs: 50, sm: 60 } }}
    >
      <ArrowBackIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />
    </IconButton>
    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#000000', fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
      Stok Barang
    </Typography>
  </Box>
));

const BatchItemRow = memo(({ 
  batch, 
  onEdit 
}: { 
  batch: Batch, 
  onEdit: (batch: Batch) => void 
}) => (
  <Box 
    sx={{ 
      mb: 1.5, 
      p: 2, 
      bgcolor: '#F9F9F9', 
      borderRadius: 2,
      borderLeft: '5px solid',
      borderColor: batch.stock > 0 ? 'success.main' : 'error.main',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }}
  >
    <Box sx={{ flexGrow: 1, pr: 1 }}>
      <Typography 
        sx={{ 
          fontSize: { xs: '16px', sm: '18px' }, 
          fontWeight: 'bold', 
          color: '#333333',
          textAlign: 'left'
        }}
      >
        {batch.variant}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
        <Typography sx={{ fontSize: { xs: '14px', sm: '16px' }, color: '#666666', textAlign: 'left' }}>
          <strong>PD:</strong> {formatDate(batch.pd)}
        </Typography>
        <Typography sx={{ fontSize: { xs: '14px', sm: '16px' }, color: '#666666', textAlign: 'left' }}>
          <strong>EXP:</strong> {formatDate(batch.exp)}
        </Typography>
        <Typography 
          sx={{ 
            fontSize: { xs: '14px', sm: '16px' }, 
            fontWeight: 'bold', 
            color: batch.stock > 0 ? 'success.dark' : 'error.main',
            textAlign: 'left'
          }}
        >
          <strong>Sisa:</strong> {batch.stock}
        </Typography>
      </Box>
    </Box>
    <IconButton 
      color="primary"
      onClick={(e) => {
        e.stopPropagation();
        onEdit(batch);
      }}
      sx={{ 
        border: '1px solid', 
        borderColor: 'primary.light',
        bgcolor: 'white',
        p: 1,
        '&:hover': { bgcolor: 'primary.50' }
      }}
    >
      <EditIcon fontSize="medium" />
    </IconButton>
  </Box>
));

const InventoryGroupCard = memo(({ 
  group, 
  isExpanded, 
  onToggle, 
  onEditBatch,
  onEditBaseName
}: { 
  group: InventoryGroup, 
  isExpanded: boolean, 
  onToggle: (name: string) => void,
  onEditBatch: (group: InventoryGroup, batch: Batch) => void,
  onEditBaseName: (oldName: string) => void
}) => (
  <Card 
    sx={{ 
      borderRadius: 4, 
      border: '2px solid #E0E0E0',
      boxShadow: 'none',
      '&:hover': { borderColor: 'primary.main' }
    }}
  >
    <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
      <Box 
        onClick={() => onToggle(group.baseName)}
        sx={{ 
          display: 'flex', 
          flexDirection: 'row', 
          alignItems: 'center', 
          cursor: 'pointer',
          '&:hover': { opacity: 0.8 }
        }}
      >
        <Avatar
          variant="rounded"
          src={group.image || defaultImage}
          sx={{ 
            width: { xs: 70, sm: 80 }, 
            height: { xs: 70, sm: 80 }, 
            mr: { xs: 2, sm: 3 }, 
            bgcolor: 'grey.100',
            border: '1px solid #EEE'
          }}
        >
          <Inventory2OutlinedIcon sx={{ fontSize: { xs: 35, sm: 40 }, color: 'grey.400' }} />
        </Avatar>
        <Box sx={{ flexGrow: 1, textAlign: 'left' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: 0.5 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 900, 
                fontSize: { xs: '18px', sm: '22px' }, 
                color: '#000000',
                lineHeight: 1.2,
                textAlign: 'left'
              }}
            >
              {group.baseName}
            </Typography>
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                onEditBaseName(group.baseName);
              }}
              sx={{ ml: 1, color: 'primary.main', bgcolor: 'primary.50' }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'primary.main', 
              fontWeight: 'bold',
              fontSize: { xs: '14px', sm: '18px' },
              textAlign: 'left'
            }}
          >
            Total: {group.totalStock} Unit
          </Typography>
        </Box>
        <IconButton size="large">
          {isExpanded ? <ExpandLessIcon fontSize="large" /> : <ExpandMoreIcon fontSize="large" />}
        </IconButton>
      </Box>

      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Divider sx={{ my: 2 }} />
          {group.batches.map((batch) => (
            <BatchItemRow 
              key={batch.id} 
              batch={batch} 
              onEdit={(b) => onEditBatch(group, b)} 
            />
          ))}
      </Collapse>
    </CardContent>
  </Card>
));

const InventorySearchBar = memo(({ 
  value, 
  onChange 
}: { 
  value: string, 
  onChange: (val: string) => void 
}) => (
  <TextField
    placeholder="Cari nama barang..."
    variant="outlined"
    fullWidth
    value={value}
    onChange={(e) => onChange(e.target.value)}
    sx={{ 
      mb: 4, 
      '& .MuiOutlinedInput-root': {
        borderRadius: 3,
        bgcolor: '#F9F9F9',
        '& fieldset': { borderColor: '#E0E0E0' },
        '&:hover fieldset': { borderColor: 'primary.main' },
      }
    }}
    slotProps={{
      input: {
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
      },
    }}
  />
));

// --- Main Component ---

const InventoryView: React.FC = () => {
  const navigate = useNavigate();
  const { getInventory, updateInventory, updateBaseName, loading, error } = useGasApi();
  const [inventoryGroups, setInventoryGroups] = useState<InventoryGroup[]>([]);
  
  // State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Partial<InventoryItem> | null>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  
  // BaseName Edit State
  const [editBaseNameOpen, setEditBaseNameOpen] = useState(false);
  const [editingOldBaseName, setEditingOldBaseName] = useState('');
  const [editingNewBaseName, setEditingNewBaseName] = useState('');
  const [editBaseNameError, setEditBaseNameError] = useState<string | null>(null);
  const [editBaseNameLoading, setEditBaseNameLoading] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchInventory = useCallback(async () => {
    try {
      const data = await getInventory();
      if (data) setInventoryGroups(data);
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

  const toggleGroup = useCallback((baseName: string) => {
    setExpandedGroups(prev => ({ ...prev, [baseName]: !prev[baseName] }));
  }, []);

  const handleOpenCreate = useCallback(() => {
    setSelectedItem(null);
    setDialogError(null);
    setIsDialogOpen(true);
  }, []);

  const handleOpenEdit = useCallback((group: InventoryGroup, batch: Batch) => {
    setSelectedItem({
      id: batch.id,
      baseName: group.baseName,
      variant: batch.variant,
      pd: batch.pd,
      exp: batch.exp,
      stock: batch.stock,
      image: group.image
    });
    setDialogError(null);
    setIsDialogOpen(true);
  }, []);

  const handleOpenEditBaseName = useCallback((oldName: string) => {
    setEditingOldBaseName(oldName);
    setEditingNewBaseName(oldName);
    setEditBaseNameError(null);
    setEditBaseNameOpen(true);
  }, []);

  const handleEditBaseNameSubmit = async () => {
    if (!editingNewBaseName.trim()) {
      setEditBaseNameError("Nama barang tidak boleh kosong.");
      return;
    }
    if (editingNewBaseName.trim() === editingOldBaseName) {
      setEditBaseNameOpen(false);
      return;
    }
    
    setEditBaseNameLoading(true);
    setEditBaseNameError(null);
    try {
      const res = await updateBaseName(editingOldBaseName, editingNewBaseName.trim());
      if (res.success) {
        setEditBaseNameOpen(false);
        fetchInventory();
      } else {
        setEditBaseNameError(res.message || 'Gagal mengubah nama barang.');
      }
    } catch {
      setEditBaseNameError('Terjadi kesalahan koneksi.');
    } finally {
      setEditBaseNameLoading(false);
    }
  };

  const handleFormSubmit = async (data: Record<string, string | number>) => {
    const payload: UpdateInventoryItem = {
      baseName: (data.baseName as string)?.trim(),
      variant: (data.variant as string)?.trim(),
      pd: data.pd as string,
      exp: data.exp as string,
      stock: Number(data.stock),
      image: (data.image as string)?.trim()
    };
    if (selectedItem?.id) payload.id = selectedItem.id;

    try {
      const res = await updateInventory(payload);
      if (res.success) {
        setIsDialogOpen(false);
        fetchInventory();
      } else {
        setDialogError(res.message || 'Gagal menyimpan data.');
      }
    } catch {
      setDialogError('Terjadi kesalahan koneksi saat menyimpan.');
    }
  };

  const baseNameOptions = Array.from(new Set(inventoryGroups.map(g => g.baseName)));

  const filteredGroups = inventoryGroups.filter(group => 
    group.baseName.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, pb: 10, bgcolor: '#FFFFFF', minHeight: '100vh' }}>
      <InventoryHeader onBack={() => navigate('/dashboard')} />

      {error && <Alert severity="error" sx={{ mb: 3, fontSize: '1.1rem' }}>{error}</Alert>}

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon sx={{ fontSize: 30 }} />}
        onClick={handleOpenCreate}
        fullWidth
        sx={{ 
          mb: 2, 
          height: { xs: 60, sm: 70 }, 
          fontSize: { xs: '1.1rem', sm: '1.3rem' }, 
          fontWeight: 'bold', 
          borderRadius: 3, 
          textAlign: 'left', 
          justifyContent: 'flex-start', 
          px: 3 
        }}
      >
        Tambah Stok Baru
      </Button>

      <InventorySearchBar value={searchQuery} onChange={setSearchQuery} />

      {filteredGroups.length === 0 && loading ? null : (
        <Grid container spacing={2}>
          {filteredGroups.map((group) => (
            <Grid key={group.baseName} size={{ xs: 12 }}>
              <InventoryGroupCard 
                group={group}
                isExpanded={!!expandedGroups[group.baseName]}
                onToggle={toggleGroup}
                onEditBatch={handleOpenEdit}
                onEditBaseName={handleOpenEditBaseName}
              />
            </Grid>
          ))}
          
          {filteredGroups.length === 0 && !loading && (
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" align="left" color="textSecondary" sx={{ mt: 5, px: 2 }}>
                {searchQuery ? 'Tidak ada barang yang cocok.' : 'Tidak ada data stok.'}
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
          sx={{ 
            height: 60, 
            fontSize: '1.2rem', 
            fontWeight: 'bold', 
            borderRadius: 3, 
            textAlign: 'left', 
            justifyContent: 'flex-start', 
            px: 3 
          }}
        >
          Refresh Data Stok
        </Button>
      </Box>

      <Suspense fallback={null}>
        {isDialogOpen && (
          <InventoryDialog
            open={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onSubmit={handleFormSubmit}
            initialData={selectedItem}
            loading={loading}
            error={dialogError}
            baseNameOptions={baseNameOptions}
          />
        )}
      </Suspense>

      <Dialog open={editBaseNameOpen} onClose={() => !editBaseNameLoading && setEditBaseNameOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 'bold', color: '#225E37' }}>
          Ubah Nama Barang
        </DialogTitle>
        <DialogContent>
          {editBaseNameError && <Alert severity="warning" sx={{ mb: 2, mt: 1 }}>{editBaseNameError}</Alert>}
          <Typography sx={{ mb: 2, mt: 1, color: 'text.secondary' }}>
            Ini akan mengubah nama barang pada semua varian.
          </Typography>
          <TextField
            autoFocus
            label="Nama Barang Baru"
            fullWidth
            value={editingNewBaseName}
            onChange={(e) => setEditingNewBaseName(e.target.value)}
            disabled={editBaseNameLoading}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            variant="outlined" 
            onClick={() => setEditBaseNameOpen(false)} 
            disabled={editBaseNameLoading}
            color="inherit"
          >
            Batal
          </Button>
          <Button 
            onClick={handleEditBaseNameSubmit} 
            variant="contained" 
            color="primary"
            disabled={editBaseNameLoading}
          >
            {editBaseNameLoading ? <CircularProgress size={24} color="inherit" /> : 'Simpan'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventoryView;

