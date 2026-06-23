import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { MainLayout } from "../layouts/MainLayout";
import { Button, Table, Modal } from "../components";
import { getEditors, addEditor, updateEditor, deleteEditor } from "../services/api";

export const EditorsPage = () => {
  const [editors, setEditors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "" });

  // Fetch editors on component mount
  useEffect(() => {
    fetchEditorsList();
  }, []);

  const fetchEditorsList = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getEditors();
      setEditors(response.data.editors);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch editors:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEditor = () => {
    setEditingId(null);
    setFormData({ name: "", email: "", password: "", phone: "" });
    setIsModalOpen(true);
  };

  const handleEditEditor = (editor) => {
    setEditingId(editor.id);
    setFormData({
      name: editor.name,
      email: editor.email,
      password: "", // Password field typically not shown for editing
      phone: editor.phone,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (formData.name && formData.email && formData.phone) {
      try {
        if (editingId) {
          // Update existing editor
          await updateEditor(editingId, formData);
          console.log("✅ Editor updated");
        } else {
          // Add new editor
          if (!formData.password) {
            alert("Password is required for new editors");
            return;
          }
          await addEditor(formData);
          console.log("✅ Editor added");
        }
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ name: "", email: "", password: "", phone: "" });
        // Refresh editors list
        await fetchEditorsList();
      } catch (err) {
        setError(err.message);
        console.error("Failed to save editor:", err);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this editor?")) {
      try {
        await deleteEditor(id);
        console.log("✅ Editor deleted");
        // Refresh editors list after deletion
        await fetchEditorsList();
      } catch (err) {
        setError(err.message);
        console.error("Failed to delete editor:", err);
      }
    }
  };

  const columns = ["Name", "Email", "Phone"];

  const tableData = editors.map((editor) => ({
    id: editor.id,
    name: editor.name,
    email: editor.email,
    phone: editor.phone,
  }));

  const actions = (row) => (
    <>
      <button 
        onClick={() => {
          const editor = editors.find((e) => e.email === row.email);
          if (editor) handleEditEditor(editor);
        }}
        className="text-accent-orange hover:text-orange-600 transition-colors"
      >
        <Edit size={18} />
      </button>
      <button
        onClick={() => {
          const editor = editors.find((e) => e.email === row.email);
          if (editor) handleDelete(editor.id);
        }}
        className="text-red-500 hover:text-red-600 transition-colors"
      >
        <Trash2 size={18} />
      </button>
    </>
  );

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg text-gray-400">Loading editors...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg text-red-500">Error: {error}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Editors</h1>
          <Button
            variant="primary"
            onClick={handleAddEditor}
            className="gap-2"
          >
            <Plus size={20} />
            New Editor
          </Button>
        </div>

        {/* Table */}
        <div className="bg-bg-tertiary rounded-lg border border-gray-800 overflow-hidden">
          <Table columns={columns} data={tableData} actions={actions} />
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        title={editingId ? "Edit Editor" : "Add New Editor"}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 bg-bg-secondary text-white rounded-lg border border-gray-700 focus:border-accent-orange focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 bg-bg-secondary text-white rounded-lg border border-gray-700 focus:border-accent-orange focus:outline-none"
          />
          {!editingId && (
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 bg-bg-secondary text-white rounded-lg border border-gray-700 focus:border-accent-orange focus:outline-none"
            />
          )}
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2 bg-bg-secondary text-white rounded-lg border border-gray-700 focus:border-accent-orange focus:outline-none"
          />
        </div>
      </Modal>
    </MainLayout>
  );
};
