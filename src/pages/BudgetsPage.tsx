import * as React from "react";
import ProgressBar from "@/components/ProgressBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBill, faPlus } from "@fortawesome/free-solid-svg-icons";

const BudgetsPage = () => {
  return (
    <section className="h-full flex flex-col min-h-0 gap-y-4 pb-4">
      {/* presupuesto total */}
      <div className="flex justify-between items-start">
        <p className="text-base font-bold">Presupuesto total</p>
        <div>
          <p className="text-base font-bold">Objetivo</p>
          <p className="text-lg font-bold">$400.000</p>
        </div>
      </div>
      <ProgressBar progress={65} />

      {/* estadisticas */}
      <div className="flex">
        <div className="flex-1 border-t border-b border-r border-neutral-700 p-2">
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm">Gastado</p>
            <p className="text-lg font-bold">$100.000</p>
          </div>
        </div>
        <div className="flex-1 border-t border-b border-neutral-700 p-2">
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm">Disponible</p>
            <p className="text-lg font-bold">$400.000</p>
          </div>
        </div>
      </div>

      {/* categorias */}
      <div className="flex flex-col gap-y-4 flex-1 min-h-0">
        <p className="text-lg font-bold">Categorias</p>

        <div className="flex-1 overflow-y-auto space-y-2">
          {/* card categoria */}
          <div className="rounded-xl bg-white shadow-sm dark:bg-neutral-900 dark:border-neutral-700 p-3">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faMoneyBill} className="mr-4" />
                <p>Tarjeta</p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-lg font-bold">$500</p>
                <p className="text-xs">Objetivo $500</p>
              </div>
            </div>
            <ProgressBar progress={65} />
          </div>

          {/* card categoria */}
          <div className="rounded-xl bg-white shadow-sm dark:bg-neutral-900 dark:border-neutral-700 p-3">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faMoneyBill} className="mr-4" />
                <p>Tarjeta</p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-lg font-bold">$500</p>
                <p className="text-xs">Objetivo $500</p>
              </div>
            </div>
            <ProgressBar progress={65} />
          </div>

          {/* card categoria */}
          <div className="rounded-xl bg-white shadow-sm dark:bg-neutral-900 dark:border-neutral-700 p-3">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faMoneyBill} className="mr-4" />
                <p>Tarjeta</p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-lg font-bold">$500</p>
                <p className="text-xs">Objetivo $500</p>
              </div>
            </div>
            <ProgressBar progress={65} />
          </div>

          {/* card categoria */}
          <div className="rounded-xl bg-white shadow-sm dark:bg-neutral-900 dark:border-neutral-700 p-3">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faMoneyBill} className="mr-4" />
                <p>Tarjeta</p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-lg font-bold">$500</p>
                <p className="text-xs">Objetivo $500</p>
              </div>
            </div>
            <ProgressBar progress={65} />
          </div>

          {/* card categoria */}
          <div className="rounded-xl bg-white shadow-sm dark:bg-neutral-900 dark:border-neutral-700 p-3">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faMoneyBill} className="mr-4" />
                <p>Tarjeta</p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-lg font-bold">$500</p>
                <p className="text-xs">Objetivo $500</p>
              </div>
            </div>
            <ProgressBar progress={65} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BudgetsPage;
