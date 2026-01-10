// // app/api/pdf-generation/route.js
// import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
// import { getQuotationById, getFeatureNameMap } from "@/services/quotationApi";
// import { formatDate } from "@/utils/common";
// import fs from 'fs';
// import path from 'path';

// export const maxDuration = 30;

// export async function GET(request) {
//   try {
//     const url = new URL(request.url);
//     const { searchParams } = url;
//     const quotationId = searchParams.get('quotationId');
//     const includeLetterhead = searchParams.get('includeLetterhead') === 'true';
//     const tenant = searchParams.get('tenant');
//     const shouldDownload = searchParams.get('download') === 'true';

//     if (!quotationId || !tenant) {
//       return new Response(
//         JSON.stringify({ message: "Missing required parameters" }),
//         { status: 400, headers: { 'Content-Type': 'application/json' } }
//       );
//     }

//     // Fetch data
//     const response = await getQuotationById(quotationId, tenant);
//     if (!response?.success || !response.data) {
//       return new Response(
//         JSON.stringify({ message: "Quotation not found" }),
//         { status: 404, headers: { 'Content-Type': 'application/json' } }
//       );
//     }

//     const quotationData = response.data;
//     const featureNameMap = await getFeatureNameMap(tenant);
//     const filename = `${(quotationData.customerName || 'quotation').replace(/\s+/g, '_')}_${quotationData.quotationNo || ''}.pdf`;

//     // Create a new PDF document
//     const pdfDoc = await PDFDocument.create();

//     // Embed fonts
//     const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
//     const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

//     // Helper function to embed image based on file type
//     const embedImage = async (imagePath) => {
//       if (!fs.existsSync(imagePath)) {
//         console.warn(`Image not found: ${imagePath}`);
//         return null;
//       }

//       const imageBytes = fs.readFileSync(imagePath);
//       const ext = path.extname(imagePath).toLowerCase();

//       try {
//         if (ext === '.png') {
//           return await pdfDoc.embedPng(imageBytes);
//         } else if (ext === '.jpg' || ext === '.jpeg') {
//           return await pdfDoc.embedJpg(imageBytes);
//         } else {
//           console.warn(`Unsupported image format: ${ext}`);
//           return null;
//         }
//       } catch (err) {
//         console.error(`Failed to embed image ${imagePath}:`, err.message);
//         return null;
//       }
//     };

//     // Load letterhead images if includeLetterhead is true
//     let coverImage = null;
//     let backImage = null;
//     let letterheadImage = null;

//     if (includeLetterhead) {
//       // Load cover page
//       let coverImagePath = path.join(process.cwd(), 'public', 'images', 'cover_page.png');
//       if (!fs.existsSync(coverImagePath)) {
//         coverImagePath = path.join(process.cwd(), 'public', 'images', 'cover_page.jpg');
//       }
//       coverImage = await embedImage(coverImagePath);

//       // Load letterhead header (for content pages)
//       let letterheadPath = path.join(process.cwd(), 'public', 'images', 'letterhead_full.png');
//       if (!fs.existsSync(letterheadPath)) {
//         letterheadPath = path.join(process.cwd(), 'public', 'images', 'letterhead_full.jpg');
//       }
//       letterheadImage = await embedImage(letterheadPath);

//       // Load back page
//       let backImagePath = path.join(process.cwd(), 'public', 'images', 'backpage_page.png');
//       if (!fs.existsSync(backImagePath)) {
//         backImagePath = path.join(process.cwd(), 'public', 'images', 'backpage_page.jpg');
//       }
//       backImage = await embedImage(backImagePath);
//     }

//     // Helper function to add letterhead to a page
//     const addLetterheadToPage = (page) => {
//       if (includeLetterhead && letterheadImage) {
//         const { width, height } = page.getSize();
//         // Draw letterhead as full background
//         page.drawImage(letterheadImage, {
//           x: 0,
//           y: 0,
//           width: width,
//           height: height
//         });
//       }
//     };

