import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { MainLayout } from "../layouts/MainLayout";
import { Button, Modal, StatusBadge } from "../components";
import { addPost, getPosts, deletePost } from "../services/api";

export const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    heading: "",
    matter: "",
    category: "",
    subcategory: "",
    images: "[]",
    isTrending: false,
    status: "published",
  });

  // Fetch posts on component mount
  useEffect(() => {
    fetchPostsData();
  }, []);

  const fetchPostsData = async () => {
    try {
      setLoading(true);
      const response = await getPosts();
      if (response.success && response.data) {
        setPosts(Array.isArray(response.data) ? response.data : [response.data]);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = () => {
    setFormData({
      heading: "",
      matter: "",
      category: "",
      subcategory: "",
      images: "[]",
      isTrending: false,
      status: "published",
    });
    setIsModalOpen(true);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async () => {
    if (!formData.heading || !formData.matter || !formData.category || !formData.subcategory) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await addPost({
        heading: formData.heading,
        matter: formData.matter,
        category: formData.category,
        subcategory: formData.subcategory,
        images: formData.images,
        isTrending: formData.isTrending,
        status: formData.status,
      });

      if (response.success) {
        setSuccess("Post created successfully!");
        setPosts([...posts, response.data]);
        setIsModalOpen(false);
        setFormData({
          heading: "",
          matter: "",
          category: "",
          subcategory: "",
          images: "[]",
          isTrending: false,
          status: "published",
        });
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error("Error adding post:", err);
      setError(err.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      setLoading(true);
      const response = await deletePost(id);
      if (response.success) {
        setPosts(posts.filter((post) => post.id !== id));
        setSuccess("Post deleted successfully!");
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Failed to delete post");
    } finally {
      setLoading(false);
    }
  };

  const columns = ["Heading", "Category", "Status"];

  const actions = (post) => (
    <>
      <button className="text-accent-orange hover:text-orange-600 transition-colors">
        <Edit size={18} />
      </button>
      <button
        onClick={() => handleDelete(post.id)}
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
            disabled={loading}
            className="gap-2"
          >
            <Plus size={20} />
            New Post
          </Button>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

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
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-gray-400">
                      No posts found
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr
                      key={post.id}
                      className="border-b border-gray-700 hover:bg-black/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-300">{post.heading}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{post.category}</td>
                      <td className="px-6 py-4 text-sm">
                        <StatusBadge status={post.status} />
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        {actions(post)}
                      </td>
                    </tr>
                  ))
                )}
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
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-1">
              Heading *
            </label>
            <input
              type="text"
              placeholder="Post heading"
              value={formData.heading}
              onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
              className="w-full px-4 py-2 bg-bg-secondary text-white rounded-lg border border-gray-700 focus:border-accent-orange focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 block mb-1">
              Content (Matter) *
            </label>
            <textarea
              placeholder="Post content"
              value={formData.matter}
              onChange={(e) => setFormData({ ...formData, matter: e.target.value })}
              rows="4"
              className="w-full px-4 py-2 bg-bg-secondary text-white rounded-lg border border-gray-700 focus:border-accent-orange focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-1">
                Category *
              </label>
              <input
                type="text"
                placeholder="e.g., technology"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 bg-bg-secondary text-white rounded-lg border border-gray-700 focus:border-accent-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 block mb-1">
                Subcategory *
              </label>
              <input
                type="text"
                placeholder="e.g., ai"
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                className="w-full px-4 py-2 bg-bg-secondary text-white rounded-lg border border-gray-700 focus:border-accent-orange focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 block mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 bg-bg-secondary text-white rounded-lg border border-gray-700 focus:border-accent-orange focus:outline-none"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isTrending"
              checked={formData.isTrending}
              onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
              className="w-4 h-4 rounded border-gray-700 bg-bg-secondary cursor-pointer"
            />
            <label htmlFor="isTrending" className="text-sm font-medium text-gray-300 cursor-pointer">
              Mark as Trending
            </label>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 block mb-1">
              Images (JSON format)
            </label>
            <textarea
              placeholder='["image1.jpg", "image2.jpg"]'
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              rows="2"
              className="w-full px-4 py-2 bg-bg-secondary text-white rounded-lg border border-gray-700 focus:border-accent-orange focus:outline-none resize-none"
            />
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
};
