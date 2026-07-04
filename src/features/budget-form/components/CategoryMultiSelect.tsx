import { categoriesSeed, type Category } from '@/features/categories';
import { CategoryIcon } from '@/shared/components';

interface CategoryMultiSelectProps {
  selectedCategoryIds: string[];
  onToggle: (categoryId: string) => void;
  disabled?: boolean;
}

function CategoryChip({
  category,
  isSelected,
  onToggle,
  disabled = false,
}: {
  category: Category;
  isSelected: boolean;
  onToggle: (id: string) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isSelected}
      onClick={() => {
        if (disabled) return;
        onToggle(category.id);
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

export function CategoryMultiSelect({
  selectedCategoryIds,
  onToggle,
  disabled = false,
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
          disabled={disabled}
        />
      ))}
    </div>
  );
}
