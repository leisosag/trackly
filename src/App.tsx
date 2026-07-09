import { useState } from 'react';
import { Toaster } from 'sonner';
import {
  WalletIcon,
  ChartPieIcon,
  CreditCardIcon,
} from '@phosphor-icons/react';
import { MovementsPage } from '@/features/movements';
import { BottomNav, MonthSelector, type NavItem } from '@/shared/components';
import { BudgetsPage } from '@/features/budgets';
import { CreditCardsPage } from './features/credit-cards';

type AppSection = 'movements' | 'budgets' | 'credit-cards';

function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('movements');

  const NAV_ITEMS: NavItem[] = [
    { id: 'movements', label: 'Movimientos', icon: WalletIcon },
    { id: 'budgets', label: 'Presupuestos', icon: ChartPieIcon },
    { id: 'credit-cards', label: 'Tarjetas', icon: CreditCardIcon },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-mauve-950">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 800,
          classNames: {
            toast: 'bg-neutral-900 text-white border-none',
          },
        }}
      />

      <MonthSelector />

      {activeSection === 'movements' && <MovementsPage />}

      {activeSection === 'budgets' && <BudgetsPage />}

      {activeSection === 'credit-cards' && <CreditCardsPage />}

      <BottomNav
        items={NAV_ITEMS}
        activeId={activeSection}
        onSelect={(id) => setActiveSection(id as AppSection)}
      />
    </div>
  );
}

export default App;
