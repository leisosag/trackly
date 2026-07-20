// Formatea un input de monto mientras se escribe: agrega separador de miles
// (punto) y admite centavos con coma, siguiendo el formato es-AR (mismo
// criterio que formatCurrency). Pensado para inputs de tipo texto, no
// number, porque el navegador no permite puntos como separador en type="number".
export function formatAmountInput(raw: string): string {
  const cleaned = raw.replace(/[^\d,]/g, '');

  const [intPartRaw, ...rest] = cleaned.split(',');
  const hasComma = cleaned.includes(',');
  const decPart = rest.join('').slice(0, 2); // máximo 2 decimales (centavos)

  const intDigits = intPartRaw.replace(/^0+(?!$)/, ''); // sin ceros a la izquierda
  const formattedInt = intDigits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return hasComma ? `${formattedInt},${decPart}` : formattedInt;
}

// Convierte el valor formateado ("50.000,50") a number (50000.5).
// Devuelve null si el input está vacío, para distinguirlo de un monto en 0.
export function parseAmountInput(formatted: string): number | null {
  if (!formatted.trim()) return null;
  const normalized = formatted.replace(/\./g, '').replace(',', '.');
  const num = Number(normalized);
  return Number.isFinite(num) ? num : null;
}
