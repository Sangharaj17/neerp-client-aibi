'use client';
import { toast } from "react-hot-toast";
import { getQuotationById, getFeatureNameMap } from "@/services/quotationApi";
import { generateLiftTable, generateStandardFeaturesTable, generateScopeOfWorkHtml, generateLiftPriceRow, generateCombinedLiftPriceTable, generateProposalTermsHtml, generateTermsAndConditionsHtml } from "@/utils/pdfElementCreations";
import { formatDate } from "@/utils/common";

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
    const HEADER_IMG = '/images/header.png';
    const FOOTER_IMG = '/images/footer.png';
    const WATERMARK_IMG = '/images/watermark.png';

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

    // helper: create an element used for html2canvas rendering
    const renderHtmlToPdfPage = async (htmlString, options = {}) => {
      // options: { fullPageImage: boolean } - if fullPageImage true, we render with no margins and size = A4
      const wrapper = document.createElement('div');
      // apply styles so wrapper has exact A4 px dimensions for html2canvas
      const mmToPx = mm => Math.round(mm * pxPerMm * targetDpiScale);
      wrapper.style.width = `${mmToPx(A4_WIDTH_MM)}px`;
      wrapper.style.height = `${mmToPx(A4_HEIGHT_MM)}px`;
      wrapper.style.boxSizing = 'border-box';
      wrapper.style.background = options.background || '#ffffff';
      wrapper.style.position = 'relative';
      wrapper.style.overflow = 'hidden';
      wrapper.innerHTML = htmlString;

      // append to DOM (offscreen) so fonts/images can load
      wrapper.style.position = 'fixed';
      wrapper.style.left = '-9999px';
      wrapper.style.top = '0';
      document.body.appendChild(wrapper);

      // wait a tick to let images start loading
      await new Promise(r => setTimeout(r, 50));

      // use html2canvas with high scale for quality
      const canvas = await html2canvas(wrapper, {
        scale: targetDpiScale,
        useCORS: true,
        allowTaint: false,
        logging: false,
        imageTimeout: 15000,
        // ensure we render full element
        width: wrapper.offsetWidth,
        height: wrapper.offsetHeight,
        windowWidth: wrapper.offsetWidth,
        windowHeight: wrapper.offsetHeight
      });

      // clean up
      document.body.removeChild(wrapper);

      // convert to dataURL
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

      return { dataUrl, canvasWidth: canvas.width, canvasHeight: canvas.height };
    };

    // helper: add image dataURL as a full A4 page in PDF. If not first page, addPage first.
    const addJpgToPdfFullPage = (dataUrl, pageIndex) => {
      // if (pageIndex > 0) pdf.addPage();
      // jsPDF addImage expects dimensions in units (mm)
      pdf.addPage();
      pdf.addImage(dataUrl, 'JPEG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);
    };

    // 1) Render COVER full-page image (no header/footer/watermark)
    if (includeLetterhead) {
      // create simple wrapper with full-cover image stretched to A4 (object-fit:cover)
      const coverHtml = `
        <div style="width:100%; height:100%; position:relative; overflow:hidden;">
          <img src="${COVER_IMG}" style="width:100%; height:100%; object-fit:cover; display:block;" />
        </div>
      `;
      const { dataUrl } = await renderHtmlToPdfPage(coverHtml, { background: '#ffffff' });
      // pageIndex = 0 = first page
      addJpgToPdfFullPage(dataUrl, 0);
    }

    // Prepare a function to build inner page HTML (header + watermark + content + footer)
    const buildInnerPageHtml = (contentHtml) => {
      // Define the content area margins dynamically
      const HEADER_HEIGHT_MM = 40; // Space reserved for the header
      const FOOTER_HEIGHT_MM = 28; // Space reserved for the footer
      const DEFAULT_MARGIN_MM = 10; // Margin when letterhead is excluded

      // Set top margin: 40mm if letterhead is included, 10mm otherwise
      const topMargin = includeLetterhead ? `${HEADER_HEIGHT_MM}mm` : `${DEFAULT_MARGIN_MM}mm`;

      // Set bottom margin: 28mm if letterhead is included, 10mm otherwise
      const bottomMargin = includeLetterhead ? `${FOOTER_HEIGHT_MM}mm` : `${DEFAULT_MARGIN_MM}mm`;

      // Conditional HTML for Header
      const headerHtml = includeLetterhead ? `
        <div style="position: absolute; top: 0; left: 0; right: 0; height: ${HEADER_HEIGHT_MM}mm; overflow: hidden;">
            <img src="${HEADER_IMG}" style="width:100%; height:100%; object-fit:cover; display:block;" />
        </div>
    ` : '';

      // Conditional HTML for Footer
      const footerHtml = includeLetterhead ? `
        <div style="position: absolute; bottom: 0; left: 0; right: 0; height: ${FOOTER_HEIGHT_MM}mm; overflow: hidden;">
            <img src="${FOOTER_IMG}" style="width:100%; height:100%; object-fit:cover; display:block;" />
        </div>
    ` : '';

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

          ${headerHtml}
            
          ${footerHtml}

          <!-- WATERMARK centered (behind content) -->
          <div style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); opacity: 0.12; z-index: 1; pointer-events: none;">
            <img src="${WATERMARK_IMG}" style="width:60%; height:auto; display:block;" />
          </div>

          <!-- CONTENT area: leave margins for header/footer -->
          <div style="
            position: absolute;
            top: 40mm;
            bottom: 28mm;

            /* SET YOUR LEFT/RIGHT MARGINS HERE */
            padding-left: 15mm;
            padding-right: 15mm;

            box-sizing: border-box;
            overflow: hidden;
          ">

            <!-- INNER CONTENT (scaling only) -->
            <div style="
              /* transform: scale(1.08); */
              transform-origin: top left;
            ">
            ${contentHtml}
          </div>
        </div>
      `;
    };

    // 2) Render Body page (inner page index 1)
    {
      const bodyContent = `
        <div style="font-size:26pt; line-height:1.4; margin-top:20%;">
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
      const { dataUrl } = await renderHtmlToPdfPage(innerHtml);
      addJpgToPdfFullPage(dataUrl, pdf.getNumberOfPages()); // add second page (pageIndex = 1)
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
        const { dataUrl: liftDataUrl } = await renderHtmlToPdfPage(innerHtml); // Using distinct name 'liftDataUrl'
        addJpgToPdfFullPage(liftDataUrl, pdf.getNumberOfPages()); // Adds the first page for this lift


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
          const { dataUrl: featuresDataUrl } = await renderHtmlToPdfPage(innerHtml);
          // Pass the extracted string to the PDF helper
          addJpgToPdfFullPage(featuresDataUrl, pdf.getNumberOfPages()); // Adds the SECOND page for this lift
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
      const { dataUrl } = await renderHtmlToPdfPage(innerHtml);
      addJpgToPdfFullPage(dataUrl, pdf.getNumberOfPages());
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
      const { dataUrl } = await renderHtmlToPdfPage(innerHtml);
      addJpgToPdfFullPage(dataUrl, pdf.getNumberOfPages());
    }

    // 7) Back cover (final page) - no header/footer/watermark
    if (includeLetterhead) {
      const backHtml = `
        <div style="width:100%; height:100%; position:relative; overflow:hidden;">
          <img src="${BACK_IMG}" style="width:100%; height:100%; object-fit:cover; display:block;" />
        </div>
      `;
      const { dataUrl } = await renderHtmlToPdfPage(backHtml);
      addJpgToPdfFullPage(dataUrl, pdf.getNumberOfPages());
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
