import { useState } from 'react';
import { TrashIcon, PencilSimpleIcon } from '@phosphor-icons/react';
import { CategoryMultiSelect } from './CategoryMultiSelect';
import { cn } from '@/shared/utils';
import type { Budget } from '@/features/budgets';

interface BudgetFormProps {
  mode?: 'create' | 'edit';
  initialBudget?: Budget;
  onSubmit: (budget: Omit<Budget, 'id'>) => void;
  onDelete?: () => void;
}

export function BudgetForm({
  mode = 'create',
  initialBudget,
  onSubmit,
  onDelete,
}: BudgetFormProps) {
  const isGeneral = initialBudget?.isGeneral ?? false;

  const [name, setName] = useState(initialBudget?.name ?? '');
  const [amount, setAmount] = useState(
    initialBudget ? String(initialBudget.amount) : '',
  );
  const [categoryIds, setCategoryIds] = useState<string[]>(
    initialBudget?.categoryIds ?? [],
  );
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const numericAmount = Number(amount);
  const isValid = isGeneral
    ? numericAmount > 0
    : name.trim() !== '' && numericAmount > 0 && categoryIds.length > 0;

  function toggleCategory(categoryId: string) {
    setCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  }

  function handleSubmit() {
    if (!isValid) return;

    onSubmit({
      name: isGeneral ? 'Presupuesto general' : name.trim(),
      amount: numericAmount,
      period: 'monthly',
      categoryIds: isGeneral ? null : categoryIds,
      isGeneral,
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {mode === 'edit' && !isGeneral && onDelete && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() =>
              confirmingDelete ? onDelete() : setConfirmingDelete(true)
            }
            className={cn(
              'flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium hover:cursor-pointer',
              confirmingDelete
                ? 'bg-red-600 text-white dark:bg-rose-500/15 dark:text-rose-300 dark:border dark:border-rose-400/20'
                : 'text-red-600 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-400/10',
            )}
          >
            <TrashIcon size={16} />
            {confirmingDelete ? 'Sí, eliminar' : 'Eliminar'}
          </button>
        </div>
      )}

      {!isGeneral && (
        <div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2.5">
          <PencilSimpleIcon
            size={18}
            className="shrink-0 text-neutral-400 dark:text-mauve-400"
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del presupuesto"
            aria-label="Nombre del presupuesto"
            className="w-full text-sm text-neutral-900 dark:text-mauve-50 outline-none placeholder:text-neutral-400"
          />
        </div>
      )}

      <div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2.5">
        <span className="text-sm text-neutral-400">$</span>
        <input
          type="number"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Monto límite"
          aria-label="Monto límite del presupuesto"
          className="w-full text-sm text-neutral-900 dark:text-mauve-50 outline-none placeholder:text-neutral-400"
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2.5 text-sm text-neutral-500">
        <span>Período</span>
        <span className="font-medium text-neutral-900 dark:text-mauve-50">
          Mensual
        </span>
      </div>

      {!isGeneral && (
        <div>
          <h4 className="mb-2 text-sm font-medium text-neutral-500">
            Categorías
          </h4>
          <CategoryMultiSelect
            selectedCategoryIds={categoryIds}
            onToggle={toggleCategory}
          />
        </div>
      )}

      <button
        type="button"
        disabled={!isValid}
        onClick={handleSubmit}
        className={cn(
          'rounded-xl bg-neutral-900 dark:bg-cyan-300 py-3 font-medium text-white dark:text-mauve-900 disabled:bg-neutral-300 dark:disabled:bg-mauve-400',
          isValid && 'hover:cursor-pointer',
        )}
        aria-label="guardar"
      >
        Guardar
      </button>
    </div>
  );
}
