import "./App.css";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { increment, decrement } from "@/store/features/expenseSlice";

function App() {
  const dispatch = useAppDispatch();
  const count = useAppSelector((state) => state.expense.value);
  return (
    <>
      <div>
        <h1>Trackly</h1>
        <p>Count: {count}</p>
        <button onClick={() => dispatch(increment())}>+1</button>
        <button onClick={() => dispatch(decrement())}>-1</button>
      </div>
    </>
  );
}

export default App;
