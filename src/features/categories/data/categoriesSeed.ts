import type { Category } from '../types';

export const categoriesSeed: Category[] = [
  { id: 'salary', name: 'Salario', icon: 'Wallet', type: 'income' },
  { id: 'freelance', name: 'Freelance', icon: 'Laptop', type: 'income' },
  { id: 'gift', name: 'Regalo', icon: 'Gift', type: 'income' },
  { id: 'food', name: 'Comida', icon: 'ForkKnife', type: 'expense' },
  { id: 'transport', name: 'Transporte', icon: 'Bus', type: 'expense' },
  { id: 'home', name: 'Hogar', icon: 'House', type: 'expense' },
  { id: 'health', name: 'Salud', icon: 'Heartbeat', type: 'expense' },
  { id: 'leisure', name: 'Ocio', icon: 'GameController', type: 'expense' },
];