//     // 1. Add cover page (full image, no letterhead)
//     if (includeLetterhead && coverImage) {
//       const coverPage = pdfDoc.addPage([595.28, 841.89]); // A4 size
//       coverPage.drawImage(coverImage, {
//         x: 0,
//         y: 0,
//         width: 595.28,
//         height: 841.89
//       });
//     }

//     // Generate quotation details
//     const dateObject = new Date(quotationData.quotationDate);
//     const monthName = dateObject.toLocaleString('en-US', { month: 'short' });
//     const financialYear = `${String(dateObject.getFullYear()).slice(-2)}-${String(dateObject.getFullYear() + 1).slice(-2)}`;
//     const refNo = `${financialYear}/${monthName}/${quotationData.quotationNo}`;
//     const formattedDate = formatDate(quotationData.quotationDate) || '';

//     // 2. Add first content page (with letterhead background)
//     const page1 = pdfDoc.addPage([595.28, 841.89]);
//     addLetterheadToPage(page1); // Add letterhead background

//     const { width, height } = page1.getSize();

//     // Adjust starting position to account for letterhead header space (~50mm = 141.73 points)
//     let yPosition = height - 150; // Start below letterhead header

//     // Header
//     page1.drawText(`REF.NO: ${refNo}`, {
//       x: 50,
//       y: yPosition,
//       size: 10,
//       font: helveticaFont,
//       color: rgb(0, 0, 0)
//     });

//     page1.drawText(`Date: ${formattedDate}`, {
//       x: width - 150,
//       y: yPosition,
//       size: 10,
//       font: helveticaFont,
//       color: rgb(0, 0, 0)
//     });

//     yPosition -= 40;

//     // To section
//     page1.drawText('To,', {
//       x: 50,
//       y: yPosition,
//       size: 12,
//       font: helveticaBold
//     });
//     yPosition -= 20;

//     page1.drawText((quotationData.siteName || '').toUpperCase(), {
//       x: 50,
//       y: yPosition,
//       size: 10,
//       font: helveticaFont
//     });
//     yPosition -= 15;

//     page1.drawText((quotationData.siteAdder || '').toUpperCase(), {
//       x: 50,
//       y: yPosition,
//       size: 10,
//       font: helveticaFont
//     });
//     yPosition -= 30;

//     // Attention
//     page1.drawText('Kindly Attention,', {
//       x: 50,
//       y: yPosition,
//       size: 10,
//       font: helveticaBold
//     });
//     yPosition -= 20;

//     const customerText = `${(quotationData.customerName || '').toUpperCase()} ${quotationData.contactNumber ? `(+91 ${quotationData.contactNumber})` : ''}`;
//     page1.drawText(customerText, {
//       x: 50,
//       y: yPosition,
//       size: 10,
//       font: helveticaFont
//     });
//     yPosition -= 30;

//     // Dear Sir
//     page1.drawText('Dear Sir,', {
//       x: 50,
//       y: yPosition,
//       size: 10,
//       font: helveticaFont
//     });
//     yPosition -= 30;

//     // Subject
//     const subjectText = `Sub.: Supply, Installing, Testing and commissioning of (${quotationData.liftDetails.length}) lifts for your project at ${(quotationData.siteName || '').toUpperCase()}`;

//     // Word wrap for subject
//     const maxWidth = width - 100;
//     const words = subjectText.split(' ');
//     let line = '';

//     for (const word of words) {
//       const testLine = line + word + ' ';
//       const textWidth = helveticaFont.widthOfTextAtSize(testLine, 10);

//       if (textWidth > maxWidth && line !== '') {
//         page1.drawText(line, { x: 50, y: yPosition, size: 10, font: helveticaFont });
//         line = word + ' ';
//         yPosition -= 15;
//       } else {
//         line = testLine;
//       }
//     }
//     if (line) {
//       page1.drawText(line, { x: 50, y: yPosition, size: 10, font: helveticaFont });
//       yPosition -= 30;
//     }

