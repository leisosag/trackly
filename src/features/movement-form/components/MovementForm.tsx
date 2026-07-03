import { useState } from 'react';
import { TrashIcon } from '@phosphor-icons/react';
import { Calculator } from './Calculator';
import { CategoryPicker } from './CategoryPicker';
import { getCategoryById } from '@/features/categories';
import {
  cn,
  getTodayInputValue,
  isoToInputValue,
  applyDateToIso,
} from '@/shared/utils';
import { CategoryIcon, DateField, DescriptionField } from '@/shared/components';
import type { Movement } from '@/features/movements';

type Step = 'category' | 'amount';

interface MovementFormProps {
  mode?: 'create' | 'edit';
  initialMovement?: Movement;
  onSubmit: (movement: Omit<Movement, 'id'>) => void;
  onDelete?: () => void;
}

export function MovementForm({
  mode = 'create',
  initialMovement,
  onSubmit,
  onDelete,
}: MovementFormProps) {
  const [step, setStep] = useState<Step>(
    initialMovement ? 'amount' : 'category',
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    initialMovement?.categoryId ?? null,
  );
  const [description, setDescription] = useState(
    initialMovement?.description ?? '',
  );
  const [expression, setExpression] = useState(
    initialMovement ? String(initialMovement.amount) : '',
  );
  const [dateValue, setDateValue] = useState(
    initialMovement
      ? isoToInputValue(initialMovement.date)
      : getTodayInputValue(),
  );
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const selectedCategory = selectedCategoryId
    ? getCategoryById(selectedCategoryId)
    : undefined;

  function handleCategorySelect(categoryId: string) {
    setSelectedCategoryId(categoryId);
    setStep('amount');
  }

  function handleAmountConfirm(amount: number) {
    if (!selectedCategoryId) return;

    const baseIso = initialMovement?.date ?? new Date().toISOString();

    onSubmit({
      categoryId: selectedCategoryId,
      description: description.trim() || undefined,
      amount,
      date: applyDateToIso(baseIso, dateValue),
    });

    if (mode === 'create') {
      setStep('category');
      setSelectedCategoryId(null);
      setDescription('');
      setExpression('');
      setDateValue(getTodayInputValue());
    }
  }

  if (step === 'category') {
    return (
      <CategoryPicker
        selectedCategoryId={selectedCategoryId}
        onSelect={handleCategorySelect}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep('category')}
          aria-label="Volver a elegir categoría"
          className="flex w-fit items-center gap-2 rounded-full py-1 pr-3 hover:bg-neutral-100 dark:hover:bg-mauve-900/30 hover:cursor-pointer"
        >
          {selectedCategory && (
            <CategoryIcon category={selectedCategory} className="p-2" />
          )}
          <span className="font-medium text-neutral-900 dark:text-mauve-50">
            {selectedCategory?.name}
          </span>
        </button>

        {mode === 'edit' && onDelete && (
          <button
            type="button"
            onClick={() =>
              confirmingDelete ? onDelete() : setConfirmingDelete(true)
            }
            className={cn(
              'flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium',
              confirmingDelete
                ? 'bg-red-600 text-white'
                : 'text-red-600 hover:bg-red-50',
            )}
          >
            <TrashIcon size={16} />
            {confirmingDelete ? 'Confirmar' : 'Eliminar'}
          </button>
        )}
      </div>

      <DateField value={dateValue} onChange={setDateValue} />
      <DescriptionField value={description} onChange={setDescription} />

      <Calculator
        expression={expression}
        onExpressionChange={setExpression}
        onConfirm={handleAmountConfirm}
      />
    </div>
  );
}
