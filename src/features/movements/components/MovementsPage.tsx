import { useState } from 'react';
import { toast } from 'sonner';
import { useMovements } from '../hooks/useMovements';
import { BalanceHeader } from './BalanceHeader';
import { MovementList } from './MovementList';
import type { Movement } from '../types';
import { Fab, Modal } from '@/shared/components';
import { MovementForm } from '@/features/movement-form';

type FormState = { mode: 'create' } | { mode: 'edit'; movement: Movement };

export function MovementsPage() {
  const { movements, addMovement, updateMovement, removeMovement } =
    useMovements();

  const [formState, setFormState] = useState<FormState | null>(null);

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

  return (
    <>
      <BalanceHeader movements={movements} />

      <main className="pb-24">
        <MovementList
          movements={movements}
          onMovementClick={(movement) =>
            setFormState({ mode: 'edit', movement })
          }
        />
      </main>

      <Fab
        onClick={() => setFormState({ mode: 'create' })}
        label="Agregar movimiento"
        className="fixed bottom-6 left-1/2 z-6 -translate-x-1/2"
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
    </>
  );
}
