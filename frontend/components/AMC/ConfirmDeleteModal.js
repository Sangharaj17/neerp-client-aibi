'use client';

export default function ConfirmDeleteModal({ isOpen, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onCancel} // Click outside = cancel
    >
      <div
        className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 animate-fadeIn"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Confirm Deletion
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete this enquiry? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
