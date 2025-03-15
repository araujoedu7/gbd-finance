import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Student } from '../types';
import { customColors } from '../App';

interface AddStudentProps {
  onAddStudent: (student: Omit<Student, 'id' | 'payments' | 'createdAt' | 'updatedAt'>) => void;
}

export function AddStudent({ onAddStudent }: AddStudentProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStudent(formData);
    setFormData({ name: '', phone: '' });
    setOpen(false);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
        sx={{
          bgcolor: customColors.black,
          color: customColors.white,
          '&:hover': {
            bgcolor: customColors.blackLight,
          }
        }}
      >
        Adicionar Aluno
      </Button>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: customColors.white,
          }
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ color: customColors.black }}>
            Adicionar Novo Aluno
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nome"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: customColors.black,
                  },
                  '&:hover fieldset': {
                    borderColor: customColors.gold,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: customColors.gold,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: customColors.black,
                  '&.Mui-focused': {
                    color: customColors.gold,
                  },
                },
              }}
            />
            <TextField
              margin="dense"
              label="Telefone"
              fullWidth
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: customColors.black,
                  },
                  '&:hover fieldset': {
                    borderColor: customColors.gold,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: customColors.gold,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: customColors.black,
                  '&.Mui-focused': {
                    color: customColors.gold,
                  },
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={() => setOpen(false)}
              sx={{ 
                color: customColors.black,
                '&:hover': {
                  color: customColors.gold,
                }
              }}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              sx={{
                bgcolor: customColors.black,
                color: customColors.white,
                '&:hover': {
                  bgcolor: customColors.blackLight,
                }
              }}
            >
              Adicionar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
} 