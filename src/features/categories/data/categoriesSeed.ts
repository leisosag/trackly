import type { Category } from '../types';

export const categoriesSeed: Category[] = [
  { id: 'salary', name: 'Salario', icon: 'Wallet', type: 'income' },
  { id: 'cashback', name: 'Reintegros', icon: 'HandCoins', type: 'income' },
  { id: 'investments', name: 'Inversiones', icon: 'Bank', type: 'income' },
  { id: 'gift-income', name: 'Regalo', icon: 'Gift', type: 'income' },
  { id: 'other', name: 'Otros', icon: 'Coins', type: 'income' },

  { id: 'food', name: 'Comida', icon: 'ForkKnife', type: 'expense' },
  { id: 'home', name: 'Hogar', icon: 'House', type: 'expense' },
  { id: 'personal', name: 'Personales', icon: 'User', type: 'expense' },
  { id: 'social', name: 'Salidas', icon: 'Cheers', type: 'expense' },
  { id: 'transport', name: 'Transporte', icon: 'Bus', type: 'expense' },
  { id: 'delivery', name: 'Delivery', icon: 'Hamburger', type: 'expense' },
  { id: 'shopping', name: 'Compras', icon: 'ShoppingBag', type: 'expense' },
  { id: 'savings', name: 'Ahorros', icon: 'PiggyBank', type: 'expense' },
  { id: 'credit', name: 'Tarjeta', icon: 'CreditCard', type: 'expense' },
  { id: 'money', name: 'Reserva', icon: 'Money', type: 'expense' },
  { id: 'gift-expense', name: 'Regalo', icon: 'Gift', type: 'expense' },
  { id: 'taxes', name: 'Impuestos', icon: 'Scroll', type: 'expense' },
  // { id: 'health', name: 'Salud', icon: 'Heartbeat', type: 'expense' },
  // { id: 'leisure', name: 'Ocio', icon: 'GameController', type: 'expense' },
];
