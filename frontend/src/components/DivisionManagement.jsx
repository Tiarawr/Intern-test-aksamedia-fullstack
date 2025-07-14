import React, { useState, useEffect, useRef } from "react";
import { Plus, Search, Edit, Trash2, Briefcase } from "lucide-react";
import { divisionsAPI } from "../../services/api";
import { useTheme } from "../contexts/ThemeContext";
import DivisionFormModal from "./DivisionFormModal";

// Notification Component
function Notification({ show, type, title, message, onClose }) {
  return (
    <div
      className={`fixed top-20 right-4 z-50 min-w-80 px-4 py-3 rounded-lg shadow-lg border flex items-center space-x-3 transition-all duration-300 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      } ${
        type === "error"
          ? "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-700 text-red-800 dark:text-red-200"
          : "border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-700 text-green-800 dark:text-green-200"
      }`}
    >
      <div className="flex-shrink-0">
        {type === "error" ? (
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        ) : (
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </div>
      <div>
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs mt-1 opacity-90">{message}</div>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}

export default function DivisionManagement() {
  const [divisions, setDivisions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const { isDark } = useTheme();

  // Notification state
  const [notif, setNotif] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
  });
  const notifTimeout = useRef();

  // Show notification
  const showNotification = (type, title, message) => {
    setNotif({ show: true, type, title, message });
    clearTimeout(notifTimeout.current);
    notifTimeout.current = setTimeout(
      () => setNotif((n) => ({ ...n, show: false })),
      4000
    );
  };

  // Fetch divisions
  const fetchDivisions = async () => {
    setIsLoading(true);
    try {
      const response = await divisionsAPI.getAll(searchTerm);
      if (response && response.status === "success") {
        setDivisions(response.data.divisions);
      }
    } catch (error) {
      // Silent fail for divisions
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
          showNotification("success", "Berhasil", "Divisi berhasil dihapus");
          fetchDivisions(); // Refresh list
        }
      } catch (error) {
        showNotification("error", "Error", "Gagal menghapus divisi: " + error.message);
      }
    }
  };

  const handleModalSuccess = (action) => {
    const message =
      action === "created"
        ? "Divisi berhasil ditambahkan!"
        : "Divisi berhasil diperbarui!";
    showNotification("success", "Berhasil", message);
    fetchDivisions(); // Refresh list
  };

  return (
    <div className={`p-6 ${isDark ? "text-white" : "text-gray-900"}`}>
      {/* Notification */}
      <Notification
        show={notif.show}
        type={notif.type}
        title={notif.title}
        message={notif.message}
        onClose={() => setNotif((n) => ({ ...n, show: false }))}
      />

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
