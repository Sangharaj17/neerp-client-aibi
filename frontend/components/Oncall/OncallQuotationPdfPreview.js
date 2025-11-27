"use client";

import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "@/utils/axiosInstance";
import {
  PDFViewer,
  PDFDownloadLink,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image
} from "@react-pdf/renderer";

/* ===========================
   Styles for react-pdf
   =========================== */
const styles = StyleSheet.create({
  page: {
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 30,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#000",
    lineHeight: 1.4,
  },

  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },

  headerWithImage: {
    width: "100%",
    height: 50,
    padding: 1
  },

  headerImage: {
    width: "100%",
    height: "100%",
  },

  headerRow: {
    paddingHorizontal: 30,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: { fontSize: 10, color: "#1E40AF", fontWeight: 700 },
  hr: { height: 1, backgroundColor: "#1F2937", marginTop: 4 },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    fontSize: 10,
  },

  footerRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  footerText: {
    fontSize: 9,
  },

  footerPage: {
    fontSize: 9,
  },

  footerWithImage: {
    width: "100%",
    height: 40,
  },

  footerImage: {
    width: "100%",
    height: "100%",
  },

  coverCenter: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80%",
  },

  coverTitle: { fontSize: 36, fontWeight: 800, color: "#1E40AF" },

  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    marginTop: 8,
    marginBottom: 6,
    color: "#1F2937",
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
    paddingBottom: 4,
  },

  text: { fontSize: 11 },
  bold: { fontWeight: 700 },

  /* table */
  table: { display: "table", width: "auto", marginTop: 6, marginBottom: 8 },
  tableRow: { flexDirection: "row" },
  tableHeader: {
    backgroundColor: "#F3F4F6",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#D1D5DB",
  },
  tableCell: { padding: 4, borderWidth: 1, borderColor: "#D1D5DB", fontSize: 10 },
  tdLeft: { textAlign: "left" },
  tdRight: { textAlign: "right" },
  tdCenter: { textAlign: "center" },

  smallItalicRight: { fontSize: 10, fontStyle: "italic", textAlign: "right" },

  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  twoCol: { flexDirection: "row", justifyContent: "space-between" },
  colHalf: { width: "48%" },
  list: { marginLeft: 12 },
});

/* ===========================
   Helper formatters
   =========================== */
const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
};

const formatContentText = (content) => {
  if (!content) return null;
  return content.split("\n").map((line, i) => (
    <Text key={i} style={{ fontSize: 11 }}>
      {line}
    </Text>
  ));
};

const currencyINR = (value) => {
  if (value == null) return "-";
  try {
    return value.toLocaleString("en-IN", { 
      style: "currency", 
      currency: "INR", 
      minimumFractionDigits: 2 
    });
  } catch {
    return String(value);
  }
};

/* ===========================
   OnCall Pricing Table
   =========================== */
