import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { MainLayout } from "../layouts/MainLayout";
import { Button, Table, Modal, StatusBadge } from "../components";
import { advertisementsData } from "../data/mockData";

export const AdvertisementsPage = () => {
  const [ads, setAds] = useState(advertisementsData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", link: "", status: "Active" });

  const handleAddAd = () => {
    setFormData({ title: "", link: "", status: "Active" });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (formData.title && formData.link) {
      const newAd = {
        id: ads.length + 1,
        ...formData,
      };
      setAds([...ads, newAd]);
      setIsModalOpen(false);
      setFormData({ title: "", link: "", status: "Active" });
    }
  };

  const handleDelete = (id) => {
    setAds(ads.filter((ad) => ad.id !== id));
  };

  const columns = ["Title", "Link", "Status"];

  const tableData = ads.map((ad) => ({
    title: ad.title,
    link: ad.link,
    status: ad.status,
  }));

  const actions = (row) => (
    <>
      <button className="text-accent-orange hover:text-orange-600 transition-colors">
        <Edit size={18} />
      </button>
      <button
        onClick={() => {
          const ad = ads.find((a) => a.title === row.title);
          if (ad) handleDelete(ad.id);
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
          <h1 className="text-3xl font-bold">Advertisements</h1>
          <Button
            variant="primary"
            onClick={handleAddAd}
            className="gap-2"
          >
            <Plus size={20} />
            New Ad
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
                {ads.map((ad) => (
                  <tr
                    key={ad.id}
                    className="border-b border-gray-700 hover:bg-black/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-300">{ad.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-300 truncate max-w-xs">
                      <a href={ad.link} target="_blank" rel="noopener noreferrer" className="text-accent-orange hover:underline">
                        {ad.link}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <StatusBadge status={ad.status} />
                    </td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <button className="text-accent-orange hover:text-orange-600 transition-colors">
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(ad.id)}
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
        title="Add New Advertisement"
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
            type="url"
            placeholder="Link"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            className="w-full px-4 py-2 bg-bg-secondary text-white rounded-lg border border-gray-700 focus:border-accent-orange focus:outline-none"
          />
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2 bg-bg-secondary text-white rounded-lg border border-gray-700 focus:border-accent-orange focus:outline-none"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </Modal>
    </MainLayout>
  );
};
