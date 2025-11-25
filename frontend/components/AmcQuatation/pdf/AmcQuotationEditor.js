"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";

export default function AmcQuotationEditor() {
  const [data, setData] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // ==========================
  // 1. LOAD DATA FROM API
  // ==========================
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get(
        "/api/amc/quotation/pdf/headings-with-contents"
      );
      setData(res.data);
    } catch (err) {
      console.error("Error loading data", err);
    }
  };

  // ==========================
  // Toggle heading expand
  // ==========================
  const toggleHeading = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // ==========================
  // Edit content input
  // ==========================
  const handleContentChange = (headingIndex, contentIndex, value) => {
    const updated = [...data];
    updated[headingIndex].contents[contentIndex].contentData = value;
    setData(updated);
  };

  // ==========================
  // Add new Content
  // ==========================
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

  // ==========================
  // Delete Content
  // ==========================
  const deleteContent = (headingIndex, contentIndex) => {
    const updated = [...data];
    updated[headingIndex].contents.splice(contentIndex, 1);
    setData(updated);
  };

  // ==========================
  // SAVE ALL
  // ==========================
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

  // ==========================
  // UI STARTS HERE
  // ==========================
  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontWeight: 800 }}>AMC Quotation Editor</h2>

      {data.map((heading, hIndex) => (
        <div
          key={heading.id}
          style={{
            marginTop: "20px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "15px",
          }}
        >
          {/* =======================
               HEADING
          ======================= */}
          <div
            onClick={() => toggleHeading(hIndex)}
            style={{
              fontSize: "18px",
              fontWeight: "700",
              cursor: "pointer",
              paddingBottom: "8px",
              borderBottom: "1px solid #ddd",
            }}
          >
            {heading.headingName}
          </div>

          {/* =======================
              CONTENT SECTION
          ======================= */}
          {expanded[hIndex] && (
            <div style={{ marginTop: "15px", paddingLeft: "10px" }}>

              {/* SPECIAL FIRST PAGE SECTION */}
              {heading.headingName === "THIS IS FIXED FIRST PAGE"  
|| heading.headingName === "HEADER" || 
heading.headingName === "FOOTER" ||
heading.headingName === "THIS IS FIXED LAST PAGE"? (
  <div
    className="flex flex-col items-center py-4"
    style={{ borderBottom: "1px solid #ddd" }}
  >
    <label className="block text-sm font-medium text-gray-700 mb-3">
      Upload First Page Image
    </label>

    {/* Ensure contents[0] exists */}
    {(() => {
      if (!heading.contents || heading.contents.length === 0) {
        heading.contents = [{ picture: null }];
      }
    })()}

    {/* Preview */}
    {heading.contents[0]?.picture ? (
      <div className="flex flex-col items-center">
        <img
          src={heading.contents[0].picture}
          className="w-32 h-32 object-contain border border-gray-300 rounded-md mb-3"
        />

        {/* DELETE BUTTON */}
       <button
  onClick={() => {
    const updated = [...data];
    // Remove the first content row completely
    updated[hIndex].contents.splice(0, 1);
    setData(updated);
  }}
  style={{
    background: "red",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  }}
>
  Delete Image
</button>

      </div>
    ) : (
      <div className="w-32 h-32 flex items-center justify-center border border-gray-300 rounded-md mb-3 text-gray-400">
        No Image
      </div>
    )}

    {/* File Input */}
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
          const updated = [...data];
          updated[hIndex] ||= {};
          updated[hIndex].contents ||= [];
          updated[hIndex].contents[0] ||= { picture: null };
          updated[hIndex].contents[0].picture = reader.result;
          setData(updated);
        };
        reader.readAsDataURL(file);
      }}
      className="text-sm text-gray-700 file:py-2 file:px-4 file:rounded-md
                 file:bg-blue-50 file:text-blue-700"
    />
  </div>
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
                          handleContentChange(hIndex, cIndex, e.target.value)
                        }
                      />

                      <button
                        onClick={() => deleteContent(hIndex, cIndex)}
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
                    onClick={() => addContent(hIndex)}
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
      ))}

      {/* SAVE BUTTON */}
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
        }}
      >
        {isSaving ? "Saving..." : "Save All"}
      </button>
    </div>
  );
}
