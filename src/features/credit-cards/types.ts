export interface CreditCard {
  id: string;
  name: string;
  closingDay: number; // día de cierre del resumen (1-31)
  isActive: boolean;
  closingDayConfirmedPeriod?: string; // "2026-07" — último período en que se confirmó/actualizó el cierre
}
