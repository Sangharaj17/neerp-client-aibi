'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function Breadcrumb({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="flex p-4 bg-yellow-600 h-16 items-center gap-1.5 text-sm " aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} className="flex items-center gap-1.5">
            {index > 0 && (
              <ChevronRight className="w-3 h-3 text-white flex-shrink-0" />
            )}
            {isLast ? (
              <span className="text-white font-medium leading-none">{item.label}</span>
            ) : item.href ? (
              <Link
                href={item.href}
                className="text-white hover:text-gray-100 transition-colors leading-none"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-white leading-none">{item.label}</span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

