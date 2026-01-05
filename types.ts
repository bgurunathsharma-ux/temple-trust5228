
export interface Donation {
  id: string;
  donorName: string;
  amount: number;
  purpose: string;
  date: string;
  phone: string;
}

export interface Expense {
  id: string;
  item: string;
  amount: number;
  category: 'Maintenance' | 'Pooja' | 'Annadanam' | 'Salary' | 'Utilities';
  date: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export type ViewType = 'dashboard' | 'donations' | 'expenses' | 'inventory' | 'events' | 'ai-assistant';
