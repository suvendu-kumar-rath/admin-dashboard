import { useNavigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { Button } from "../components";
import { useAuth } from "../context/AuthContext";

export const EditorPanelPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="rounded-3xl bg-bg-tertiary border border-gray-800 p-8 shadow-xl shadow-black/10">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-accent-orange">Editor Panel</p>
              <h1 className="mt-2 text-4xl font-semibold text-white">
                Welcome back{user?.name ? `, ${user.name}` : ""}.
              </h1>
              <p className="mt-3 max-w-2xl text-gray-400">
                Use this workspace to create content, review active posts, and manage your daily editor tasks.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-800 bg-black/40 p-5">
                <p className="text-sm text-gray-400">Blog drafts</p>
                <p className="mt-3 text-3xl font-semibold text-white">12</p>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-black/40 p-5">
                <p className="text-sm text-gray-400">Pending reviews</p>
                <p className="mt-3 text-3xl font-semibold text-white">4</p>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-black/40 p-5">
                <p className="text-sm text-gray-400">Active campaigns</p>
                <p className="mt-3 text-3xl font-semibold text-white">3</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Quick actions</h2>
                <p className="text-gray-400">Jump straight to the place you need.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => navigate("/posts")}>Create Post</Button>
                <Button variant="secondary" onClick={() => navigate("/advertisements")}>Review Ads</Button>
                <Button variant="secondary" onClick={() => navigate("/editor-panel")}>Open Panel</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-3xl border border-gray-800 bg-bg-tertiary p-6">
            <h3 className="text-xl font-semibold text-white">Today’s editor notes</h3>
            <ul className="mt-4 space-y-3 text-gray-300">
              <li className="rounded-2xl border border-gray-800 bg-black/30 p-4">
                <p className="font-medium text-white">Proofread the featured post</p>
                <p className="text-sm text-gray-400">Check the new trending story for brand voice and SEO tags.</p>
              </li>
              <li className="rounded-2xl border border-gray-800 bg-black/30 p-4">
                <p className="font-medium text-white">Approve the advertisement campaign</p>
                <p className="text-sm text-gray-400">Review the latest creative assets before publishing.</p>
              </li>
              <li className="rounded-2xl border border-gray-800 bg-black/30 p-4">
                <p className="font-medium text-white">Confirm publication schedule</p>
                <p className="text-sm text-gray-400">Sync with the calendar and publish time-sensitive content.</p>
              </li>
            </ul>
          </section>

          <section className="rounded-3xl border border-gray-800 bg-bg-tertiary p-6">
            <h3 className="text-xl font-semibold text-white">Need help?</h3>
            <div className="mt-4 space-y-4 text-gray-300">
              <div className="rounded-2xl border border-gray-800 bg-black/30 p-4">
                <p className="font-medium text-white">Update drafts</p>
                <p className="text-sm text-gray-400">Add images, refine headlines, and check post categories.</p>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-black/30 p-4">
                <p className="font-medium text-white">Check live performance</p>
                <p className="text-sm text-gray-400">Review the latest published posts and ad performance.</p>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-black/30 p-4">
                <p className="font-medium text-white">Communicate with authors</p>
                <p className="text-sm text-gray-400">Share editing notes and ask for revisions when needed.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};
