import React, { useState, useEffect } from "react";
import { X, Upload, User, Phone, Briefcase, Camera } from "lucide-react";
import { employeesAPI } from "../../services/api";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath; // Already full URL
  if (imagePath.startsWith("data:")) return imagePath; // Base64 data URL
  return `http://127.0.0.1:8000/storage/${imagePath}`;
};

export default function EmployeeFormModal({
  isOpen,
  onClose,
  employee = null,
  divisions = [],
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    division: "",
    position: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Lock body scroll when modal is open
  useBodyScrollLock(isOpen);

  // Set form data if editing
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || "",
        phone: employee.phone || "",
        division: employee.division?.id || "",
        position: employee.position || "",
        image: null,
      });
      setImagePreview(getImageUrl(employee.image) || null);
    } else {
      setFormData({
        name: "",
        phone: "",
        division: "",
        position: "",
        image: null,
      });
      setImagePreview(null);
    }
    setErrors({});
  }, [employee, isOpen]);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama wajib diisi";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Nomor telepon wajib diisi";
    } else if (!/^[\+]?[0-9\-\s]+$/.test(formData.phone)) {
      newErrors.phone = "Format nomor telepon tidak valid";
    }

    if (!formData.division) {
      newErrors.division = "Divisi wajib dipilih";
    }

    if (!formData.position.trim()) {
      newErrors.position = "Posisi wajib diisi";
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
        phone: formData.phone.trim(),
        division: formData.division,
        position: formData.position.trim(),
      };

      if (formData.image) {
        submitData.image = formData.image;
      }

      let response;
      if (employee) {
        // Update employee
        response = await employeesAPI.update(employee.id, submitData);
      } else {
        // Create employee
        response = await employeesAPI.create(submitData);
      }

      if (response.status === "success") {
        onSuccess(employee ? "updated" : "created");
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
      <div className="relative w-full max-w-md transform transition-all duration-300 scale-100 my-8 text-gray-900 dark:text-white">
        {/* Modal panel */}
        <div className="relative rounded-2xl shadow-2xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header with gradient */}
          <div className="relative px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {employee ? "Edit Karyawan" : "Tambah Karyawan"}
                </h3>
                <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
                  {employee
                    ? "Perbarui informasi karyawan"
                    : "Tambahkan karyawan baru"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form content */}
          <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
            {errors.submit && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Image Upload */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full flex items-center justify-center border-2 border-dashed transition-colors group-hover:border-blue-400 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                      <Camera className="w-8 h-8 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                  Klik untuk upload foto
                </p>
              </div>

              {/* Name Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Nama Lengkap *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.name
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 dark:border-gray-600 focus:border-blue-500"
                    } focus:ring-4 focus:ring-blue-500/20 focus:outline-none`}
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Phone Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Nomor Telepon *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.phone
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 dark:border-gray-600 focus:border-blue-500"
                    } focus:ring-4 focus:ring-blue-500/20 focus:outline-none`}
                    placeholder="+62 812 3456 7890"
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Division Select */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Divisi *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <select
                    name="division"
                    value={formData.division}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.division
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 dark:border-gray-600 focus:border-blue-500"
                    } focus:ring-4 focus:ring-blue-500/20 focus:outline-none`}
                  >
                    <option value="">Pilih Divisi</option>
                    {divisions.map((division) => (
                      <option key={division.id} value={division.id}>
                        {division.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.division && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.division}
                  </p>
                )}
              </div>

              {/* Position Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Posisi/Jabatan *
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.position
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-200 dark:border-gray-600 focus:border-blue-500"
                  } focus:ring-4 focus:ring-blue-500/20 focus:outline-none`}
                  placeholder="Software Engineer, Manager, dll"
                />
                {errors.position && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.position}
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Footer with action buttons */}
          <div className="px-6 py-4 border-t bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl font-semibold transition-all bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-gray-500/20 focus:outline-none"
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
                  <span>
                    {employee ? "Update Karyawan" : "Simpan Karyawan"}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
