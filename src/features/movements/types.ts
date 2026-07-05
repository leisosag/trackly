export interface Movement {
  id: string;
  categoryId: string;
  description?: string;
  amount: number;
  date: string; // ISO string, ej: "2026-07-01T14:30:00.000Z"
  paymentMethodId: string;
}
