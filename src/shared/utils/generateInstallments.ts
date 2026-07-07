import type { Movement } from '@/features/movements';
import { getStatementPeriod, addPeriodMonths } from './statementPeriod';

type BaseMovementInput = Omit<
  Movement,
  'id' | 'installment' | 'statementPeriod'
>;

// A partir de un movimiento base en crédito (importe = valor de UNA cuota), genera un Movement por cada cuota, todas con el mismo groupId,
// numeradas correlativamente, y con el statementPeriod correspondiente a cada mes de resumen (según el día de cierre de la tarjeta).
export function generateInstallments(
  base: BaseMovementInput,
  installmentsCount: number,
  closingDay: number,
): Omit<Movement, 'id'>[] {
  const groupId = crypto.randomUUID();
  const firstPeriod = getStatementPeriod(new Date(base.date), closingDay);

  return Array.from({ length: installmentsCount }, (_, i) => ({
    ...base,
    statementPeriod: addPeriodMonths(firstPeriod, i),
    installment: {
      groupId,
      number: i + 1,
      total: installmentsCount,
    },
  }));
}
