import { Routes, Route } from "react-router-dom";
import DashboardPage from "@/pages/DashboardPage";
import ListPage from "@/pages/ListPage";
import BaseLayout from "@/components/layout/BaseLayout";
import BudgetsPage from "@/pages/BudgetsPage";
import SettingsPage from "@/pages/SettingsPage";

function App() {
  return (
    <>
      <Routes>
        <Route element={<BaseLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/expenses" element={<ListPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
