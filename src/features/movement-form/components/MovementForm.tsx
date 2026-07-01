import { createElement, useState } from 'react';
import { Calculator } from './Calculator';
import { CategoryPicker } from './CategoryPicker';
import { getCategoryById } from '@/features/categories';
import { getIcon, cn } from '@/shared/utils';
import type { Movement } from '@/features/movements';

type Step = 'category' | 'amount';

interface MovementFormProps {
  onSubmit: (movement: Omit<Movement, 'id'>) => void;
}

export function MovementForm({ onSubmit }: MovementFormProps) {
  const [step, setStep] = useState<Step>('category');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [description, setDescription] = useState('');
  const [expression, setExpression] = useState('');

  const selectedCategory = selectedCategoryId
    ? getCategoryById(selectedCategoryId)
    : undefined;

  function handleCategorySelect(categoryId: string) {
    setSelectedCategoryId(categoryId);
    setStep('amount');
  }

  function handleAmountConfirm(amount: number) {
    if (!selectedCategoryId) return;

    onSubmit({
      categoryId: selectedCategoryId,
      description: description.trim() || undefined,
      amount,
      date: new Date().toISOString(),
    });

    setStep('category');
    setSelectedCategoryId(null);
    setDescription('');
    setExpression('');
  }

  if (step === 'category') {
    return (
      <CategoryPicker
        selectedCategoryId={selectedCategoryId}
        onSelect={handleCategorySelect}
      />
    );
  }

  const icon = selectedCategory
    ? createElement(getIcon(selectedCategory.icon), { size: 20 })
    : null;

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => setStep('category')}
        aria-label="Volver a elegir categoría"
        className="flex w-fit items-center gap-2 rounded-full py-1 pr-3 hover:bg-neutral-100 hover:cursor-pointer"
      >
        <div
          className={cn(
            'flex size-10 items-center justify-center rounded-full text-neutral-600',
            selectedCategory?.type === 'income'
              ? 'bg-emerald-100'
              : 'bg-red-100',
          )}
        >
          {icon}
        </div>
        <span className="font-medium text-neutral-900">
          {selectedCategory?.name}
        </span>
      </button>

      <div>
        <label
          htmlFor="description"
          className="mb-1 block text-sm text-neutral-500"
        >
          Descripción (opcional)
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Escribir descripción..."
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-400"
        />
      </div>

      <Calculator
        expression={expression}
        onExpressionChange={setExpression}
        onConfirm={handleAmountConfirm}
      />
    </div>
  );
}
