export interface Event {
  id: number;
  title: string;
  description: string;
  date: string; // formato YYYY-MM-DD
  time: string; // formato HH:mm
  type: 'meeting' | 'competition' | 'training' | 'other';
  location: string;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
  expiresAt?: Date;
}

export interface Student {
  id: number;
  name: string;
  phone: string;
  payments: Payment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: number;
  month: number;
  year: number;
  status: 'paid' | 'unpaid';
  paidAt?: Date;
  StudentId: number;
}

export interface TeamNotice {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  priority: 'low' | 'medium' | 'high';
  author: string;
  isActive: boolean;
}

// ... rest of the types ... 