import { useState } from 'react';
import { toast } from 'sonner';
import { useMovements } from '@/features/movements';
import { BudgetForm } from '@/features/budget-form';
import { Fab, Modal } from '@/shared/components';
import type { Budget } from '../types';
import { useBudgets } from '../hooks/useBudgets';
import { BudgetList } from './BudgetList';

type FormState = { mode: 'create' } | { mode: 'edit'; budget: Budget };

export function BudgetsPage() {
  const { movements } = useMovements();
  const { budgets, addBudget, updateBudget, removeBudget } = useBudgets();

  const [formState, setFormState] = useState<FormState | null>(null);

  function handleBudgetCreate(budget: Omit<Budget, 'id'>) {
    addBudget(budget);
    setFormState(null);
    toast.success('Presupuesto creado');
  }

  function handleBudgetUpdate(id: string, budget: Omit<Budget, 'id'>) {
    updateBudget(id, budget);
    setFormState(null);
    toast.success('Presupuesto actualizado');
  }

  function handleBudgetDelete(id: string) {
    removeBudget(id);
    setFormState(null);
    toast.success('Presupuesto eliminado');
  }

  return (
    <>
      <main className="pb-24">
        <BudgetList
          budgets={budgets}
          movements={movements}
          onBudgetClick={(budget) => setFormState({ mode: 'edit', budget })}
        />
      </main>

      <Fab
        onClick={() => setFormState({ mode: 'create' })}
        label="Agregar presupuesto"
        className="fixed bottom-6 left-1/2 z-6 -translate-x-1/2"
      />

      <Modal
        open={formState !== null}
        onOpenChange={(open) => !open && setFormState(null)}
        title={
          formState?.mode === 'edit'
            ? formState.budget.isGeneral
              ? 'Editar presupuesto general'
              : 'Editar presupuesto'
            : 'Nuevo presupuesto'
        }
      >
        {formState?.mode === 'create' && (
          <BudgetForm
            key="create-budget"
            mode="create"
            onSubmit={handleBudgetCreate}
          />
        )}
        {formState?.mode === 'edit' && (
          <BudgetForm
            key={`edit-budget-${formState.budget.id}`}
            mode="edit"
            initialBudget={formState.budget}
            onSubmit={(budget) =>
              handleBudgetUpdate(formState.budget.id, budget)
            }
            onDelete={
              formState.budget.isGeneral
                ? undefined
                : () => handleBudgetDelete(formState.budget.id)
            }
          />
        )}
      </Modal>
    </>
  );
}
