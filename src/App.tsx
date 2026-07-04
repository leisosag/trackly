import { useState } from 'react';
import { Toaster } from 'sonner';
import { WalletIcon, ChartPieIcon } from '@phosphor-icons/react';
import { MovementsPage } from '@/features/movements';
import { BottomNav, type NavItem } from '@/shared/components';
import { BudgetsPage } from '@/features/budgets';

type AppSection = 'movements' | 'budgets';

function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('movements');

  const NAV_ITEMS: NavItem[] = [
    { id: 'movements', label: 'Movimientos', icon: WalletIcon },
    { id: 'budgets', label: 'Presupuestos', icon: ChartPieIcon },
  ];

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

      {activeSection === 'movements' && <MovementsPage />}

      {activeSection === 'budgets' && <BudgetsPage />}

      <BottomNav
        items={NAV_ITEMS}
        activeId={activeSection}
        onSelect={(id) => setActiveSection(id as AppSection)}
      />
    </div>
  );
}

export default App;
