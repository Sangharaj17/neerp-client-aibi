// Import all your HTML generation utility functions here
import {
    generateLiftTable,
    generateStandardFeaturesTable,
    generateScopeOfWorkHtml,
    generateLiftPriceRow,
    generateCombinedLiftPriceTable,
    generateTermsAndConditionsHtml
} from "@/utils/pdfElementCreations";
import { formatDate } from "@/utils/common";

// NOTE: Placeholder functions for utilities that should be external.
const getFeatureNameMap = () => { /* Logic to fetch/create map */ return {}; };
// Added a placeholder for utility function usage consistency.


/**
 * Generates the full, single HTML document string for Puppeteer to render.
 * @param {object} quotationData - The data fetched from the Spring Boot API.
 * @param {boolean} includeLetterhead - Whether to include specific letterhead elements.
 * @param {string} COVER_IMG_URL - Absolute URL for the cover page image.
 * @param {string} BACK_IMG_URL - Absolute URL for the back page image.
 * @param {string} LETTERHEAD_URL - Absolute URL for the full letterhead image.
 * @returns {string} The full HTML document string.
 */
export const generateQuotationHtml = (
    quotationData,
    includeLetterhead,
    tenant,
    COVER_IMG_URL,
    BACK_IMG_URL,
    LETTERHEAD_URL,
    featureNameMap
) => {
    // Data Extraction 
    let company_name = tenant;
    const values = "";

    const dateObject = new Date(quotationData.quotationDate);
    const refName = "";
    const monthName = dateObject.toLocaleString('en-US', { month: 'short' });
    const financialYear = `${String(dateObject.getFullYear()).slice(-2)}-${String(dateObject.getFullYear() + 1).slice(-2)}`;
    const refNo = `${financialYear}/${monthName}/${quotationData.quotationNo}`;

    const newQuatationDate = formatDate(quotationData.quotationDate) || '';
    const quotationNo = quotationData.quotationNo || '';

    const site_address = quotationData.siteAdder || '';
    const siteName = quotationData.siteName || '';

    const customerName = quotationData.customerName || '';
    const contact_number = quotationData.contactNumber || '';
    const contact_number1 = quotationData.contactNumber1 || '';

    const customer_name2 = quotationData.customerName2 || "";
    const contact_number2 = quotationData.contactNumber2 || "";

    const salutations1 = quotationData.salutations1 || '';
    const salutations2 = quotationData.customerName2 ? quotationData.salutations2 : "";

    const activity_by = quotationData.createdByEmployeeName || '';
    const employeeContactNumber = quotationData.contactNumber || ''; // Assuming contactNumber is the employee's contact
    const employeeRoleName = quotationData.employeeRoleName || '';

    const lift_qnty = quotationData.liftDetails.length || '';

    // Define the safe area heights for the letterhead (critical for the margin fix)
    const LETTERHEAD_TOP_SAFE_MM = 50;
    const LETTERHEAD_BOTTOM_SAFE_MM = 28;
    const CONTENT_SIDE_MARGIN_MM = 12;

    const globalStyles = `
    <style>
        :root {
            --a4-width-mm: 210mm;
            --a4-height-mm: 297mm;
        }
        
        html,body { 
            height:100%; 
            margin:0; 
            padding:0; 
            font-family: "Segoe UI", Arial, sans-serif; 
            font-size:11pt; 
            color:#111; 
            /* FIX: Force background rendering */
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }


        /* ------------------------------------------------------------------
           CRITICAL: Use @page to define content margins
           ------------------------------------------------------------------ */
        
        /* Default page rule: Applies to all pages unless a named page is used */
        @page {
            size: A4;
            /* 1. Define the content safe zone: Text content will be restricted to the area INSIDE these margins. */
            /* This applies the necessary padding for the letterhead header/footer area to the content. */
            margin: ${LETTERHEAD_TOP_SAFE_MM}mm ${CONTENT_SIDE_MARGIN_MM}mm ${LETTERHEAD_BOTTOM_SAFE_MM}mm ${CONTENT_SIDE_MARGIN_MM}mm;
            
            /* Background is now handled by the .letterhead-overlay div (full-bleed) */
            background-image: none !important; 
            
            /* Page Numbering */
            counter-increment: page;
            @bottom-right {
                content: "Page " counter(page);
                font-size: 10pt;
                color: #555;
                margin-bottom: 5mm; /* Position page number inside the 30mm bottom margin */
            }
        }

        /* --- Named Page Overrides (Cover and Back) --- */
        /* These pages are full bleed and MUST override the content margins/backgrounds */
        @page cover-page {
            margin: 0; /* Full bleed, no margin */
            background-image: none !important;
            counter-reset: page 0; /* Disable page number on cover and reset counter */
            @bottom-right { content: none; }
        }

        @page back-page {
            margin: 0; /* Full bleed, no margin */
            background-image: none !important;
            counter-increment: none;
            @bottom-right { content: none; }
        }
        
        /* ------------------------------------------------------------------
           HTML Content Styles
           ------------------------------------------------------------------ */

        /* Assign named pages to the cover and back elements (Full bleed content) */
        .cover-page { page: cover-page; background-image: url('${COVER_IMG_URL}'); }
        .back-page { page: back-page; background-image: url('${BACK_IMG_URL}'); page-break-after: avoid !important; }

        .cover-page, .back-page {
            width: var(--a4-width-mm);
            height: var(--a4-height-mm);
            display:block;
            background-repeat:no-repeat;
            background-size:cover;
            background-position:center center;
            margin:0;
            padding:0;
            page-break-after: always;
            box-sizing: border-box;
        }

        /* Content pages now rely 100% on the @page margin for safety. */
        .content-page {
            /* Width is relative to the *content area* defined by the @page margins */
            width: 100%;
            /* min-height is no longer needed as the @page margin defines the content block */
            box-sizing: border-box;
            /* No internal padding/margin needed, as @page margin already defines the safe area */
            padding: 0; 
            margin: 0;
            page-break-after: always;
        }
        
        /* Letterhead Overlay DIV for maximum compatibility across print engines. */
        
        @media print {
        * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        }

        .letterhead-overlay {
            position: fixed;
            inset: 0;
            width: 100vw !important;
            height: 100vh !important;

            background-image: url('${LETTERHEAD_URL}') !important;
            background-size: cover !important;
            background-repeat: no-repeat !important;

            z-index: -1000;
            pointer-events: none;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;

            }

        /* Keep tables and headings safe during page-breaks */
        table { width:100%; border-collapse: collapse; page-break-inside: avoid; }
        thead { display: table-header-group; }
        tfoot { display: table-footer-group; }
        tr { page-break-inside: avoid; page-break-after: auto; }
        h1,h2,h3 { page-break-after: avoid; margin-top:0.6rem; margin-bottom:0.4rem; }
        p { page-break-inside: avoid; }
        .page-break { page-break-before: always; }

    </style>
    `;



    // ******************** 2. Build Content Sections ***************

    // --- A. Cover Page ---
    const coverPageHtml = `
        <div class="cover-page"></div>
    `;


    // --- B. Initial Letter (First Content Page) ---
    // Note: The content automatically flows within the @page margins.
    const initialLetterHtml = `
        <div class="content-page">
            <div style="line-height:1.6;">
                <table style="width:100%; margin-bottom:16mm;">
                    <tr>
                        <td style="text-align:left;"><strong>REF.NO: ${refNo}</strong></td>
                        <td style="text-align:right;">Date: ${newQuatationDate}</td>
                    </tr>
                </table>

                <p style="margin:6mm 0;"><strong>To,</strong><br/>
                    <span style="text-transform:uppercase;">${siteName}</span><br/>
                    <span style="text-transform:uppercase;">${site_address}</span>
                </p>

                <p style="margin:6mm 0;"><strong>Kindly Attention,</strong><br/>
                    <strong style="text-transform:uppercase;">
                        ${customerName} ${contact_number ? `( +91 ${quotationData.contactNumber} )` : ''}           
                        ${customer_name2
            ? `<br>${salutations2}&nbsp;${customer_name2}&nbsp;${contact_number2}`
            : ''
        }
                    </strong>
                </p>
                
                <p style="margin:6mm 0;">Dear Sir,</p>

                <p style="margin:6mm 0;">
                    <strong>Sub.:</strong> Supply, Installing, Testing and commissioning of (${quotationData.liftDetails.length}) lifts for your project at
                    <strong style="text-transform:uppercase;"> ${siteName}</strong>
                </p>

                <p style="margin:6mm 0;">
                    As desired we take pleasure in submitting herewith our proposal for your subject building.
                    <br/><br/>
                    In case you desire any further information / clarification, please do not hesitate to contact us.
                    <br/><br/>
                    Thanking you,<br/>
                    Yours faithfully,<br/><br/>
                    <strong>${company_name}</strong><br/>
                    ${activity_by != '' ? activity_by + '<br/>' : ''}
                    ${contact_number != '' ? `M-${contact_number}` : ''}
                </p>
            </div>
        </div>
    `;


    // --- C. Lift Specifications and Features ---
    let liftSpecsHtml = '';
    quotationData.liftDetails.forEach((lift, i) => {
        liftSpecsHtml += `
            <div class="content-page">
                ${generateLiftTable(lift,
            i,
            quotationData.customerName || '',
            quotationData.siteAdder || '',
            refName,
            financialYear,
            monthName,
            quotationData.quotationNo || '',
            newQuatationDate)
            }
            `;

        if (lift.stdFeatureIds && lift.stdFeatureIds.length > 0) {
            liftSpecsHtml += `              
                ${generateStandardFeaturesTable(
                lift.stdFeatureIds,
                featureNameMap,
                lift.liftTypeName,
                lift.vfdMainDriveName,
                lift.controlPanelMakeName,
                lift.doorOperatorName,
                lift.mainMachineSetName,
                lift.carRailsName,
                lift.wireRopeName,
                lift.wiringHarnessName
            )}              
            </div>
            `;
        }
    });



    // --- D. Scope, Price, and Terms ---
    const scopeContent = quotationData.scopeOfWorkContent;
    const proposalContent = quotationData.proposalTermsContent;
    const liftRows = quotationData.liftDetails
        .map(lift => generateLiftPriceRow(lift))
        .join("");

    const liftPriceTables = generateCombinedLiftPriceTable(
        liftRows,
        quotationData.customerName,
        quotationData.siteAdder,
        refName,
        financialYear,
        monthName,
        newQuatationDate
    );

    // collect lift-specific scope info
    const liftScopeData = quotationData.liftDetails.map((lift, idx) => ({
        liftNo: idx + 1,
        warranty_period: lift.warrantyPeriodName,
        pwd_including: lift.pwdIncludeExclude,
        pwd_amount: lift.pwdAmount,
        scaf_including: lift.scaffoldingIncludeExclude,
        scaf_amount: lift.bambooScaffolding
    }));

    const scopePriceAndTermsHtml = `
            <div class="page-break"></div>
            <div class="content-page">
                ${generateScopeOfWorkHtml(
        scopeContent,
        liftScopeData,
        liftPriceTables,
        proposalContent,
        company_name,
        values)}
    </div>
        `;

    // --- E. Terms & Conditions ---
    const tncHtml = `
        <div class="page-break"></div>
        <div class="content-page">
            ${generateTermsAndConditionsHtml(quotationData.tncContent)}
        </div>
    `;

    // --- F. Back Page ---
    const backPageHtml = `<div class="back-page"></div>`;

    // 3. Assemble the final HTML document
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${(quotationData.customerName || 'quotation').replace(/\s+/g, '_')}_${quotationData.quotationNo || ''}</title>
            ${globalStyles}
        </head>
        <body>
            ${includeLetterhead ? `<div class="letterhead-overlay" style="margin: 0 !important;"></div>` : ''}
            <div class="content-wrapper">
                ${coverPageHtml}
                ${initialLetterHtml}
                ${liftSpecsHtml}
                ${scopePriceAndTermsHtml}
                ${tncHtml}
                ${backPageHtml}
            </div>
        </body>
        </html>
    `;
};