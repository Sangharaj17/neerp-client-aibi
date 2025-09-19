
export default function ResponsiveForm({
  onSubmit,
  children,
  columns = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  gap = "gap-4",
  className = "",
}) {
  return (
    <form
      onSubmit={onSubmit}
      className={`grid ${columns} ${gap} mb-3 ${className}`}
    >
      {children}
    </form>
  );
}
