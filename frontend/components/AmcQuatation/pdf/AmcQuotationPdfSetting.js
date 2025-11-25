"use client";

import { useState } from "react";
import AmcQuotationPdfSettingPreviewAndPrint from "./AmcQuotationPdfSettingPreviewAndPrint";
import AmcQuotationEditor from "./AmcQuotationEditor";

export default function AmcQuotationPdfSetting() {
  const [activeTab, setActiveTab] = useState("pdf");

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontWeight: 800, marginBottom: "20px" }}>
        AMC Quotation PDF Settings
      </h1>

      {/* --------------------- */}
      {/*        TABS UI        */}
      {/* --------------------- */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("pdf")}
          style={{
            padding: "10px 20px",
            background: activeTab === "pdf" ? "#007bff" : "#e1e1e1",
            color: activeTab === "pdf" ? "#fff" : "#000",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Proposal PDF
        </button>

        <button
          onClick={() => setActiveTab("editor")}
          style={{
            padding: "10px 20px",
            background: activeTab === "editor" ? "#007bff" : "#e1e1e1",
            color: activeTab === "editor" ? "#fff" : "#000",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Edit Headings & Contents
        </button>
      </div>

      {/* --------------------- */}
      {/*     TAB CONTENTS      */}
      {/* --------------------- */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        {activeTab === "pdf" && <AmcQuotationPdfSettingPreviewAndPrint  isWithLetterHead={true}/>}

        {activeTab === "editor" && <AmcQuotationEditor />}
      </div>
    </div>
  );
}
