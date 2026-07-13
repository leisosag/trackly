import { useState } from 'react';
import {
  PencilSimpleIcon,
  TrashIcon,
  PowerIcon,
  type Icon,
} from '@phosphor-icons/react';
import { cn } from '../utils';
import { Modal } from './Modal';

type Variant = 'edit' | 'delete' | 'activate';
type Mode = 'toggle' | 'confirm';
type ConfirmVia = 'inline' | 'modal';

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
  confirmVia?: ConfirmVia;
  confirmMessage?: string;
  className?: string;
}

export function ConfirmActionButton({
  variant,
  onConfirm,
  mode,
  label,
  confirmLabel,
  iconOnly = false,
  confirmVia = 'inline',
  confirmMessage = 'Esta acción no se puede deshacer.',
  className,
}: ConfirmActionButtonProps) {
  const config = VARIANT_CONFIG[variant];
  const resolvedMode = mode ?? config.defaultMode;
  const resolvedLabel = label ?? config.defaultLabel;
  const resolvedConfirmLabel = confirmLabel ?? config.defaultConfirmLabel;
  const Icon = config.icon;

  const [active, setActive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  function handleClick() {
    if (confirmVia === 'modal') {
      setModalOpen(true);
      return;
    }

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

  function handleModalConfirm() {
    setModalOpen(false);
    onConfirm();
  }

  return (
    <>
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

      {confirmVia === 'modal' && (
        <Modal
          open={modalOpen}
          onOpenChange={setModalOpen}
          title={resolvedLabel}
          level={3}
        >
          <div className="flex flex-col gap-4">
            <p className="text-sm text-neutral-600 dark:text-mauve-300">
              {confirmMessage}
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl px-3 py-1.5 text-sm font-medium text-neutral-500 dark:text-mauve-300 hover:bg-neutral-100 dark:hover:bg-mauve-700/40 hover:cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleModalConfirm}
                className="rounded-xl bg-red-600 dark:bg-rose-500/15 dark:text-rose-300 dark:border dark:border-rose-400/20 px-3 py-1.5 text-sm font-medium text-white hover:cursor-pointer"
              >
                {resolvedConfirmLabel}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
