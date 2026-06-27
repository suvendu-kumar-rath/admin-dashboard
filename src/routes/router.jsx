import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { EditorsPage } from "../pages/EditorsPage";
import { EditorPanelPage } from "../pages/EditorPanelPage";
import { AdminPanelPage } from "../pages/AdminPanelPage";
import { PostsPage } from "../pages/PostsPage";
import { AdvertisementsPage } from "../pages/AdvertisementsPage";
import { LoginPage } from "../pages/LoginPage";
import { ProtectedRoute } from "../components/ProtectedRoute";

const RootRedirect = () => {
  const { user } = useAuth();

  if (user?.role === "editor") {
    return <Navigate to="/editor-panel" replace />;
  }

  if (user?.role === "admin") {
    return <Navigate to="/admin-panel" replace />;
  }

  return <Navigate to="/posts" replace />;
};

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <RootRedirect />
      </ProtectedRoute>
    ),
  },
  {
    path: "/editor-panel",
    element: (
      <ProtectedRoute allowedRoles={["editor", "admin"]}>
        <EditorPanelPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin-panel",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminPanelPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/editors",
    element: (
      <ProtectedRoute allowedRoles={["editor", "admin"]}>
        <EditorsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/posts",
    element: (
      <ProtectedRoute>
        <PostsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/advertisements",
    element: (
      <ProtectedRoute>
        <AdvertisementsPage />
      </ProtectedRoute>
    ),
  },
]);
