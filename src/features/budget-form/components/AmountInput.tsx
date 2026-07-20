import { CurrencyDollarIcon } from '@phosphor-icons/react';
import { Input } from '@/shared/components';
import { formatAmountInput } from '@/shared/utils';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  placeholder?: string;
  disabled?: boolean;
}

export function AmountInput({
  value,
  onChange,
  ariaLabel,
  placeholder,
  disabled = false,
}: AmountInputProps) {
  return (
    <Input
      type="text"
      inputMode="decimal"
      value={value}
      onChange={(raw) => onChange(formatAmountInput(raw))}
      ariaLabel={ariaLabel}
      placeholder={placeholder}
      icon={CurrencyDollarIcon}
      disabled={disabled}
    />
  );
}