//     // Body paragraphs
//     const bodyText1 = 'As desired we take pleasure in submitting herewith our proposal for your subject building.';
//     page1.drawText(bodyText1, {
//       x: 50,
//       y: yPosition,
//       size: 10,
//       font: helveticaFont,
//       maxWidth: maxWidth
//     });
//     yPosition -= 40;

//     const bodyText2 = 'In case you desire any further information / clarification, please do not hesitate to contact us.';
//     page1.drawText(bodyText2, {
//       x: 50,
//       y: yPosition,
//       size: 10,
//       font: helveticaFont,
//       maxWidth: maxWidth
//     });
//     yPosition -= 30;

//     // Closing
//     page1.drawText('Thanking you,', { x: 50, y: yPosition, size: 10, font: helveticaFont });
//     yPosition -= 15;
//     page1.drawText('Yours faithfully,', { x: 50, y: yPosition, size: 10, font: helveticaFont });
//     yPosition -= 25;
//     page1.drawText(tenant, { x: 50, y: yPosition, size: 10, font: helveticaBold });
//     yPosition -= 15;
//     if (quotationData.createdByEmployeeName) {
//       page1.drawText(quotationData.createdByEmployeeName, { x: 50, y: yPosition, size: 10, font: helveticaFont });
//       yPosition -= 15;
//     }
//     if (quotationData.contactNumber) {
//       page1.drawText(`M-${quotationData.contactNumber}`, { x: 50, y: yPosition, size: 10, font: helveticaFont });
//     }

//     // 3. Add lift specification pages (with letterhead background)
//     quotationData.liftDetails.forEach((lift, index) => {
//       const liftPage = pdfDoc.addPage([595.28, 841.89]);
//       addLetterheadToPage(liftPage); // Add letterhead background

//       let y = height - 150; // Start below letterhead header

//       liftPage.drawText(`Lift ${index + 1} Specifications`, {
//         x: width / 2 - 80,
//         y: y,
//         size: 14,
//         font: helveticaBold
//       });
//       y -= 30;

//       const specs = [
//         ['Lift Type', lift.liftTypeName],
//         ['Capacity', `${lift.capacity} kg / ${lift.persons} persons`],
//         ['Speed', `${lift.speed} m/s`],
//         ['Stops/Openings', `${lift.stops} / ${lift.openings}`],
//         ['Travel', `${lift.travel} mm`],
//         ['Machine Room', lift.machineRoomName],
//         ['Drive Type', lift.vfdMainDriveName],
//         ['Control Panel', lift.controlPanelMakeName],
//         ['Door Type', lift.doorTypeName],
//         ['Door Operator', lift.doorOperatorName]
//       ];

//       specs.forEach(([label, value]) => {
//         if (y > 80) { // Leave space for letterhead footer
//           liftPage.drawText(`${label}: ${value || 'N/A'}`, {
//             x: 50,
//             y: y,
//             size: 10,
//             font: helveticaFont
//           });
//           y -= 18;
//         }
//       });

//       y -= 10;

//       if (lift.stdFeatureIds?.length > 0) {
//         if (y > 100) {
//           liftPage.drawText('Standard Features:', {
//             x: 50,
//             y: y,
//             size: 12,
//             font: helveticaBold
//           });
//           y -= 20;
//         }

//         lift.stdFeatureIds.forEach(featureId => {
//           const featureName = featureNameMap[featureId];
//           if (featureName && y > 80) { // Leave space for letterhead footer
//             liftPage.drawText(`• ${featureName}`, {
//               x: 50,
//               y: y,
//               size: 10,
//               font: helveticaFont
//             });
//             y -= 15;
//           }
//         });
//       }
//     });

//     // 4. Add back page (full image, no letterhead)
//     if (includeLetterhead && backImage) {
//       const backPage = pdfDoc.addPage([595.28, 841.89]);
//       backPage.drawImage(backImage, {
//         x: 0,
//         y: 0,
//         width: 595.28,
//         height: 841.89
//       });
//     }

//     // Serialize the PDF
//     const pdfBytes = await pdfDoc.save();
//     const pdfBuffer = Buffer.from(pdfBytes);

