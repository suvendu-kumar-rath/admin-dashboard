import { useNavigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { Button } from "../components";
import { useAuth } from "../context/AuthContext";

export const AdminPanelPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="rounded-3xl bg-bg-tertiary border border-gray-800 p-8 shadow-xl shadow-black/10">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-accent-orange">Admin Panel</p>
              <h1 className="mt-2 text-4xl font-semibold text-white">
                Welcome back{user?.name ? `, ${user.name}` : ""}.
              </h1>
              <p className="mt-3 max-w-2xl text-gray-400">
                Manage editors, review content, and keep the site running smoothly from this dashboard.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-800 bg-black/40 p-5">
                <p className="text-sm text-gray-400">Active editors</p>
                <p className="mt-3 text-3xl font-semibold text-white">8</p>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-black/40 p-5">
                <p className="text-sm text-gray-400">Pending approvals</p>
                <p className="mt-3 text-3xl font-semibold text-white">5</p>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-black/40 p-5">
                <p className="text-sm text-gray-400">Open tasks</p>
                <p className="mt-3 text-3xl font-semibold text-white">3</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Quick actions</h2>
                <p className="text-gray-400">Jump straight to the tools you need.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => navigate("/editors")}>Manage Editors</Button>
                <Button variant="secondary" onClick={() => navigate("/posts")}>Review Posts</Button>
                <Button variant="secondary" onClick={() => navigate("/advertisements")}>Review Ads</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-3xl border border-gray-800 bg-bg-tertiary p-6">
            <h3 className="text-xl font-semibold text-white">Admin overview</h3>
            <ul className="mt-4 space-y-3 text-gray-300">
              <li className="rounded-2xl border border-gray-800 bg-black/30 p-4">
                <p className="font-medium text-white">Track site performance</p>
                <p className="text-sm text-gray-400">Use the admin tools to monitor content health and editor activity.</p>
              </li>
              <li className="rounded-2xl border border-gray-800 bg-black/30 p-4">
                <p className="font-medium text-white">Approve new accounts</p>
                <p className="text-sm text-gray-400">Manage user roles and ensure access is granted correctly.</p>
              </li>
              <li className="rounded-2xl border border-gray-800 bg-black/30 p-4">
                <p className="font-medium text-white">Review editorial backlog</p>
                <p className="text-sm text-gray-400">Keep priority items moving and unblock your team.</p>
              </li>
            </ul>
          </section>

          <section className="rounded-3xl border border-gray-800 bg-bg-tertiary p-6">
            <h3 className="text-xl font-semibold text-white">Need help?</h3>
            <div className="mt-4 space-y-4 text-gray-300">
              <div className="rounded-2xl border border-gray-800 bg-black/30 p-4">
                <p className="font-medium text-white">View editor performance</p>
                <p className="text-sm text-gray-400">Check how your team is handling reviews and approvals.</p>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-black/30 p-4">
                <p className="font-medium text-white">Configure site settings</p>
                <p className="text-sm text-gray-400">Update content settings and publishing permissions.</p>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-black/30 p-4">
                <p className="font-medium text-white">Resolve pending issues</p>
                <p className="text-sm text-gray-400">Clear warnings and keep editorial workflows moving.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};
