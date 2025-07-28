import React from "react";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";

const ModalWrapper = ({
  isOpen,
  onClose,
  children,
  className = "",
  overlayClassName = "",
  preventCloseOnOverlayClick = false,
}) => {
  // Lock body scroll when modal is open
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !preventCloseOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Background overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${overlayClassName}`}
        onClick={handleOverlayClick}
      />

      {/* Modal container */}
      <div
        className={`relative w-full max-w-md transform transition-all duration-300 scale-100 my-8 ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalWrapper;
