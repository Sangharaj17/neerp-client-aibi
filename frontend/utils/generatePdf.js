'use client';
import { toast } from "react-hot-toast";
import { getQuotationById, getFeatureNameMap } from "@/services/quotationApi";
import { generateLiftTable, generateStandardFeaturesTable, generateScopeOfWorkHtml, generateLiftPriceRow, generateCombinedLiftPriceTable, generateProposalTermsHtml, generateTermsAndConditionsHtml } from "@/utils/pdfElementCreations";
import { formatDate } from "@/utils/common";


// Function to check if a file path is an image extension
const isImagePath = (path) => {
  if (!path) return false;
  const lowerCasePath = path.toLowerCase();
  // Includes jpeg, jpg, png, webp, gif, etc.
  return /\.(jpe?g|png|gif|webp)$/i.test(lowerCasePath);
};


/**
 * Robust PDF generator using jsPDF + html2canvas.
 * - Cover (full page image) -> no header/footer/watermark
 * - Body (page) -> header + watermark + footer
 * - Each lift -> its own page with header + watermark + footer
 * - Back cover (full page image) -> no header/footer/watermark
 *
 * Auto-saves and opens PDF in new tab.
 *
 * Uses local files (will be converted to URLs by the environment):
 *  - /mnt/data/cover_page.png
 *  - /mnt/data/backpage_page.png
 *  - /mnt/data/header.png
 *  - /mnt/data/footer.png
 *  - /mnt/data/watermark.png
 */
