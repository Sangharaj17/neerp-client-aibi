"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { pdfFirstPageToImage } from "./pdfUtils";

export default function AmcQuotationEditor() {
  const [data, setData] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [headingId , setHeadingId] = useState(null);


  // 1. Local state for the CSS DTO
const [styleDto, setStyleDto] = useState({
  paddingTop: "",
  paddingBottom: "",
  amcQuotationPdfHeadingsId: headingId // Initialize with the heading's ID
});

// 2. Fetch existing styles from Backend using heading.id
useEffect(() => {
  console.log("Fetching styles for heading ID:");
  const fetchStyles = async () => {
    // Only fetch if the heading actually has an ID from the DB
    if (headingId) {
      try {
        const res = await axiosInstance.get(`/api/css-styles/by-heading/${headingId}`);
        if (res.data) {
          setStyleDto(res.data);
        }
      } catch (err) {
        console.error("Style fetch failed. Likely no style record exists yet.", err);
      }
    }
  };
  
  fetchStyles();
}, [headingId]); // Re-run if the heading ID changes

// 3. Save Styles via PUT
const handleSaveStyles = async () => {
  if (!headingId) {
    alert("Cannot save styles: Heading ID is missing.");
    return;
  }

  try {
    const payload = {
      ...styleDto,
      amcQuotationPdfHeadingsId: headingId // Explicitly link to the heading
    };
    
    const res = await axiosInstance.put(`/api/css-styles/by-heading/${headingId}`, payload);
    setStyleDto(res.data); // Update local UI with saved data
    alert("Layout saved!");
  } catch (err) {
    console.error("Save failed", err);
  }
};


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
  const toggleHeading = (index , headingId , headingName) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));

    //if(headingName === "MAIN CONTENT BACKGROUND PAGE")
      setHeadingId(headingId);
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
            onClick={() => toggleHeading(hIndex , heading.id , heading.headingName)}
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

              {heading.headingName === "THIS IS FIXED FIRST PAGE" ||
heading.headingName === "MAIN CONTENT BACKGROUND PAGE" ||
heading.headingName === "THIS IS FIXED LAST PAGE" ? (
  <>
    {/* CONDITION: FIRST OR LAST PAGE UI */}
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
              alt="Preview"
            />
            <button
              onClick={() => {
                const updated = [...data];
                updated[hIndex].contents[0].picture = null;
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

        {/* File Inputs */}
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
                  updated[hIndex].contents[0] = { picture: reader.result };
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
                  updated[hIndex].contents[0] = { picture: imageBase64 };
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
      /* ELSE: MAIN CONTENT BACKGROUND PAGE UI */
      <div className="flex flex-row gap-6 p-4 border rounded-lg bg-white shadow-sm">
        {/* LEFT COLUMN: IMAGE */}
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
                  updated[hIndex].contents[0].picture = null;
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
                    // Ensure contents[0] exists before setting
                    if (!updated[hIndex].contents) updated[hIndex].contents = [];
                    updated[hIndex].contents[0] = { picture: reader.result };
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
                    if (!updated[hIndex].contents) updated[hIndex].contents = [];
                    updated[hIndex].contents[0] = { picture: imageBase64 };
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

        {/* RIGHT COLUMN: CSS STYLES */}
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
)  : (
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
