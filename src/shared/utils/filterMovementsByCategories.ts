import type { Movement } from '@/features/movements';

export function filterMovementsByCategories(
  movements: Movement[],
  categoryIds: string[],
): Movement[] {
  return movements.filter((m) => categoryIds.includes(m.categoryId));
}
