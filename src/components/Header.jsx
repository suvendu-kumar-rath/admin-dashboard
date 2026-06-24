import { Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      console.log("🚪 Logging out user:", user?.email);
      logout();
      navigate("/login");
    }
  };

  return (
    <header className="bg-bg-tertiary border-b border-gray-800 h-16 flex items-center justify-between px-6 lg:px-8 fixed top-0 right-0 left-0 lg:left-64 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-gray-400 hover:text-white transition-colors"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold">
          Admin <span className="text-accent-orange">Dashboard</span>
        </h1>
      </div>

      <button 
        onClick={handleLogout}
        className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors"
      >
        <LogOut size={20} />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </header>
  );
};
