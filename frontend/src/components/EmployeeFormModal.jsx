import React, { useState, useEffect } from "react";
import { X, Upload, User, Phone, Briefcase } from "lucide-react";
// import ApiService from "./services/api";

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
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check theme
  useEffect(() => {
    const checkTheme = () => {
      const hasDarkClass = document.documentElement.classList.contains("dark");
      setIsDarkMode(hasDarkClass);
    };
    checkTheme();
  }, []);

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
      setImagePreview(employee.image || null);
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
        response = await ApiService.updateEmployee(employee.id, submitData);
      } else {
        // Create employee
        response = await ApiService.createEmployee(submitData);
      }

      if (response.status === "success") {
        onSuccess(employee ? "updated" : "created");
        onClose();
      } else {
        throw new Error(response.message || "Operation failed");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setErrors({
        submit: error.message || "Terjadi kesalahan pada server",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div
          className={`inline-block w-full max-w-lg transform overflow-hidden rounded-lg text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Header */}
          <div
            className={`px-6 py-4 border-b ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {employee ? "Edit Karyawan" : "Tambah Karyawan"}
              </h3>
              <button
                onClick={onClose}
                className={`p-1 rounded-lg hover:bg-gray-100 ${
                  isDarkMode
                    ? "hover:bg-gray-700 text-gray-400"
                    : "text-gray-500"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="px-6 py-4">
            {errors.submit && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                {errors.submit}
              </div>
            )}

            {/* Image Upload */}
            <div className="mb-6">
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Foto Karyawan
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    >
                      <User
                        className={`w-8 h-8 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className={`inline-flex items-center px-3 py-2 border rounded-lg cursor-pointer ${
                      isDarkMode
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Pilih Foto
                  </label>
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="mb-4">
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Nama Lengkap *
              </label>
              <div className="relative">
                <User
                  className={`absolute left-3 top-3 w-5 h-5 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                    errors.name
                      ? "border-red-500"
                      : isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Nomor Telepon *
              </label>
              <div className="relative">
                <Phone
                  className={`absolute left-3 top-3 w-5 h-5 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                    errors.phone
                      ? "border-red-500"
                      : isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Contoh: +62 812 3456 7890"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Division */}
            <div className="mb-4">
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Divisi *
              </label>
              <div className="relative">
                <Briefcase
                  className={`absolute left-3 top-3 w-5 h-5 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <select
                  name="division"
                  value={formData.division}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                    errors.division
                      ? "border-red-500"
                      : isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
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
                <p className="mt-1 text-sm text-red-600">{errors.division}</p>
              )}
            </div>

            {/* Position */}
            <div className="mb-6">
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Posisi/Jabatan *
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.position
                    ? "border-red-500"
                    : isDarkMode
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-gray-300 bg-white text-gray-900"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Contoh: Software Engineer"
              />
              {errors.position && (
                <p className="mt-1 text-sm text-red-600">{errors.position}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 px-4 py-2 border rounded-lg font-medium ${
                  isDarkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
              >
                {isLoading ? "Menyimpan..." : employee ? "Update" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
