import toast from "react-hot-toast";

/**
 * Prompts a confirmation toast for deletion with "Yes" and "Cancel".
 * Executes the deletion callback only if user confirms.
 * @param {string} itemName - Name to show in the message (e.g. "Landing Door Type")
 * @param {Function} onConfirm - Callback to execute on confirmation
 */
export const confirmDeleteWithToast = (itemName, onConfirm) => {
  toast(
    (t) => (
      <div className="flex flex-col gap-2 text-sm">
        <span>Are you sure you want to delete <b>{itemName}</b>?</span>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-300 rounded text-xs hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    { duration: 3000 }
  );
};
