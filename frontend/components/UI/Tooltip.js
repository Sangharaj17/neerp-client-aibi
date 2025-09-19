import { useState } from "react";

export default function Tooltip({ children, message, position = "bottom" }) {
  const [visible, setVisible] = useState(false);

  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className={`absolute ${positions[position]} z-50 flex flex-col items-center`}
        >
          {/* Tooltip Box */}
          <div className="relative bg-gray-900 text-white text-xs rounded-md px-3 py-1 shadow-lg animate-fadeIn">
            {message}
            {/* Arrow */}
            <div
              className={`absolute w-2 h-2 bg-gray-900 rotate-45 ${
                position === "top"
                  ? "bottom-[-4px] left-1/2 -translate-x-1/2"
                  : position === "bottom"
                  ? "top-[-4px] left-1/2 -translate-x-1/2"
                  : position === "left"
                  ? "right-[-4px] top-1/2 -translate-y-1/2"
                  : "left-[-4px] top-1/2 -translate-y-1/2"
              }`}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
