import { dateToPeriod } from '@/shared/utils';
import type { CreditCard } from '../types';

export function needsClosingDayReminder(
  card: CreditCard,
  referenceDate: Date = new Date(),
): boolean {
  if (!card.isActive) return false;
  const currentPeriod = dateToPeriod(referenceDate);
  return card.closingDayConfirmedPeriod !== currentPeriod;
}
