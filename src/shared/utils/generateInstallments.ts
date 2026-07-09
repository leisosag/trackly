import type { Movement } from '@/features/movements';
import { getStatementPeriod, addPeriodMonths } from './statementPeriod';

type BaseMovementInput = Omit<
  Movement,
  'id' | 'installment' | 'statementPeriod'
>;

// Reubica una fecha dentro del mes/año de un período "YYYY-MM", conservando
// el día y la hora originales (clampeando el día si el mes de destino tiene
// menos días, ej: 31 de enero -> 28/29 de febrero).
function toPeriodDate(period: string, original: Date): Date {
  const [year, month] = period.split('-').map(Number);
  const lastDayOfTargetMonth = new Date(year, month, 0).getDate();
  const day = Math.min(original.getDate(), lastDayOfTargetMonth);
  const result = new Date(original);
  result.setFullYear(year, month - 1, day);
  return result;
}

// A partir de un movimiento base en crédito (importe = valor de UNA cuota),
// genera un Movement por cada cuota, todas con el mismo groupId, numeradas
// correlativamente. Tanto statementPeriod como date quedan alineados al mes
// de resumen de cada cuota (según el día de cierre de la tarjeta): así
// BalanceHeader, MovementsPage y los presupuestos —que filtran por date—
// descuentan cada cuota del mes que realmente corresponde, en vez de
// concentrar el total de la compra en el mes de la compra original.
export function generateInstallments(
  base: BaseMovementInput,
  installmentsCount: number,
  closingDay: number,
): Omit<Movement, 'id'>[] {
  const groupId = crypto.randomUUID();
  const originalDate = new Date(base.date);
  const firstPeriod = getStatementPeriod(originalDate, closingDay);

  return Array.from({ length: installmentsCount }, (_, i) => {
    const period = addPeriodMonths(firstPeriod, i);
    return {
      ...base,
      date: toPeriodDate(period, originalDate).toISOString(),
      statementPeriod: period,
      installment: {
        groupId,
        number: i + 1,
        total: installmentsCount,
      },
    };
  });
}
