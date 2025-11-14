'use client';

import { Toaster } from 'react-hot-toast';
import NavigationAccordion from "@/components/NavigationAccordion/NavigationAccordion";
import Topbar from "@/components/Topbar/Topbar";

export default function DClientLayout({ children }) {
  return (
    <div className="min-h-screen">
      <main className="w-full flex h-screen">
        <aside className="w-64 sticky top-0 self-start">
          <NavigationAccordion />
        </aside>
        <section className="flex-1 h-screen overflow-y-auto">
          <Topbar />

          {/* ✅ Top-Center Toasts */}
          <Toaster position="top-center" reverseOrder={false} />

          <div className="">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}
