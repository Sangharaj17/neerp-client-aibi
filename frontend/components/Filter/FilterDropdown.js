"use client";
import { useState, useRef, useEffect } from "react";
import { Filter } from "lucide-react";

export default function FilterDropdown({ columnKey, columnData, onFilter }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(new Set(columnData));
  const dropdownRef = useRef();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const uniqueValues = [...new Set(columnData)].filter(v =>
    v?.toString().toLowerCase().includes(search.toLowerCase())
  );

  const toggleValue = (value) => {
    const newSet = new Set(selected);
    if (newSet.has(value)) newSet.delete(value);
    else newSet.add(value);
    setSelected(newSet);
  };

  const handleSelectAll = () => {
    if (selected.size === uniqueValues.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(uniqueValues));
    }
  };

  const applyFilter = () => {
    onFilter(columnKey, Array.from(selected));
    setOpen(false);
  };

  const sortAZ = () => {
    onFilter(columnKey, null, "asc");
    setOpen(false);
  };

  const sortZA = () => {
    onFilter(columnKey, null, "desc");
    setOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="ml-1 text-gray-500 hover:text-black"
      >
        <Filter size={16} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-56 bg-white border border-gray-300 rounded shadow-lg p-2">
          <button
            className="w-full text-left px-2 py-1 hover:bg-gray-100 text-sm"
            onClick={sortAZ}
          >
            Sort A → Z
          </button>
          <button
            className="w-full text-left px-2 py-1 hover:bg-gray-100 text-sm"
            onClick={sortZA}
          >
            Sort Z → A
          </button>

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded w-full px-2 py-1 mt-2 mb-1 text-sm"
          />

          <label className="flex items-center px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.size === uniqueValues.length}
              onChange={handleSelectAll}
              className="mr-2"
            />
            Select All
          </label>

          <div className="max-h-40 overflow-y-auto border-t border-gray-200 mt-1">
            {uniqueValues.map((val, idx) => (
              <label
                key={idx}
                className="flex items-center px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.has(val)}
                  onChange={() => toggleValue(val)}
                  className="mr-2"
                />
                {val || "(Blank)"}
              </label>
            ))}
          </div>

          <button
            onClick={applyFilter}
            className="mt-2 w-full bg-blue-500 text-white text-sm py-1 rounded hover:bg-blue-600"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