export const generatePdf = async (quotationMainId, includeLetterhead = true, onStart, onComplete) => {
  if (onStart) onStart();
  const TOAST_ID = 'pdf-robust-loading';

  try {
    toast.loading('Generating robust PDF...', { id: TOAST_ID });

    const response = await getQuotationById(quotationMainId);
    if (!response || !response.success) throw new Error('Failed to fetch quotation details');
    const quotationData = response.data;

    // console.log('Quotation Data for PDF:', quotationData);



    const featureNameMap = await getFeatureNameMap();


    // const comp_manu = await fetchComponents();
    // console.log("=========fetchComponents=========>",fetchComponents);


    const storedTenant = localStorage.getItem("tenant");
    let company_name = "";

    if (storedTenant) {
      const clientNameKey = `${storedTenant}_clientName`;
      const storedClientName = localStorage.getItem(clientNameKey);
      if (storedClientName) {
        company_name = storedClientName;
      }
    }

    const values = "";

    const dateObject = new Date(quotationData.quotationDate);
    const refName = "";
    const monthName = dateObject.toLocaleString('en-US', { month: 'short' });
    const financialYear = `${String(dateObject.getFullYear()).slice(-2)}-${String(dateObject.getFullYear() + 1).slice(-2)}`;

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
    const employeeContactNumber = quotationData.employeeContactNumber || '';
    const employeeRoleName = quotationData.employeeRoleName || '';


    const lift_qnty = quotationData.liftDetails.length || '';


    // Use your images (local paths)
    // Your environment will transform these local paths into accessible URLs.
    const COVER_IMG = '/images/cover_page.png';
    const BACK_IMG = '/images/backpage_page.png';
    const LETTERHEAD_SOURCE = '/images/letterhead_full.png';

    // const HEADER_IMG = '/images/header.png';
    // const FOOTER_IMG = '/images/footer.png';
    // const WATERMARK_IMG = '/images/watermark.png';



    // imports
    const [{ jsPDF }, html2canvas] = await Promise.all([
      import('jspdf').then(m => m),
      import('html2canvas').then(m => m.default || m)
    ]);

    // Create jsPDF A4 size in mm
    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    });

    pdf.deletePage(1);

    // A4 sizes in mm
    const A4_WIDTH_MM = 210;
    const A4_HEIGHT_MM = 297;

    // We'll render each page by building a temporary DOM element, converting it to canvas with html2canvas,
    // then inserting the resulting image into jsPDF as a full page image.
    // To get good quality, compute pixel sizes based on 2x scale.
    const pxPerMm = 3.7795275591; // 1 mm ~ 3.7795 px (approx at 96 DPI). We'll override via html2canvas scale.
    const targetDpiScale = 2; // 2x for crisp images


    const renderHtmlToPdfPage = async (htmlString) => {
      const wrapper = document.createElement("div");

      wrapper.style.width = "800px";
      wrapper.style.position = "absolute";
      wrapper.style.left = "-99999px";
      wrapper.innerHTML = htmlString;

      document.body.appendChild(wrapper);

      await new Promise(r => setTimeout(r, 50));

      const canvas = await html2canvas(wrapper, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      document.body.removeChild(wrapper);

      const imgData = canvas.toDataURL("image/jpeg", 0.95);

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      return { imgData, imgWidth, imgHeight, heightLeft, position, pageHeight };
    };

    const addMultipage = (pdf, page) => {
      pdf.addPage();
      pdf.addImage(page.imgData, "JPEG", 0, page.position, page.imgWidth, page.imgHeight);

      page.heightLeft -= page.pageHeight;

      while (page.heightLeft > 0) {
        pdf.addPage();
        page.position = page.heightLeft - page.imgHeight;
        pdf.addImage(page.imgData, "JPEG", 0, page.position, page.imgWidth, page.imgHeight);
        page.heightLeft -= page.pageHeight;
      }
    };
    

    // 1) Render COVER full-page image (no header/footer/watermark)
    if (includeLetterhead) {
      // create simple wrapper with full-cover image stretched to A4 (object-fit:cover)
      const coverHtml = `
        <div style="width:100%; height:100%; position:relative; overflow:hidden;">
          <img src="${COVER_IMG}" style="width:100%; height:100%; object-fit:cover; display:block;" />
        </div>
      `;
      const coverPage = await renderHtmlToPdfPage(coverHtml);
      addMultipage(pdf, coverPage);
    }

    // Prepare a function to build inner page HTML (header + watermark + content + footer)
    const buildInnerPageHtml = (contentHtml) => {
      // Define the content area margins dynamically
      const TOP_MARGIN = '50mm';
      const BOTTOM_MARGIN = '30mm';
      const DEFAULT_MARGIN = '10mm';

      let letterheadLayerHtml = '';
      const isImageLetterhead = isImagePath(LETTERHEAD_SOURCE);

      if (includeLetterhead && isImageLetterhead) {
        letterheadLayerHtml = `
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden; z-index: 1;">
                <img src="${LETTERHEAD_SOURCE}" style="width:100%; height:100%; object-fit:cover; display:block;" />
            </div>
        `;
      }

      // Set dynamic margins for the content div
      // const contentTopMargin = includeLetterhead ? TOP_MARGIN : DEFAULT_MARGIN;
      // const contentBottomMargin = includeLetterhead ? BOTTOM_MARGIN : DEFAULT_MARGIN;

      // Use inline styles; images loaded from local paths.
      return `
      <style>
        ul { 
            padding-left: 20px;             
        }

        li {
            list-style-type:disc;
        }
        </style>

        <div style="width:100%; height:100%; position:relative;         
            /* GLOBAL FONT SETTINGS FOR ALL INNER PAGES */
          font-family: Roboto, 'Segoe UI', Calibri, Arial, sans-serif;
          /*font-size: 32pt;
          line-height: 1.35;*/
          -webkit-font-smoothing: antialiased;
          font-smooth: always;
          color: #000;
        ">

          ${letterheadLayerHtml}

          <!-- CONTENT area: leave margins for header/footer -->
          <div style="
            position: absolute;
            top: ${TOP_MARGIN};
            bottom: ${BOTTOM_MARGIN};

            /* SET YOUR LEFT/RIGHT MARGINS HERE */
            padding-left: 15mm;
            padding-right: 15mm;

            box-sizing: border-box;
            overflow: hidden;
            z-index: 2; /* Ensure content is above the background image */
          ">

            <!-- INNER CONTENT (scaling only) -->
            <div style="
              /* transform: scale(1.08); */
              transform-origin: top left;
              margin-top: ${TOP_MARGIN};
              margin-bottom: ${BOTTOM_MARGIN};
            ">
            ${contentHtml}
          </div>
        </div>
      `;
    };

    // 2) Render Body page (inner page index 1)
    {
      const bodyContent = `
        <div style="font-size:26pt; line-height:1.4;">
          <table style="width:100%; border-collapse: collapse; margin-bottom:16mm;">
            <tr>
              <td style="text-align:left;"><strong>REF.NO: ${refName}/${financialYear}/${monthName}/${quotationNo}</strong></td>
              <td style="text-align:right;">Date: ${newQuatationDate}</td>
            </tr>
          </table>

          <p style="margin:6mm 0;"><strong>To,</strong><br/>
            <span style="text-transform:uppercase;">${siteName}</span><br/>
            <span style="text-transform:uppercase;">${site_address}</span>
          </p>

          <p style="margin:6mm 0;"><strong>Kindly Attention,</strong><br/>
            <strong style="text-transform:uppercase;">
                  ${customerName} ${{ contact_number } ? `( +91 ${quotationData.contactNumber} )` : ''}
                  ${customer_name2 // Check if customer_name2 is not null or empty
          ? `<br>${salutations2}&nbsp;${customer_name2}&nbsp;${contact_number2}`
          : ''
        }
            </strong>
          </p>

          <p style="margin:6mm 0;">Dear Sir,</p>

          <p style="margin:6mm 0;">
            <strong>Sub.:</strong> Supply, Installing, Testing and commissioning of (01) for your project at
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
      `;

      const innerHtml = buildInnerPageHtml(bodyContent);
      const bodyPage = await renderHtmlToPdfPage(innerHtml);
      addMultipage(pdf, bodyPage);
    }

    // 3) Render each lift page (each a separate page)
    if (quotationData.liftDetails && quotationData.liftDetails.length) {
      for (let i = 0; i < quotationData.liftDetails.length; i++) {
        const lift = quotationData.liftDetails[i];
        const isLastLift = i === quotationData.liftDetails.length - 1;

        // --- A. TECHNICAL SPECIFICATION SHEET PAGE ---
        const liftTableHtml = `
              <div style="margin: 25px 0 0 0;">
                ${generateLiftTable(
          lift,
          i,
          quotationData.customerName || '',
          quotationData.siteAdder || '',
          refName,
          financialYear,
          monthName,
          quotationData.quotationNo || '',
          newQuatationDate
        )}
              </div>
            `;

        let innerHtml = buildInnerPageHtml(liftTableHtml);
        const liftPage = await renderHtmlToPdfPage(innerHtml);
        addMultipage(pdf, liftPage);


        // --- B. STANDARD FEATURES PAGE (IF DATA EXISTS) ---
        if (lift.stdFeatureIds && lift.stdFeatureIds.length > 0) {

          // Generate the Features Table HTML
          let featuresHtmlContent = `
                    <div style="width: 100%;">
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

          // --- C. SCOPE OF WORK (APPEND TO LAST LIFT'S FEATURE PAGE) ---
          // if (isLastLift) {
          //   // Here, you would access the DB field for Scope of Work content
          //   const scopeContent = quotationData.scopeOfWorkContent; // Placeholder for DB field
          //   featuresHtmlContent += `
          // 		<div style="margin-top: 50px;">
          // 			${generateScopeOfWorkHtml(scopeContent)}
          // 		</div>
          // 	`;
          // }

          // Render and add the Features Page
          innerHtml = buildInnerPageHtml(featuresHtmlContent);
          const featuresPage = await renderHtmlToPdfPage(innerHtml);
          addMultipage(pdf, featuresPage);
        }

      }
    }

    // 4)--- SCOPE OF WORK ON SEPARATE PAGE ---
    {
      const scopeContent = quotationData.scopeOfWorkContent;
      const proposalContent = quotationData.proposalTermsContent; // Placeholder for DB field

      // create rows for each lift
      const liftRows = quotationData.liftDetails
        .map(lift => generateLiftPriceRow(lift))
        .join("");

      // full price table with single header + all rows
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

      // generate final HTML
      const scopeHtml = generateScopeOfWorkHtml(
        scopeContent,
        liftScopeData,
        liftPriceTables,
        proposalContent,
        company_name,
        values
      );

      const innerHtml = buildInnerPageHtml(scopeHtml);
      const scopePage = await renderHtmlToPdfPage(innerHtml);
      addMultipage(pdf, scopePage);
    }


    // 5) PROPOSAL WITH PAYMENT TERMS PAGE
    // {
    //   // Access the DB field for Proposal/Payment Terms content
    //   const proposalContent = quotationData.proposalTermsContent; // Placeholder for DB field
    //   const proposalHtml = generateProposalTermsHtml(proposalContent);

    //   const innerHtml = buildInnerPageHtml(proposalHtml);
    //   const { dataUrl } = await renderHtmlToPdfPage(innerHtml);
    //   addJpgToPdfFullPage(dataUrl, pdf.getNumberOfPages());
    // }

    // 5) TERMS AND CONDITIONS PAGE
    {
      // Access the DB field for Terms and Conditions content
      let tncContent = quotationData.tncContent; // Placeholder for DB field      
      const tncHtml = generateTermsAndConditionsHtml(tncContent);

      const innerHtml = buildInnerPageHtml(tncHtml);
      const tncPage = await renderHtmlToPdfPage(innerHtml);
      addMultipage(pdf, tncPage);
    }

    // 7) Back cover (final page) - no header/footer/watermark
    if (includeLetterhead) {
      const backHtml = `
        <div style="width:100%; height:100%; position:relative; overflow:hidden;">
          <img src="${BACK_IMG}" style="width:100%; height:100%; object-fit:cover; display:block;" />
        </div>
      `;
      const backPage = await renderHtmlToPdfPage(backHtml);
      addMultipage(pdf, backPage);
    }

    // PDF is built. Now save + open in new tab.
    const filename = `${(quotationData.customerName || 'quotation').replace(/\s+/g, '_')}_${quotationData.id || ''}.pdf`;

    // save (download)
    const pdfBlob = pdf.output('blob');
    const downloadUrl = URL.createObjectURL(pdfBlob);

    // trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    // open in new tab
    window.open(downloadUrl, '_blank');

    // cleanup: revoke objectURL after a short delay
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 20000);

    toast.success('PDF generated, downloaded and opened in new tab', { id: TOAST_ID });
  } catch (err) {
    console.error('PDF generation error:', err);
    toast.error('Failed to generate PDF. See console for details', { id: TOAST_ID });
  } finally {
    if (onComplete) onComplete();
  }
};
