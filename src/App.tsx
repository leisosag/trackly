import { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { WalletIcon, ChartPieIcon } from '@phosphor-icons/react';
import {
  useMovements,
  MovementList,
  BalanceHeader,
  type Movement,
} from '@/features/movements';
import { MovementForm } from '@/features/movement-form';
import { useBudgets, BudgetList, type Budget } from '@/features/budgets';
import { BudgetForm } from '@/features/budget-form';
import { Fab, Modal, BottomNav, type NavItem } from '@/shared/components';

type FormState = { mode: 'create' } | { mode: 'edit'; movement: Movement };
type BudgetFormState = { mode: 'create' } | { mode: 'edit'; budget: Budget };
type AppSection = 'movements' | 'budgets';

function App() {
  const { movements, addMovement, updateMovement, removeMovement } =
    useMovements();
  const { budgets, addBudget, updateBudget, removeBudget } = useBudgets();

  const [formState, setFormState] = useState<FormState | null>(null);
  const [budgetFormState, setBudgetFormState] =
    useState<BudgetFormState | null>(null);

  const [activeSection, setActiveSection] = useState<AppSection>('movements');

  const NAV_ITEMS: NavItem[] = [
    { id: 'movements', label: 'Movimientos', icon: WalletIcon },
    { id: 'budgets', label: 'Presupuestos', icon: ChartPieIcon },
  ];

  function handleCreate(movement: Omit<Movement, 'id'>) {
    addMovement(movement);
    setFormState(null);
    toast.success('Movimiento cargado');
  }

  function handleUpdate(id: string, movement: Omit<Movement, 'id'>) {
    updateMovement(id, movement);
    setFormState(null);
    toast.success('Movimiento actualizado');
  }

  function handleDelete(id: string) {
    removeMovement(id);
    setFormState(null);
    toast.success('Movimiento eliminado');
  }

  function handleBudgetCreate(budget: Omit<Budget, 'id'>) {
    addBudget(budget);
    setBudgetFormState(null);
    toast.success('Presupuesto creado');
  }

  function handleBudgetUpdate(id: string, budget: Omit<Budget, 'id'>) {
    updateBudget(id, budget);
    setBudgetFormState(null);
    toast.success('Presupuesto actualizado');
  }

  function handleBudgetDelete(id: string) {
    removeBudget(id);
    setBudgetFormState(null);
    toast.success('Presupuesto eliminado');
  }

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-mauve-950">
      <Toaster
        position="top-center"
        toastOptions={{
          classNames: {
            toast: 'bg-neutral-900 text-white border-none',
          },
        }}
      />

      {activeSection === 'movements' && <BalanceHeader movements={movements} />}

      <main className="pb-24">
        {activeSection === 'movements' && (
          <MovementList
            movements={movements}
            onMovementClick={(movement) =>
              setFormState({ mode: 'edit', movement })
            }
          />
        )}

        {activeSection === 'budgets' && (
          <BudgetList
            budgets={budgets}
            movements={movements}
            onBudgetClick={(budget) =>
              setBudgetFormState({ mode: 'edit', budget })
            }
          />
        )}
      </main>

      {activeSection === 'movements' && (
        <Fab
          onClick={() => setFormState({ mode: 'create' })}
          label="Agregar movimiento"
          className="fixed bottom-6 left-1/2 z-6 -translate-x-1/2"
        />
      )}

      {activeSection === 'budgets' && (
        <Fab
          onClick={() => setBudgetFormState({ mode: 'create' })}
          label="Agregar presupuesto"
          className="fixed bottom-6 left-1/2 z-6 -translate-x-1/2"
        />
      )}

      <BottomNav
        items={NAV_ITEMS}
        activeId={activeSection}
        onSelect={(id) => setActiveSection(id as AppSection)}
      />

      <Modal
        open={formState !== null}
        onOpenChange={(open) => !open && setFormState(null)}
        title={
          formState?.mode === 'edit' ? 'Editar movimiento' : 'Nuevo movimiento'
        }
      >
        {formState?.mode === 'create' && (
          <MovementForm key="create" mode="create" onSubmit={handleCreate} />
        )}
        {formState?.mode === 'edit' && (
          <MovementForm
            key={`edit-${formState.movement.id}`}
            mode="edit"
            initialMovement={formState.movement}
            onSubmit={(movement) =>
              handleUpdate(formState.movement.id, movement)
            }
            onDelete={() => handleDelete(formState.movement.id)}
          />
        )}
      </Modal>

      <Modal
        open={budgetFormState !== null}
        onOpenChange={(open) => !open && setBudgetFormState(null)}
        title={
          budgetFormState?.mode === 'edit'
            ? budgetFormState.budget.isGeneral
              ? 'Editar presupuesto general'
              : 'Editar presupuesto'
            : 'Nuevo presupuesto'
        }
      >
        {budgetFormState?.mode === 'create' && (
          <BudgetForm
            key="create-budget"
            mode="create"
            onSubmit={handleBudgetCreate}
          />
        )}
        {budgetFormState?.mode === 'edit' && (
          <BudgetForm
            key={`edit-budget-${budgetFormState.budget.id}`}
            mode="edit"
            initialBudget={budgetFormState.budget}
            onSubmit={(budget) =>
              handleBudgetUpdate(budgetFormState.budget.id, budget)
            }
            onDelete={
              budgetFormState.budget.isGeneral
                ? undefined
                : () => handleBudgetDelete(budgetFormState.budget.id)
            }
          />
        )}
      </Modal>
    </div>
  );
}

export default App;
