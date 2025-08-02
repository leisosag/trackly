import { Outlet } from "react-router-dom";
import Navbar from "@/components/navigation/Navbar";

const BaseLayout = () => {
  return (
    <div className="flex flex-col h-dvh w-screen bg-neutral-800">
      <Navbar />

      <main className="flex-1 p-6 pb-16 border">
        <Outlet />
      </main>
    </div>
  );
};

export default BaseLayout;
