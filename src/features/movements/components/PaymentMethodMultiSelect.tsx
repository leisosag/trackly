import {
  getPaymentMethods,
  type PaymentMethod,
  type PaymentMethodKind,
} from '@/features/payment-methods';
import { cn, getIcon, getCategoryColors } from '@/shared/utils';

interface PaymentMethodMultiSelectProps {
  selectedPaymentMethodIds: string[];
  onToggle: (paymentMethodId: string) => void;
  disabled?: boolean;
}

const ICON_BY_KIND: Record<PaymentMethodKind, string> = {
  cash: 'Money',
  debit: 'Bank',
  credit: 'CreditCard',
};

function PaymentMethodChip({
  method,
  isSelected,
  onToggle,
  disabled = false,
}: {
  method: PaymentMethod;
  isSelected: boolean;
  onToggle: (id: string) => void;
  disabled?: boolean;
}) {
  const Icon = getIcon(ICON_BY_KIND[method.kind]);
  const colors = getCategoryColors('financial');

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isSelected}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        onToggle(method.id);
      }}
      className={cn(
        'flex flex-col items-center gap-1 rounded-xl border-1 px-3 py-2 text-xs font-medium transition-colors',
        colors.border,
        !disabled && 'hover:cursor-pointer',
        isSelected ? colors.active : colors.circle,
      )}
    >
      <Icon
        size={18}
        weight="regular"
        className={cn(colors.icon, isSelected && 'text-mauve-900')}
      />
      <span className={cn(colors.icon, isSelected && 'text-mauve-900')}>
        {method.name}
      </span>
    </button>
  );
}

// Chips de selección múltiple para medios de pago, con el mismo lenguaje
// visual que CategoryMultiSelect (ícono + nombre, colorScheme financial).
// No reutiliza CategoryIcon directamente porque ese componente exige un
// objeto Category completo (con `type`), que no aplica a un medio de pago;
// en su lugar reutiliza los mismos utils de íconos/colores (getIcon,
// getCategoryColors) para no duplicar esa lógica.
export function PaymentMethodMultiSelect({
  selectedPaymentMethodIds,
  onToggle,
  disabled = false,
}: PaymentMethodMultiSelectProps) {
  const paymentMethods = getPaymentMethods();

  return (
    <div className="flex flex-wrap gap-2">
      {paymentMethods.map((method) => (
        <PaymentMethodChip
          key={method.id}
          method={method}
          isSelected={selectedPaymentMethodIds.includes(method.id)}
          onToggle={onToggle}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
