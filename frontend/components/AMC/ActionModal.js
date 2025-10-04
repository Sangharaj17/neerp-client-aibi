// components/Common/ActionModal.js
'use client';

export default function ActionModal({ isOpen, title, children, onCancel }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white w-full max-w-3xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl rounded-xl shadow-lg p-6 animate-fadeIn overflow-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* {title && <h2 className="text-xl font-semibold text-gray-800 mb-3">{title}</h2>} */}
        <div className="text-sm text-gray-600 mb-6">{children}</div>
        <div className="flex justify-end space-x-3">
          {/* Cancel and Confirm buttons intentionally removed */}
        </div>
      </div>
    </div>
  );
}