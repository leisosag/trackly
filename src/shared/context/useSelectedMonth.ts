import { useContext } from 'react';
import { SelectedMonthContext } from './SelectedMonthContext';

export function useSelectedMonth() {
  const context = useContext(SelectedMonthContext);

  if (!context) {
    throw new Error(
      'useSelectedMonth debe usarse dentro de un SelectedMonthProvider',
    );
  }

  return context;
}
