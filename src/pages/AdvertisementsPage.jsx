import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { MainLayout } from "../layouts/MainLayout";
import { Button, Modal, StatusBadge } from "../components";
import {
  getAdvertisements,
  addAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
} from "../services/api";

export const AdvertisementsPage = () => {
  const [ads, setAds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingAdId, setEditingAdId] = useState(null);
  const [formData, setFormData] = useState({ title: "", link: "", image: "", status: "Active" });

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      setIsLoading(true);
      const response = await getAdvertisements();

      let adsArray = [];
      if (response?.success) {
        if (Array.isArray(response.data)) {
          adsArray = response.data;
        } else if (Array.isArray(response.data?.advertisements)) {
          adsArray = response.data.advertisements;
        } else if (Array.isArray(response.data?.items)) {
          adsArray = response.data.items;
        }
      } else if (Array.isArray(response)) {
        adsArray = response;
      }

      setAds(adsArray || []);
    } catch (error) {
      console.error("❌ Error fetching advertisements:", error);
      setAds([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAd = () => {
    setEditingAdId(null);
    setFormData({ title: "", link: "", status: "Active" });
    setIsModalOpen(true);
  };

  const handleEditAd = (ad) => {
    setEditingAdId(ad.id);
    setFormData({
      title: ad.title || "",
      link: ad.link || "",
      image: ad.image || "",
      status: ad.status || "Active",
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ title: "", link: "", image: "", status: "Active" });
    setEditingAdId(null);
  };

  const handleSubmit = async () => {
    if (!formData.title?.trim()) {
      alert("Title is required");
      return;
    }

    if (!formData.link?.trim()) {
      alert("Link is required");
      return;
    }

    try {
      setIsLoading(true);
      if (editingAdId) {
        const response = await updateAdvertisement(editingAdId, formData);
        if (response?.success) {
          await fetchAdvertisements();
          setIsModalOpen(false);
          resetForm();
          alert("Advertisement updated successfully.");
        }
      } else {
        const response = await addAdvertisement(formData);
        if (response?.success) {
          await fetchAdvertisements();
          setIsModalOpen(false);
          resetForm();
          alert("Advertisement created successfully.");
        }
      }
    } catch (error) {
      console.error("❌ Advertisement submit error:", error);
      alert(`Failed to ${editingAdId ? "update" : "create"} advertisement: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this advertisement?")) return;

    try {
      setIsLoading(true);
      const response = await deleteAdvertisement(id);
      if (response?.success) {
        await fetchAdvertisements();
        alert("Advertisement deleted successfully.");
      }
    } catch (error) {
      console.error("❌ Advertisement delete error:", error);
      alert(`Failed to delete advertisement: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = ["Title", "Link", "Status"];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Advertisements</h1>
          <Button variant="primary" onClick={handleAddAd} className="gap-2" disabled={isLoading}>
            <Plus size={20} />
            New Ad
          </Button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-orange"></div>
          </div>
        )}

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
                {ads.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                      No advertisements found.
                    </td>
                  </tr>
                ) : (
                  ads.map((ad) => (
                    <tr key={ad.id} className="border-b border-gray-700 hover:bg-black/30 transition-colors">
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
                        <button onClick={() => handleEditAd(ad)} className="text-accent-orange hover:text-orange-600 transition-colors">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(ad.id)} className="text-red-500 hover:text-red-600 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

+      <Modal isOpen={isModalOpen} title={editingAdId ? "Edit Advertisement" : "Add New Advertisement"} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit}>
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
          <input
            type="url"
            placeholder="Image URL"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
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
