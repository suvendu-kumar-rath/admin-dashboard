import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { MainLayout } from "../layouts/MainLayout";
import { Button, Table, Modal, StatusBadge } from "../components";
import { getPosts, addPost, updatePost, deletePost } from "../services/api";

export const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [formData, setFormData] = useState({
    heading: "",
    matter: "",
    category: "",
    subcategory: "",
    images: "",
    isTrending: false,
    status: "draft",
  });

  // Fetch posts on component mount
  useEffect(() => {
    fetchPostsData();
  }, []);

  const fetchPostsData = async () => {
    try {
      setIsLoading(true);
      console.log('📡 Fetching posts from backend...');
      const response = await getPosts();
      console.log('📥 Posts response:', response);
      
      // Handle different response formats
      let postsArray = [];
      if (response.success) {
        // Check if data is an array or object with data property
        if (Array.isArray(response.data)) {
          postsArray = response.data;
        } else if (response.data && Array.isArray(response.data.posts)) {
          postsArray = response.data.posts;
        } else if (response.data && typeof response.data === 'object') {
          postsArray = [response.data];
        }
      } else if (Array.isArray(response)) {
        postsArray = response;
      }
      
      console.log('✅ Loaded posts:', postsArray);
      setPosts(postsArray);
    } catch (error) {
      console.error("❌ Error fetching posts:", error);
      alert(`Failed to fetch posts: ${error.message}`);
      setPosts([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPost = () => {
    setEditingPostId(null);
    setFormData({
      heading: "",
      matter: "",
      category: "",
      subcategory: "",
      images: "",
      isTrending: false,
      status: "draft",
    });
    setIsModalOpen(true);
  };

  const handleEditPost = (post) => {
    setEditingPostId(post.id);
    setFormData({
      heading: post.heading,
      matter: post.matter,
      category: post.category,
      subcategory: post.subcategory || "",
      images: post.images || "",
      isTrending: post.isTrending || false,
      status: post.status || "draft",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.heading?.trim()) {
      alert("Heading is required");
      return;
    }
    
    if (!formData.matter?.trim()) {
      alert("Content (Matter) is required");
      return;
    }
    
    if (!formData.category?.trim()) {
      alert("Category is required");
      return;
    }

    // Validate heading length (backend validation)
    if (formData.heading.trim().length < 5) {
      alert("Heading must be at least 5 characters long");
      return;
    }

    if (formData.heading.trim().length > 255) {
      alert("Heading must be less than 255 characters");
      return;
    }

    try {
      setIsLoading(true);
      
      if (editingPostId) {
        // Update existing post
        console.log('📤 Updating post ID:', editingPostId);
        console.log('📤 Post data being sent:', formData);
        const response = await updatePost(editingPostId, formData);
        
        console.log('📥 Post update response:', response);
        if (response.success) {
          setIsModalOpen(false);
          setEditingPostId(null);
          setFormData({
            heading: "",
            matter: "",
            category: "",
            subcategory: "",
            images: "",
            isTrending: false,
            status: "draft",
          });
          alert("Post updated successfully!");
          await fetchPostsData();
        }
      } else {
        // Create new post
        console.log('📤 Creating post with data:', formData);
        const response = await addPost(formData);
        
        console.log('📥 Post creation response:', response);
        if (response.success) {
          setIsModalOpen(false);
          setFormData({
            heading: "",
            matter: "",
            category: "",
            subcategory: "",
            images: "",
            isTrending: false,
            status: "draft",
          });
          alert("Post created successfully!");
          await fetchPostsData();
        }
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert(`Failed to ${editingPostId ? "update" : "create"} post: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      setIsLoading(true);
      console.log('🗑️ Deleting post ID:', id);
      const response = await deletePost(id);
      
      console.log('📥 Delete response:', response);
      if (response.success) {
        alert("Post deleted successfully!");
        // Refresh posts from backend to ensure data persistence
        await fetchPostsData();
      }
    } catch (error) {
      console.error("❌ Error deleting post:", error);
      alert(`Failed to delete post: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = ["Heading", "Category", "Status", "Trending"];

  const tableData = posts.map((post) => ({
    heading: post.heading,
    category: post.category,
    status: post.status,
    isTrending: post.isTrending ? "Yes" : "No",
    post,
  }));

  const actions = (row) => (
    <>
      <button className="text-accent-orange hover:text-orange-600 transition-colors">
        <Edit size={18} />
      </button>
      <button
        onClick={() => {
          const post = posts.find((p) => p.id === row.post.id);
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
            disabled={isLoading}
          >
            <Plus size={20} />
            New Post
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-orange"></div>
          </div>
        )}

        {/* Table */}
        {!isLoading && (
          <div className="bg-bg-tertiary rounded-lg border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              {posts.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  No posts yet. Create your first post!
                </div>
              ) : (
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
                        <td className="px-6 py-4 text-sm text-gray-300">{post.heading}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{post.category}</td>
                        <td className="px-6 py-4 text-sm">
                          <StatusBadge status={post.status} />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {post.isTrending ? "Yes" : "No"}
                        </td>
                        <td className="px-6 py-4 text-sm flex gap-2">
                          <button 
                            onClick={() => handleEditPost(post)}
                            className="text-accent-orange hover:text-orange-600 transition-colors"
                          >
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
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        title={editingPostId ? "Edit Post" : "Add New Post"}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPostId(null);
        }}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Heading *
            </label>
            <input
              type="text"
              placeholder="Post heading"
              value={formData.heading}
              onChange={(e) =>
                setFormData({ ...formData, heading: e.target.value })
              }
              className="w-full px-4 py-2 bg-bg-secondary text-white rounded-lg border border-gray-700 focus:border-accent-orange focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Content (Matter) *
            </label>
            <textarea
              placeholder="Post content"
              value={formData.matter}
              onChange={(e) =>
                setFormData({ ...formData, matter: e.target.value })
              }
              rows="4"
              className="w-full px-4 py-2 bg-bg-secondary text-white rounded-lg border border-gray-700 focus:border-accent-orange focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <input
                type="text"
                placeholder="e.g., technology"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 bg-bg-secondary text-white rounded-lg border border-gray-700 focus:border-accent-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subcategory
              </label>
              <input
                type="text"
                placeholder="e.g., ai"
                value={formData.subcategory}
                onChange={(e) =>
                  setFormData({ ...formData, subcategory: e.target.value })
                }
                className="w-full px-4 py-2 bg-bg-secondary text-white rounded-lg border border-gray-700 focus:border-accent-orange focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Images (URL)
            </label>
            <input
              type="text"
              placeholder="Comma-separated image URLs"
              value={formData.images}
              onChange={(e) =>
                setFormData({ ...formData, images: e.target.value })
              }
              className="w-full px-4 py-2 bg-bg-secondary text-white rounded-lg border border-gray-700 focus:border-accent-orange focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-4 py-2 bg-bg-secondary text-white rounded-lg border border-gray-700 focus:border-accent-orange focus:outline-none"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Trending
              </label>
              <div className="flex items-center h-10">
                <input
                  type="checkbox"
                  checked={formData.isTrending}
                  onChange={(e) =>
                    setFormData({ ...formData, isTrending: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-700 text-accent-orange focus:ring-accent-orange"
                />
                <span className="ml-2 text-sm text-gray-300">
                  Mark as trending
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
};
