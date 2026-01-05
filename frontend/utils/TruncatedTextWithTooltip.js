"use client"

import { useState } from "react";

export const TruncatedTextWithTooltip = ({
  text,
  maxLength = 30,
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!text) return <span>-</span>;

  const isLong = text.length > maxLength;
  console.log("isLong", isLong);

  const displayText = expanded
    ? text
    : isLong
      ? text.slice(0, maxLength) + "..."
      : text;

  return (
    <div className="max-w-full">
      <div
        className={`
          text-sm
          break-all
          break-words
          whitespace-normal
          overflow-hidden
          ${expanded ? "" : "line-clamp-2"}
        `}
      >
        {displayText}
      </div>

      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-xs text-blue-600 underline cursor-pointer"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
};