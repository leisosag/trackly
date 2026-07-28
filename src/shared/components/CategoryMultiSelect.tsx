import {
  categoriesSeed,
  type Category,
  type CategoryType,
} from '@/features/categories';
import { CategoryIcon } from './CategoryIcon';

interface CategoryMultiSelectProps {
  mode?: 'single' | 'multi';
  types?: CategoryType[];
  disabled?: boolean;
  // modo 'multi' (default)
  selectedCategoryIds?: string[];
  onToggle?: (categoryId: string) => void;
  // modo 'single'
  selectedCategoryId?: string | null;
  onSelect?: (categoryId: string) => void;
}

const GROUP_LABELS: Record<CategoryType, string> = {
  income: 'Ingresos',
  expense: 'Gastos',
};

function CategoryButton({
  category,
  isSelected,
  onClick,
  showCheckedState,
  disabled = false,
}: {
  category: Category;
  isSelected: boolean;
  onClick: () => void;
  showCheckedState: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      {...(showCheckedState
        ? { role: 'checkbox' as const, 'aria-checked': isSelected }
        : {})}
      onClick={() => {
        if (disabled) return;
        onClick();
      }}
    >
      <CategoryIcon
        category={category}
        isCircle={false}
        active={isSelected}
        borderOnHover
        disabled={disabled}
      />
    </button>
  );
}

// Selector de categorías, con dos modos:
// - 'multi' (default): selección múltiple vía checkboxes (BudgetForm, filtro de Movimientos)
// - 'single': selección única, sin aria-checked (reemplaza al viejo CategoryPicker de movement-form)
// Agrupa visualmente por tipo (Ingresos/Gastos) únicamente cuando `types` incluye más de un tipo;
// con un solo tipo (ej. BudgetForm, solo gastos) no muestra encabezado, para no alterar su apariencia actual.
export function CategoryMultiSelect({
  mode = 'multi',
  types = ['expense'],
  disabled = false,
  selectedCategoryIds = [],
  onToggle,
  selectedCategoryId = null,
  onSelect,
}: CategoryMultiSelectProps) {
  const showGroupHeaders = types.length > 1;

  function isSelected(id: string): boolean {
    return mode === 'single'
      ? selectedCategoryId === id
      : selectedCategoryIds.includes(id);
  }

  function handleClick(id: string) {
    if (mode === 'single') {
      onSelect?.(id);
    } else {
      onToggle?.(id);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {types.map((type) => {
        const categoriesOfType = categoriesSeed.filter((c) => c.type === type);
        if (categoriesOfType.length === 0) return null;

        return (
          <div key={type}>
            {showGroupHeaders && (
              <h4 className="mb-2 text-sm font-medium text-neutral-500">
                {GROUP_LABELS[type]}
              </h4>
            )}
            <div className="flex flex-wrap gap-2">
              {categoriesOfType.map((category) => (
                <CategoryButton
                  key={category.id}
                  category={category}
                  isSelected={isSelected(category.id)}
                  onClick={() => handleClick(category.id)}
                  showCheckedState={mode === 'multi'}
                  disabled={disabled}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
