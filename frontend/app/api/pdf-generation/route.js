// app/api/pdf-generation/route.js
import puppeteer from "puppeteer";
import { API_ENDPOINTS } from "@/utils/apiEndpoints";
import { getQuotationById, getFeatureNameMap } from "@/services/quotationApi"; // Reuse your existing fetch logic
import { generateQuotationHtml } from "./pdfTemplateGenerator"; // <--- NEW FILE

// Ensure the Node.js process has access to puppeteer binary (e.g., in Vercel/Docker)
// and set a high timeout for the request, as this is a heavy operation.
export const maxDuration = 60; // Max execution time for Vercel/Next.js

export async function GET(request) {
  let browser;
  try {

    const url = new URL(request.url);
    const BASE_URL = `${url.protocol}//${url.host}`;
    const COVER_IMG = `${BASE_URL}/images/cover_page.png`;
    const BACK_IMG = `${BASE_URL}/images/backpage_page.png`;
    const LETTERHEAD_SOURCE = `${BASE_URL}/images/letterhead_full.png`;

    const { searchParams } = new URL(request.url);
    const quotationId = searchParams.get('quotationId');
    const includeLetterhead = searchParams.get('includeLetterhead') === 'true';
    const tenant = searchParams.get('tenant');
    const shouldDownload = searchParams.get('download') === 'true';

    if (!quotationId || !tenant) {
      return new Response(JSON.stringify({ message: "Missing required parameters" }), { status: 400 });
    }

    //----------------- 1. Fetch backend data (Reuse your existing logic) ----------------- 
    // NOTE: This call must be configured to use fetch/axios server-side.
    const response = await getQuotationById(quotationId, tenant);
    if (!response || !response.success || !response.data) {
      return new Response(JSON.stringify({ message: "Quotation not found" }), { status: 404 });
    }
    const quotationData = response.data;
    // console.log(quotationData);
    const filename = `${(quotationData.customerName || 'quotation').replace(/\s+/g, '_')}_${quotationData.quotationNo || ''}.pdf`;


    const featureNameMap = await getFeatureNameMap(tenant);
// console.log(featureNameMap);
    //-----------------  2. Generate the entire HTML document string ----------------- 
    const html = generateQuotationHtml(
      quotationData,
      includeLetterhead,
      tenant,
      COVER_IMG,
      BACK_IMG,
      LETTERHEAD_SOURCE,
      featureNameMap
    );


    //-----------------   3. Generate PDF using Puppeteer -----------------  
    const browser = await puppeteer.launch({
      // Recommended args for production/CI environments
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: "new", // Modern headless mode
    });

    const page = await browser.newPage();

    //-----------------   4. Set Content and Wait -----------------  
    // Use networkidle0 to wait for images/CSS/fonts to load
    // Important: set a reasonable viewport matching A4 width px to get consistent rendering
    await page.setViewport({ width: 1200, height: 1600 });

    await page.setContent(html, { waitUntil: "networkidle0" });


    //-----------------   5. Generate the PDF -----------------  
    // Puppeteer: use header/footer for page numbers placed below the letterhead.
    // NOTE: top margin must be >= letterhead height (e.g., 45-50 mm)
    const topMarginMm = 50; // mm - should match the CSS top padding used in HTML
    const bottomMarginMm = 14;

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      // Configure margins to leave space for your letterhead/headers in the HTML template
      margin: {
        // top: '50mm',    // Space for header/logo
        // bottom: '30mm', // Space for footer/page numbers
        // left: '10mm',
        // right: '10mm',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      },
      // Enable auto-generated page numbers/headers using standard HTML templates
      // displayHeaderFooter: true,
      // 🚨 REMOVED: Disable header/footer templates to avoid conflict with cover/back pages
      displayHeaderFooter: false, // MANDATORY: Disable native headers/footers
    });

    await browser.close();

    // 6. Return the PDF buffer
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=${filename}`,
      },
    });

  } catch (err) {
    console.error("PDF GENERATION ERROR:", err);
    return new Response(JSON.stringify({ message: "PDF generation failed." }), { status: 500 });
  }
}