//     console.log('✅ PDF generated with pdf-lib, size:', pdfBuffer.length, 'bytes');
//     console.log(`📄 Pages: Cover=${includeLetterhead && coverImage ? 'Yes' : 'No'}, Content=${quotationData.liftDetails.length + 1}, Back=${includeLetterhead && backImage ? 'Yes' : 'No'}`);

//     const disposition = shouldDownload ? 'attachment' : 'inline';

//     return new Response(pdfBuffer, {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/pdf',
//         'Content-Disposition': `${disposition}; filename="${filename}"`,
//         'Content-Length': pdfBuffer.length.toString()
//       }
//     });

//   } catch (err) {
//     console.error('❌ PDF ERROR:', err);
//     console.error('Error stack:', err.stack);
//     return new Response(
//       JSON.stringify({
//         message: 'PDF generation failed',
//         error: process.env.NODE_ENV === 'development' ? err.message : 'Internal error'
//       }),
//       { status: 500, headers: { 'Content-Type': 'application/json' } }
//     );
//   }
// }









// // app/api/pdf-generation/route.js
// import PDFDocument from 'pdfkit';
// import { getQuotationById, getFeatureNameMap } from "@/services/quotationApi";
// import { formatDate } from "@/utils/common";

// export const maxDuration = 30; // Much faster

// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const quotationId = searchParams.get('quotationId');
//     const includeLetterhead = searchParams.get('includeLetterhead') === 'true';
//     const tenant = searchParams.get('tenant');
//     const shouldDownload = searchParams.get('download') === 'true';

//     if (!quotationId || !tenant) {
//       return new Response(
//         JSON.stringify({ message: "Missing required parameters" }),
//         { status: 400, headers: { 'Content-Type': 'application/json' } }
//       );
//     }

//     // Fetch data
//     const response = await getQuotationById(quotationId, tenant);
//     if (!response?.success || !response.data) {
//       return new Response(
//         JSON.stringify({ message: "Quotation not found" }),
//         { status: 404, headers: { 'Content-Type': 'application/json' } }
//       );
//     }

//     const quotationData = response.data;
//     const featureNameMap = await getFeatureNameMap(tenant);
//     const filename = `${(quotationData.customerName || 'quotation').replace(/\s+/g, '_')}_${quotationData.quotationNo || ''}.pdf`;

//     // Create PDF document
//     const doc = new PDFDocument({
//       size: 'A4',
//       margin: 50,
//       bufferPages: true
//     });

//     const chunks = [];

//     // Collect PDF chunks
//     doc.on('data', (chunk) => chunks.push(chunk));

//     // Wait for PDF to finish
//     const pdfPromise = new Promise((resolve, reject) => {
//       doc.on('end', () => resolve(Buffer.concat(chunks)));
//       doc.on('error', reject);
//     });

//     // Add cover page (if you have the image)
//     if (includeLetterhead) {
//       try {
//         doc.image('public/images/cover_page.png', 0, 0, {
//           width: 595.28,
//           height: 841.89
//         });
//         doc.addPage();
//       } catch (err) {
//         console.warn('Cover image not found, skipping');
//       }
//     }

//     // Generate quotation date
//     const dateObject = new Date(quotationData.quotationDate);
//     const monthName = dateObject.toLocaleString('en-US', { month: 'short' });
//     const financialYear = `${String(dateObject.getFullYear()).slice(-2)}-${String(dateObject.getFullYear() + 1).slice(-2)}`;
//     const refNo = `${financialYear}/${monthName}/${quotationData.quotationNo}`;
//     const formattedDate = formatDate(quotationData.quotationDate) || '';

//     // Header
//     doc.fontSize(10)
//       .text(`REF.NO: ${refNo}`, 50, 50, { align: 'left' })
//       .text(`Date: ${formattedDate}`, 50, 50, { align: 'right' });

//     doc.moveDown(2);

