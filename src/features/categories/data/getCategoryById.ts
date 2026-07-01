import { categoriesSeed } from './categoriesSeed';
import type { Category } from '../types';

export function getCategoryById(id: string): Category | undefined {
  return categoriesSeed.find((c) => c.id === id);
}
