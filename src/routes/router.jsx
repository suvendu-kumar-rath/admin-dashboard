import { createBrowserRouter } from "react-router-dom";
import { EditorsPage } from "../pages/EditorsPage";
import { PostsPage } from "../pages/PostsPage";
import { AdvertisementsPage } from "../pages/AdvertisementsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <EditorsPage />,
  },
  {
    path: "/editors",
    element: <EditorsPage />,
  },
  {
    path: "/posts",
    element: <PostsPage />,
  },
  {
    path: "/advertisements",
    element: <AdvertisementsPage />,
  },
]);
