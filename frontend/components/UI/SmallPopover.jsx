import { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";

const SmallPopover = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ left: 0, top: 0 });
  const [position, setPosition] = useState("bottom"); // 'top' or 'bottom'
  const ref = useRef(null);
  const popoverRef = useRef(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate position only when open
  useEffect(() => {
    if (open && ref.current && popoverRef.current) {
      const rect = ref.current.getBoundingClientRect();
      const popRect = popoverRef.current.getBoundingClientRect();

      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      setPosition(spaceBelow < popRect.height && spaceAbove > popRect.height ? "top" : "bottom");

      setCoords({
        left: rect.left + rect.width / 2,
        top: spaceBelow < popRect.height && spaceAbove > popRect.height
          ? rect.top - popRect.height - 8
          : rect.bottom + 8
      });
    }
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="text-blue-600 hover:text-blue-800 transition-transform duration-150 hover:scale-110"
      >
        <Info size={16} />
      </button>
      {/* <div 
        ref={popoverRef} 
        className={absolute z-50 w-80 sm:w-96 p-4 bg-white border rounded-lg shadow-xl transition-all duration-300 ease-in-out transform origin-top ${ 
          open ? position === "top" 
            ? "opacity-100 translate-y-0 bottom-full mb-2 animate-slide-down-fade" 
            : "opacity-100 translate-y-0 top-full mt-2 animate-slide-up-fade" : "opacity-0 scale-95 pointer-events-none" 
          } 
          left-1/2 -translate-x-1/2
        } 
          style={{ maxWidth: "90vw" }} 
        > */}
      <div
        ref={popoverRef}
        className={`fixed z-50 w-80 sm:w-96 p-4 bg-white border rounded-lg shadow-xl transition-all duration-300 ease-in-out transform origin-top ${
          open
            ? position === "top"
              ? "opacity-100 translate-y-0 animate-slide-down-fade"
              : "opacity-100 translate-y-0 animate-slide-up-fade"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{
          left: coords.left - 160, // half popover width
          top: coords.top,
          maxWidth: "90vw"
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default SmallPopover;