const OncallPricingTablePdf = ({ pricingData }) => {
  if (!pricingData) return null;
  const materials = pricingData.materialDetails || [];

  return (
    <View
      style={{ marginBottom: 10, borderWidth: 1, borderColor: "#9CA3AF", padding: 6 }}
      wrap={false}
    >
      <Text style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
        Pricing Details
      </Text>

      {/* Table Header */}
      <View style={[styles.table, styles.tableHeader]} wrap={false}>
        <View style={[styles.tableRow]} wrap={false}>
          <View style={[{ width: "8%" }, styles.tableCell]}>
            <Text style={styles.tdCenter}>Sr. No.</Text>
          </View>
          <View style={[{ width: "32%" }, styles.tableCell]}>
            <Text style={styles.tdLeft}>Particulars</Text>
          </View>
          <View style={[{ width: "15%" }, styles.tableCell]}>
            <Text style={styles.tdCenter}>HSN/SAC</Text>
          </View>
          <View style={[{ width: "10%" }, styles.tableCell]}>
            <Text style={styles.tdCenter}>Qty</Text>
          </View>
          <View style={[{ width: "15%" }, styles.tableCell]}>
            <Text style={styles.tdRight}>Rate (Rs.)</Text>
          </View>
          <View style={[{ width: "10%" }, styles.tableCell]}>
            <Text style={styles.tdCenter}>Per</Text>
          </View>
          <View style={[{ width: "10%" }, styles.tableCell]}>
            <Text style={styles.tdRight}>Amount (Rs.)</Text>
          </View>
        </View>

        {/* Table Rows */}
        {materials.map((material, i) => (
          <View style={styles.tableRow} key={i} wrap={false}>
            <View style={[{ width: "8%" }, styles.tableCell]}>
              <Text style={styles.tdCenter}>{i + 1}</Text>
            </View>
            <View style={[{ width: "32%" }, styles.tableCell]}>
              <Text style={styles.tdLeft}>{material.particulars}</Text>
            </View>
            <View style={[{ width: "15%" }, styles.tableCell]}>
              <Text style={styles.tdCenter}>{material.hsnSac ?? "-"}</Text>
            </View>
            <View style={[{ width: "10%" }, styles.tableCell]}>
              <Text style={styles.tdCenter}>{material.quantity ?? "-"}</Text>
            </View>
            <View style={[{ width: "15%" }, styles.tableCell]}>
              <Text style={styles.tdRight}>{currencyINR(material.rate)}</Text>
            </View>
            <View style={[{ width: "10%" }, styles.tableCell]}>
              <Text style={styles.tdCenter}>{material.per ?? "-"}</Text>
            </View>
            <View style={[{ width: "10%" }, styles.tableCell]}>
              <Text style={styles.tdRight}>{currencyINR(material.amount)}</Text>
            </View>
          </View>
        ))}

        {/* Sub Total */}
        <View style={styles.tableRow} wrap={false}>
          <View style={{ width: "90%", padding: 4 }}>
            <Text style={{ textAlign: "right", fontWeight: 700 }}>Sub Total:</Text>
          </View>
          <View style={[{ width: "10%" }, styles.tableCell]}>
            <Text style={styles.tdRight}>{currencyINR(pricingData.subTotal)}</Text>
          </View>
        </View>

        {/* GST */}
        <View style={styles.tableRow} wrap={false}>
          <View style={{ width: "90%", padding: 4 }}>
            <Text style={{ textAlign: "right" }}>GST @ {pricingData.gstPercentage}%:</Text>
          </View>
          <View style={[{ width: "10%" }, styles.tableCell]}>
            <Text style={styles.tdRight}>{currencyINR(pricingData.amountWithGst)}</Text>
          </View>
        </View>

        {/* Grand Total */}
        <View style={styles.tableRow} wrap={false}>
          <View style={{ width: "90%", padding: 4 }}>
            <Text style={{ textAlign: "right", fontWeight: 700 }}>GRAND TOTAL:</Text>
          </View>
          <View style={[{ width: "10%" }, styles.tableCell]}>
            <Text style={styles.tdRight}>{currencyINR(pricingData.grandTotal)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

/* ===========================
   The PDF Document Component
   =========================== */
const OncallDocument = ({ apiData, isWithLetterHead }) => {
  // Extract images and content
  const firstPageImage =
    apiData?.oncallQuotationPdfHeadingWithContentsDtos
      ?.find((h) => h.headingName === "THIS IS FIXED FIRST PAGE")
      ?.contents?.[0]?.picture || null;

  const lastPageImage =
    apiData?.oncallQuotationPdfHeadingWithContentsDtos
      ?.find((h) => h.headingName === "THIS IS FIXED LAST PAGE")
      ?.contents?.[0]?.picture || null;

  const header =
    apiData?.oncallQuotationPdfHeadingWithContentsDtos
      ?.find((h) => h.headingName === "HEADER")
      ?.contents?.[0]?.picture || null;

  const footer =
    apiData?.oncallQuotationPdfHeadingWithContentsDtos
      ?.find((h) => h.headingName === "FOOTER")
      ?.contents?.[0]?.picture || null;

  // Extract content sections
  const introContent =
    apiData?.oncallQuotationPdfHeadingWithContentsDtos
      ?.find((h) => h.headingName === "Introduction")
      ?.contents?.[0]?.contentData || "";

  const scopeOfWork =
    apiData?.oncallQuotationPdfHeadingWithContentsDtos
      ?.find((h) => h.headingName === "SCOPE OF WORK")
      ?.contents || [];

  const termsConditions =
    apiData?.oncallQuotationPdfHeadingWithContentsDtos
      ?.find((h) => h.headingName === "Terms and Conditions")
      ?.contents || [];

  const exclusions =
    apiData?.oncallQuotationPdfHeadingWithContentsDtos
      ?.find((h) => h.headingName === "EXCLUSIONS")
      ?.contents || [];

  // Header/footer content
  const headerLeft = `${apiData?.companyName || ""} - OnCall Quotation`;
  const headerRight = `Date: ${formatDate(apiData?.quotationDate)}`;

  return (
    <Document>
      {/* FIRST PAGE */}
      {isWithLetterHead && (
        <Page size="A4" style={styles.page}>
          {firstPageImage ? (
            <Image
              src={firstPageImage}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <View style={styles.coverCenter}>
              <Text style={styles.coverTitle}>THIS IS FIXED FIRST PAGE</Text>
            </View>
          )}
        </Page>
      )}

      {/* MAIN CONTENT PAGES */}
      <Page size="A4" style={styles.page} wrap>
        {/* HEADER */}
        {isWithLetterHead && (
          <View style={styles.header} fixed>
            {header ? (
              <View style={styles.headerWithImage}>
                <Image src={header} style={styles.headerImage} />
              </View>
            ) : (
              <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>{headerLeft}</Text>
                <Text style={{ fontSize: 10 }}>{headerRight}</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.hr} />

        {/* Body */}
        <View>
          {/* Ref and Date */}
          <View style={{ marginTop: 8, marginBottom: 6 }}>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <Text style={{ fontSize: 10 }}>
                <Text style={{ fontWeight: 700 }}>Date: </Text>
                {formatDate(apiData?.quotationDate)}
              </Text>
            </View>
            <Text style={{ fontSize: 12, fontWeight: 700 }}>
              Our Ref. No. <Text style={{ color: "#1E40AF" }}>{apiData?.refNo}</Text>
            </Text>
          </View>

          {/* Letter Details */}
          <View style={{ marginTop: 6, marginBottom: 8 }}>
            <Text style={{ fontWeight: 700 }}>To,</Text>
            <Text style={{ fontWeight: 700 }}>{apiData?.sitename}</Text>
            <Text>{apiData?.siteAddress}</Text>
            
            <Text style={{ marginTop: 6, fontWeight: 700 }}>Kindly Attention,</Text>
            <Text>Mr. {apiData?.kindAttention}</Text>
            
            {apiData?.customerName && (
              <>
                <Text style={{ marginTop: 4 }}>
                  <Text style={{ fontWeight: 700 }}>Customer: </Text>
                  {apiData.customerName}
                </Text>
                {apiData?.customerNumber && (
                  <Text>Phone: +91 {apiData.customerNumber}</Text>
                )}
                {apiData?.customerAddress && (
                  <Text>{apiData.customerAddress}</Text>
                )}
              </>
            )}
          </View>

          {/* Subject */}
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 12, fontWeight: 700 }}>
              Subject: {apiData?.subject || "Quotation for OnCall Service"}
            </Text>
          </View>

          {/* Intro Content */}
          <View style={{ marginBottom: 8 }}>{formatContentText(introContent)}</View>

          {/* Scope of Work */}
          {scopeOfWork.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>SCOPE OF WORK:</Text>
              <View style={{ marginLeft: 12, marginBottom: 8 }}>
                {scopeOfWork.map((item) => (
                  <Text key={item.id} style={{ marginBottom: 4 }}>
                    • {item.contentData}
                  </Text>
                ))}
              </View>
            </>
          )}

          {/* Pricing Table */}
          {apiData?.oncallQuotationPdfPrizingData && (
            <>
              <Text style={styles.sectionTitle}>PRICING DETAILS:</Text>
              <OncallPricingTablePdf 
                pricingData={apiData.oncallQuotationPdfPrizingData} 
              />
              
              {apiData?.amountInWords && (
                <Text style={styles.smallItalicRight}>
                  {apiData.amountInWords}
                </Text>
              )}
            </>
          )}

          {/* Terms and Conditions */}
          {termsConditions.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>TERMS AND CONDITIONS:</Text>
              <View style={{ marginLeft: 12, marginBottom: 8 }}>
                {termsConditions.map((item) => (
                  <Text key={item.id} style={{ marginBottom: 4 }}>
                    • {item.contentData}
                  </Text>
                ))}
              </View>
            </>
          )}

          {/* Exclusions */}
          {exclusions.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>EXCLUSIONS:</Text>
              <View style={{ marginLeft: 12, marginBottom: 8 }}>
                {exclusions.map((item) => (
                  <Text key={item.id} style={{ marginBottom: 4 }}>
                    • {item.contentData}
                  </Text>
                ))}
              </View>
            </>
          )}

          {/* Signature Section */}
          <View style={{ marginTop: 20 }}>
            <Text>Thanking you,</Text>
            <View style={{ marginTop: 20 }}>
              <View style={{ 
                height: 30, 
                width: 140, 
                borderWidth: 1, 
                borderStyle: "dashed", 
                borderColor: "#CCC", 
                justifyContent: "center", 
                alignItems: "center" 
              }}>
                <Text>[Company Seal/Signature]</Text>
              </View>
            </View>
            <Text style={{ marginTop: 8, fontWeight: 700 }}>
              {apiData?.companyName}
            </Text>
          </View>
        </View>

        {/* FOOTER */}
        {isWithLetterHead && (
          <View style={styles.footer} fixed>
            {footer ? (
              <View style={styles.footerWithImage}>
                <Image src={footer} style={styles.footerImage} />
              </View>
            ) : (
              <View style={styles.footerRow}>
                <Text style={styles.footerText}>{apiData?.companyName}</Text>
                <Text style={styles.footerPage}>Page </Text>
              </View>
            )}
          </View>
        )}
      </Page>

      {/* LAST PAGE */}
      {isWithLetterHead && (
        <Page size="A4" style={styles.page}>
          {lastPageImage ? (
            <Image
              src={lastPageImage}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <View style={styles.coverCenter}>
              <Text style={styles.coverTitle}>THIS IS FIXED LAST PAGE</Text>
            </View>
          )}
        </Page>
      )}
    </Document>
  );
};

/* ===========================
   Main Component
   =========================== */
export default function OncallQuotationPdfPreview({ 
  oncallId,
  isWithLetterHead = true
}) {
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/oncall/getOncallQuotationPdfData/${oncallId || 1}`
        );
        setApiData(response.data || {});
      } catch (err) {
        console.error("Error fetching oncall data:", err);
        setApiData({});
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [oncallId]);

  const doc = useMemo(
    () => (
      <OncallDocument
        apiData={apiData || {}}
        isWithLetterHead={isWithLetterHead}
      />
    ),
    [apiData, isWithLetterHead]
  );

  if (isLoading) {
    return <div style={{ padding: 12 }}>Loading OnCall Quotation Data...</div>;
  }

  // Get site name from API data
  const pdfFileName = `${apiData?.sitename || "Site"}_OncallQuotation.pdf`;

  return (
    <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <PDFDownloadLink 
          document={doc} 
          fileName={pdfFileName} 
          style={{ textDecoration: "none" }}
        >
          {({ loading }) => (
            <button style={{ 
              background: "#2563EB", 
              color: "#fff", 
              padding: "8px 12px", 
              borderRadius: 6, 
              border: "none" 
            }}>
              {loading ? "Preparing..." : "Download PDF"}
            </button>
          )}
        </PDFDownloadLink>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ padding: "8px 12px", borderRadius: 6 }}
        >
          Scroll to Preview
        </button>
      </div>

      {/* Viewer */}
      <div style={{ height: "80vh", border: "1px solid #e5e7eb" }}>
        <PDFViewer width="100%" style={{ height: "100%" }}>
          {doc}
        </PDFViewer>
      </div>
    </div>
  );
}