import { categoriesSeed, type Category } from '@/features/categories';
import { CategoryIcon } from '@/shared/components';

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
  return (
    <button type="button" onClick={() => onSelect(category.id)}>
      <CategoryIcon
        category={category}
        isCircle={false}
        active={isSelected}
        borderOnHover
      />
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
