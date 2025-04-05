import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { Outlet } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Topbar />

        <div className="flex-1 p-6 overflow-y-auto">
            <Outlet />
        </div>
      </div>
    </div>
  );
}
