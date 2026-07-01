import { useState } from 'react';
import {
  useMovements,
  MovementList,
  type Movement,
} from '@/features/movements';
import { MovementForm } from '@/features/movement-form';
import { Fab, Modal } from '@/shared/components';

type FormState = { mode: 'create' } | { mode: 'edit'; movement: Movement };

function App() {
  const { movements, addMovement, updateMovement, removeMovement } =
    useMovements();
  const [formState, setFormState] = useState<FormState | null>(null);

  function handleCreate(movement: Omit<Movement, 'id'>) {
    addMovement(movement);
    setFormState(null);
  }

  function handleUpdate(id: string, movement: Omit<Movement, 'id'>) {
    updateMovement(id, movement);
    setFormState(null);
  }

  function handleDelete(id: string) {
    removeMovement(id);
    setFormState(null);
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="px-4 py-6">
        <h1 className="text-xl font-semibold text-neutral-900">
          Mis movimientos
        </h1>
      </header>

      <main>
        <MovementList
          movements={movements}
          onMovementClick={(movement) =>
            setFormState({ mode: 'edit', movement })
          }
        />
      </main>

      <Fab onClick={() => setFormState({ mode: 'create' })} />

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
    </div>
  );
}

export default App;
