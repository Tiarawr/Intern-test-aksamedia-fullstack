import React from "react";
import { X } from "lucide-react";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, employeeName }) {
  // Lock body scroll when modal is open
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Background Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg my-8">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold dark:text-white">
            Konfirmasi Hapus
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-center dark:text-gray-300">
          <p className="mb-4">
            Apakah Anda yakin ingin menghapus karyawan{" "}
            <strong>{employeeName}</strong>?
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Tidak
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
