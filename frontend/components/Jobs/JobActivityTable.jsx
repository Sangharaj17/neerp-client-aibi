import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Search } from "lucide-react";

const JobActivityTable = ({
  jobActivities,
  formatDateShort,
  renderTruncatedText,
  openPhotoGallery,
  setPreviewUrl,
  exportSingleActivityPDF,
  handleSendMail,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "jobActivityId",
    direction: "asc",
  });

  // PDF Loading State
  const [pdfLoadingActivityId, setPdfLoadingActivityId] = useState(null);

  const handlePdfExport = async (activity) => {
    try {
      setPdfLoadingActivityId(activity.jobActivityId);
      await exportSingleActivityPDF(activity);
    } catch (error) {
      console.error("PDF generation failed", error);
    } finally {
      setPdfLoadingActivityId(null);
    }
  };

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const fileUrl = `${API_BASE_URL}/api/job-activities/files/`;

  // Sortable columns (excluding action columns)
  const sortableColumns = [
    { key: "jobActivityId", label: "Sr.No" },
    { key: "createdAt", label: "Date" },
    { key: "jobActivityByName", label: "Activity By" },
    { key: "activityType", label: "Activity Type" },
    { key: "activityTitle", label: "Activity Title" },
    { key: "activityDescription", label: "Description" },
    { key: "remark", label: "Remark" },
  ];

  // Non-sortable action columns
  const actionColumns = ["Document", "Signature", "Pdf", "Send Mail"];

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  // Filter and sort data
  const filteredAndSortedActivities = useMemo(() => {
    if (!jobActivities || jobActivities.length === 0) return [];

    // Filter by search query
    let filtered = jobActivities.filter((activity) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        (activity.jobActivityByName?.toLowerCase() || "").includes(
          searchLower
        ) ||
        (activity.activityType?.toLowerCase() || "").includes(searchLower) ||
        (activity.activityTitle?.toLowerCase() || "").includes(searchLower) ||
        (activity.activityDescription?.toLowerCase() || "").includes(
          searchLower
        ) ||
        (activity.remark?.toLowerCase() || "").includes(searchLower) ||
        formatDateShort(activity.createdAt)?.toLowerCase().includes(searchLower)
      );
    });

    // Sort data
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle null/undefined values
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        // Handle date sorting
        if (sortConfig.key === "createdAt") {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }

        // Handle string comparison (case-insensitive)
        if (typeof aValue === "string" && typeof bValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [jobActivities, searchQuery, sortConfig]);

  // Render sort icon
  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return (
        <div className="inline-flex flex-col ml-1 opacity-30">
          <ChevronUp className="w-3 h-3 -mb-1" />
          <ChevronDown className="w-3 h-3" />
        </div>
      );
    }

    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4 inline ml-1 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1 text-blue-600" />
    );
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header with Title and Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
          <h2 className="text-lg font-semibold text-blue-600">
            Job Activity Details
            {searchQuery && (
              <span className="text-sm text-gray-500 ml-2">
                ({filteredAndSortedActivities.length} of{" "}
                {jobActivities?.length || 0} activities)
              </span>
            )}
          </h2>

          {/* Results Summary */}
          {filteredAndSortedActivities.length > 0 && (
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-12 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {filteredAndSortedActivities.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {jobActivities?.length || 0}
                </span>{" "}
                activities
                {searchQuery && (
                  <span className="text-gray-500 ml-1">
                    (filtered by: "{searchQuery}")
                  </span>
                )}
              </div>

              {/* Sort Info */}
              <div className="text-sm text-gray-600">
                Sorted by:{" "}
                <span className="font-semibold text-gray-900">
                  {
                    sortableColumns.find((col) => col.key === sortConfig.key)
                      ?.label
                  }
                </span>
                <span className="text-gray-500 ml-1">
                  (
                  {sortConfig.direction === "asc"
                    ? "↑ Ascending"
                    : "↓ Descending"}
                  )
                </span>
              </div>
            </div>
          )}

          {/* Search Box */}
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="🔍 Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Table Container with Fixed Height and Scroll */}
        <div className="border border-gray-300 rounded-lg shadow-sm overflow-hidden">
          {/* ✅ Added: Fixed height container with overflow */}
          <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
            <table className="min-w-full border-collapse bg-white">
              {/* ✅ Added: Sticky header */}
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10 shadow-sm">
                <tr>
                  {/* Sortable Columns */}
                  {sortableColumns.map((column) => (
                    <th
                      key={column.key}
                      onClick={() => handleSort(column.key)}
                      className="px-4 py-3 border border-gray-300 text-sm font-semibold text-left cursor-pointer hover:bg-gray-200 transition-colors select-none group bg-gray-100"
                      title={`Sort by ${column.label}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="group-hover:text-blue-600 transition-colors">
                          {column.label}
                        </span>
                        <SortIcon columnKey={column.key} />
                      </div>
                    </th>
                  ))}

                  {/* Non-sortable Action Columns */}
                  {actionColumns.map((column) => (
                    <th
                      key={column}
                      className="px-4 py-3 border border-gray-300 text-sm font-semibold text-center bg-gray-100"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedActivities.length > 0 ? (
                  filteredAndSortedActivities.map((activity, idx) => (
                    <tr
                      key={activity.jobActivityId}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      {/* Sr.No */}
                      <td className="px-4 py-3 border border-gray-300 text-sm font-medium text-gray-900">
                        {activity.jobActivityId}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 border border-gray-300 text-sm text-gray-700 whitespace-nowrap">
                        {formatDateShort(activity.createdAt)}
                      </td>

                      {/* Activity By */}
                      <td className="px-4 py-3 border border-gray-300 text-sm text-gray-700">
                        {activity.jobActivityByName}
                      </td>

                      {/* Activity Type */}
                      <td className="px-4 py-3 border border-gray-300 text-sm">
                        <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                          {activity.jobActivityTypeName}
                        </span>
                      </td>

                      {/* Activity Title */}
                      <td className="px-4 py-3 border border-gray-300 text-sm text-gray-700">
                        {renderTruncatedText(
                          activity.activityTitle,
                          "Activity Title"
                        )}
                      </td>

                      {/* Description */}
                      <td className="px-4 py-3 border border-gray-300 text-sm text-gray-600">
                        {renderTruncatedText(
                          activity.activityDescription,
                          "Activity Description"
                        )}
                      </td>

                      {/* Remark */}
                      <td className="px-4 py-3 border border-gray-300 text-sm text-gray-600">
                        {renderTruncatedText(activity.remark, "Remark")}
                      </td>

                      {/* Document (Gallery) */}
                      <td className="px-4 py-3 border border-gray-300 text-center">
                        <button
                          onClick={() => openPhotoGallery(activity.photos)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline transition"
                        >
                          {activity.photos?.length > 0 ? (
                            <span className="flex items-center justify-center gap-1">
                              📷 Gallery ({activity.photos.length})
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </button>
                      </td>

                      {/* Signature */}
                      <td className="px-4 py-3 border border-gray-300 text-center">
                        {activity.signatureUrl ? (
                          <button
                            // onClick={() => setPreviewUrl(activity.signatureUrl)}
                            onClick={() =>
                              setPreviewUrl(fileUrl + activity.signatureUrl)
                            }
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-blue-100 transition"
                            title="View Signature"
                          >
                            <svg
                              className="w-5 h-5 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>

                      {/* PDF */}
                      <td className="px-4 py-3 border border-gray-300 text-center">
                        <button
                          onClick={() => handlePdfExport(activity)}
                          disabled={
                            pdfLoadingActivityId === activity.jobActivityId
                          }
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Generate Activity PDF"
                        >
                          {pdfLoadingActivityId === activity.jobActivityId ? (
                            <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <svg
                              className="w-5 h-5 text-red-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                          )}
                        </button>
                      </td>

                      {/* Send Mail */}
                      <td className="px-4 py-3 border border-gray-300 text-center">
                        <div className="flex flex-col items-center gap-1">
                          {activity.mailSent && (
                            <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                              ✓ Sent
                            </span>
                          )}
                          <button
                            onClick={() =>
                              handleSendMail(activity.jobActivityId)
                            }
                            className="text-blue-600 hover:text-white hover:bg-blue-600 text-xs font-semibold px-3 py-1.5 border border-blue-600 rounded-lg transition-all shadow-sm hover:shadow-md"
                            title="Send email to customer"
                          >
                            {activity.mailSent ? "Resend" : "Send Mail"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-gray-500 font-medium">
                            {searchQuery
                              ? "No activities found matching your search"
                              : "No activities found"}
                          </p>
                          {searchQuery && (
                            <button
                              onClick={() => setSearchQuery("")}
                              className="text-blue-600 hover:underline text-sm mt-2"
                            >
                              Clear search
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobActivityTable;
