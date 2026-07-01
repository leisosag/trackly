import { useMovements } from './features/movements/hooks/useMovements';
import { MovementList } from './features/movements/components/MovementList';

function App() {
  const { movements } = useMovements();

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
    </div>
  );
}

export default App;
