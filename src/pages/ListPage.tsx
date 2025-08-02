import * as React from "react";
import Card from "@/components/Card";
import Expense from "@/components/Expense";

const ListPage = () => {
  return (
    <section className="h-full flex flex-col min-h-0 gap-y-4 pb-4">
      {/* disponible */}
      <header className="shrink-0">
        <h2 className="text-xl font-bold">6.000</h2>
        <p>Egresos: 3.000.000</p>
        <p>Ingresos: 4.000.000</p>
      </header>
      {/* gastos por dia */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {[...Array(5)].map((_, i) => (
          <Card key={i} title="02 ago 2025" description="ingreso">
            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
              <Expense title="Servicios" details="Contadora" amount={30000} />
              <Expense title="Servicios" details="Contadora" amount={30000} />
              <Expense title="Servicios" details="Contadora" amount={30000} />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ListPage;
