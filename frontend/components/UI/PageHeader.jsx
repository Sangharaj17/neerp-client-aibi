'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const PageHeader = ({ title, description, showBack, children }) => {
  const router = useRouter();
  
  return (
    <div className="w-full bg-white border-b border-gray-200 h-14 flex items-center px-6">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {showBack && (
            <button 
              onClick={() => router.back()}
              className="p-1.5 -ml-1.5 hover:bg-neutral-100 rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-600" />
            </button>
          )}
          <div>
            <h1 className="text-sm font-medium text-neutral-800">{title}</h1>
            {description && (
              <p className="text-xs text-gray-400">{description}</p>
            )}
          </div>
        </div>
        {children && (
          <div className="flex items-center gap-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;

