import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { increment, decrement } from "@/store/features/expenseSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBill, faPlus } from "@fortawesome/free-solid-svg-icons";

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const count = useAppSelector((state) => state.expense.value);

  return (
    // <div>
    //   <div>
    //     <p className="border">Count: {count}</p>
    //     <button onClick={() => dispatch(increment())}>+1</button>
    //     <button onClick={() => dispatch(decrement())}>-1</button>
    //   </div>
    // </div>
    <section className="h-full flex flex-col min-h-0 gap-y-4 pb-4">
      {/* tarjeta de acumulados */}
      <div className="flex max-w-full rounded-xl bg-white shadow-sm dark:bg-neutral-900 dark:border-neutral-700 p-3">
        <div className="flex items-center justify-between w-full mr-3">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faMoneyBill} className="mr-4" />
            <div>
              <p className="text-xs">Ingresos</p>
              <p className="text-lg font-bold">$ 3.000.000</p>
            </div>
          </div>
        </div>
        <button className="!bg-pink-600 hover:bg-pink-700 h-w-full text-white flex items-center justify-center">
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>

      {/* tarjeta de acumulados */}
      <div className="flex max-w-full rounded-xl bg-white shadow-sm dark:bg-neutral-900 dark:border-neutral-700 p-3">
        <div className="flex items-center justify-between w-full mr-3">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faMoneyBill} className="mr-4" />
            <div>
              <p className="text-xs">Egresos</p>
              <p className="text-lg font-bold">$ 3.000.000</p>
            </div>
          </div>
        </div>
        <button className="!bg-pink-600 hover:bg-pink-700 h-w-full text-white flex items-center justify-center">
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>

      {/* tarjeta de acumulados */}
      <div className="flex max-w-full rounded-xl bg-white shadow-sm dark:bg-neutral-900 dark:border-neutral-700 p-3">
        <div className="flex items-center justify-between w-full mr-3">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faMoneyBill} className="mr-4" />
            <div>
              <p className="text-xs">Ahorros</p>
              <p className="text-lg font-bold">$ 3.000.000</p>
            </div>
          </div>
        </div>
        <button className="!bg-pink-600 hover:bg-pink-700 h-w-full text-white flex items-center justify-center">
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
    </section>
  );
};
export default DashboardPage;
