import React, { useState, useEffect } from "react";
import { X, Briefcase } from "lucide-react";
import { divisionsAPI } from "../../services/api";
import { useTheme } from "../contexts/ThemeContext";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";

export default function DivisionFormModal({
  isOpen,
  onClose,
  division = null,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { isDark } = useTheme();

  // Lock body scroll when modal is open
  useBodyScrollLock(isOpen);

  // Set form data if editing
  useEffect(() => {
    if (division) {
      setFormData({
        name: division.name || "",
      });
    } else {
      setFormData({
        name: "",
      });
    }
    setErrors({});
  }, [division, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama divisi wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const submitData = {
        name: formData.name.trim(),
      };

      let response;
      if (division) {
        // Update division
        response = await divisionsAPI.update(division.id, submitData);
      } else {
        // Create division
        response = await divisionsAPI.create(submitData);
      }

      if (response.status === "success") {
        onSuccess(division ? "updated" : "created");
        onClose();
      } else {
        throw new Error(response.message || "Operation failed");
      }
    } catch (error) {
      setErrors({
        submit: error.message || "Terjadi kesalahan pada server",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Background overlay with blur effect */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal container */}
      <div
        className={`relative w-full max-w-md transform transition-all duration-300 scale-100 my-8 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        {/* Modal panel */}
        <div
          className={`relative rounded-2xl shadow-2xl border ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          } overflow-hidden`}
        >
          {/* Header with gradient */}
          <div
            className={`relative px-6 py-5 ${
              isDark
                ? "bg-gradient-to-r from-gray-800 to-gray-700"
                : "bg-gradient-to-r from-blue-50 to-indigo-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {division ? "Edit Divisi" : "Tambah Divisi"}
                </h3>
                <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
                  {division
                    ? "Perbarui informasi divisi"
                    : "Tambahkan divisi baru"}
                </p>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-full transition-colors ${
                  isDark
                    ? "hover:bg-gray-600 text-gray-300 hover:text-white"
                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form content */}
          <div className="px-6 py-6">
            {errors.submit && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input */}
              <div className="space-y-2">
                <label
                  className={`block text-sm font-semibold ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Nama Divisi *
                </label>
                <div className="relative">
                  <Briefcase
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all ${
                      errors.name
                        ? "border-red-400 focus:border-red-500"
                        : isDark
                        ? "border-gray-600 bg-gray-700 text-white focus:border-blue-500"
                        : "border-gray-200 bg-white text-gray-900 focus:border-blue-500"
                    } focus:ring-4 focus:ring-blue-500/20 focus:outline-none`}
                    placeholder="Masukkan nama divisi"
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.name}
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Footer with action buttons */}
          <div
            className={`px-6 py-4 border-t ${
              isDark
                ? "bg-gray-800/50 border-gray-700"
                : "bg-gray-50/50 border-gray-200"
            }`}
          >
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                  isDark
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                } focus:ring-4 focus:ring-gray-500/20 focus:outline-none`}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                } text-white focus:ring-4 focus:ring-blue-500/30 focus:outline-none shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-lg`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Menyimpan...
                  </div>
                ) : (
                  <span>{division ? "Update Divisi" : "Simpan Divisi"}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
