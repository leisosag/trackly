import type { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBill } from "@fortawesome/free-solid-svg-icons";

type ExpenseProps = {
  icon?: string;
  title?: string;
  details?: string;
  amount: number;
  children?: ReactNode;
};

const Expense = ({ icon, title, details, amount, children }: ExpenseProps) => {
  return (
    <div className="flex p-2 items-center justify-between">
      <div className="flex items-center">
        <FontAwesomeIcon
          icon={faMoneyBill}
          className="p-2 bg-pink-400 rounded-full mr-2"
        />
        <div>
          <p className="text-base">{title}</p>
          <p className="text-xs">{details}</p>
        </div>
      </div>
      <p className="text-base">+{amount}</p>
    </div>
  );
};

export default Expense;
