import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { MainLayout } from "../layouts/MainLayout";
import { Button, Table, Modal, StatusBadge } from "../components";
import { postsData } from "../data/mockData";

export const PostsPage = () => {
  const [posts, setPosts] = useState(postsData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", author: "", status: "Draft" });

  const handleAddPost = () => {
    setFormData({ title: "", author: "", status: "Draft" });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (formData.title && formData.author) {
      const newPost = {
        id: posts.length + 1,
        ...formData,
      };
      setPosts([...posts, newPost]);
      setIsModalOpen(false);
      setFormData({ title: "", author: "", status: "Draft" });
    }
  };

  const handleDelete = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  const columns = ["Title", "Author", "Status"];

  const tableData = posts.map((post) => ({
    title: post.title,
    author: post.author,
    status: post.status,
    post, // Store full post for actions
  }));

  const actions = (row) => (
    <>
      <button className="text-accent-orange hover:text-orange-600 transition-colors">
        <Edit size={18} />
      </button>
      <button
        onClick={() => {
          const post = posts.find((p) => p.title === row.title);
          if (post) handleDelete(post.id);
        }}
        className="text-red-500 hover:text-red-600 transition-colors"
      >
        <Trash2 size={18} />
      </button>
    </>
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Posts</h1>
          <Button
            variant="primary"
            onClick={handleAddPost}
            className="gap-2"
          >
            <Plus size={20} />
            New Post
          </Button>
        </div>

        {/* Table */}
        <div className="bg-bg-tertiary rounded-lg border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  {columns.map((column) => (
                    <th
                      key={column}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider"
                    >
                      {column}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-gray-700 hover:bg-black/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-300">{post.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{post.author}</td>
                    <td className="px-6 py-4 text-sm">
                      <StatusBadge status={post.status} />
                    </td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <button className="text-accent-orange hover:text-orange-600 transition-colors">
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        title="Add New Post"
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 bg-bg-secondary text-white rounded-lg border border-gray-700 focus:border-accent-orange focus:outline-none"
          />
          <input
            type="text"
            placeholder="Author"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-4 py-2 bg-bg-secondary text-white rounded-lg border border-gray-700 focus:border-accent-orange focus:outline-none"
          />
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2 bg-bg-secondary text-white rounded-lg border border-gray-700 focus:border-accent-orange focus:outline-none"
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
        </div>
      </Modal>
    </MainLayout>
  );
};
