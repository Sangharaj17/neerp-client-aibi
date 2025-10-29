// components/Common/ActionModal.js
'use client';

export default function ActionModal({ isOpen, children, onCancel }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        // FIX: Increased max-w to 5xl and 6xl to allow the invoice to occupy more screen width.
        className="bg-white w-full max-w-5xl lg:max-w-6xl rounded-xl shadow-lg p-6 animate-fadeIn overflow-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-sm text-gray-600 mb-6">{children}</div>
        <div className="flex justify-end space-x-3">
          {/* Cancel and Confirm buttons intentionally removed */}
        </div>
      </div>
    </div>
  );
}