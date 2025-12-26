"use client";

import React, { useEffect, useState , useRef} from "react";
import axiosInstance from "@/utils/axiosInstance";
import {
  pdf,
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
  firstpage: {
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 30,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#000",
    lineHeight: 1.4,
    position: "relative",
  },
  page: {
    position: "relative",
    paddingTop: 100,
    paddingBottom: 120,
    paddingHorizontal: 30,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#000",
    lineHeight: 1.4,
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "auto",
    height: "auto",
    zIndex: -1,
  },
  content: {
    position: "relative",
    zIndex: 1,
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
  if (value == null || value === undefined) return "-";
  try {
    const num = parseFloat(value);
    if (isNaN(num)) return String(value);
    
    const parts = num.toFixed(2).split('.');
    const intPart = parts[0];
    const decimalPart = parts[1];
    
    const reversed = intPart.split('').reverse().join('');
    let formatted = '';
    for (let i = 0; i < reversed.length; i++) {
      if (i > 0 && i % 3 === 0) {
        formatted = ',' + formatted;
      }
      if (i === 3) {
        formatted = ',' + formatted;
        break;
      }
      formatted = reversed[i] + formatted;
    }
    
    if (intPart.length > 3) {
      formatted = reversed.substring(3).split('').reverse().join('');
      formatted = formatted.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
      formatted = formatted + ',' + intPart.slice(-3);
    }
    
    return `${formatted}.${decimalPart}`;
  } catch (error) {
    console.log('Currency format error:', error);
    return String(value);
  }
};

/* ===========================
   Modernization Pricing Table
   =========================== */
const ModernizationPricingTablePdf = ({ pricingData }) => {
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

      <View style={[styles.table, styles.tableHeader]} wrap={false}>
        <View style={[styles.tableRow]} wrap={false}>
          <View style={[{ width: "8%" }, styles.tableCell]}>
            <Text style={styles.tdCenter}>Sr. No.</Text>
          </View>
          <View style={[{ width: "22%" }, styles.tableCell]}>
            <Text style={styles.tdLeft}>Particulars</Text>
          </View>
          <View style={[{ width: "15%" }, styles.tableCell]}>
            <Text style={styles.tdCenter}>HSN/SAC</Text>
          </View>
          <View style={[{ width: "10%" }, styles.tableCell]}>
            <Text style={styles.tdCenter}>Qty</Text>
          </View>
          <View style={[{ width: "10%" }, styles.tableCell]}>
            <Text style={styles.tdCenter}>Guarantee(Months)</Text>
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

        {materials.map((material, i) => (
          <View style={styles.tableRow} key={i} wrap={false}>
            <View style={[{ width: "8%" }, styles.tableCell]}>
              <Text style={styles.tdCenter}>{i + 1}</Text>
            </View>
            <View style={[{ width: "22%" }, styles.tableCell]}>
              <Text style={styles.tdLeft}>{material.particulars}</Text>
            </View>
            <View style={[{ width: "15%" }, styles.tableCell]}>
              <Text style={styles.tdCenter}>{material.hsnSac ?? "-"}</Text>
            </View>
            <View style={[{ width: "10%" }, styles.tableCell]}>
              <Text style={styles.tdCenter}>{material.quantity ?? "-"}</Text>
            </View>
            <View style={[{ width: "10%" }, styles.tableCell]}>
              <Text style={styles.tdCenter}>{material.guarantee ?? "-"}</Text>
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

        <View style={styles.tableRow} wrap={false}>
          <View style={{ width: "90%", padding: 4 }}>
            <Text style={{ textAlign: "right", fontWeight: 700 }}>Sub Total:</Text>
          </View>
          <View style={[{ width: "10%" }, styles.tableCell]}>
            <Text style={styles.tdRight}>{currencyINR(pricingData.subTotal)}</Text>
          </View>
        </View>

        <View style={styles.tableRow} wrap={false}>
          <View style={{ width: "90%", padding: 4 }}>
            <Text style={{ textAlign: "right" }}>GST @ {pricingData.gstPercentage}%:</Text>
          </View>
          <View style={[{ width: "10%" }, styles.tableCell]}>
            <Text style={styles.tdRight}>{currencyINR(pricingData.amountWithGst)}</Text>
          </View>
        </View>

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
const ModernizationDocument = ({ apiData, isWithLetterHead, styleDto }) => {
  const firstPageImage =
    apiData?.modernizationQuotationPdfHeadingWithContentsDtos
      ?.find((h) => h.headingName === "THIS IS FIXED FIRST PAGE")
      ?.contents?.[0]?.picture || null;

  const lastPageImage =
    apiData?.modernizationQuotationPdfHeadingWithContentsDtos
      ?.find((h) => h.headingName === "THIS IS FIXED LAST PAGE")
      ?.contents?.[0]?.picture || null;

  const MAIN_CONTENT_BACKGROUND_PAGE =
    apiData?.modernizationQuotationPdfHeadingWithContentsDtos
      ?.find((h) => h.headingName === "MAIN CONTENT BACKGROUND PAGE")
      ?.contents?.[0]?.picture || null;

  const introContent =
    apiData?.modernizationQuotationPdfHeadingWithContentsDtos
      ?.find((h) => h.headingName === "Introduction")
      ?.contents?.[0]?.contentData || "";

  const scopeOfWork =
    apiData?.modernizationQuotationPdfHeadingWithContentsDtos
      ?.find((h) => h.headingName === "SCOPE OF WORK")
      ?.contents || [];

  const termsConditions =
    apiData?.modernizationQuotationPdfHeadingWithContentsDtos
      ?.find((h) => h.headingName === "Terms and Conditions")
      ?.contents || [];

  const exclusions =
    apiData?.modernizationQuotationPdfHeadingWithContentsDtos
      ?.find((h) => h.headingName === "EXCLUSIONS")
      ?.contents || [];

  let mainPageCss = {
    position: "relative",
    paddingTop: styleDto?.paddingTop ? parseInt(styleDto.paddingTop) : 100,
    paddingBottom: styleDto?.paddingBottom ? parseInt(styleDto.paddingBottom) : 120,
    paddingHorizontal: 30,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#000",
    lineHeight: 1.4,
  };

  return (
    <Document>
      {isWithLetterHead && (
        <Page size="A4">
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

      <Page size="A4" style={mainPageCss} wrap>
        {isWithLetterHead && (
          <Image
            src={MAIN_CONTENT_BACKGROUND_PAGE}
            style={styles.background}
            fixed
          />
        )}

        <View style={styles.hr} />

        <View>
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

          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 12, fontWeight: 700 }}>
              Subject: {apiData?.subject || "Quotation for Lift Modernization"}
            </Text>
          </View>

          <View style={{ marginBottom: 10, padding: 8, backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB" }}>
            <View style={{ flexDirection: "row", marginBottom: 4 }}>
              <View style={{ width: "30%" }}>
                <Text style={{ fontWeight: 700, fontSize: 10 }}>Warranty (Months):</Text>
              </View>
              <View style={{ width: "70%" }}>
                <Text style={{ fontSize: 10 }}>{apiData?.warranty || "-"}</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", marginBottom: 4 }}>
              <View style={{ width: "30%" }}>
                <Text style={{ fontWeight: 700, fontSize: 10 }}>Work Period (Months):</Text>
              </View>
              <View style={{ width: "70%" }}>
                <Text style={{ fontSize: 10 }}>{apiData?.workperiod || "-"}</Text>
              </View>
            </View>
            {apiData?.note && (
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "30%" }}>
                  <Text style={{ fontWeight: 700, fontSize: 10 }}>Note:</Text>
                </View>
                <View style={{ width: "70%" }}>
                  <Text style={{ fontSize: 10 }}>{apiData.note}</Text>
                </View>
              </View>
            )}
          </View>

          <View style={{ marginBottom: 8 }}>{formatContentText(introContent)}</View>

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

          {apiData?.modernizationQuotationPdfPrizingData && (
            <>
              <Text style={styles.sectionTitle}>PRICING DETAILS:</Text>
              <ModernizationPricingTablePdf 
                pricingData={apiData.modernizationQuotationPdfPrizingData} 
              />
              
              {apiData?.amountInWords && (
                <Text style={styles.smallItalicRight}>
                  {apiData.amountInWords}
                </Text>
              )}
            </>
          )}

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
      </Page>

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
   Main Component - Simplified
   =========================== */
export default function ModernizationQuotationPdfGenerator({ 
  modernizationId,
  isWithLetterHead = true,
  onSuccess,
  onError
}) {
  const [styleDto, setStyleDto] = useState({
    paddingTop: "",
    paddingBottom: "",
    amcQuotationPdfHeadingsId: 0
  });

  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Fetch styles
  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/css-styles/by-heading-name/${encodeURIComponent("MAIN CONTENT BACKGROUND PAGE")}`
        );
        if (res.data) {
          setStyleDto(res.data);
        }
      } catch (err) {
        console.error("Style fetch failed:", err);
      }
    };
    fetchStyles();
  }, []);

  const hasSentPdf = useRef(false);


 useEffect(() => {
  // 🚫 Prevent double execution
  if (hasSentPdf.current) return;

  hasSentPdf.current = true; // ✅ mark as executed
  generateAndSendPdf();

}, []); // Run
  // Generate PDF and send to backend
  const generateAndSendPdf = async () => {
    if (!modernizationId) {
      onError?.("Modernization ID is required");
      return;
    }

    setIsLoading(true);
    setIsSending(true);

    try {
      // Step 1: Fetch data
      const response = await axiosInstance.get(
        `/api/modernization/getModernizatationQuotationPdfData/${modernizationId}`
      );
      const data = response.data || {};
      setApiData(data);

      // Step 2: Generate PDF
      const doc = (
        <ModernizationDocument
          apiData={data}
          isWithLetterHead={isWithLetterHead}
          styleDto={styleDto}
        />
      );

      const blob = await pdf(doc).toBlob();
      
      // Step 3: Create FormData
      const formData = new FormData();
      const fileName = `${data?.sitename || "Site"}_ModernizationQuotation.pdf`;
      formData.append("file", blob, fileName);
      formData.append("modernizationQuotationId", modernizationId.toString());

      // Step 4: Send to backend
      const emailResponse = await axiosInstance.post(
        "/api/modernization/quotation/email",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onSuccess?.(emailResponse.data);
      
    } catch (err) {
      console.error("Error generating or sending PDF:", err);
      onError?.(err.response?.data || err.message || "Failed to send quotation");
    } finally {
      setIsLoading(false);
      setIsSending(false);
    }
  };

  return (
    <div style={{ padding: 12 }}>
      {/* <button
        onClick={generateAndSendPdf}
        disabled={isLoading || isSending}
        style={{
          background: isSending ? "#9CA3AF" : "#2563EB",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: 6,
          border: "none",
          cursor: isSending ? "not-allowed" : "pointer",
          fontSize: 14,
          fontWeight: 600
        }}
      >
        {isSending ? "Sending Email..." : "Generate & Send Quotation Email"}
      </button> */}
    </div>
  );
}