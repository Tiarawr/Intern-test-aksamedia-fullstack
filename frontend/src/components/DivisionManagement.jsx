import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Briefcase } from "lucide-react";
import { divisionsAPI } from "../../services/api";
import { useTheme } from "../contexts/ThemeContext";
import DivisionFormModal from "./DivisionFormModal";

export default function DivisionManagement() {
  const [divisions, setDivisions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const { isDark } = useTheme();

  // Fetch divisions
  const fetchDivisions = async () => {
    setIsLoading(true);
    try {
      const response = await divisionsAPI.getAll(searchTerm);
      if (response && response.status === "success") {
        setDivisions(response.data.divisions);
      }
    } catch (error) {
      console.error("Error fetching divisions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDivisions();
  }, [searchTerm]);

  const handleAddDivision = () => {
    setSelectedDivision(null);
    setShowModal(true);
  };

  const handleEditDivision = (division) => {
    setSelectedDivision(division);
    setShowModal(true);
  };

  const handleDeleteDivision = async (divisionId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus divisi ini?")) {
      try {
        const response = await divisionsAPI.delete(divisionId);
        if (response.status === "success") {
          fetchDivisions(); // Refresh list
        }
      } catch (error) {
        alert("Gagal menghapus divisi: " + error.message);
      }
    }
  };

  const handleModalSuccess = (action) => {
    const message =
      action === "created"
        ? "Divisi berhasil ditambahkan!"
        : "Divisi berhasil diperbarui!";
    alert(message);
    fetchDivisions(); // Refresh list
  };

  return (
    <div className={`p-6 ${isDark ? "text-white" : "text-gray-900"}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Manajemen Divisi</h2>
        <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Kelola divisi perusahaan
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <input
            type="text"
            placeholder="Cari divisi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all ${
              isDark
                ? "border-gray-600 bg-gray-700 text-white focus:border-blue-500"
                : "border-gray-200 bg-white text-gray-900 focus:border-blue-500"
            } focus:ring-4 focus:ring-blue-500/20 focus:outline-none`}
          />
        </div>

        {/* Add Button */}
        <button
          onClick={handleAddDivision}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Tambah Divisi
        </button>
      </div>

      {/* Division List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {divisions.length === 0 ? (
            <div
              className={`text-center py-12 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold mb-2">Belum ada divisi</p>
              <p>Tambahkan divisi pertama untuk memulai</p>
            </div>
          ) : (
            divisions.map((division) => (
              <div
                key={division.id}
                className={`p-4 rounded-xl border transition-all hover:shadow-lg ${
                  isDark
                    ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isDark ? "bg-blue-900/30" : "bg-blue-100"
                      }`}
                    >
                      <Briefcase
                        className={`w-5 h-5 ${
                          isDark ? "text-blue-400" : "text-blue-600"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{division.name}</h3>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        ID: {division.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditDivision(division)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDark
                          ? "hover:bg-gray-700 text-gray-400 hover:text-blue-400"
                          : "hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                      }`}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDivision(division.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDark
                          ? "hover:bg-gray-700 text-gray-400 hover:text-red-400"
                          : "hover:bg-gray-100 text-gray-500 hover:text-red-600"
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      <DivisionFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        division={selectedDivision}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
