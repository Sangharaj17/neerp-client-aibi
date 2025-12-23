"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
  pdf
} from "@react-pdf/renderer";
import toast from "react-hot-toast";

/* ===========================
   Styles for react-pdf (same as original)
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
  if (value == null) return "-";
  try {
    return value.toLocaleString("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 });
  } catch {
    return String(value);
  }
};

/* ===========================
   Pricing Table Component
   =========================== */
const PricingTablePdf = ({ contractData }) => {
  if (!contractData) return null;
  const liftData = contractData.liftPricingDatas || [];

  return (
    <View
      style={{ marginBottom: 10, borderWidth: 1, borderColor: "#9CA3AF", padding: 6 }}
      wrap={false}
    >
      <Text style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
        Contract Type: {contractData.contractType}
      </Text>

      <View style={[styles.table, styles.tableHeader]} wrap={false}>
        <View style={[styles.tableRow]} wrap={false}>
          <View style={[{ width: "6%" }, styles.tableCell]}>
            <Text style={styles.tdCenter}>Sr. No.</Text>
          </View>
          <View style={[{ width: "44%" }, styles.tableCell]}>
            <Text style={styles.tdLeft}>Description</Text>
          </View>
          <View style={[{ width: "10%" }, styles.tableCell]}>
            <Text style={styles.tdCenter}>No. of Lifts</Text>
          </View>
          <View style={[{ width: "20%" }, styles.tableCell]}>
            <Text style={styles.tdRight}>Price/Lift (Rs.)</Text>
          </View>
          <View style={[{ width: "20%" }, styles.tableCell]}>
            <Text style={styles.tdRight}>Total Amount (Rs.)</Text>
          </View>
        </View>

        {liftData.map((lift, i) => (
          <View style={styles.tableRow} key={i} wrap={false}>
            <View style={[{ width: "6%" }, styles.tableCell]}>
              <Text style={styles.tdCenter}>{i + 1}</Text>
            </View>
            <View style={[{ width: "44%" }, styles.tableCell]}>
              <Text style={styles.tdLeft}>{lift.productDescription}</Text>
            </View>
            <View style={[{ width: "10%" }, styles.tableCell]}>
              <Text style={styles.tdCenter}>{lift.noOfLifts ?? "-"}</Text>
            </View>
            <View style={[{ width: "20%" }, styles.tableCell]}>
              <Text style={styles.tdRight}>{currencyINR(lift.pricePerLift)}</Text>
            </View>
            <View style={[{ width: "20%" }, styles.tableCell]}>
              <Text style={styles.tdRight}>{currencyINR(lift.totalAmount)}</Text>
            </View>
          </View>
        ))}

        <View style={styles.tableRow} wrap={false}>
          <View style={{ width: "80%", padding: 4 }}>
            <Text style={{ textAlign: "right", fontWeight: 700 }}>Sub Total:</Text>
          </View>
          <View style={[{ width: "20%" }, styles.tableCell]}>
            <Text style={styles.tdRight}>{currencyINR(contractData.subTotalOfAllLifts)}</Text>
          </View>
        </View>

        <View style={styles.tableRow} wrap={false}>
          <View style={{ width: "80%", padding: 4 }}>
            <Text style={{ textAlign: "right" }}>GST @ {contractData.gstPercentage}%:</Text>
          </View>
          <View style={[{ width: "20%" }, styles.tableCell]}>
            <Text style={styles.tdRight}>{currencyINR(contractData.gstAmountOfLifts)}</Text>
          </View>
        </View>

        <View style={styles.tableRow} wrap={false}>
          <View style={{ width: "80%", padding: 4 }}>
            <Text style={{ textAlign: "right", fontWeight: 700 }}>GRAND TOTAL:</Text>
          </View>
          <View style={[{ width: "20%" }, styles.tableCell]}>
            <Text style={styles.tdRight}>{currencyINR(contractData.totalPriceWithTax)}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.smallItalicRight}>{contractData.totalPriceWithTaxInWords}</Text>
    </View>
  );
};

/* ===========================
   PDF Document Component
   =========================== */
