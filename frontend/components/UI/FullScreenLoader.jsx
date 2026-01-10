import React from "react";

const FullScreenLoader = ({ message = "Loading Lift Details…" }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="flex flex-col items-center gap-4 bg-white/90 px-6 py-5 rounded-2xl shadow-2xl border border-blue-100">
        {/* Spinner */}
        <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />

        {/* Text */}
        <p className="text-gray-700 font-medium tracking-wide">{message}</p>
      </div>
    </div>
  );
};

export default FullScreenLoader;
