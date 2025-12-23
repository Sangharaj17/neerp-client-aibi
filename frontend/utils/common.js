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

