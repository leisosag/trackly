import { Input } from '@/shared/components';
import { CreditCardIcon } from '@phosphor-icons/react';

interface InstallmentsFieldProps {
  value: string;
  onChange: (value: string) => void;
  periodLabels: string[];
  disabled?: boolean;
}

export function InstallmentsField({
  value,
  onChange,
  periodLabels,
  disabled = false,
}: InstallmentsFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Input
        type="number"
        inputMode="numeric"
        min={1}
        step={1}
        value={value}
        onChange={(value) => onChange(value)}
        ariaLabel="Cantidad de cuotas"
        placeholder="Cantidad de cuotas"
        icon={CreditCardIcon}
        disabled={disabled}
      />

      {periodLabels.length > 0 && (
        <p className="px-1 text-xs text-neutral-400 dark:text-mauve-500">
          {periodLabels.length === 1
            ? `Se va a reflejar en el resumen de ${periodLabels[0]}`
            : `Se van a crear ${periodLabels.length} movimientos, uno por resumen: ${periodLabels.join(', ')}`}
        </p>
      )}
    </div>
  );
}
