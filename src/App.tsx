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
import { Fab, Modal, BottomNav, type NavItem } from '@/shared/components';

type FormState = { mode: 'create' } | { mode: 'edit'; movement: Movement };
type AppSection = 'movements' | 'budgets';

function App() {
  const { movements, addMovement, updateMovement, removeMovement } =
    useMovements();
  const [formState, setFormState] = useState<FormState | null>(null);
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
          <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
            <p>Presupuestos: próximamente</p>
          </div>
        )}
      </main>

      {activeSection === 'movements' && (
        <Fab
          onClick={() => setFormState({ mode: 'create' })}
          label="Agregar movimiento"
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
    </div>
  );
}

export default App;
