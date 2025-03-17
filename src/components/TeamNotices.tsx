import React, { useState, useEffect } from 'react';
import { TeamNotice } from '../types';
import { Card, CardContent, Typography, Chip, Box, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Snackbar, Alert } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { teamNoticesService } from '../services/teamNoticesService';

const TeamNotices: React.FC = () => {
  const [notices, setNotices] = useState<TeamNotice[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingNotice, setEditingNotice] = useState<TeamNotice | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium' as TeamNotice['priority'],
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const loadNotices = async () => {
    try {
      const data = await teamNoticesService.getAllNotices();
      setNotices(data);
    } catch (error) {
      showSnackbar('Erro ao carregar avisos', 'error');
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const handleOpenDialog = (notice?: TeamNotice) => {
    if (notice) {
      setEditingNotice(notice);
      setFormData({
        title: notice.title,
        content: notice.content,
        priority: notice.priority,
      });
    } else {
      setEditingNotice(null);
      setFormData({
        title: '',
        content: '',
        priority: 'medium',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingNotice(null);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = async () => {
    try {
      if (editingNotice) {
        await teamNoticesService.updateNotice(editingNotice.id, formData);
        showSnackbar('Aviso atualizado com sucesso', 'success');
      } else {
        await teamNoticesService.createNotice({
          ...formData,
          author: 'Sistema',
          isActive: true,
        });
        showSnackbar('Aviso criado com sucesso', 'success');
      }
      handleCloseDialog();
      loadNotices();
    } catch (error) {
      showSnackbar('Erro ao salvar aviso', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await teamNoticesService.deleteNotice(id);
      showSnackbar('Aviso removido com sucesso', 'success');
      loadNotices();
    } catch (error) {
      showSnackbar('Erro ao remover aviso', 'error');
    }
  };

  const getPriorityColor = (priority: TeamNotice['priority']) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Avisos da Equipe
        </Typography>
        <IconButton color="primary" onClick={() => handleOpenDialog()}>
          <AddIcon />
        </IconButton>
      </Box>

      <Grid container spacing={3}>
        {notices.map((notice) => (
          <Grid item xs={12} md={6} lg={4} key={notice.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h2">
                    {notice.title}
                  </Typography>
                  <Box>
                    <IconButton size="small" onClick={() => handleOpenDialog(notice)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(notice.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {notice.content}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Chip
                    label={notice.priority}
                    color={getPriorityColor(notice.priority)}
                    size="small"
                  />
                  <Typography variant="caption" color="text.secondary">
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingNotice ? 'Editar Aviso' : 'Novo Aviso'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Título"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Conteúdo"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              multiline
              rows={4}
              fullWidth
              required
            />
            <TextField
              select
              label="Prioridade"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as TeamNotice['priority'] })}
              fullWidth
              required
            >
              <MenuItem value="low">Baixa</MenuItem>
              <MenuItem value="medium">Média</MenuItem>
              <MenuItem value="high">Alta</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={!formData.title || !formData.content}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TeamNotices; 