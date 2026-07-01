import { Calculator } from './Calculator';

export function MovementForm() {
  function handleAmountConfirm(amount: number) {
    console.log('Monto confirmado:', amount);
  }

  return (
    <div className="flex flex-col gap-4">
      <Calculator onConfirm={handleAmountConfirm} />
    </div>
  );
}
