// components/Common/ActionModal.js
'use client';

import { X } from 'lucide-react';

export default function ActionModal({ isOpen, children, onCancel, title }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        // FIX: Increased max-w to 5xl and 6xl to allow the invoice to occupy more screen width.
        className="bg-white w-full max-w-5xl lg:max-w-6xl rounded-xl shadow-lg p-6 animate-fadeIn overflow-auto max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Optional Title */}
        {title && (
          <h2 className="text-xl font-medium text-black mb-4 pr-8">{title}</h2>
        )}

        <div className="text-sm text-gray-600 mb-6">{children}</div>
        <div className="flex justify-end space-x-3">
          {/* Cancel and Confirm buttons intentionally removed */}
        </div>
      </div>
    </div>
  );
}