import { useEffect, useState } from 'react';
import { GearSixIcon, PlusIcon } from '@phosphor-icons/react';
import { useMovements, MovementList } from '@/features/movements';
import {
  needsClosingDayReminder,
  useCreditCards,
  type CreditCard,
} from '@/features/credit-cards';
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
import { toast } from 'sonner';
import type { Movement, NewMovementInput } from '@/features/movements';
import { MovementForm } from '@/features/movement-form';

type FormState = { mode: 'create' } | { mode: 'edit'; card: CreditCard };

export function CreditCardsPage() {
  const { movements, updateInstallmentGroup, removeInstallmentGroup } =
    useMovements();
  const { selectedDate } = useSelectedMonth();
  const { creditCards, addCreditCard, updateCreditCard } = useCreditCards();

  const [manageOpen, setManageOpen] = useState(false);
  const [formState, setFormState] = useState<FormState | null>(null);
  const [movementFormState, setMovementFormState] = useState<{
    movement: Movement;
  } | null>(null);

  const period = dateToPeriod(selectedDate);
  const cardMovements = getCreditCardMovements(movements, period);
  const total = cardMovements.reduce((sum, m) => sum + m.amount, 0);
  const activeCards = creditCards.filter((c) => c.isActive);
  const groups = groupMovementsByCard(cardMovements, activeCards);

  // Se dispara una única vez al entrar a la pantalla (no en cada render ni al cambiar el mes navegado)
  // El recordatorio es sobre el mes real actual, no sobre el mes del selector.
  useEffect(() => {
    activeCards.forEach((card) => {
      if (needsClosingDayReminder(card)) {
        toast(
          `Recordá actualizar la fecha de cierre de ${card.name} para este mes`,
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  function handleMovementClick(movement: Movement) {
    if (movement.installment && movement.installment.number !== 1) {
      toast.info(
        'Esta cuota forma parte de una compra. Para editarla o eliminarla, tocá la cuota 1.',
      );
      return;
    }
    setMovementFormState({ movement });
  }

  function handleInstallmentUpdate(groupId: string, input: NewMovementInput) {
    updateInstallmentGroup(groupId, {
      categoryId: input.categoryId,
      description: input.description,
      amount: input.amount,
      date: input.date,
      paymentMethodId: input.paymentMethodId!,
    });
    setMovementFormState(null);
    toast.success('Compra actualizada');
  }

  function handleInstallmentDelete(groupId: string) {
    removeInstallmentGroup(groupId);
    setMovementFormState(null);
    toast.success('Compra eliminada');
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
                <MovementList
                  movements={groupMovements}
                  onMovementClick={handleMovementClick}
                />
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
        level={2}
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

      <Modal
        open={movementFormState !== null}
        onOpenChange={(open) => !open && setMovementFormState(null)}
        title="Editar compra"
      >
        {movementFormState &&
          (() => {
            const total = movementFormState.movement.installment?.total ?? 1;
            const groupId = movementFormState.movement.installment!.groupId;
            const confirmMessage =
              total === 1
                ? 'Se va a eliminar esta compra.'
                : `Se van a eliminar las ${total} cuotas de esta compra.`;

            return (
              <MovementForm
                key={`edit-installment-${groupId}`}
                mode="edit"
                initialMovement={movementFormState.movement}
                lockPaymentMethod
                deleteConfirmMessage={confirmMessage}
                onSubmit={(input) => handleInstallmentUpdate(groupId, input)}
                onDelete={() => handleInstallmentDelete(groupId)}
              />
            );
          })()}
      </Modal>
    </>
  );
}
