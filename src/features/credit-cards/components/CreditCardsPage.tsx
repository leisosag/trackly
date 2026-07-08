import { useState } from 'react';
import { GearSixIcon, PlusIcon } from '@phosphor-icons/react';
import { useMovements, MovementList } from '@/features/movements';
import { useCreditCards, type CreditCard } from '@/features/credit-cards';
import { useSelectedMonth } from '@/shared/context';
import {
  formatCurrency,
  dateToPeriod,
  formatPeriodLabel,
  getCreditCardMovements,
  canDeactivateCreditCard,
  groupMovementsByCard,
} from '@/shared/utils';
import { Modal } from '@/shared/components';
import { CreditCardForm } from './CreditCardForm';
import { CreditCardList } from './CreditCardList';

type FormState = { mode: 'create' } | { mode: 'edit'; card: CreditCard };

export function CreditCardsPage() {
  const { movements } = useMovements();
  const { selectedDate } = useSelectedMonth();
  const { creditCards, addCreditCard, updateCreditCard } = useCreditCards();

  const [manageOpen, setManageOpen] = useState(false);
  const [formState, setFormState] = useState<FormState | null>(null);

  const period = dateToPeriod(selectedDate);
  const cardMovements = getCreditCardMovements(movements, period);
  const total = cardMovements.reduce((sum, m) => sum + m.amount, 0);
  const activeCards = creditCards.filter((c) => c.isActive);
  const groups = groupMovementsByCard(cardMovements, activeCards);

  function handleCardCreate(
    card: Omit<CreditCard, 'id' | 'closingDayConfirmedPeriod'>,
  ) {
    addCreditCard(card);
    setFormState(null);
  }

  function handleCardUpdate(
    id: string,
    card: Omit<CreditCard, 'id' | 'closingDayConfirmedPeriod'>,
  ) {
    updateCreditCard(id, card);
    setFormState(null);
  }

  function handleCardDeactivate(card: CreditCard) {
    updateCreditCard(card.id, {
      name: card.name,
      closingDay: card.closingDay,
      isActive: false,
    });
    setFormState(null);
  }

  function handleCardActivate(card: CreditCard) {
    updateCreditCard(card.id, {
      name: card.name,
      closingDay: card.closingDay,
      isActive: true,
    });
    setFormState(null);
  }

  return (
    <>
      <header className="sticky top-0 z-2 bg-neutral-900 dark:bg-mauve-800 py-4 px-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base text-neutral-400">
              Resumen de {formatPeriodLabel(period)}
            </p>
            <p
              data-testid="credit-cards-total"
              className="text-3xl font-semibold dark:text-cyan-300"
            >
              {formatCurrency(total)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setManageOpen(true)}
            aria-label="Gestionar tarjetas"
            className="rounded-full p-2 text-neutral-400 hover:cursor-pointer hover:bg-white/10 hover:text-white"
          >
            <GearSixIcon size={20} />
          </button>
        </div>
      </header>

      <main className="flex flex-col gap-4 pb-24">
        {activeCards.length === 0 ? (
          <MovementList movements={[]} />
        ) : (
          groups.map(
            ({ card, movements: groupMovements, total: cardTotal }) => (
              <div key={card.id}>
                <div className="flex items-center justify-between px-4 pt-4 pb-1">
                  <h4 className="text-sm font-medium text-neutral-500">
                    {card.name}
                  </h4>
                  <span className="text-sm text-neutral-400">
                    {formatCurrency(cardTotal)}
                  </span>
                </div>
                <MovementList movements={groupMovements} />
              </div>
            ),
          )
        )}
      </main>

      <Modal open={manageOpen} onOpenChange={setManageOpen} title="Tarjetas">
        <div className="flex flex-col gap-4">
          <CreditCardList
            cards={creditCards}
            onCardClick={(card) => setFormState({ mode: 'edit', card })}
          />

          <button
            type="button"
            onClick={() => setFormState({ mode: 'create' })}
            className="flex items-center justify-center gap-2 rounded-xl bg-neutral-900 dark:bg-cyan-300 py-3 text-sm font-medium text-white dark:text-mauve-900 hover:cursor-pointer"
          >
            <PlusIcon size={18} weight="bold" />
            Agregar tarjeta
          </button>
        </div>
      </Modal>

      <Modal
        open={formState !== null}
        onOpenChange={(open) => !open && setFormState(null)}
        title={formState?.mode === 'edit' ? 'Editar tarjeta' : 'Nueva tarjeta'}
      >
        {formState?.mode === 'create' && (
          <CreditCardForm
            key="create-card"
            mode="create"
            onSubmit={handleCardCreate}
          />
        )}
        {formState?.mode === 'edit' && (
          <CreditCardForm
            key={`edit-card-${formState.card.id}`}
            mode="edit"
            initialCard={formState.card}
            onSubmit={(card) => handleCardUpdate(formState.card.id, card)}
            onDeactivate={() => handleCardDeactivate(formState.card)}
            onActivate={() => handleCardActivate(formState.card)}
            canDeactivate={canDeactivateCreditCard(
              formState.card.id,
              movements,
            )}
          />
        )}
      </Modal>
    </>
  );
}
