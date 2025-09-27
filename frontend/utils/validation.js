// utils/validation.js

/**
 * Decode HTML entities in a string
 */
export const decodeHtml = (str) => {
  if (!str) return "";
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
};

export const decodeHtmlEntities = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.documentElement.textContent;
};

/**
 * Check if a value is empty
 */
export const isEmpty = (value) => {
  return value === null || value === undefined || value.toString().trim() === "";
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  if (isEmpty(email)) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate phone number (example: 10 digits)
 */
export const isValidPhone = (phone) => {
  if (isEmpty(phone)) return false;
  const re = /^\d{10}$/;
  return re.test(phone);
};

/**
 * Validate number within a range
 */
export const isInRange = (value, min, max) => {
  if (isEmpty(value)) return false;
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Helper to create a decoded render function for tables
 */
export const renderDecoded = (key) => (item) => decodeHtml(item[key]);
