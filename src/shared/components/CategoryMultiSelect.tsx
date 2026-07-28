import {
  categoriesSeed,
  type Category,
  type CategoryType,
} from '@/features/categories';
import { CategoryIcon } from './CategoryIcon';

interface CategoryMultiSelectProps {
  selectedCategoryIds: string[];
  onToggle: (categoryId: string) => void;
  types?: CategoryType[];
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
  types = ['expense'],
  disabled = false,
}: CategoryMultiSelectProps) {
  const filteredCategories = categoriesSeed.filter((c) =>
    types.includes(c.type),
  );

  return (
    <div className="flex flex-wrap gap-2">
      {filteredCategories.map((category) => (
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
