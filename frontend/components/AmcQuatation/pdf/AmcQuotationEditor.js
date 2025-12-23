"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { pdfFirstPageToImage } from "./pdfUtils";

export default function AmcQuotationEditor() {
  const [data, setData] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [headingId, setHeadingId] = useState(null);
  const [activeTab, setActiveTab] = useState("AMC"); // Default active tab

  // Local state for the CSS DTO
  const [styleDto, setStyleDto] = useState({
    paddingTop: "",
    paddingBottom: "",
    amcQuotationPdfHeadingsId: headingId,
  });

  // Fetch existing styles from Backend using heading.id
  useEffect(() => {
    const fetchStyles = async () => {
      if (headingId) {
        try {
          const res = await axiosInstance.get(`/api/css-styles/by-heading/${headingId}`);
          if (res.data) {
            setStyleDto(res.data);
          }
        } catch (err) {
          // Style fetch failed
        }
      }
    };

    fetchStyles();
  }, [headingId]);

  // Save Styles via PUT
  const handleSaveStyles = async () => {
    if (!headingId) {
      alert("Cannot save styles: Heading ID is missing.");
      return;
    }

    try {
      const payload = {
        ...styleDto,
        amcQuotationPdfHeadingsId: headingId,
      };

      const res = await axiosInstance.put(`/api/css-styles/by-heading/${headingId}`, payload);
      setStyleDto(res.data);
      alert("Layout saved!");
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  // Load data from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get("/api/amc/quotation/pdf/headings-with-contents");
      setData(res.data);
      
      // Set the first available quotationType as active tab
      if (res.data.length > 0) {
        const types = [...new Set(res.data.map(h => h.quotationType))];
        if (types.length > 0) {
          setActiveTab(types[0]);
        }
      }
    } catch (err) {
      console.error("Error loading data", err);
    }
  };

  // Toggle heading expand
  const toggleHeading = (index, headingId, headingName) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
    setHeadingId(headingId);
  };

  // Edit content input
  const handleContentChange = (headingIndex, contentIndex, value) => {
    const updated = [...data];
    updated[headingIndex].contents[contentIndex].contentData = value;
    setData(updated);
  };

  // Add new Content
  const addContent = (headingIndex) => {
    const updated = [...data];
    updated[headingIndex].contents.push({
      id: null,
      contentData: "",
      picture: null,
      headingId: updated[headingIndex].id,
    });
    setData(updated);
  };

  // Delete Content
  const deleteContent = (headingIndex, contentIndex) => {
    const updated = [...data];
    updated[headingIndex].contents.splice(contentIndex, 1);
    setData(updated);
  };

  // Save all
  const saveAll = async () => {
    setIsSaving(true);
    try {
      await axiosInstance.post("/api/amc/quotation/pdf/update-all", data);
      alert("Updated Successfully");
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving data");
    }
    setIsSaving(false);
  };

  // Group headings by quotationType
  const groupedData = data.reduce((acc, heading) => {
    const type = heading.quotationType || "Other";
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(heading);
    return acc;
  }, {});

  // Get all quotation types for tabs
  const quotationTypes = Object.keys(groupedData).sort();

  // Get filtered data for active tab
  const filteredData = groupedData[activeTab] || [];

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      <h2 style={{ fontWeight: 800, marginBottom: "30px" }}>AMC Quotation Editor</h2>

      {/* Tabs Navigation */}
      <div style={{ 
        display: "flex", 
        gap: "10px", 
        borderBottom: "2px solid #e5e7eb",
        marginBottom: "30px",
        flexWrap: "wrap"
      }}>
        {quotationTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            style={{
              padding: "12px 24px",
              fontSize: "15px",
              fontWeight: "600",
              border: "none",
              borderBottom: activeTab === type ? "3px solid #007bff" : "3px solid transparent",
              background: activeTab === type ? "#f0f9ff" : "transparent",
              color: activeTab === type ? "#007bff" : "#6b7280",
              cursor: "pointer",
              transition: "all 0.2s",
              borderRadius: "4px 4px 0 0",
            }}
          >
            {type}
            <span style={{ 
              marginLeft: "8px", 
              fontSize: "12px",
              background: activeTab === type ? "#007bff" : "#9ca3af",
              color: "white",
              padding: "2px 8px",
              borderRadius: "10px"
            }}>
              {groupedData[type]?.length || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {filteredData.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#9ca3af",
            fontSize: "16px"
          }}>
            No headings found for {activeTab}
          </div>
        ) : (
          filteredData.map((heading, hIndex) => {
            // Find the original index in the full data array
            const originalIndex = data.findIndex(h => h.id === heading.id);
            
            return (
              <div
                key={heading.id}
                style={{
                  marginBottom: "20px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  padding: "15px",
                  background: "#fff",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}
              >
                {/* Heading */}
                <div
                  onClick={() => toggleHeading(originalIndex, heading.id, heading.headingName)}
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    cursor: "pointer",
                    paddingBottom: "12px",
                    borderBottom: "1px solid #e5e7eb",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <span>{heading.headingName}</span>
                  <span style={{ 
                    fontSize: "14px", 
                    color: "#6b7280",
                    transform: expanded[originalIndex] ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s"
                  }}>
                    ▼
                  </span>
                </div>

                {/* Content Section */}
                {expanded[originalIndex] && (
                  <div style={{ marginTop: "15px", paddingLeft: "10px" }}>
                    {heading.headingName === "THIS IS FIXED FIRST PAGE" ||
                    heading.headingName === "MAIN CONTENT BACKGROUND PAGE" ||
                    heading.headingName === "THIS IS FIXED LAST PAGE" ? (
                      <>
                        {/* FIRST OR LAST PAGE UI */}
                        {heading.headingName === "THIS IS FIXED FIRST PAGE" ||
                        heading.headingName === "THIS IS FIXED LAST PAGE" ? (
                          <div
                            className="flex flex-col items-center py-4"
                            style={{ borderBottom: "1px solid #ddd" }}
                          >
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              {heading.headingName === "THIS IS FIXED FIRST PAGE"
                                ? "Upload First Page Image"
                                : "Upload Last Page Image"}
                            </label>

                            {(() => {
                              if (!heading.contents || heading.contents.length === 0) {
                                heading.contents = [{ picture: null }];
                              }
                            })()}

                            {heading.contents[0]?.picture ? (
                              <div className="flex flex-col items-center">
                                <img
                                  src={heading.contents[0].picture}
                                  className="w-32 h-32 object-contain border border-gray-300 rounded-md mb-3"
                                  alt="Preview"
                                />
                                <button
                                  onClick={() => {
                                    const updated = [...data];
                                    updated[originalIndex].contents[0].picture = null;
                                    setData(updated);
                                  }}
                                  className="bg-red-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-600"
                                >
                                  Delete Image
                                </button>
                              </div>
                            ) : (
                              <div className="w-32 h-32 flex items-center justify-center border border-gray-300 rounded-md mb-3 text-gray-400">
                                No Image
                              </div>
                            )}

                            <div className="flex gap-3 items-center flex-wrap">
                              <label className="cursor-pointer">
                                <span className="inline-block py-2 px-4 rounded-md bg-blue-50 text-blue-700 text-sm hover:bg-blue-100">
                                  Upload Image
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                      const updated = [...data];
                                      updated[originalIndex].contents[0] = { picture: reader.result };
                                      setData(updated);
                                    };
                                    reader.readAsDataURL(file);
                                    e.target.value = "";
                                  }}
                                />
                              </label>
                              <label className="cursor-pointer">
                                <span className="inline-block py-2 px-4 rounded-md bg-green-50 text-green-700 text-sm hover:bg-green-100">
                                  Upload PDF
                                </span>
                                <input
                                  type="file"
                                  accept="application/pdf"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    try {
                                      const imageBase64 = await pdfFirstPageToImage(file);
                                      const updated = [...data];
                                      updated[originalIndex].contents[0] = { picture: imageBase64 };
                                      setData(updated);
                                    } catch (error) {
                                      alert("Failed to convert PDF.");
                                    }
                                    e.target.value = "";
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        ) : (
                          /* MAIN CONTENT BACKGROUND PAGE UI */
                          <div className="flex flex-row gap-6 p-4 border rounded-lg bg-white shadow-sm">
                            <div className="w-1/2 border-r pr-6 flex flex-col items-center">
                              <label className="text-xs font-bold text-gray-500 uppercase mb-4">
                                Header Image
                              </label>

                              {heading.contents?.[0]?.picture ? (
                                <div className="relative group flex flex-col items-center">
                                  <img
                                    src={heading.contents[0].picture}
                                    className="w-40 h-40 object-contain border rounded-md shadow-inner"
                                    alt="Header Preview"
                                  />
                                  <button
                                    onClick={() => {
                                      const updated = [...data];
                                      updated[originalIndex].contents[0].picture = null;
                                      setData(updated);
                                    }}
                                    className="mt-2 text-xs text-red-500 hover:text-red-700 font-medium"
                                  >
                                    Remove Image
                                  </button>
                                </div>
                              ) : (
                                <div className="w-40 h-40 border-2 border-dashed border-gray-200 rounded-md flex items-center justify-center text-gray-400">
                                  No Image
                                </div>
                              )}

                              <div className="flex gap-2 mt-4">
                                <label className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] px-3 py-2 rounded cursor-pointer transition">
                                  UPLOAD IMG
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (!file) return;
                                      const reader = new FileReader();
                                      reader.onload = () => {
                                        const updated = [...data];
                                        if (!updated[originalIndex].contents) updated[originalIndex].contents = [];
                                        updated[originalIndex].contents[0] = { picture: reader.result };
                                        setData(updated);
                                      };
                                      reader.readAsDataURL(file);
                                      e.target.value = "";
                                    }}
                                  />
                                </label>
                                <label className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] px-3 py-2 rounded cursor-pointer transition">
                                  UPLOAD PDF
                                  <input
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    onChange={async (e) => {
                                      const file = e.target.files[0];
                                      if (!file) return;
                                      try {
                                        const imageBase64 = await pdfFirstPageToImage(file);
                                        const updated = [...data];
                                        if (!updated[originalIndex].contents) updated[originalIndex].contents = [];
                                        updated[originalIndex].contents[0] = { picture: imageBase64 };
                                        setData(updated);
                                      } catch (err) {
                                        alert("PDF Conversion Failed");
                                      }
                                      e.target.value = "";
                                    }}
                                  />
                                </label>
                              </div>
                            </div>

                            <div className="w-1/2 pl-4 flex flex-col justify-center">
                              <h4 className="text-xs font-bold text-gray-500 uppercase mb-4">
                                Styling (API ID: {heading.id || "N/A"})
                              </h4>

                              <div className="space-y-4">
                                <div>
                                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                                    Padding Top
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none"
                                    placeholder="e.g. 20px"
                                    value={styleDto.paddingTop || ""}
                                    onChange={(e) =>
                                      setStyleDto({ ...styleDto, paddingTop: e.target.value })
                                    }
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                                    Padding Bottom
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none"
                                    placeholder="e.g. 20px"
                                    value={styleDto.paddingBottom || ""}
                                    onChange={(e) =>
                                      setStyleDto({ ...styleDto, paddingBottom: e.target.value })
                                    }
                                  />
                                </div>

                                <button
                                  onClick={handleSaveStyles}
                                  className="w-full bg-gray-800 hover:bg-black text-white text-xs font-bold py-2.5 rounded transition shadow-sm mt-2"
                                >
                                  SAVE CSS SETTINGS
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {/* NORMAL CONTENT SECTIONS */}
                        {heading.contents.map((content, cIndex) => (
                          <div
                            key={cIndex}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "12px",
                              gap: "10px",
                            }}
                          >
                            <textarea
                              style={{
                                width: "80%",
                                height: "90px",
                                padding: "10px",
                                borderRadius: "6px",
                                border: "1px solid #aaa",
                              }}
                              value={content.contentData}
                              onChange={(e) =>
                                handleContentChange(originalIndex, cIndex, e.target.value)
                              }
                            />

                            <button
                              onClick={() => deleteContent(originalIndex, cIndex)}
                              style={{
                                background: "red",
                                color: "#fff",
                                border: "none",
                                padding: "8px 15px",
                                borderRadius: "6px",
                                cursor: "pointer",
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        ))}

                        <button
                          onClick={() => addContent(originalIndex)}
                          style={{
                            marginTop: "10px",
                            background: "#007bff",
                            color: "#fff",
                            padding: "8px 14px",
                            borderRadius: "6px",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          + Add New Content
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={saveAll}
        disabled={isSaving}
        style={{
          marginTop: "25px",
          background: "green",
          color: "#fff",
          padding: "12px 25px",
          borderRadius: "8px",
          border: "none",
          fontSize: "17px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        {isSaving ? "Saving..." : "Save All Changes"}
      </button>
    </div>
  );
}