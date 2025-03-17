import { Student, Payment, Event, Notice } from '../types';

const API_URL = 'http://localhost:3001/api';

async function getStudents(): Promise<Student[]> {
  const response = await fetch(`${API_URL}/students`);
  if (!response.ok) {
    throw new Error('Erro ao buscar estudantes');
  }
  return response.json();
}

async function addStudent(student: Omit<Student, 'id' | 'payments' | 'createdAt' | 'updatedAt'>): Promise<Student> {
  const response = await fetch(`${API_URL}/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(student),
  });
  if (!response.ok) {
    throw new Error('Erro ao adicionar estudante');
  }
  return response.json();
}

async function updatePayment(studentId: number, payment: Omit<Payment, 'id' | 'StudentId'>): Promise<Student> {
  try {
    const response = await fetch(`${API_URL}/students/${studentId}/payment`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payment,
        paidAt: payment.status === 'paid' ? 
          (payment.paidAt ? payment.paidAt.toISOString() : new Date().toISOString()) : 
          null
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao atualizar pagamento');
    }

    const data = await response.json();
    
    // Garantir que as datas sejam convertidas corretamente
    return {
      ...data,
      payments: data.payments?.map((p: Payment) => ({
        ...p,
        paidAt: p.paidAt ? new Date(p.paidAt) : null
      }))
    };
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}

// Event methods
async function getEvents(): Promise<Event[]> {
  const response = await fetch(`${API_URL}/events`);
  if (!response.ok) {
    throw new Error('Erro ao buscar eventos');
  }
  return response.json();
}

async function addEvent(event: Omit<Event, 'id'>): Promise<Event> {
  const response = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });
  if (!response.ok) {
    throw new Error('Erro ao adicionar evento');
  }
  return response.json();
}

async function updateEvent(event: Event): Promise<Event> {
  const response = await fetch(`${API_URL}/events/${event.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });
  if (!response.ok) {
    throw new Error('Erro ao atualizar evento');
  }
  return response.json();
}

async function deleteEvent(eventId: number): Promise<void> {
  const response = await fetch(`${API_URL}/events/${eventId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Erro ao excluir evento');
  }
}

// Notice methods
async function getNotices(): Promise<Notice[]> {
  const response = await fetch(`${API_URL}/notices`);
  if (!response.ok) {
    throw new Error('Erro ao buscar avisos');
  }
  return response.json();
}

async function addNotice(notice: Omit<Notice, 'id' | 'createdAt'>): Promise<Notice> {
  const response = await fetch(`${API_URL}/notices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(notice),
  });
  if (!response.ok) {
    throw new Error('Erro ao adicionar aviso');
  }
  return response.json();
}

async function updateNotice(notice: Notice): Promise<Notice> {
  const response = await fetch(`${API_URL}/notices/${notice.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(notice),
  });
  if (!response.ok) {
    throw new Error('Erro ao atualizar aviso');
  }
  return response.json();
}

async function deleteNotice(noticeId: number): Promise<void> {
  const response = await fetch(`${API_URL}/notices/${noticeId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Erro ao excluir aviso');
  }
}

export default {
  getStudents,
  addStudent,
  updatePayment,
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  getNotices,
  addNotice,
  updateNotice,
  deleteNotice
}; 