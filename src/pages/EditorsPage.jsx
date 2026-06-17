import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { MainLayout } from "../layouts/MainLayout";
import { Button, Table, Modal } from "../components";
import { editorsData } from "../data/mockData";

export const EditorsPage = () => {
  const [editors, setEditors] = useState(editorsData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "" });

  const handleAddEditor = () => {
    setFormData({ name: "", email: "", password: "", phone: "" });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (formData.name && formData.email && formData.password && formData.phone) {
      const newEditor = {
        id: editors.length + 1,
        ...formData,
      };
      setEditors([...editors, newEditor]);
      setIsModalOpen(false);
      setFormData({ name: "", email: "", password: "", phone: "" });
    }
  };

  const handleDelete = (id) => {
    setEditors(editors.filter((editor) => editor.id !== id));
  };

  const columns = ["Name", "Email", "Password", "Phone"];

  const tableData = editors.map((editor) => ({
    name: editor.name,
    email: editor.email,
    password: editor.password,
    phone: editor.phone,
  }));

  const actions = (row) => (
    <>
      <button className="text-accent-orange hover:text-orange-600 transition-colors">
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
        title="Add New Editor"
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
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-2 bg-bg-secondary text-white rounded-lg border border-gray-700 focus:border-accent-orange focus:outline-none"
          />
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
