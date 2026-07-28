import { useEffect, useState } from 'react';
import { CategoryMultiSelect, Modal } from '@/shared/components';

interface CategoryFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialCategoryIds: string[];
  onApply: (categoryIds: string[]) => void;
}

export function CategoryFilterModal({
  open,
  onOpenChange,
  initialCategoryIds,
  onApply,
}: CategoryFilterModalProps) {
  const [categoryIds, setCategoryIds] = useState<string[]>(initialCategoryIds);

  useEffect(() => {
    if (open) setCategoryIds(initialCategoryIds);
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
          types={['income', 'expense']}
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
