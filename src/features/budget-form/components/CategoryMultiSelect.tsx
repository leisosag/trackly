import { categoriesSeed, type Category } from '@/features/categories';
import { CategoryIcon } from '@/shared/components';

interface CategoryMultiSelectProps {
  selectedCategoryIds: string[];
  onToggle: (categoryId: string) => void;
}

function CategoryChip({
  category,
  isSelected,
  onToggle,
}: {
  category: Category;
  isSelected: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isSelected}
      onClick={() => onToggle(category.id)}
    >
      <CategoryIcon
        category={category}
        isCircle={false}
        active={isSelected}
        borderOnHover
      />
    </button>
  );
}

export function CategoryMultiSelect({
  selectedCategoryIds,
  onToggle,
}: CategoryMultiSelectProps) {
  const expenseCategories = categoriesSeed.filter((c) => c.type === 'expense');

  return (
    <div className="flex flex-wrap gap-2">
      {expenseCategories.map((category) => (
        <CategoryChip
          key={category.id}
          category={category}
          isSelected={selectedCategoryIds.includes(category.id)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
