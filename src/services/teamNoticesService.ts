import { TeamNotice } from '../types';

const API_URL = 'http://localhost:3001/api';

export const teamNoticesService = {
  async getAllNotices(): Promise<TeamNotice[]> {
    const response = await fetch(`${API_URL}/team-notices`);
    if (!response.ok) {
      throw new Error('Erro ao buscar avisos');
    }
    return response.json();
  },

  async createNotice(notice: Omit<TeamNotice, 'id' | 'createdAt' | 'updatedAt'>): Promise<TeamNotice> {
    const response = await fetch(`${API_URL}/team-notices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notice),
    });
    if (!response.ok) {
      throw new Error('Erro ao criar aviso');
    }
    return response.json();
  },

  async updateNotice(id: number, notice: Partial<TeamNotice>): Promise<TeamNotice> {
    const response = await fetch(`${API_URL}/team-notices/${id}`, {
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
  },

  async deleteNotice(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/team-notices/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Erro ao deletar aviso');
    }
  },
}; 