import { useEffect, useState } from 'react';
import { CategoryMultiSelect, Modal } from '@/shared/components';
import { PaymentMethodMultiSelect } from './PaymentMethodMultiSelect';

interface MovementFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialCategoryIds: string[];
  initialPaymentMethodIds: string[];
  onApply: (categoryIds: string[], paymentMethodIds: string[]) => void;
}

export function MovementFilterModal({
  open,
  onOpenChange,
  initialCategoryIds,
  initialPaymentMethodIds,
  onApply,
}: MovementFilterModalProps) {
  const [categoryIds, setCategoryIds] = useState<string[]>(initialCategoryIds);
  const [paymentMethodIds, setPaymentMethodIds] = useState<string[]>(
    initialPaymentMethodIds,
  );

  // Radix no desmonta el contenido del modal entre aperturas, así que el
  // estado local no se reinicia solo. Se resincroniza explícitamente cada
  // vez que se abre, para reflejar el filtro real (ej.: después de un
  // clearFilters externo, que vacía ambos arrays).
  useEffect(() => {
    if (open) {
      setCategoryIds(initialCategoryIds);
      setPaymentMethodIds(initialPaymentMethodIds);
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

  function togglePaymentMethod(paymentMethodId: string) {
    setPaymentMethodIds((prev) =>
      prev.includes(paymentMethodId)
        ? prev.filter((id) => id !== paymentMethodId)
        : [...prev, paymentMethodId],
    );
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Filtrar movimientos">
      <div className="flex flex-col gap-4">
        <CategoryMultiSelect
          selectedCategoryIds={categoryIds}
          onToggle={toggleCategory}
          types={['income', 'expense']}
        />

        <div>
          <h4 className="mb-2 text-sm font-medium text-neutral-500">
            Medio de pago
          </h4>
          <PaymentMethodMultiSelect
            selectedPaymentMethodIds={paymentMethodIds}
            onToggle={togglePaymentMethod}
          />
        </div>

        <button
          type="button"
          onClick={() => onApply(categoryIds, paymentMethodIds)}
          className="flex items-center justify-center rounded-xl bg-neutral-900 dark:bg-cyan-300 py-3 text-sm font-medium text-white dark:text-mauve-900 hover:cursor-pointer"
        >
          Filtrar
        </button>
      </div>
    </Modal>
  );
}
