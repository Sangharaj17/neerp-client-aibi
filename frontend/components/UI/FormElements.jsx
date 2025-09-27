// FormSection.jsx
export function FormSection({ title, icon: Icon, children }) {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-lg">
      <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2 mb-6">
        {Icon && <Icon className="w-5 h-5 text-gray-600" />} {title}
      </h2>
      {children}
    </div>
  );
}

export function FormInput({ className = "", ...props }) {
  const value =
    props.value === undefined || props.value === null ? "" : props.value;

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
    //primary: "bg-gray-800 text-white hover:bg-gray-700",
    //secondary: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md", // active (blue)
    secondary: "border border-gray-300 text-gray-700 hover:bg-gray-100", // inactive
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700",
  };

  return (
    <button {...props} className={`${base} ${variants[variant]} ${className}`}>
      {loading ? "Saving..." : children}
    </button>
  );
}

export function FormRadioGroup({
  label,
  name,
  options,
  selected,
  onChange,
  required,
}) {
  return (
    <div className="mb-2">
      {label && (
        <label className="block text-gray-700 text-sm mb-1">{label}</label>
      )}
      <div className="flex gap-4">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="text-gray-700 text-sm flex items-center gap-1"
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={selected === opt.value}
              onChange={onChange}
              className="text-blue-500"
              required={required}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}