//     // To Section
//     doc.fontSize(12).font('Helvetica-Bold').text('To,');
//     doc.fontSize(10).font('Helvetica')
//       .text(quotationData.siteName?.toUpperCase() || '')
//       .text(quotationData.siteAdder?.toUpperCase() || '');

//     doc.moveDown();

//     // Attention
//     doc.font('Helvetica-Bold').text('Kindly Attention,');
//     doc.font('Helvetica')
//       .text(`${quotationData.customerName?.toUpperCase() || ''} ${quotationData.contactNumber ? `(+91 ${quotationData.contactNumber})` : ''}`);

//     if (quotationData.customerName2) {
//       doc.text(`${quotationData.salutations2 || ''} ${quotationData.customerName2?.toUpperCase()} ${quotationData.contactNumber2 || ''}`);
//     }

//     doc.moveDown();
//     doc.text('Dear Sir,');
//     doc.moveDown();

//     // Subject
//     doc.font('Helvetica-Bold').text(`Sub.: `, { continued: true })
//       .font('Helvetica').text(`Supply, Installing, Testing and commissioning of (${quotationData.liftDetails.length}) lifts for your project at ${quotationData.siteName?.toUpperCase() || ''}`);

//     doc.moveDown();

//     // Body
//     doc.font('Helvetica')
//       .text('As desired we take pleasure in submitting herewith our proposal for your subject building.');

//     doc.moveDown();
//     doc.text('In case you desire any further information / clarification, please do not hesitate to contact us.');

//     doc.moveDown();
//     doc.text('Thanking you,')
//       .text('Yours faithfully,')
//       .moveDown()
//       .font('Helvetica-Bold').text(tenant)
//       .font('Helvetica').text(quotationData.createdByEmployeeName || '')
//       .text(quotationData.contactNumber ? `M-${quotationData.contactNumber}` : '');

//     // Add new page for lift details
//     doc.addPage();

//     // Lift Specifications
//     quotationData.liftDetails.forEach((lift, index) => {
//       if (index > 0) doc.addPage();

//       doc.fontSize(14).font('Helvetica-Bold')
//         .text(`Lift ${index + 1} Specifications`, { align: 'center' });

//       doc.moveDown();

//       const specs = [
//         ['Lift Type', lift.liftTypeName],
//         ['Capacity', `${lift.capacity} kg / ${lift.persons} persons`],
//         ['Speed', `${lift.speed} m/s`],
//         ['Stops/Openings', `${lift.stops} / ${lift.openings}`],
//         ['Travel', `${lift.travel} mm`],
//         ['Machine Room', lift.machineRoomName],
//         ['Drive Type', lift.vfdMainDriveName],
//         ['Control Panel', lift.controlPanelMakeName],
//         ['Door Type', lift.doorTypeName],
//         ['Door Operator', lift.doorOperatorName]
//       ];

//       doc.fontSize(10).font('Helvetica');

//       specs.forEach(([label, value]) => {
//         doc.font('Helvetica-Bold').text(`${label}: `, { continued: true })
//           .font('Helvetica').text(value || 'N/A');
//       });

//       doc.moveDown();

//       // Features
//       if (lift.stdFeatureIds?.length > 0) {
//         doc.fontSize(12).font('Helvetica-Bold').text('Standard Features:');
//         doc.fontSize(10).font('Helvetica');

//         lift.stdFeatureIds.forEach(featureId => {
//           const featureName = featureNameMap[featureId];
//           if (featureName) {
//             doc.text(`• ${featureName}`);
//           }
//         });
//       }
//     });

//     // Add back page
//     doc.addPage();
//     try {
//       doc.image('public/images/backpage_page.png', 0, 0, {
//         width: 595.28,
//         height: 841.89
//       });
//     } catch (err) {
//       console.warn('Back page image not found');
//     }

//     // Finalize PDF
//     doc.end();

//     // Wait for PDF generation
//     const pdfBuffer = await pdfPromise;

//     console.log('PDF generated with PDFKit, size:', pdfBuffer.length, 'bytes');

//     const disposition = shouldDownload ? 'attachment' : 'inline';

