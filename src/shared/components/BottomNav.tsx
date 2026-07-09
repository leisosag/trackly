import type { Icon } from '@phosphor-icons/react';
import { cn } from '../utils';

export interface NavItem {
  id: string;
  label: string;
  icon: Icon;
}

interface BottomNavProps {
  items: NavItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function BottomNav({ items, activeId, onSelect }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-5 flex items-center justify-around border-t border-neutral-200 bg-white px-2 pt-10 md:pb-4 md:py-8 dark:border-mauve-700 dark:bg-mauve-800">
      {items.map((item) => {
        const ItemIcon = item.icon;
        const isActive = item.id === activeId;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-lg px-0 md:px-4 py-1 text-xs font-medium hover:cursor-pointer',
              isActive
                ? 'text-neutral-900 dark:text-cyan-300'
                : 'text-neutral-400 dark:text-mauve-400',
            )}
          >
            <ItemIcon size={22} weight={isActive ? 'fill' : 'regular'} />
            <span className="invisible md:visible">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
