import { useRef } from 'react';
import { CalendarIcon, CaretRightIcon } from '@phosphor-icons/react';
import { formatDateLabel } from '@/shared/utils';

interface DateFieldProps {
  value: string; // yyyy-mm-dd
  onChange: (value: string) => void;
}

export function DateField({ value, onChange }: DateFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    inputRef.current?.showPicker?.();
  }

  return (
    <button
      type="button"
      onClick={openPicker}
      className="flex w-full items-center justify-between rounded-lg border border-neutral-200 px-3 py-2.5 text-left hover:bg-neutral-50 hover:cursor-pointer"
    >
      <div className="flex items-center gap-2 text-sm text-neutral-700">
        <CalendarIcon size={18} className="text-neutral-400" />
        <span>Fecha</span>
      </div>

      <div className="flex items-center gap-1 text-sm text-neutral-500">
        <span>{formatDateLabel(value)}</span>
        <CaretRightIcon size={14} />
        <input
          ref={inputRef}
          type="date"
          value={value}
          onChange={(e) => e.target.value && onChange(e.target.value)}
          aria-label="Fecha del movimiento"
          className="h-0 w-0 opacity-0"
          tabIndex={-1}
        />
      </div>
    </button>
  );
}
