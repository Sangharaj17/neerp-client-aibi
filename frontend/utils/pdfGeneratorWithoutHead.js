'use client';
import { toast } from "react-hot-toast";
import { getQuotationById } from "@/services/quotationApi";
import { generateLiftTable } from "@/utils/pdfElementCreations";
import { formatDate, formatCurrency } from "@/utils/common";

export const generatePdfWithOutLetterhead = async (quotationMainId, onStart, onComplete) => {
    if (onStart) onStart();
    const TOAST_ID = 'pdf-plain-loading';

    try {
        // Show a loading notification
        toast.loading('Generating Plain PDF Copy...', { id: TOAST_ID });


        const response = await getQuotationById(quotationMainId);
        console.log('response:', response);

        if (!response.success) {
            throw new Error('Failed to fetch quotation details from the server.');
        }

        const quotationData = response.data;

        console.log('Quotation Data for PDF:', quotationData);


        const storedTenant = localStorage.getItem("tenant");
        let company_name = "";

        if (storedTenant) {
            const clientNameKey = `${storedTenant}_clientName`;
            const storedClientName = localStorage.getItem(clientNameKey);
            if (storedClientName) {
                company_name = storedClientName;
            }
        }

        const dateObject = new Date(quotationData.quotationDate);
        const refName = "";
        const currentYear = dateObject.getFullYear();
        const nextYear = currentYear + 1;
        const shortCurrentYear = currentYear.toString().slice(-2);
        const shortNextYear = nextYear.toString().slice(-2);
        const financialYear = `${shortCurrentYear}-${shortNextYear}`;

        // 'long' gives the full name, 'en-US' ensures standard English naming.
        const monthName = dateObject.toLocaleString('en-US', { month: 'short' });
        const newQuatationDate = formatDate(quotationData.quotationDate);
        const quotationNo = quotationData.quotationNo;

        const site_address = quotationData.siteAdder;
        const siteName = quotationData.siteName;

        const customerName = quotationData.customerName;
        const contact_number = quotationData.contactNumber;
        const contact_number1 = quotationData.contactNumber1;

        const customer_name2 = quotationData.customerName2 || "";
        const contact_number2 = quotationData.contactNumber2 || "";

        const salutations1 = quotationData.salutations1;
        const salutations2 = quotationData.customerName2 ? quotationData.salutations2 : "";

        const activity_by = quotationData.createdByEmployeeName;
        const employeeContactNumber = quotationData.employeeContactNumber;
        const employeeRoleName = quotationData.employeeRoleName;


        const lift_qnty = quotationData.liftDetails.length;

        // Dynamically import html2pdf.js inside the function
        const html2pdf = (await import('html2pdf.js')).default;

        const element = document.createElement('div');
        // element.style.width = '210mm'; // A4 width
        // element.style.padding = '10mm'; // Margins
        // element.style.boxSizing = 'border-box';
        // element.style.fontFamily = 'Times New Roman, Times, serif'; // Use a serif font stack
        // element.style.fontSize = '12pt'; // Times New Roman often defaults to 12pt for readability
        // element.style.lineHeight = '1.5'; // Increased line height slightly for better flow
        element.style.color = '#000'; // Ensure text is pure black

        // Helper for consistent header styling
        const getHeader = () => `
        `;

        // Construct the full HTML content based on the PDF's structure
        element.innerHTML = `
            <style>
                /* Add CSS reset for tables inside the main HTML if needed */
                table.quotation-main tr, table.quotation-main td { 
                    border: none; /* Override the generic table rule for the main info tables */
                }
            </style>            
            <div>
                <table class="quotation-main" style='border:0px !important; width:100%;'>
                    <tr>
                        <td style='border: 0px; width:50%;text-align:left;'><strong>REF.NO: ${refName}/${financialYear}/${monthName}/${quotationNo}</strong> </td>
                    </tr>
                    <tr>
                        <td style='border: 0px; width:50%;text-align:right;'>Date: ${newQuatationDate}</td>
                    </tr>
                </table>

                <p><strong>To,</strong><br> 
                    <span class='case'>${siteName}</span><br>
                    <span class='case'>${site_address}</span>.
                    </strong></p>
                    <p><strong>Kindly Attention,</strong><br>
                    <strong>
                        <span class='case'>${customerName} (+91&nbsp;${contact_number})
                        ${customer_name2 // Check if customer_name2 is not null or empty
                ? `<br>${salutations2}&nbsp;${customer_name2}&nbsp;${contact_number2}`
                : ''
            }
                        </span>
                    </strong>
                </p>

                <p>Dear Sir,</p>

                <p>Sub.: Supply, Installing, Testing and commissioning of (01) for your project at <strong><span class='case'> ${siteName} </span></strong><br><br></p>

                <p>As desired we take pleasure in submitting herewith our proposal for your subject building.
                <br><br>In the event you decide to place an order on us, kindly sign on all pages and return both copies of our proposal along with the advance payment cheque, when one copy duly approved by our authorized official will be returned to you for your records.<br><br>In case you desire any further information / clarification, please do not hesitate to contact us.
                <br><br>We now look forward to receiving your valued order, which we assure you, will receive best from <strong>${company_name}</strong> always.
                <br><br>Thanking you,<br>
                Yours faithfully,<br><strong>${company_name}.</strong><br>${activity_by}<br>M-${contact_number}<br><br><br><br><br><br><br><br><br><br><br>
                </p>



                <style>
                    .table{
                        border-left: thin solid;
                        border-right: thin solid;
                        border-bottom: thin solid #000000;
                        border-top: thin solid;
                    }
                    .table{
                        margin-top: 10px;
                        margin-bottom: 10px;
                        border-collapse: collapse;
                        
                    }
                    table tr {
                        border-bottom: 1px solid black;
                    }
                    table td {
                        border: 1px solid black;
                    }

                    table tr:last-child { 
                        border-bottom: none; 
                    }
                    .speci {
                        border-collapse: collapse;
                        width: 100%; /* Ensure it spans full width */
                        margin-bottom: 20px; /* Space between repeated tables */
                    }
                    .speci tr {
                        border-bottom: 1px solid black;
                    }
                    .speci td, .speci th {
                        border: 1px solid black;
                        font-size: 10pt; /* Use a standard font size, not 50px */
                        padding: 5px; /* Add padding for readability */
                    }
                    .speci tr:last-child { 
                        border-bottom: none; 
                    }
                </style>`;

                const allLiftDetailsHTML = quotationData.liftDetails
                    .map((liftDetail, index) => 
                        generateLiftTable(
                            liftDetail, 
                            index, 
                            customerName, 
                            site_address, 
                            refName, 
                            financialYear, 
                            monthName, 
                            quotationNo, 
                            newQuatationDate
                        )
                    )
                    .join(''); 

                element.innerHTML += `
                    <div style="page-break-before: always;"></div>
                    
                    ${allLiftDetailsHTML}
                    
                    `;                
                element.innerHTML += `
                    </div>

            <div style="page-break-before: always; page-break-after: always; padding-bottom: 10mm;">
                ${getHeader()}
                <p style="margin-bottom: 0;">CLIENT NAME: ${quotationData.customerName}</p>
                <p style="margin-top: 0; margin-bottom: 10mm;">SITE ADDRESS: ${quotationData.siteName}</p>
                <p style="text-align: right; margin-top: 0; margin-bottom: 0;">REF.NO:${quotationData.quotationNo}</p>
                <p style="text-align: right; margin-top: 0; margin-bottom: 15mm;">DATE:${quotationData.quotationDate}</p>

                <h3 style="margin-bottom: 5px;">Lift Specification</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15mm;">
                    <thead>
                        <tr>
                            <th style="padding: 4px; border: 1px solid #ccc; background-color: #f2f2f2;">Lift Specification</th>
                            <th style="padding: 4px; border: 1px solid #ccc; background-color: #f2f2f2;">Unit</th>
                            <th style="padding: 4px; border: 1px solid #ccc; background-color: #f2f2f2;">Price Per Unit</th>
                            <th style="padding: 4px; border: 1px solid #ccc; background-color: #f2f2f2;">Price</th>
                            <th style="padding: 4px; border: 1px solid #ccc; background-color: #f2f2f2;">GST Amount</th>
                            <th style="padding: 4px; border: 1px solid #ccc; background-color: #f2f2f2;">Final Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${quotationData.liftDetails
                && quotationData.liftDetails
                    .length > 0 ?
                quotationData.liftDetails
                    .map(item => `
                                <tr>
                                    <td style="padding: 4px; border: 1px solid #ccc;">${item.liftQuotationNo}</td>
                                    <td style="padding: 4px; border: 1px solid #ccc;">1</td>
                                    <td style="padding: 4px; border: 1px solid #ccc;">${item.loadAmt}</td>
                                    <td style="padding: 4px; border: 1px solid #ccc;">${item.
                            totalAmountWithoutGST}</td>
                                    <td style="padding: 4px; border: 1px solid #ccc;">${item.totalAmount}</td>
                                    <td style="padding: 4px; border: 1px solid #ccc;">${item.totalAmount}</td>
                                </tr>
                            `).join('')
                : ''}
                    </tbody>
                </table>

                <h3 style="margin-top: 20mm; margin-bottom: 5px;">TERMS & CONDITIONS: -</h3>
                <ul style="list-style-type: disc; margin-left: 20px; padding-left: 0;">
                    <li style="margin-bottom: 5px;">Validity - 30 days from the date of submit.</li>
                    <li style="margin-bottom: 5px;">The scope of work is limited to only supply and installation.</li>
                    <li style="margin-bottom: 5px;">Any kind of civil work, like wall cutting, POP, flooring or any other related civil work is not in our scope.</li>
                    <li style="margin-bottom: 5px;">Scaffolding will be provided by you.</li>
                    <li style="margin-bottom: 5px;">Power for installation and testing will be provided by you.</li>
                    <li style="margin-bottom: 5px;">The material will be delivered at site, you should arrange the space for material storage.</li>
                    <li style="margin-bottom: 5px;">Any kind of Government taxes like GST, etc., will be extra as per actual.</li>
                    <li style="margin-bottom: 5px;">The unloading of lift material would be done by our manpower. However, any monetary consideration towards labor union or Hamal panchayat of your site area exists, the same will have to be taken care and paid by you.</li>
                </ul>

                <h3 style="margin-top: 20mm; margin-bottom: 5px;">PAYMENT SLABS:</h3>
                <ul style="list-style-type: disc; margin-left: 20px; padding-left: 0;">
                    <li style="margin-bottom: 5px;">20% of the contract value in advance, along with order confirmation.</li>
                    <li style="margin-bottom: 5px;">50% of the contract value against commencement of material procurement.</li>
                    <li style="margin-bottom: 5px;">20% of the contract value on commencement of installation of elevator.</li>
                    <li style="margin-bottom: 5px;">10% of the contract value before hand over the elevator.</li>
                </ul>

                <div style="position: absolute; bottom: 10mm; left: 10mm; width: calc(100% - 20mm); font-size: 8pt; text-align: center;">
                    <p style="margin: 0;">B-307, Shubham Heights, S. No. 22/1/B1, Pimple Saudagar, Pune 411027</p>
                    <p style="margin: 0;">020-27279009/7276266662 | www.vertexelevators.in | vertexelevators.india@gmail.com</p>
                </div>
            </div>

            <div style="page-break-before: always; page-break-after: always; padding-bottom: 10mm;">
                ${getHeader()}

                <h3 style="margin-bottom: 5px;">WARRANTY & FREE MAINTENANCE:</h3>
                <ul style="list-style-type: disc; margin-left: 20px; padding-left: 0;">
                    <li style="margin-bottom: 5px;">Vertex Elevators warranty only the material and workmanship of the equipment For a period of twelve (12) months, from the date of completion of validity period.</li>
                    <li style="margin-bottom: 5px;">The warranty covers repair and replacement of the defective parts only and Do not cover any consequential resulting liabilities, damages or losses</li>
                </ul>

                <h3 style="margin-top: 20mm; margin-bottom: 5px;">DOCUMENTS REQUIRED FOR ELEVATOR LICENSE:</h3>
                <ul style="list-style-type: disc; margin-left: 20px; padding-left: 0;">
                    <li style="margin-bottom: 5px;">Sanctioned Building Plan with lift provision.</li>
                    <li style="margin-bottom: 5px;">Commencement certificates.</li>
                    <li style="margin-bottom: 5px;">Architect Certificate.</li>
                    <li style="margin-bottom: 5px;">Structure engineer Certificate.</li>
                    <li style="margin-bottom: 5px;">Owner Letter with signature.</li>
                    <li style="margin-bottom: 5px;">Owners' identity proof Aadhar card/ Driving license.</li>
                    <li style="margin-bottom: 5px;">Passport size Photograph.</li>
                </ul>

                <h3 style="margin-top: 20mm; margin-bottom: 5px;">PREPARATORY WORK:-</h3>
                <ul style="list-style-type: disc; margin-left: 20px; padding-left: 0;">
                    <li style="margin-bottom: 5px;">To be provided site details and drawings required for starting work on the project.</li>
                    <li style="margin-bottom: 5px;">To be provided a completely enclosed elevator hoist way with all walls duly finished and painted with lift pit of required depth.</li>
                    <li style="margin-bottom: 5px;">To be provided painted and ventilated machine room of sufficient size to accommodate lift equipment.</li>
                    <li style="margin-bottom: 5px;">To be provided and install necessary hoist way door frames, fascia plates and architraves</li>
                    <li style="margin-bottom: 5px;">To be provided sill projection for each hoist way entrance to assure secured anchorage & support of each sill.</li>
                    <li style="margin-bottom: 5px;">To be provided hoist way structure of such a design that can withstand the impact and loads resulting from the use of elevator.</li>
                    <li style="margin-bottom: 5px;">To be provided civil work support for lift installation.</li>
                    <li style="margin-bottom: 5px;">To do all cutting of walls, floor, together with any repair made necessary thereby. This includes grouting of all bolts, sills, steel members, indicator and push button boxes etc. in position.</li>
                    <li style="margin-bottom: 5px;">To be provided and installed power and power connection as follows:
                        <ul style="list-style-type: circle; margin-left: 20px; padding-left: 0;">
                            <li style="margin-bottom: 5px;">A. A fused Circuit Breaker of suitable rating for elevator.</li>
                            <li style="margin-bottom: 5px;">B. A fused Circuit Breaker for lift lighting circuit.</li>
                            <li style="margin-bottom: 5px;">C. A fused Circuit Breaker for hoist way lighting circuit in the hoist way at each floor level.</li>
                            <li style="margin-bottom: 5px;">D. A separate earthing pit as per latest Indian electricity rules and double earthing connection brought in the machine room.</li>
                            <li style="margin-bottom: 5px;">E. ELCB of suitable capacity.</li>
                        </ul>
                    </li>
                    <li style="margin-bottom: 5px;">To be provided sufficient lighting and necessary power supply for elevator installation on customer expense, electric power for power tools in hoist way and testing of elevators.</li>
                    <li style="margin-bottom: 5px;">To be protect the hoist way entrance by suitable means during the process of lift installation at site.</li>
                    <li style="margin-bottom: 5px;">To be provided scaffolding in the hoist way as per our technical requirements and to remove the same alter completion of the installation.</li>
                    <li style="margin-bottom: 5px;">To be provided suitable lockable storage spaces for elevator material near the lift hoist way.</li>
                    <li style="margin-bottom: 5px;">To be provided hoisting beam in the machine room and rolled steel "I" section as mentioned for support of the machine and 'c' section I beam the lift well divider of appropriate size.</li>
                    <li style="margin-bottom: 5px;">The unloading of lift material would be done by our manpower. However, any monetary consideration towards labor union or Hamal panchayat of your site area exists, the same will have to be taken care and paid by you.</li>
                </ul>
                <p style="margin-top: 20mm;">If you have any queries for above documents, so please call on 7276266662/7776076661/020 27279009</p>

                <table style="width: 100%; border-collapse: collapse; margin-top: 20mm;">
                    <thead>
                        <tr>
                            <th style="padding: 8px; border: 1px solid #ccc; background-color: #f2f2f2; width: 50%;">For Customer</th>
                            <th style="padding: 8px; border: 1px solid #ccc; background-color: #f2f2f2; width: 50%;">For Vertex Elevators</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 20px 8px; border: 1px solid #ccc; text-align: center;">Authorized signatory<br/>Sign with stamp</td>
                            <td style="padding: 20px 8px; border: 1px solid #ccc; text-align: center;">Authorized signatory<br/>Sign with stamp</td>
                        </tr>
                    </tbody>
                </table>

                <div style="position: absolute; bottom: 10mm; left: 10mm; width: calc(100% - 20mm); font-size: 8pt; text-align: center;">
                    <p style="margin: 0;">B-307, Shubham Heights, S. No. 22/1/B1, Pimple Saudagar, Pune 411027</p>
                    <p style="margin: 0;">020-27279009/7276266662 | www.vertexelevators.in | vertexelevators.india@gmail.com</p>
                </div>
            </div>

            <div style="page-break-before: always; padding-bottom: 10mm;">
                ${getHeader()}

                <h3 style="margin-bottom: 5px;">PAYMENT DETAILS:</h3>
                <p style="margin-bottom: 15mm;">Full payment will have to be made in advance payable by cheque /D.D. drawn in favor of</p>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15mm;">
                    <thead>
                        <tr>
                            <th colspan="2" style="padding: 8px; border: 1px solid #ccc; background-color: #f2f2f2;">Bank Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td style="padding: 4px; border: 1px solid #ccc; width: 30%;">Account Name</td><td style="padding: 4px; border: 1px solid #ccc; width: 70%;">Vertex Elevators</td></tr>
                        <tr><td style="padding: 4px; border: 1px solid #ccc;">Bank Name</td><td style="padding: 4px; border: 1px solid #ccc;">STATE BANK OF INDIA</td></tr>
                        <tr><td style="padding: 4px; border: 1px solid #ccc;">Branch Name</td><td style="padding: 4px; border: 1px solid #ccc;">New Sangvi</td></tr>
                        <tr><td style="padding: 4px; border: 1px solid #ccc;">Account No.</td><td style="padding: 4px; border: 1px solid #ccc;">39597232987</td></tr>
                        <tr><td style="padding: 4px; border: 1px solid #ccc;">IFSC Code</td><td style="padding: 4px; border: 1px solid #ccc;">SBIN0014730</td></tr>
                        <tr><td style="padding: 4px; border: 1px solid #ccc;">GST No.</td><td style="padding: 4px; border: 1px solid #ccc;">27BHAPS3197L2ZQ</td></tr>
                    </tbody>
                </table>

                <p style="margin-bottom: 15mm;">The contact will deem to have started only if required amount is received by us. If you wish to accept this proposal kindly return the duplicate of this proposal duly signed by your authorized representative for our records.</p>

                <p style="margin-top: 20mm; margin-bottom: 0;">Thanking you,</p>
                <p style="margin-top: 0; margin-bottom: 0;">Yours faithfully,</p>
                <p style="margin-top: 0; margin-bottom: 0;">Vertex Elevators.</p>
                <p style="margin-top: 0; margin-bottom: 0;">Manoj Satao</p>
                <p style="margin-top: 0;">Mobile:-7776076662</p>

                <div style="position: absolute; bottom: 10mm; left: 10mm; width: calc(100% - 20mm); font-size: 8pt; text-align: center;">
                    <p style="margin: 0;">B-307, Shubham Heights, S. No. 22/1/B1, Pimple Saudagar, Pune 411027</p>
                    <p style="margin: 0;">020-27279009/7276266662 | www.vertexelevators.in | vertexelevators.india@gmail.com</p>
                </div>
            </div>
        `;

        const opt = {
            margin: [50, 15, 40, 15], // Top, Left, Bottom, Right margins in mm
            filename: `${quotationData.customerName.replace(/ /g, '_')}_${quotationData.id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2, // Higher scale for better resolution
                useCORS: true, // Important if you have images from other domains
                // logging: false, // Disable logging for cleaner console
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            },
            pagebreak: {
                mode: ['css', 'legacy'] // Use CSS page-break properties primarily
            }
        };

        html2pdf().from(element).set(opt).save();

        // Show success notification once download starts
        toast.success('Plain PDF copy successfully downloaded!', { id: TOAST_ID });
    } catch (error) {
        console.error("Plain PDF generation failed:", error);
        // Show error notification
        toast.error('Failed to generate Plain PDF.', { id: TOAST_ID });
    } finally {
        // 3. COMPLETE LOADING
        if (onComplete) onComplete();
    }
};