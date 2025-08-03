import { useRoutes } from "react-router-dom";
import DashboardPage from "../pages/Dashboard";
import AddMedia from "../pages/addMedia";
import Progress from "../pages/progress";
import Recommendations from "../pages/Recommendations";

export default function AppRoutes() {
  return useRoutes([
    { path: "/dashboard", element: <DashboardPage /> },
    { path: "/add", element: <AddMedia /> },
    { path: "/recommendations", element: <Recommendations /> },
    { path: "/progress/:type/:id", element: <Progress /> },
    { path: "/", element: <DashboardPage /> },
  ]);
}
