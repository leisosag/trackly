import { useState } from 'react';
import { useMovements, MovementList } from '@/features/movements';
import { MovementForm } from '@/features/movement-form';
import { Fab, Modal } from '@/shared/components';

function App() {
  const { movements, addMovement } = useMovements();
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleSubmit(movement: Parameters<typeof addMovement>[0]) {
    addMovement(movement);
    setIsModalOpen(false);
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="px-4 py-6">
        <h1 className="text-xl font-semibold text-neutral-900">
          Mis movimientos
        </h1>
      </header>

      <main>
        <MovementList movements={movements} />
      </main>

      <Fab onClick={() => setIsModalOpen(true)} />

      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Nuevo movimiento"
      >
        <MovementForm onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
}

export default App;
