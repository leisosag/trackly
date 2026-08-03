import { useEffect, useState } from 'react';
import { CategoryMultiSelect, Modal } from '@/shared/components';

interface CreditCardFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialCategoryIds: string[];
  onApply: (categoryIds: string[]) => void;
}

// Filtro de categoría para la vista de Tarjetas: permite ver, dentro del
// resumen de un período, cuánto se gastó en una categoría puntual (ej.
// Comida), sumando cuotas que pueden venir de compras de meses anteriores.
// No incluye medio de pago (a diferencia de MovementFilterModal) porque acá
// ya se está mirando exclusivamente movimientos de tarjeta, agrupados por
// tarjeta.
export function CreditCardFilterModal({
  open,
  onOpenChange,
  initialCategoryIds,
  onApply,
}: CreditCardFilterModalProps) {
  const [categoryIds, setCategoryIds] = useState<string[]>(initialCategoryIds);

  // mismo criterio que MovementFilterModal: Radix no desmonta el contenido
  // entre aperturas, así que hay que resincronizar el estado local a mano.
  useEffect(() => {
    if (open) {
      setCategoryIds(initialCategoryIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function toggleCategory(categoryId: string) {
    setCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Filtrar por categoría"
    >
      <div className="flex flex-col gap-4">
        <CategoryMultiSelect
          selectedCategoryIds={categoryIds}
          onToggle={toggleCategory}
          types={['expense']}
        />

        <button
          type="button"
          onClick={() => onApply(categoryIds)}
          className="flex items-center justify-center rounded-xl bg-neutral-900 dark:bg-cyan-300 py-3 text-sm font-medium text-white dark:text-mauve-900 hover:cursor-pointer"
        >
          Filtrar
        </button>
      </div>
    </Modal>
  );
}
