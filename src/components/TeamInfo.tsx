import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import Calendar from './Calendar';
import EventManager from './EventManager';
import { Event, Notice } from '../types';
import api from '../services/api';

export default function TeamInfo() {
  const [events, setEvents] = useState<Event[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [eventsData, noticesData] = await Promise.all([
        api.getEvents(),
        api.getNotices()
      ]);
      setEvents(eventsData);
      setNotices(noticesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleAddEvent = async (event: Omit<Event, 'id'>) => {
    try {
      const newEvent = await api.addEvent(event);
      setEvents([...events, newEvent]);
    } catch (error) {
      console.error('Erro ao adicionar evento:', error);
      alert('Erro ao adicionar evento. Tente novamente.');
    }
  };

  const handleEditEvent = async (event: Event) => {
    try {
      const updatedEvent = await api.updateEvent(event);
      setEvents(events.map(e => e.id === event.id ? updatedEvent : e));
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      alert('Erro ao atualizar evento. Tente novamente.');
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    try {
      await api.deleteEvent(eventId);
      setEvents(events.filter(e => e.id !== eventId));
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      alert('Erro ao excluir evento. Tente novamente.');
    }
  };

  const handleAddNotice = async (notice: Omit<Notice, 'id'>) => {
    try {
      const newNotice = await api.addNotice(notice);
      setNotices([...notices, newNotice]);
    } catch (error) {
      console.error('Erro ao adicionar aviso:', error);
      alert('Erro ao adicionar aviso. Tente novamente.');
    }
  };

  const handleEditNotice = async (notice: Notice) => {
    try {
      const updatedNotice = await api.updateNotice(notice);
      setNotices(notices.map(n => n.id === notice.id ? updatedNotice : n));
    } catch (error) {
      console.error('Erro ao atualizar aviso:', error);
      alert('Erro ao atualizar aviso. Tente novamente.');
    }
  };

  const handleDeleteNotice = async (noticeId: number) => {
    try {
      await api.deleteNotice(noticeId);
      setNotices(notices.filter(n => n.id !== noticeId));
    } catch (error) {
      console.error('Erro ao excluir aviso:', error);
      alert('Erro ao excluir aviso. Tente novamente.');
    }
  };

  return (
    <Box sx={{ 
      width: '100vw', 
      height: 'calc(100vh - 200px)', 
      overflow: 'hidden',
      margin: '0 -24px' // compensa o padding do container pai
    }}>
      <Typography variant="h4" gutterBottom sx={{ px: 3 }}>
        Informativos da Equipe
      </Typography>
      
      <Grid container spacing={3} sx={{ height: '100%', overflow: 'hidden', width: '100%', m: 0 }}>
        <Grid item xs={12} md={6} sx={{ height: '100%' }}>
          <Paper sx={{ p: 3, height: '100%', overflow: 'auto' }}>
            <Typography variant="h5" gutterBottom>
              Calendário de Eventos
            </Typography>
            <Calendar events={events} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} sx={{ height: '100%' }}>
          <Paper sx={{ p: 3, height: '100%', overflow: 'auto' }}>
            <EventManager
              events={events}
              notices={notices}
              onAddEvent={handleAddEvent}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
              onAddNotice={handleAddNotice}
              onEditNotice={handleEditNotice}
              onDeleteNotice={handleDeleteNotice}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 