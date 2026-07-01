export function dateToInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayInputValue(): string {
  return dateToInputValue(new Date());
}

export function formatDateLabel(dateInputValue: string): string {
  if (dateInputValue === getTodayInputValue()) return 'Hoy';
  const [year, month, day] = dateInputValue.split('-');
  return `${day}/${month}/${year}`;
}

// Convierte el ISO datetime completo de un Movement a solo la parte de fecha
// (yyyy-mm-dd) que necesita el <input type="date">, usando hora local
// para que coincida con el día que la usuaria realmente eligió.
export function isoToInputValue(isoString: string): string {
  return dateToInputValue(new Date(isoString));
}

// Reemplaza únicamente el día/mes/año de un ISO datetime, conservando
// la hora original — así cambiar la fecha no pisa la hora del movimiento.
export function applyDateToIso(
  isoString: string,
  dateInputValue: string,
): string {
  const original = new Date(isoString);
  const [year, month, day] = dateInputValue.split('-').map(Number);
  original.setFullYear(year, month - 1, day);
  return original.toISOString();
}
