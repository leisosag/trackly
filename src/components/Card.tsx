import type { ReactNode } from "react";

type CardProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

const Card = ({ title, description, children }: CardProps) => {
  return (
    <div className="rounded-xl bg-white shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
      <div className="flex justify-between bg-neutral-900 p-2 border-b border-neutral-700">
        <p className="text-xs">{title}</p>
        {description && (
          <p className="text-xs text-neutral-500">{description}</p>
        )}
      </div>
      <div className="p-2">{children}</div>
    </div>
  );
};

export default Card;
