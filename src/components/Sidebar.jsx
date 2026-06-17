import { useLocation, Link } from "react-router-dom";
import { Menu, Edit, FileText, Megaphone } from "lucide-react";

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { label: "Editors", icon: Edit, href: "/editors" },
    { label: "Posts", icon: FileText, href: "/posts" },
    { label: "Advertisements", icon: Megaphone, href: "/advertisements" },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-bg-secondary border-r border-gray-800 z-50 lg:z-10 transform transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-2xl font-bold text-white">Admin</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Manage
            </p>
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    toggleSidebar();
                  }
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-accent-orange text-white border-l-4 border-accent-orange"
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};
