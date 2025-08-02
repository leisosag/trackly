import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { increment, decrement } from "@/store/features/expenseSlice";

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
    <main className="p-6">
      <h1 className="text-2xl font-bold">Dashboard page</h1>
    </main>
  );
};
export default DashboardPage;
