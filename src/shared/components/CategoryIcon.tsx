import type { Category } from '@/features/categories';
import { cn, getCategoryColors, getIcon } from '../utils';

type Props = {
  category: Category;
  iconSize?: number;
  isCircle?: boolean;
  active?: boolean;
  borderOnHover?: boolean;
  className?: string;
};

export function CategoryIcon({
  category,
  iconSize = 18,
  isCircle = true,
  active = false,
  borderOnHover = false,
  className,
}: Props) {
  const Icon = getIcon(category.icon);

  const colors = getCategoryColors(category.colorScheme);

  return (
    <div
      className={cn(
        'flex items-center justify-center',
        isCircle
          ? 'rounded-full p-3'
          : 'flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium transition-colors hover:cursor-pointer',
        borderOnHover && `border-1 ${colors.border}`,
        active ? colors.active : colors.circle,
        className,
      )}
    >
      <Icon
        size={iconSize}
        weight="regular"
        className={cn(colors.icon, active && 'text-mauve-900')}
      />
      {!isCircle && (
        <span className={cn(colors.icon, active && 'text-mauve-900')}>
          {category.name}
        </span>
      )}
    </div>
  );
}
