import { useState } from 'react';
import {
  PencilSimpleIcon,
  TrashIcon,
  PowerIcon,
  type Icon,
} from '@phosphor-icons/react';
import { cn } from '../utils';

type Variant = 'edit' | 'delete' | 'activate';
type Mode = 'toggle' | 'confirm';

interface VariantConfig {
  icon: Icon;
  defaultMode: Mode;
  defaultLabel: string;
  defaultConfirmLabel: string;
  activeClasses: string;
  idleClasses: string;
}

const VARIANT_CONFIG: Record<Variant, VariantConfig> = {
  edit: {
    icon: PencilSimpleIcon,
    defaultMode: 'toggle',
    defaultLabel: 'Editar',
    defaultConfirmLabel: 'Editando',
    activeClasses:
      'bg-blue-600 text-white dark:bg-sky-500/15 dark:text-sky-300 dark:border dark:border-sky-400/20',
    idleClasses:
      'hover:bg-blue-600 text-neutral-400 dark:text-white dark:hover:bg-sky-500/15 dark:hover:text-sky-300',
  },
  delete: {
    icon: TrashIcon,
    defaultMode: 'confirm',
    defaultLabel: 'Eliminar',
    defaultConfirmLabel: 'Sí, eliminar',
    activeClasses:
      'bg-red-600 text-white dark:bg-rose-500/15 dark:text-rose-300 dark:border dark:border-rose-400/20',
    idleClasses:
      'text-red-600 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-400/10',
  },
  activate: {
    icon: PowerIcon,
    defaultMode: 'confirm',
    defaultLabel: 'Activar',
    defaultConfirmLabel: 'Sí, activar',
    activeClasses:
      'bg-emerald-600 text-white dark:bg-emerald-500/15 dark:text-emerald-300 dark:border dark:border-emerald-400/20',
    idleClasses:
      'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-400/10',
  },
};

interface ConfirmActionButtonProps {
  variant: Variant;
  onConfirm: () => void;
  mode?: Mode;
  label?: string;
  confirmLabel?: string;
  iconOnly?: boolean;
  className?: string;
}

export function ConfirmActionButton({
  variant,
  onConfirm,
  mode,
  label,
  confirmLabel,
  iconOnly = false,
  className,
}: ConfirmActionButtonProps) {
  const config = VARIANT_CONFIG[variant];
  const resolvedMode = mode ?? config.defaultMode;
  const resolvedLabel = label ?? config.defaultLabel;
  const resolvedConfirmLabel = confirmLabel ?? config.defaultConfirmLabel;
  const Icon = config.icon;

  const [active, setActive] = useState(false);

  function handleClick() {
    if (resolvedMode === 'toggle') {
      setActive((prev) => !prev);
      onConfirm();
      return;
    }

    if (active) {
      onConfirm();
    } else {
      setActive(true);
    }
  }

  return (
    <button
      type="button"
      aria-label={active ? resolvedConfirmLabel : resolvedLabel}
      onClick={handleClick}
      className={cn(
        'flex items-center justify-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium hover:cursor-pointer border',
        active ? config.activeClasses : config.idleClasses,
        className,
      )}
    >
      <Icon size={16} />
      {!iconOnly && (active ? resolvedConfirmLabel : resolvedLabel)}
    </button>
  );
}
