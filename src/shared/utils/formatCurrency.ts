export function formatCurrency(amount: number, showSymbol = false): string {
  return new Intl.NumberFormat('es-AR', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