//     return new Response(pdfBuffer, {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/pdf',
//         'Content-Disposition': `${disposition}; filename="${filename}"`,
//         'Content-Length': pdfBuffer.length.toString()
//       }
//     });

//   } catch (err) {
//     console.error('PDF ERROR:', err);
//     return new Response(
//       JSON.stringify({
//         message: 'PDF generation failed',
//         error: process.env.NODE_ENV === 'development' ? err.message : 'Internal error'
//       }),
//       { status: 500, headers: { 'Content-Type': 'application/json' } }
//     );
//   }
// }




// // app/api/pdf-generation/route.js
// import htmlPdf from 'html-pdf-node';
// import { getQuotationById, getFeatureNameMap } from "@/services/quotationApi";
// import { generateQuotationHtml } from "./pdfTemplateGenerator";

// // Ensure the Node.js process has proper timeout for PDF generation
// export const maxDuration = 60; // Max execution time for Vercel/Next.js

// export async function GET(request) {
//   try {
//     // Extract base URL and construct image paths
//     const url = new URL(request.url);
//     const BASE_URL = `${url.protocol}//${url.host}`;
//     const COVER_IMG = `${BASE_URL}/images/cover_page.png`;
//     const BACK_IMG = `${BASE_URL}/images/backpage_page.png`;
//     const LETTERHEAD_SOURCE = `${BASE_URL}/images/letterhead_full.png`;

//     // Parse query parameters
//     const { searchParams } = new URL(request.url);
//     const quotationId = searchParams.get('quotationId');
//     const includeLetterhead = searchParams.get('includeLetterhead') === 'true';
//     const tenant = searchParams.get('tenant');
//     const shouldDownload = searchParams.get('download') === 'true';

//     // Validate required parameters
//     if (!quotationId || !tenant) {
//       return new Response(
//         JSON.stringify({ message: "Missing required parameters" }),
//         {
//           status: 400,
//           headers: { 'Content-Type': 'application/json' }
//         }
//       );
//     }

//     // ----------------- 1. Fetch backend data (Reuse your existing logic) -----------------
//     const response = await getQuotationById(quotationId, tenant);
//     if (!response || !response.success || !response.data) {
//       return new Response(
//         JSON.stringify({ message: "Quotation not found" }),
//         {
//           status: 404,
//           headers: { 'Content-Type': 'application/json' }
//         }
//       );
//     }
//     const quotationData = response.data;

//     console.log('Quotation Data for PDF:', quotationData);
//     console.log('Quotation floorSelectionLabels-----------:', quotationData.liftDetails[0].floorSelectionLabels);

//     // Generate filename
//     const filename = `${(quotationData.customerName || 'quotation').replace(/\s+/g, '_')}_${quotationData.quotationNo || ''}.pdf`;

//     // Fetch feature name mapping
//     const featureNameMap = await getFeatureNameMap(tenant);

//     // ----------------- 2. Generate the entire HTML document string -----------------
//     const html = generateQuotationHtml(
//       quotationData,
//       includeLetterhead,
//       tenant,
//       COVER_IMG,
//       BACK_IMG,
//       LETTERHEAD_SOURCE,
//       featureNameMap
//     );

//     // ----------------- 3. Configure PDF generation options -----------------
//     // html-pdf-node uses Puppeteer internally but with optimized memory settings
//     const options = {
//       format: 'A4',
//       printBackground: true,
//       // Configure margins to match your template requirements
//       margin: {
//         top: 0,
//         bottom: 0,
//         left: 0,
//         right: 0
//       },
//       displayHeaderFooter: false, // MANDATORY: Disable native headers/footers
//       preferCSSPageSize: true, // Respect CSS @page rules

//       // Puppeteer launch args for memory optimization
//       args: [
//         '--no-sandbox',
//         '--disable-setuid-sandbox',
//         '--disable-dev-shm-usage', // Use disk instead of /dev/shm
//         '--disable-gpu',
//         '--disable-software-rasterizer',
//         '--disable-extensions'
//       ],

