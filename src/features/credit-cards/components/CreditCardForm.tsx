import { useState } from 'react';
import { PencilSimpleIcon, CalendarDotsIcon } from '@phosphor-icons/react';
import {
  ConfirmButton,
  ConfirmDeleteButton,
  ConfirmEditButton,
  Input,
} from '@/shared/components';
import type { CreditCard } from '../types';

interface CreditCardFormProps {
  mode?: 'create' | 'edit';
  initialCard?: CreditCard;
  onSubmit: (
    card: Omit<CreditCard, 'id' | 'closingDayConfirmedPeriod'>,
  ) => void;
  onDeactivate?: () => void;
  onActivate?: () => void;
  canDeactivate?: boolean;
}

export function CreditCardForm({
  mode = 'create',
  initialCard,
  onSubmit,
  onDeactivate,
  onActivate,
  canDeactivate = true,
}: CreditCardFormProps) {
  const [enableFields, setEnableFields] = useState(false);

  const [name, setName] = useState(initialCard?.name ?? '');
  const [closingDay, setClosingDay] = useState(
    initialCard ? String(initialCard.closingDay) : '',
  );

  const numericClosingDay = Number(closingDay);
  const isValid =
    name.trim() !== '' &&
    Number.isInteger(numericClosingDay) &&
    numericClosingDay >= 1 &&
    numericClosingDay <= 31;

  function handleSubmit() {
    if (!isValid) return;

    onSubmit({
      name: name.trim(),
      closingDay: numericClosingDay,
      isActive: initialCard?.isActive ?? true,
    });
  }

  function handleEnableFields() {
    setEnableFields((prev) => !prev);
  }

  return (
    <div className="flex flex-col gap-4">
      {mode === 'edit' && (
        <>
          <div className="grid grid-cols-2 gap-2 pt-1 sm:flex sm:justify-end">
            {initialCard?.isActive && onDeactivate && canDeactivate && (
              // TODO: hacer un componente activate button
              <ConfirmDeleteButton
                onConfirm={onDeactivate}
                label="Desactivar"
                confirmLabel="Sí, desactivar"
              />
            )}
            {!initialCard?.isActive && onActivate && (
              <ConfirmDeleteButton
                onConfirm={onActivate}
                label="Activar"
                confirmLabel="Sí, activar"
              />
            )}
            <ConfirmEditButton
              onConfirm={handleEnableFields}
              className={
                initialCard?.isActive && !canDeactivate ? 'col-span-2' : ''
              }
            />
          </div>

          {initialCard?.isActive && onDeactivate && !canDeactivate && (
            <p className="text-xs text-neutral-400 dark:text-mauve-500">
              No se puede desactivar: tiene movimientos cargados para este mes o
              meses siguientes.
            </p>
          )}
        </>
      )}

      <Input
        value={name}
        onChange={(value) => setName(value)}
        ariaLabel="Nombre de la tarjeta"
        placeholder="Nombre de la tarjeta"
        icon={PencilSimpleIcon}
        disabled={mode === 'edit' ? !enableFields : false}
      />

      <Input
        type="number"
        inputMode="numeric"
        min={1}
        max={31}
        value={closingDay}
        onChange={(value) => setClosingDay(value)}
        ariaLabel="Día de cierre"
        placeholder="Día de cierre"
        icon={CalendarDotsIcon}
        disabled={mode === 'edit' ? !enableFields : false}
      />

      <ConfirmButton
        onConfirm={handleSubmit}
        disabled={mode === 'edit' ? !isValid || !enableFields : !isValid}
      />
    </div>
  );
}
