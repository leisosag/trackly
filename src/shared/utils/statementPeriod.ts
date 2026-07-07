export function getStatementPeriod(
  purchaseDate: Date,
  closingDay: number,
): string {
  const day = purchaseDate.getDate();
  const year = purchaseDate.getFullYear();
  const month = purchaseDate.getMonth(); // 0-indexed
  const targetMonth = day > closingDay ? month + 1 : month;
  const d = new Date(year, targetMonth, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function addPeriodMonths(period: string, amount: number): string {
  const [year, month] = period.split('-').map(Number);
  const d = new Date(year, month - 1 + amount, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function formatPeriodLabel(period: string): string {
  const [year, month] = period.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  const label = new Intl.DateTimeFormat('es-AR', {
    month: 'long',
    year: 'numeric',
  }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}
