import { createElement } from 'react';
import { categoriesSeed, type Category } from '@/features/categories';
import { getIcon, cn } from '@/shared/utils';

interface CategoryPickerProps {
  selectedCategoryId: string | null;
  onSelect: (categoryId: string) => void;
}

function CategoryButton({
  category,
  isSelected,
  onSelect,
}: {
  category: Category;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const icon = createElement(getIcon(category.icon), { size: 20 });

  return (
    <button
      type="button"
      onClick={() => onSelect(category.id)}
      className={cn(
        'flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium transition-colors hover:cursor-pointer',
        isSelected
          ? 'bg-neutral-900 text-white'
          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
      )}
    >
      {icon}
      <span>{category.name}</span>
    </button>
  );
}

export function CategoryPicker({
  selectedCategoryId,
  onSelect,
}: CategoryPickerProps) {
  const incomeCategories = categoriesSeed.filter((c) => c.type === 'income');
  const expenseCategories = categoriesSeed.filter((c) => c.type === 'expense');

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h4 className="mb-2 text-sm font-medium text-neutral-500">Ingresos</h4>
        <div className="flex flex-wrap gap-2">
          {incomeCategories.map((category) => (
            <CategoryButton
              key={category.id}
              category={category}
              isSelected={category.id === selectedCategoryId}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium text-neutral-500">Gastos</h4>
        <div className="flex flex-wrap gap-2">
          {expenseCategories.map((category) => (
            <CategoryButton
              key={category.id}
              category={category}
              isSelected={category.id === selectedCategoryId}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
