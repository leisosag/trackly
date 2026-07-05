import { useState } from 'react';
import { PencilSimpleIcon } from '@phosphor-icons/react';
import { CategoryMultiSelect } from './CategoryMultiSelect';
import {
  ConfirmButton,
  ConfirmDeleteButton,
  ConfirmEditButton,
} from '@/shared/components';
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
  const [enableFields, setEnableFields] = useState(false);

  const isGeneral = initialBudget?.isGeneral ?? false;

  const [name, setName] = useState(initialBudget?.name ?? '');
  const [amount, setAmount] = useState(
    initialBudget ? String(initialBudget.amount) : '',
  );
  const [categoryIds, setCategoryIds] = useState<string[]>(
    initialBudget?.categoryIds ?? [],
  );

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

  function handleEnableFields() {
    setEnableFields((prev) => !prev);
  }

  return (
    <div className="flex flex-col gap-4">
      {mode === 'edit' && (
        <div className="grid grid-cols-2 gap-2 pt-1 sm:flex sm:justify-end">
          {!isGeneral && onDelete && (
            <ConfirmDeleteButton onConfirm={onDelete} />
          )}
          <ConfirmEditButton
            onConfirm={handleEnableFields}
            className={isGeneral ? 'col-span-2' : ''}
          />
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
            disabled={mode === 'edit' ? !enableFields : false}
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
          disabled={mode === 'edit' ? !enableFields : false}
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
            disabled={mode === 'edit' ? !enableFields : false}
          />
        </div>
      )}

      <ConfirmButton
        onConfirm={handleSubmit}
        disabled={mode === 'edit' ? !isValid || !enableFields : !isValid}
      />
    </div>
  );
}