const ProposalDocument = ({ apiData, isWithoutLetterhead, isWithLetterHead, styleDto }) => {
  const firstPageImage =
    apiData?.amcQuotationPdfHeadingWithContentsDtos
      ?.find((h) => h.headingName === "THIS IS FIXED FIRST PAGE")
      ?.contents?.[0]?.picture || null;

  const lastPageImage =
    apiData?.amcQuotationPdfHeadingWithContentsDtos
      ?.find((h) => h.headingName === "THIS IS FIXED LAST PAGE")
      ?.contents?.[0]?.picture || null;

  const MAIN_CONTENT_BACKGROUND_PAGE =
    apiData?.amcQuotationPdfHeadingWithContentsDtos
      ?.find((h) => h.headingName === "MAIN CONTENT BACKGROUND PAGE")
      ?.contents?.[0]?.picture || null;

  const introContent =
    apiData?.amcQuotationPdfHeadingWithContentsDtos?.find((h) => h.headingName === "Introduction Page")?.contents?.[0]
      ?.contentData || "";

  const maintenanceOffer =
    apiData?.amcQuotationPdfHeadingWithContentsDtos?.find((h) => h.headingName === "MAINTENANCE CONTRACT OFFER:")?.contents?.[0]
      ?.contentData || "";

  const nonCompContent =
    apiData?.amcQuotationPdfHeadingWithContentsDtos?.find((h) => h.headingName === "NON-COMPREHENSIVE MAINTENANCE")
      ?.contents || [];

  const semiCompContent =
    apiData?.amcQuotationPdfHeadingWithContentsDtos?.find((h) => h.headingName === "SEMI-COMPREHENSIVE MAINTENANCE")
      ?.contents || [];

  const comprehensiveSection = apiData?.amcQuotationPdfHeadingWithContentsDtos?.find(
    (h) => h.headingName?.trim() === "COMPREHENSIVE MAINTENANCE:"
  );
  const compSummaryContent = comprehensiveSection?.contents?.[0]?.contentData || "";
  const compDetails = comprehensiveSection?.contents?.slice(1) || [];

  const nonCompPricing = apiData?.allContractTypeOfPricingData?.contractTypeOfPricingDatas?.find(
    (c) => c.contractType === "Non-Comprehensive"
  );
  const semiCompPricing = apiData?.allContractTypeOfPricingData?.contractTypeOfPricingDatas?.find(
    (c) => c.contractType === "Semi-Comprehensive"
  );
  const compPricing = apiData?.allContractTypeOfPricingData?.contractTypeOfPricingDatas?.find(
    (c) => c.contractType === "Comprehensive"
  );

  const excludedComponents =
    apiData?.amcQuotationPdfHeadingWithContentsDtos?.find((h) => h.headingName === "EXCLUDED COMPONENT IN THIS CONTRACT -")
      ?.contents || [];

  const instructions =
    apiData?.amcQuotationPdfHeadingWithContentsDtos?.find((h) => h.headingName === "INSTRUCTIONS:")?.contents || [];

  const bank = apiData?.bankDetails || {};
  const agreement = apiData?.agreementData || {};

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
            <Text style={{ fontWeight: 700 }}>{apiData?.letterDetails?.to}</Text>
            <Text>{apiData?.letterDetails?.address}</Text>
            <Text>{apiData?.letterDetails?.pinCode}</Text>
            <Text style={{ marginTop: 6, fontWeight: 700 }}>Kindly Attention,</Text>
            <Text>
              Mr. {apiData?.letterDetails?.attentionPerson} (Ph: +91 {apiData?.letterDetails?.phone})
            </Text>
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 12, fontWeight: 700 }}>
              Subject: Quotation for Annual Maintenance Contract of Lift.
            </Text>
          </View>

          <View style={{ marginBottom: 8 }}>{formatContentText(introContent)}</View>

          <Text style={{ marginTop: 6, fontSize: 12, fontWeight: 700 }}>
            For your further clarification you may call on us at
          </Text>

          <Text style={{ marginTop: 10 }}>Thanking you,</Text>
          <View style={{ marginTop: 20 }}>
            <View style={{ height: 30, width: 140, borderWidth: 1, borderStyle: "dashed", borderColor: "#CCC", justifyContent: "center", alignItems: "center" }}>
              <Text>[Company Seal/Signature]</Text>
            </View>
          </View>

          <Text style={{ marginTop: 8, fontWeight: 700 }}>{apiData?.company_name}</Text>
          <Text>{apiData?.company_person_name}</Text>

          <View style={{ marginTop: 12 }}>
            <Text style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Lift Specifications</Text>

            <View style={[styles.table]}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <View style={[{ width: "18%" }, styles.tableCell]}>
                  <Text>Enquiry ID</Text>
                </View>
                <View style={[{ width: "28%" }, styles.tableCell]}>
                  <Text>Lift Name</Text>
                </View>
                <View style={[{ width: "18%" }, styles.tableCell]}>
                  <Text>Capacity</Text>
                </View>
                <View style={[{ width: "18%" }, styles.tableCell]}>
                  <Text>Elevator Type</Text>
                </View>
                <View style={[{ width: "18%" }, styles.tableCell]}>
                  <Text>No. of Floors</Text>
                </View>
              </View>

              {(apiData?.liftSpecifications || []).map((item, idx) => (
                <View style={styles.tableRow} key={idx}>
                  <View style={[{ width: "18%" }, styles.tableCell]}>
                    <Text>{item.enquiryId}</Text>
                  </View>
                  <View style={[{ width: "28%" }, styles.tableCell]}>
                    <Text>{item.liftName ?? "-"}</Text>
                  </View>
                  <View style={[{ width: "18%" }, styles.tableCell]}>
                    <Text>{item.capacityValue}</Text>
                  </View>
                  <View style={[{ width: "18%" }, styles.tableCell]}>
                    <Text>{item.typeOfElevators}</Text>
                  </View>
                  <View style={[{ width: "18%" }, styles.tableCell]}>
                    <Text>{item.noOfFloors ?? "-"}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <Text style={styles.sectionTitle}>MAINTENANCE CONTRACT OFFER:</Text>
          <View style={{ marginBottom: 6 }}>{formatContentText(maintenanceOffer)}</View>

          <Text style={styles.sectionTitle}>CONTRACT TYPES AND PRICE DETAILS:</Text>

          {nonCompContent || nonCompPricing ? (
            <View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
                <Text style={{ fontSize: 13, fontWeight: 700 }}>
                  NON-COMPREHENSIVE MAINTENANCE
                </Text>
              </View>

              <View>
                {nonCompContent?.map((it) => (
                  <Text key={it.id} style={{ marginBottom: 4 }}>
                    • {it.contentData}
                  </Text>
                ))}
              </View>

              {nonCompPricing && <PricingTablePdf contractData={nonCompPricing} />}
            </View>
          ) : null}

          {semiCompContent || semiCompPricing ? (
            <View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
                <Text style={{ fontSize: 13, fontWeight: 700 }}>SEMI-COMPREHENSIVE MAINTENANCE</Text>
              </View>

              <View>
                {semiCompContent?.map((it) => (
                  <Text key={it.id} style={{ marginBottom: 4 }}>
                    • {it.contentData}
                  </Text>
                ))}
              </View>

              {semiCompPricing && <PricingTablePdf contractData={semiCompPricing} />}
            </View>
          ) : null}

          {compPricing ? (
            <View>
              <Text style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>COMPREHENSIVE MAINTENANCE:</Text>
              <View>{formatContentText(compSummaryContent)}</View>
              <View style={{ marginTop: 6 }}>
                {compDetails.map((it) => (
                  <Text key={it.id} style={{ marginLeft: 8, marginBottom: 3 }}>
                    • {it.contentData}
                  </Text>
                ))}
              </View>
              <PricingTablePdf contractData={compPricing} />
            </View>
          ) : null}

          <Text style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>EXCLUDED COMPONENT IN THIS CONTRACT -</Text>
          <View style={{ marginLeft: 12 }}>
            {excludedComponents.map((it) => (
              <Text key={it.id} style={{ marginBottom: 4 }}>
                • {it.contentData}
              </Text>
            ))}
          </View>

          <Text style={{ fontSize: 13, fontWeight: 700, marginTop: 8 }}>INSTRUCTIONS:</Text>
          <View style={{ marginLeft: 12 }}>
            {instructions.map((it) => (
              <Text key={it.id} style={{ marginBottom: 4 }}>
                {it.contentData}
              </Text>
            ))}
          </View>

          <Text style={styles.sectionTitle}>PAYMENT BANK DETAILS:</Text>
          <View style={[styles.twoCol, { marginBottom: 8 }]}>
            <View style={styles.colHalf}>
              <Text>
                <Text style={styles.bold}>Account Name: </Text>
                {bank.accountName}
              </Text>
              <Text>
                <Text style={styles.bold}>Bank Name: </Text>
                {bank.bankName}
              </Text>
              <Text>
                <Text style={styles.bold}>Account Number: </Text>
                {bank.accountNumber}
              </Text>
            </View>
            <View style={styles.colHalf}>
              <Text>
                <Text style={styles.bold}>IFSC Code: </Text>
                {bank.ifscCode}
              </Text>
              <Text>
                <Text style={styles.bold}>Branch Name: </Text>
                {bank.branchName}
              </Text>
              <Text>
                <Text style={styles.bold}>GST Number: </Text>
                {bank.gstNumber}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>AGREEMENT SUMMARY:</Text>
          <View style={[styles.twoCol, { marginBottom: 8 }]}>
            <View style={styles.colHalf}>
              <Text>
                <Text style={styles.bold}>Site Name: </Text>
                {agreement.sitename}
              </Text>
              <Text>
                <Text style={styles.bold}>Contract Period: </Text>
                {agreement.contractPeriod}
              </Text>
            </View>
            <View style={styles.colHalf}>
              <Text>
                <Text style={styles.bold}>Types of Contract Offered: </Text>
                {agreement.typeOfContract}
              </Text>
              <Text>
                <Text style={styles.bold}>Payment Term: </Text>
                {agreement.paymentTerm}
              </Text>
              <Text>
                <Text style={styles.bold}>Contact Person: </Text>
                {agreement.nameOfPerson}
              </Text>
              <Text>
                <Text style={styles.bold}>Mobile Number: </Text>
                {agreement.mobileNumber}
              </Text>
            </View>
          </View>
        </View>
      </Page>

      {isWithLetterHead && (
        <Page size="A4">
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
   Main Component - Auto Generate & Send PDF
   =========================== */
export default function AmcQuotationPdfAutoSender({
  amcQuotationId,
  revisedQuotationId,
  renewalQuaId,
  revisedRenewalId,
  siteName,
  isWithoutLetterhead,
  isWithLetterHead,
  onSuccess,
  onError,
  shouldSendPdf
}) {



  const [status, setStatus] = useState("idle"); // idle, generating, sending, success, error
  const [styleDto, setStyleDto] = useState({
    paddingTop: "",
    paddingBottom: "",
    amcQuotationPdfHeadingsId: 0
  });
  const [apiData, setApiData] = useState(null);

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
        //console.error("Style fetch failed:", err);
      }
    };
    fetchStyles();
  }, []);

  // Fetch API data and auto-generate PDF
  useEffect(() => {
    const generateAndSendPdf = async () => {
      try {
        setStatus("generating");

        // 1. Fetch quotation data
        const params = new URLSearchParams();
        params.append("amcQuatationId", amcQuotationId || "");
        params.append("revisedQuatationId", revisedQuotationId || "");
        params.append("renewalQuaId", renewalQuaId || "");
        params.append("revisedRenewalId", revisedRenewalId || "");

        const apiUrl = `/api/amc/quotation/pdf/pdf-data?${params.toString()}`;
        const res = await axiosInstance.get(apiUrl);
        const data = res.data || {};
        setApiData(data);

        // 2. Generate PDF blob
        const doc = (
          <ProposalDocument
            apiData={data}
            isWithoutLetterhead={isWithoutLetterhead}
            isWithLetterHead={isWithLetterHead}
            styleDto={styleDto}
          />
        );

        const blob = await pdf(doc).toBlob();

        // 3. Send PDF to backend
        setStatus("sending");
        const formData = new FormData();
        formData.append("file", blob, `${siteName || "Site"}_AmcQuotation.pdf`);

        await axiosInstance.post("/api/amc/quotation/mail/send-pdf", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setStatus("success");
        onSuccess();
        
      } catch (err) {
        console.error("Error generating or sending PDF:", err);
        setStatus("error");
        if (onError) onError(err);
      }
    };

    // Only run if we have at least one ID
    if (amcQuotationId || revisedQuotationId || renewalQuaId || revisedRenewalId) {
        if(shouldSendPdf==='sending')
        generateAndSendPdf();
      
    }
  }, [amcQuotationId, revisedQuotationId, renewalQuaId, revisedRenewalId, siteName, isWithoutLetterhead, isWithLetterHead]);

  // Optional: Return status indicator (can be removed if you want completely silent operation)
  if (status === "idle") return null;
  
  return (
    <div style={{ padding: 12, fontSize: 14 }}>
      {status === "generating" && <p>⏳ Generating PDF...</p>}
      {status === "sending" && <p>📤 Sending PDF via email...</p>}
      {status === "success" && <p style={{ color: "green" }}>✅ PDF sent successfully!</p>}
      {status === "error" && <p style={{ color: "red" }}>❌ Failed to send PDF. Please try again.</p>}
    </div>
  );
}