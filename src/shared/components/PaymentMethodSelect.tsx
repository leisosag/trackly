import { CreditCardIcon } from '@phosphor-icons/react';
import { getPaymentMethods } from '@/features/payment-methods';

interface PaymentMethodSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function PaymentMethodSelect({
  value,
  onChange,
  disabled = false,
}: PaymentMethodSelectProps) {
  const paymentMethods = getPaymentMethods();

  return (
    <div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2.5">
      <CreditCardIcon
        size={18}
        className="shrink-0 text-neutral-400 dark:text-mauve-400"
      />
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Medio de pago"
        className="w-full bg-transparent text-sm text-neutral-900 dark:text-mauve-50 outline-none disabled:text-mauve-400 enabled:hover:cursor-pointer"
      >
        {paymentMethods.map((method) => (
          <option key={method.id} value={method.id}>
            {method.name}
          </option>
        ))}
      </select>
    </div>
  );
}
