import { useState } from 'react';
import { Calculator } from './Calculator';
import { CategoryPicker } from './CategoryPicker';
import { getCategoryById } from '@/features/categories';
import {
  getTodayInputValue,
  isoToInputValue,
  applyDateToIso,
} from '@/shared/utils';
import {
  CategoryIcon,
  ConfirmDeleteButton,
  ConfirmEditButton,
  DateField,
  DescriptionField,
  PaymentMethodSelect,
} from '@/shared/components';
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
  const [paymentMethodId, setPaymentMethodId] = useState(
    initialMovement?.paymentMethodId ?? 'debit',
  );
  const [enableFields, setEnableFields] = useState(false);

  const selectedCategory = selectedCategoryId
    ? getCategoryById(selectedCategoryId)
    : undefined;

  const isExpenseCategory = selectedCategory?.type === 'expense';

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
      paymentMethodId: isExpenseCategory ? paymentMethodId : undefined,
    });

    if (mode === 'create') {
      setStep('category');
      setSelectedCategoryId(null);
      setDescription('');
      setExpression('');
      setDateValue(getTodayInputValue());
    }
  }

  function handleEnableFields() {
    setEnableFields((prev) => !prev);
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
          disabled={mode === 'edit' ? !enableFields : false}
          aria-label="Volver a elegir categoría"
          className="flex w-fit items-center gap-2 rounded-full py-1 pr-3 hover:enabled:bg-neutral-100 dark:enabled:hover:bg-mauve-900/30 hover:enabled:cursor-pointer"
        >
          {selectedCategory && (
            <CategoryIcon
              category={selectedCategory}
              className="p-2"
              disabled={mode === 'edit' ? !enableFields : false}
            />
          )}
          <span className="font-medium text-neutral-900 dark:text-mauve-50">
            {selectedCategory?.name}
          </span>
        </button>

        {mode === 'edit' && (
          <div className="flex gap-2">
            {onDelete && <ConfirmDeleteButton onConfirm={onDelete} />}
            <ConfirmEditButton onConfirm={handleEnableFields} />
          </div>
        )}
      </div>

      <DateField
        value={dateValue}
        onChange={setDateValue}
        disabled={mode === 'edit' ? !enableFields : false}
      />
      {isExpenseCategory && (
        <PaymentMethodSelect
          value={paymentMethodId}
          onChange={setPaymentMethodId}
          disabled={mode === 'edit' ? !enableFields : false}
        />
      )}
      <DescriptionField
        value={description}
        onChange={setDescription}
        disabled={mode === 'edit' ? !enableFields : false}
      />

      <Calculator
        expression={expression}
        onExpressionChange={setExpression}
        onConfirm={handleAmountConfirm}
        disabled={mode === 'edit' ? !enableFields : false}
      />
    </div>
  );
}
