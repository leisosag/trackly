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
      <div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2.5">
        <CreditCardIcon
          size={18}
          className="shrink-0 text-neutral-400 dark:text-mauve-400"
        />
        <input
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Cantidad de cuotas"
          aria-label="Cantidad de cuotas"
          className="w-full text-sm text-neutral-900 dark:text-mauve-50 outline-none placeholder:text-neutral-400 disabled:text-mauve-400"
        />
      </div>

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
