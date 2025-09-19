
export function FormInput({ className = "", ...props }) {
  const value = props.value === undefined || props.value === null ? "" : props.value;

  return (
    <input
      {...props}
      value={value}
      className={`border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none w-full ${className}`}
    />
  );
}

export function FormSelect({ className = "", children, ...props }) {
  const value = props.value === null ? "" : props.value;
  return (
    <select
      {...props}
      value={value}
      className={`border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none w-full ${className}`}
    >
      {children}
    </select>
  );
}

export function FormButton({
  children,
  loading,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "px-6 py-2 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed w-auto inline-block";
  const variants = {
    primary: "bg-gray-800 text-white hover:bg-gray-700",
    secondary: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700",
  };

  return (
    <button
      {...props}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading ? "Saving..." : children}
    </button>
  );
}
