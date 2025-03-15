export interface Student {
  _id?: string;
  name: string;
  phone: string;
  payments: Payment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  month: number;
  year: number;
  status: 'paid' | 'unpaid';
  paidAt?: Date;
}

export interface PaymentStatus {
  month: number;
  year: number;
  status: 'paid' | 'unpaid';
}

export interface FilterOptions {
  showOnlyUnpaid: boolean;
  month?: number;
  year?: number;
}

export interface Event {
  id?: string;
  title: string;
  description: string;
  date: Date;
  type: 'meeting' | 'competition' | 'training' | 'other';
  location?: string;
}

export interface Notice {
  id?: string;
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
  expiresAt?: Date;
} 