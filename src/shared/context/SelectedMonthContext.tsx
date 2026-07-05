import { createContext, useMemo, useState, type ReactNode } from 'react';
import { getPeriodRange } from '@/shared/utils';

interface SelectedMonthContextValue {
  selectedDate: Date;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToCurrentMonth: () => void;
  isCurrentMonth: boolean;
}

interface SelectedMonthProviderProps {
  children: ReactNode;
}

function getFirstDayOfMonth(date: Date): Date {
  return getPeriodRange('monthly', date).start;
}

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export const SelectedMonthContext =
  createContext<SelectedMonthContextValue | null>(null);

export function SelectedMonthProvider({
  children,
}: SelectedMonthProviderProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(() =>
    getFirstDayOfMonth(new Date()),
  );

  function goToPreviousMonth() {
    setSelectedDate((prev) => addMonths(prev, -1));
  }

  function goToNextMonth() {
    setSelectedDate((prev) => addMonths(prev, 1));
  }

  function goToCurrentMonth() {
    setSelectedDate(getFirstDayOfMonth(new Date()));
  }

  const isCurrentMonth = useMemo(() => {
    const today = getFirstDayOfMonth(new Date());
    return (
      selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getMonth() === today.getMonth()
    );
  }, [selectedDate]);

  const value: SelectedMonthContextValue = {
    selectedDate,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    isCurrentMonth,
  };

  return (
    <SelectedMonthContext.Provider value={value}>
      {children}
    </SelectedMonthContext.Provider>
  );
}