//       // Additional optimization options
//       path: null, // Return buffer instead of saving to file

//       // Viewport settings for consistent rendering
//       viewport: {
//         width: 1200,
//         height: 1600
//       }
//     };

//     // File object for html-pdf-node
//     const file = { content: html };

//     // ----------------- 4. Generate PDF using html-pdf-node -----------------
//     console.log('Generating PDF with html-pdf-node...');
//     const pdfBuffer = await htmlPdf.generatePdf(file, options);
//     console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes');

//     // ----------------- 5. Return the PDF buffer -----------------
//     const disposition = shouldDownload ? 'attachment' : 'inline';

//     return new Response(pdfBuffer, {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/pdf',
//         'Content-Disposition': `${disposition}; filename="${filename}"`,
//         'Content-Length': pdfBuffer.length.toString(),
//         'Cache-Control': 'no-cache, no-store, must-revalidate',
//         'Pragma': 'no-cache',
//         'Expires': '0'
//       }
//     });

//   } catch (err) {
//     console.error('PDF GENERATION ERROR:', err);
//     console.error('Error stack:', err.stack);

//     return new Response(
//       JSON.stringify({
//         message: 'PDF generation failed.',
//         error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
//       }),
//       {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' }
//       }
//     );
//   }
// }




// // app/api/pdf-generation/route.js
// import { renderToBuffer } from '@react-pdf/renderer';
// import QuotationDocument from './QuotationDocument'; // Your PDF component
// import { getQuotationById, getFeatureNameMap } from "@/services/quotationApi";

// export const maxDuration = 30; // Much faster than Playwright

// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const quotationId = searchParams.get('quotationId');
//     const includeLetterhead = searchParams.get('includeLetterhead') === 'true';
//     const tenant = searchParams.get('tenant');
//     const shouldDownload = searchParams.get('download') === 'true';

//     if (!quotationId || !tenant) {
//       return new Response(
//         JSON.stringify({ message: "Missing required parameters" }),
//         { status: 400, headers: { 'Content-Type': 'application/json' } }
//       );
//     }

//     // Fetch data
//     const response = await getQuotationById(quotationId, tenant);
//     if (!response?.success || !response.data) {
//       return new Response(
//         JSON.stringify({ message: "Quotation not found" }),
//         { status: 404, headers: { 'Content-Type': 'application/json' } }
//       );
//     }

//     const quotationData = response.data;
//     const featureNameMap = await getFeatureNameMap(tenant);
//     const filename = `${(quotationData.customerName || 'quotation').replace(/\s+/g, '_')}_${quotationData.quotationNo || ''}.pdf`;

//     // Generate PDF (uses ~100MB memory vs ~500MB for Playwright)
//     const pdfBuffer = await renderToBuffer(
//       <QuotationDocument
//         data={quotationData}
//         includeLetterhead={includeLetterhead}
//         featureNameMap={featureNameMap}
//       />
//     );

//     const disposition = shouldDownload ? 'attachment' : 'inline';

//     return new Response(pdfBuffer, {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/pdf',
//         'Content-Disposition': `${disposition}; filename="${filename}"`,
//         'Content-Length': pdfBuffer.length.toString()
//       }
//     });

//   } catch (err) {
//     console.error('PDF ERROR:', err);
//     return new Response(
//       JSON.stringify({ message: 'PDF generation failed', error: err.message }),
//       { status: 500, headers: { 'Content-Type': 'application/json' } }
//     );
//   }
// }






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

    console.log('Quotation Data for PDF:', quotationData);
    console.log('Quotation floorSelectionLabels-----------:', quotationData.liftDetails[0].floorSelectionLabels);

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
    browser = await puppeteer.launch({
      // Recommended args for production/CI environments
      // args: ["--no-sandbox", "--disable-setuid-sandbox"],
      // headless: "new", // Modern headless mode

      // executablePath: "/usr/bin/chromium-browser",
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        // "--disable-gpu",
        // "--no-zygote",
        // "--single-process"
      ],
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
  } finally {
    if (browser) await browser.close();
  }
}