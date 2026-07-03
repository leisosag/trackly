export type CategoryType = 'income' | 'expense';

export type CategoryColorScheme =
  | 'income'
  | 'consumption'
  | 'essential'
  | 'financial'
  | 'special'
  | 'neutral';

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: CategoryType;
  colorScheme?: CategoryColorScheme;
}
