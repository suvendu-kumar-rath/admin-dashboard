import { createBrowserRouter } from "react-router-dom";
import { EditorsPage } from "../pages/EditorsPage";
import { PostsPage } from "../pages/PostsPage";
import { AdvertisementsPage } from "../pages/AdvertisementsPage";
import { LoginPage } from "../pages/LoginPage";
import { ProtectedRoute } from "../components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <EditorsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/editors",
    element: (
      <ProtectedRoute>
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
