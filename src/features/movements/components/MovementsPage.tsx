import { useState } from 'react';
import { toast } from 'sonner';
import { useMovements } from '../hooks/useMovements';
import { useMovementFilters } from '../hooks/useMovementFilters';
import { BalanceHeader } from './BalanceHeader';
import { MovementList } from './MovementList';
import { FilteredSummary } from './FilteredSummary';
import { MovementFilterModal } from './MovementFilterModal';
import type { Movement, NewMovementInput } from '../types';
import { Fab, Modal } from '@/shared/components';
import { MovementForm } from '@/features/movement-form';
import { useSelectedMonth } from '@/shared/context';
import { filterMovementsByPeriod, applyMovementFilters } from '@/shared/utils';

type FormState = { mode: 'create' } | { mode: 'edit'; movement: Movement };

export function MovementsPage() {
  const { movements, addMovement, updateMovement, removeMovement } =
    useMovements();

  const { selectedDate } = useSelectedMonth();

  const {
    filters,
    hasActiveFilters,
    isModalOpen,
    openModal,
    closeModal,
    applyFilters,
    clearFilters,
  } = useMovementFilters();

  const monthlyMovements = filterMovementsByPeriod(movements, selectedDate);

  const displayedMovements = hasActiveFilters
    ? applyMovementFilters(monthlyMovements, filters)
    : monthlyMovements;

  const [formState, setFormState] = useState<FormState | null>(null);

  function handleCreate(movement: NewMovementInput) {
    addMovement(movement);
    setFormState(null);
    toast.success('Movimiento cargado');
  }

  function handleUpdate(id: string, movement: NewMovementInput) {
    const { installmentsCount: _installmentsCount, ...rest } = movement;
    updateMovement(id, rest);
    setFormState(null);
    toast.success('Movimiento actualizado');
  }

  function handleDelete(id: string) {
    removeMovement(id);
    setFormState(null);
    toast.success('Movimiento eliminado');
  }

  return (
    <>
      <BalanceHeader
        movements={monthlyMovements}
        onFilterClick={openModal}
        hasActiveFilters={hasActiveFilters}
      />

      {hasActiveFilters && (
        <FilteredSummary
          movements={displayedMovements}
          filters={filters}
          onClear={clearFilters}
        />
      )}

      <main className="pb-24">
        <MovementList
          movements={displayedMovements}
          onMovementClick={(movement) =>
            setFormState({ mode: 'edit', movement })
          }
        />
      </main>

      <Fab
        onClick={() => setFormState({ mode: 'create' })}
        label="Agregar movimiento"
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

      <MovementFilterModal
        open={isModalOpen}
        onOpenChange={closeModal}
        initialCategoryIds={filters.categoryIds}
        initialPaymentMethodIds={filters.paymentMethodIds}
        onApply={applyFilters}
      />
    </>
  );
}
