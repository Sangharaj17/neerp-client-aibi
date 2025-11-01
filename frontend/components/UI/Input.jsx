'use client';

import React from 'react';

// Minimal shadcn-like Input component styled with Tailwind
const Input = React.forwardRef(function Input({ className = '', ...props }, ref) {
  return (
    <input
      ref={ref}
      className={
        `flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm ` +
        `placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ` +
        `focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ` +
        className
      }
      {...props}
    />
  );
});

export default Input;


