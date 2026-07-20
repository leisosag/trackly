import type { Icon } from '@phosphor-icons/react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
> {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  placeholder?: string;
  icon?: Icon;
  disabled?: boolean;
  type?: string;
}

export function Input({
  value,
  onChange,
  ariaLabel,
  placeholder,
  icon: IconComponent,
  disabled = false,
  type = 'text',
  ...inputProps
}: InputProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2.5">
      {IconComponent && (
        <IconComponent
          size={18}
          className="shrink-0 text-neutral-400 dark:text-mauve-400"
        />
      )}
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="w-full text-sm text-neutral-900 dark:text-mauve-50 outline-none placeholder:text-neutral-400 disabled:text-mauve-400"
        {...inputProps}
      />
    </div>
  );
}
