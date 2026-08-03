import type { Movement } from '@/features/movements';
import { getStatementPeriod, addPeriodMonths } from './statementPeriod';

type BaseMovementInput = Omit<
  Movement,
  'id' | 'installment' | 'statementPeriod'
>;

// A partir de un movimiento base en crédito (importe = valor de UNA cuota),
// genera un Movement por cada cuota, todas con el mismo groupId, numeradas
// correlativamente y con la MISMA date (fecha real de la compra): los
// movimientos de crédito quedan excluidos del saldo mensual y de los
// presupuestos (ver excludeCreditCardMovements), y solo se ven agrupados
// por fecha real de compra en la vista de Tarjetas. Lo único que varía por
// cuota es statementPeriod (según el día de cierre de la tarjeta), que es
// el campo que determina a qué resumen pertenece cada una.
export function generateInstallments(
  base: BaseMovementInput,
  installmentsCount: number,
  closingDay: number,
  groupId: string = crypto.randomUUID(),
): Omit<Movement, 'id'>[] {
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
