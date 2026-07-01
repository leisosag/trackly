import { PencilSimpleIcon } from '@phosphor-icons/react';

interface DescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function DescriptionField({ value, onChange }: DescriptionFieldProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2.5">
      <PencilSimpleIcon size={18} className="shrink-0 text-neutral-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Descripción (opcional)"
        aria-label="Descripción del movimiento"
        className="w-full text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
      />
    </div>
  );
}
