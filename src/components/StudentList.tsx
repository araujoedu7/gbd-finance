import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  TablePagination,
} from '@mui/material';
import { Student, Payment } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '../services/api';

interface FilterOptions {
  showOnlyUnpaid: boolean;
  month: number;
  year: number;
}

interface StudentListProps {
  students: Student[];
  filterOptions: {
    showOnlyUnpaid: boolean;
    month: number;
    year: number;
  };
  onFilterChange: (options: {
    showOnlyUnpaid: boolean;
    month: number;
    year: number;
  }) => void;
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  onPaymentStatusChange: (studentId: number, payment: Omit<Payment, 'id' | 'StudentId'>) => Promise<void>;
}

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

// Definindo as cores personalizadas
const customColors = {
  gold: '#D4AF37',
  goldLight: '#FFE5A9',
  black: '#000000',
  blackLight: '#222222',
  white: '#FFFFFF',
  grayLight: '#F5F5F5'
};

export const StudentList: React.FC<StudentListProps> = ({
  students,
  filterOptions,
  onFilterChange,
  setStudents,
  onPaymentStatusChange,
}) => {
  const currentYear = new Date().getFullYear();

  const getPaymentStatus = (student: Student, month: number, year: number): 'paid' | 'unpaid' => {
    const payment = student.payments?.find(
      (p) => p.month === month && p.year === year
    );
    return payment?.status || 'unpaid';
  };

  const handlePaymentToggle = async (student: Student, month: number, year: number) => {
    const currentStatus = getPaymentStatus(student, month, year);
    const newStatus: 'paid' | 'unpaid' = currentStatus === 'paid' ? 'unpaid' : 'paid';
    
    // Atualiza o estado local imediatamente
    setStudents(prevStudents => 
      prevStudents.map(s => {
        if (s.id === student.id) {
          const updatedPayments = [...(s.payments || [])];
          const existingPayment = updatedPayments.find(
            p => p.month === month && p.year === year
          );

          if (existingPayment) {
            existingPayment.status = newStatus;
            existingPayment.paidAt = newStatus === 'paid' ? new Date() : undefined;
          } else {
            updatedPayments.push({
              id: Date.now(),
              StudentId: student.id,
              month,
              year,
              status: newStatus,
              paidAt: newStatus === 'paid' ? new Date() : undefined
            });
          }

          return {
            ...s,
            payments: updatedPayments
          };
        }
        return s;
      })
    );

    // Atualiza no servidor em segundo plano
    try {
      await onPaymentStatusChange(student.id, {
        month,
        year,
        status: newStatus,
        paidAt: newStatus === 'paid' ? new Date() : undefined
      });
    } catch (error) {
      console.error('Erro ao sincronizar com servidor:', error);
      // Não reverte o estado local para manter a experiência do usuário fluida
    }
  };

  const filteredStudents = students.filter(student => {
    if (!filterOptions.showOnlyUnpaid) return true;
    return getPaymentStatus(student, filterOptions.month, filterOptions.year) === 'unpaid';
  });

  // Funções de estatísticas
  const getTotalStudents = () => students.length;
  
  const getTotalPaid = () => {
    return students.filter(student => 
      getPaymentStatus(student, filterOptions.month, filterOptions.year) === 'paid'
    ).length;
  };

  const getTotalUnpaid = () => {
    return students.filter(student => 
      getPaymentStatus(student, filterOptions.month, filterOptions.year) === 'unpaid'
    ).length;
  };

  const getPaymentPercentage = () => {
    const total = getTotalStudents();
    if (total === 0) return 0;
    return (getTotalPaid() / total) * 100;
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Dashboard */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ 
            bgcolor: customColors.gold, 
            color: customColors.black,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
            }
          }}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total de Alunos</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{getTotalStudents()}</Typography>
            </Paper>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ 
            bgcolor: customColors.gold, 
            color: customColors.black,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
            }
          }}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Pagamentos em Dia</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{getTotalPaid()}</Typography>
            </Paper>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ 
            bgcolor: customColors.gold, 
            color: customColors.black,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
            }
          }}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Pagamentos Pendentes</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{getTotalUnpaid()}</Typography>
            </Paper>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ 
            bgcolor: customColors.gold, 
            color: customColors.black,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
            }
          }}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Taxa de Pagamento</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{getPaymentPercentage().toFixed(1)}%</Typography>
            </Paper>
          </Paper>
        </Grid>
      </Grid>

      {/* Filtros */}
      <Paper sx={{ 
        p: 2, 
        mb: 3, 
        bgcolor: customColors.black,
        color: customColors.white
      }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <TextField
            select
            label="Mês"
            value={filterOptions.month}
            onChange={(e) => onFilterChange({ ...filterOptions, month: Number(e.target.value) })}
            sx={{ 
              minWidth: 150,
              '& .MuiOutlinedInput-root': {
                color: customColors.white,
                '& fieldset': {
                  borderColor: customColors.gold,
                },
                '&:hover fieldset': {
                  borderColor: customColors.goldLight,
                },
              },
              '& .MuiInputLabel-root': {
                color: customColors.gold,
              },
              '& .MuiSelect-icon': {
                color: customColors.gold,
              }
            }}
            size="small"
          >
            {MONTHS.map((month, index) => (
              <MenuItem key={index + 1} value={index + 1}>{month}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Ano"
            value={filterOptions.year}
            onChange={(e) => onFilterChange({ ...filterOptions, year: Number(e.target.value) })}
            sx={{ 
              minWidth: 100,
              '& .MuiOutlinedInput-root': {
                color: customColors.white,
                '& fieldset': {
                  borderColor: customColors.gold,
                },
                '&:hover fieldset': {
                  borderColor: customColors.goldLight,
                },
              },
              '& .MuiInputLabel-root': {
                color: customColors.gold,
              },
              '& .MuiSelect-icon': {
                color: customColors.gold,
              }
            }}
            size="small"
          >
            {YEARS.map(year => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </TextField>

          <FormControlLabel
            control={
              <Checkbox
                id="filter-unpaid-checkbox"
                checked={filterOptions.showOnlyUnpaid}
                onChange={(e) => onFilterChange({
                  ...filterOptions,
                  showOnlyUnpaid: e.target.checked,
                })}
                sx={{
                  color: customColors.white,
                  '&.Mui-checked': {
                    color: customColors.gold,
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(212, 175, 55, 0.08)',
                  },
                }}
                inputProps={{
                  'aria-label': 'Mostrar apenas alunos inadimplentes'
                }}
              />
            }
            label={
              <Typography color={filterOptions.showOnlyUnpaid ? customColors.gold : customColors.white}>
                Mostrar apenas inadimplentes
              </Typography>
            }
            htmlFor="filter-unpaid-checkbox"
          />
        </Box>
      </Paper>

      {/* Tabela */}
      <TableContainer component={Paper} sx={{ 
        maxHeight: 'calc(100vh - 450px)',
        overflow: 'auto',
        bgcolor: customColors.white,
        borderRadius: 2,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ 
                fontWeight: 'bold', 
                backgroundColor: customColors.black, 
                color: customColors.white,
                borderBottom: `2px solid ${customColors.gold}`,
                fontSize: '1rem',
                padding: '16px',
              }}>
                Nome
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 'bold', 
                backgroundColor: customColors.black, 
                color: customColors.white,
                borderBottom: `2px solid ${customColors.gold}`,
                fontSize: '1rem',
                padding: '16px',
              }}>
                Telefone
              </TableCell>
              {MONTHS.map((month) => (
                <TableCell 
                  key={month} 
                  align="center"
                  sx={{ 
                    fontWeight: 'bold', 
                    backgroundColor: customColors.black, 
                    color: customColors.white,
                    borderBottom: `2px solid ${customColors.gold}`,
                    fontSize: '0.9rem',
                    padding: '16px 8px',
                    minWidth: '80px'
                  }}
                >
                  <Typography variant="subtitle2">{month.substring(0, 3)}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow 
                key={student.id}
                sx={{
                  '&:nth-of-type(odd)': {
                    backgroundColor: 'rgba(212, 175, 55, 0.03)',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(212, 175, 55, 0.08)',
                  },
                  transition: 'background-color 0.2s',
                }}
              >
                <TableCell 
                  component="th" 
                  scope="row"
                  sx={{ 
                    padding: '12px 16px',
                    borderBottom: `1px solid ${customColors.grayLight}`,
                  }}
                >
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 500,
                      color: customColors.black 
                    }}
                  >
                    {student.name}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{ 
                    padding: '12px 16px',
                    borderBottom: `1px solid ${customColors.grayLight}`,
                  }}
                >
                  <Typography 
                    variant="body2"
                    sx={{ 
                      color: customColors.blackLight,
                      fontFamily: 'monospace',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {student.phone}
                  </Typography>
                </TableCell>
                {MONTHS.map((_, index) => {
                  const month = index + 1;
                  const isPaid = getPaymentStatus(student, month, filterOptions.year) === 'paid';
                  const payment = student.payments?.find(
                    (p) => p.month === month && p.year === filterOptions.year
                  );
                  const paidDate = payment?.paidAt ? new Date(payment.paidAt).toLocaleDateString() : '';

                  return (
                    <TableCell 
                      key={month} 
                      align="center"
                      sx={{ 
                        padding: '8px',
                        borderBottom: `1px solid ${customColors.grayLight}`,
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            id={`payment-checkbox-${student.id}-${month}-${filterOptions.year}`}
                            checked={isPaid}
                            onChange={() => handlePaymentToggle(student, month, filterOptions.year)}
                            sx={{
                              color: '#757575',
                              '&.Mui-checked': {
                                color: customColors.gold,
                              },
                              '&:hover': {
                                backgroundColor: 'rgba(212, 175, 55, 0.08)',
                              },
                            }}
                            inputProps={{
                              'aria-label': `Alterar status de pagamento de ${student.name} para ${MONTHS[month-1]} de ${filterOptions.year}`
                            }}
                          />
                        }
                        label={
                          <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              color: isPaid ? customColors.gold : '#757575',
                              fontSize: '0.7rem',
                              fontWeight: isPaid ? 'bold' : 'normal'
                            }}
                          >
                            {isPaid ? 'PAGO' : 'PENDENTE'}
                          </Typography>
                        }
                        labelPlacement="bottom"
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 