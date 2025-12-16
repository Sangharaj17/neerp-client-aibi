'use client';

import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Menu, X } from 'lucide-react';
import NavigationAccordion from "@/components/NavigationAccordion/NavigationAccordion";
import { useParams } from 'next/navigation';
import { getTenant } from '@/utils/tenant';

export default function DClientLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const { tenant: tenantFromParams } = useParams();
  const tenant = tenantFromParams || getTenant();

  useEffect(() => {
    if (!tenant) return;
    const clientNameKey = `${tenant}_clientName`;
    const storedClientName = localStorage.getItem(clientNameKey);
    setClientName(storedClientName || 'Client Portal');
  }, [tenant]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Mobile Top Bar */}
      <div className="md:hidden h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-30">
        <span className="font-semibold text-slate-900 truncate max-w-[200px]">
          {clientName}
        </span>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 -mr-2 text-slate-600 hover:bg-slate-100 rounded-md"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <main className="w-full flex h-[calc(100vh-3.5rem)] md:h-screen">
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200
          transition-transform duration-200 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <NavigationAccordion />
        </aside>

        <section className="flex-1 h-full overflow-y-auto">
          {/* ✅ Top-Center Toasts */}
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#171717',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e5e5',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />

          <div className="">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}
