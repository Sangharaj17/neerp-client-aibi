import { useState, useMemo } from "react";
import { Pencil, Trash2, ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import classNames from "classnames";

const ReusableTable = ({
  title,
  columns,
  data,
  loading = false, // ✅ default to false
  onEdit,
  onDelete,
  searchTerm,
  onSearchChange,
  height = "auto",
  pageSize = 10,
  combineActions = true,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // const filteredData = useMemo(() => {
  //   return data.filter((item) =>
  //     item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  // }, [data, searchTerm]);

  const filteredData = useMemo(() => {
    const term = (searchTerm || "").toLowerCase();
    return data.filter((row) =>
      columns.some((col) =>
        String(row[col.key] ?? "")
          .toLowerCase()
          .includes(term)
      )
    );
  }, [data, searchTerm, columns]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleSort = (key) => {
    if (sortConfig.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>

      <div
        className="overflow-auto border border-gray-200 rounded-md"
        style={{ maxHeight: height || "400px" }}
      >
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-100 shadow z-10 text-gray-700">
            <tr>
              <th
                key="id-header"
                className="px-4 py-2 border border-gray-200 text-left bg-gray-100 text-gray-700"
              >
                ID
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-2 border border-gray-200 bg-gray-100 text-gray-700 ${col.align || "text-left"} ${
                    col.sortable ? "cursor-pointer select-none" : ""
                  }`}
                  onClick={() => col.sortable && toggleSort(col.key)}
                >
                  <div className="flex items-center justify-between items-center w-full">
                    <span>{col.label}</span>
                    {col.sortable && (
                      // <span className="ml-1 text-gray-400">
                      //   {sortConfig?.key === col.key
                      //     ? sortConfig.direction === "asc"
                      //       ? "🔼"
                      //       : "🔽"
                      //     : // Show default "unsorted" icon
                      //       "🔼"}
                      // </span>
                      <span className="ml-1">
                        {sortConfig?.key === col.key ? (
                          sortConfig.direction === "asc" ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )
                        ) : (
                          <ChevronUp size={14} className="opacity-90" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}

              {(onEdit || onDelete) &&
                (combineActions ? (
                  <th
                    key="actions-header"
                    className="px-4 py-2 border border-gray-200 text-center bg-gray-100 text-gray-700"
                  >
                    Actions
                  </th>
                ) : (
                  <>
                    {onEdit && (
                      <th
                        key="edit-header"
                        className="px-4 py-2 border border-gray-200 text-center bg-gray-100 text-gray-700"
                      >
                        Edit
                      </th>
                    )}
                    {onDelete && (
                      <th
                        key="delete-header"
                        className="px-4 py-2 border border-gray-200 text-center bg-gray-100 text-gray-700"
                      >
                        Delete
                      </th>
                    )}
                  </>
                ))}
            </tr>
          </thead>
          
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (onEdit || onDelete ? (combineActions ? 1 : 2) : 0) +
                    1
                  }
                  className="p-6 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Loader2 className="animate-spin h-5 w-5 text-blue-600" />
                    <span>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item, idx) => (
                <tr
                  key={`${item.id}-${idx}`}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td
                    key={`id-${item.id ?? idx}`}
                    className="px-4 py-2 border border-gray-200"
                  >
                    {(currentPage - 1) * pageSize + idx + 1}
                  </td>
                  {columns.map((col) => (
                    <td
                      key={`col-${col.key}-${item.id ?? idx}`}
                      className={classNames(
                        "px-4 py-2 border border-gray-200",
                        col.align || "text-left"
                      )}
                    >
                      {/* {item[col.key]} */}
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}

                  {(onEdit || onDelete) &&
                    (combineActions ? (
                      <td
                        key={`actions-${item.id ?? idx}`}
                        className="px-4 py-2 border border-gray-200 text-center space-x-2"
                      >
                        {onEdit && (
                          <button onClick={() => onEdit(item)}>
                            <Pencil
                              size={16}
                              className="text-blue-500 hover:text-blue-700"
                            />
                          </button>
                        )}
                        {onDelete && (
                          <button onClick={() => onDelete(item.id)}>
                            <Trash2
                              size={16}
                              className="text-red-400 hover:text-red-700"
                            />
                          </button>
                        )}
                      </td>
                    ) : (
                      <>
                        {onEdit && (
                          <td
                            key={`edit-${item.id ?? idx}`}
                            className="px-4 py-2 border border-gray-200 text-center"
                          >
                            <button onClick={() => onEdit(item)}>
                              <Pencil
                                size={16}
                                className="text-blue-500 hover:text-blue-700"
                              />
                            </button>
                          </td>
                        )}
                        {onDelete && (
                          <td
                            key={`delete-${item.id ?? idx}`}
                            className="px-4 py-2 border border-gray-200 text-center"
                          >
                            <button onClick={() => onDelete(item.id)}>
                              <Trash2
                                size={16}
                                className="text-red-400 hover:text-red-700"
                              />
                            </button>
                          </td>
                        )}
                      </>
                    ))}
                </tr>
              ))
            ) : (
              <tr key="no-data">
                <td
                  colSpan={columns.length + (combineActions ? 2 : 3)}
                  className="p-4 text-center text-gray-500"
                >
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
          {/* <tbody>
            {
            paginatedData.length > 0 ? (
              paginatedData.map((item, idx) => (
                <tr
                  key={`${item.id}-${idx}`}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td
                    key={`id-${item.id ?? idx}`}
                    className="px-4 py-2 border border-gray-200"
                  >
                    {(currentPage - 1) * pageSize + idx + 1}
                  </td>
                  {columns.map((col) => (
                    <td
                      key={`col-${col.key}-${item.id ?? idx}`}
                      className={classNames(
                        "px-4 py-2 border border-gray-200",
                        col.align || "text-left"
                      )}
                    >
                      {item[col.key]}
                    </td>
                  ))}

                  {(onEdit || onDelete) &&
                    (combineActions ? (
                      <td
                        key={`actions-${item.id ?? idx}`}
                        className="px-4 py-2 border border-gray-200 text-center space-x-2"
                      >
                        {onEdit && (
                          <button onClick={() => onEdit(item)}>
                            <Pencil
                              size={16}
                              className="text-blue-500 hover:text-blue-700"
                            />
                          </button>
                        )}
                        {onDelete && (
                          <button onClick={() => onDelete(item.id)}>
                            <Trash2
                              size={16}
                              className="text-red-400 hover:text-red-700"
                            />
                          </button>
                        )}
                      </td>
                    ) : (
                      <>
                        {onEdit && (
                          <td
                            key={`edit-${item.id ?? idx}`}
                            className="px-4 py-2 border border-gray-200 text-center"
                          >
                            <button onClick={() => onEdit(item)}>
                              <Pencil
                                size={16}
                                className="text-blue-500 hover:text-blue-700"
                              />
                            </button>
                          </td>
                        )}
                        {onDelete && (
                          <td
                            key={`delete-${item.id ?? idx}`}
                            className="px-4 py-2 border border-gray-200 text-center"
                          >
                            <button onClick={() => onDelete(item.id)}>
                              <Trash2
                                size={16}
                                className="text-red-400 hover:text-red-700"
                              />
                            </button>
                          </td>
                        )}
                      </>
                    ))}
                </tr>
              ))
            ) : (
              <tr key="no-data">
                <td
                  colSpan={columns.length + (combineActions ? 2 : 3)}
                  className="p-4 text-center text-gray-500"
                >
                  No data found.
                </td>
              </tr>
            )}
          </tbody> */}
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReusableTable;
