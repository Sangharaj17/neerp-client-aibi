"use client"
import { useState } from "react";

export const formatDateShort = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch {
        return 'Invalid Date';
    }
};

export const formatDateIN = (isoString) => {
    if (!isoString) return 'N/A';
    try {
        // Creates a Date object from the ISO string
        const date = new Date(isoString);
        // Formats the date to a localized string (e.g., "11/19/2025")
        return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
        return isoString.split('T')[0] || 'Invalid Date';
    }
}


function formatDateTime(dateStr) {
    if (!dateStr) return "";

    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;

    const day = String(date.getDate()).padStart(2, "0");
    const monthName = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day} / ${monthName} / ${year} ${hours}:${minutes}:${seconds}`;
}


// Helper function to format currency
export const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return '₹ N/A';
    return `₹ ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};


export const safeNumber = (v) => {
    const n = Number(v);
    return isNaN(n) ? 0 : n;
};


// Remove extra spaces + basic XSS sanitize
export const sanitizeText = (value = "") =>
    value
        .replace(/<[^>]*>?/gm, "")   // remove HTML tags
        .replace(/\s+/g, " ")        // collapse spaces
        .trim();

// Must contain at least one alphabet
export const hasAlphabet = (value = "") => /[a-zA-Z]/.test(value);

// Invalid if only digits or only special characters
export const isOnlyDigitsOrSpecialChars = (value = "") =>
    !hasAlphabet(value);


export const formatJobNo = (job, companyName) => {
    console.log("job", job);
    console.log("companyName", companyName);
    if (!job || !job.startDate || !companyName) return job.jobNo;

    try {
        const startYear = new Date(job.startDate).getFullYear();
        const nextYear = startYear - 1999; // as per convention or just (startYear + 1).toString().slice(-2)?
        // User requested: (startDate year-startDateNextYear)
        // Usually financial year is 2024-25. 
        // Let's assume standard YYYY-YY format or YYYY-YYYY?
        // User example: jobNo as fetcedCompanyName:job.jobId(startDate year-startDateNextYear)
        // Example: SMASH:123(2024-2025) or (2024-25)?
        // I will use full year for now as it is safer: (2024-2025)

        const nextYearFull = startYear + 1;

        // job.jobId is integer.
        // jobNo as fetchedCompanyName:job.jobId(startDate year-startDateNextYear)

        return `${companyName}:${job.jobId}(${startYear}-${nextYearFull})`;

    } catch (e) {
        console.error("Error formatting job no", e);
        return job.jobNo;
    }
};



export const TruncatedTextWithTooltip = ({
    text,
    maxLength = 30,
}) => {
    const [expanded, setExpanded] = useState(false);

    if (!text) return <span>-</span>;

    const isLong = text.length > maxLength;

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

