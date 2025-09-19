'use client';
import React from 'react';

export default function Checkbox({ label, name, checked, onChange }) {
  return (
    <label className="flex items-center space-x-2 mb-2">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="form-checkbox h-4 w-4 text-blue-600"
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}
