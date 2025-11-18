'use client'; // This directive is correct and should remain at the top
import { toast } from "react-hot-toast";

export const generatePdfWithLetterhead = async (quotationData, onStart, onComplete) => { 

    if (onStart) onStart();
    const TOAST_ID = 'pdf-loading';

    try {
        toast.loading('Generating PDF with Letterhead...', { id: TOAST_ID });

        // Dynamically import html2pdf.js inside the function
        const html2pdf = (await import('html2pdf.js')).default;

        const element = document.createElement('div');
        element.style.width = '210mm'; // A4 width
        element.style.padding = '10mm'; // Margins
        element.style.boxSizing = 'border-box';
        element.style.fontFamily = 'Arial, sans-serif';
        element.style.fontSize = '10pt';
        element.style.lineHeight = '1.4';
        element.style.color = '#333';

        // Helper for consistent header styling
        const getHeader = () => `
    <div style="text-align: center; margin-bottom: 5mm;">
      <h1 style="color: #004D99; font-size: 20pt; margin: 0; padding: 0;">VERTEX ELEVATORS</h1>
    </div>
    <div style="text-align: center; font-size: 8pt; margin-bottom: 5mm;">
      <p style="margin: 0;">B-307, Shubham Heights, S. No. 22/1/B1, Pimple Saudagar, Pune 411027</p>
      <p style="margin: 0;">020-27279009 / 7276266662 | www.vertexelevators.in | vertexelevators.india@gmail.com</p>
    </div>
    <hr style="border: 0.5px solid #eee; margin: 5mm 0;">
  `;

        // Construct the full HTML content based on the PDF's structure
        element.innerHTML = `
    <div style="page-break-after: always; padding-bottom: 10mm;">
        ${getHeader()}
        <p style="text-align: right; margin-top: 10mm;">REF.NO: Vertex/25-26/Jul/${quotationData.sr}</p>
        <p style="text-align: right; margin-bottom: 15mm;">Date: ${quotationData.date}</p>

        <p style="margin-bottom: 0;"><strong>To,</strong></p>
        <p style="margin-top: 0; margin-bottom: 0;">TEST.</p>
        <p style="margin-top: 0; margin-bottom: 10mm;">TEST.</p>

        <p style="margin-bottom: 0;">Kind Attention,</p>
        <p style="margin-top: 0; margin-bottom: 10mm;">${quotationData.customer} (${quotationData.contact})</p>

        <p>Dear Sir,</p>
        <p style="margin-bottom: 15px;"><strong>Subject: Quotation for supply installation testing and commissioning of passenger elevator.</strong></p>

        <p>We are thankful to you for providing us an opportunity to serve you with our best quality product and technical excellence.</p>
        <p>We undertake this opportunity to introduce ourselves as one of the fastest growing ISO 9001: 2015 certified Elevator Company in Maharashtra India with latest highly advanced global technology of micro processer-based control panel with Serial Communication System and Gearless Machine Techniques at us Indoor facility, which ensure the reliability and performance of the equipment.</p>
        <p>We hereby submit our best quotation for your requirement and, waiting for Your valuable response to furnish further details.</p>
        <p>Thanking you and assuring the best of our services for all the time.</p>

        <p style="margin-top: 20mm; margin-bottom: 0;">Thanking you,</p>
        <p style="margin-top: 0; margin-bottom: 0;">Yours faithfully,</p>
        <p style="margin-top: 0; margin-bottom: 0;">Owner</p>
        <p style="margin-top: 0; margin-bottom: 0;">Vertex Elevators.</p>
        <p style="margin-top: 0;">M-7776076662</p>

        <div style="position: absolute; bottom: 10mm; left: 10mm; width: calc(100% - 20mm); font-size: 8pt; text-align: center;">
            <p style="margin: 0;">B-307, Shubham Heights, S. No. 22/1/B1, Pimple Saudagar, Pune 411027</p>
            <p style="margin: 0;">020-27279009/7276266662 | www.vertexelevators.in | vertexelevators.india@gmail.com</p>
        </div>
    </div>

    <div style="page-break-before: always; page-break-after: always; padding-bottom: 10mm;">
        ${getHeader()}
        <h3 style="text-align: center; margin-bottom: 15mm; font-size: 14pt;">TECHINICAL SPECIFICATIONS SHEET</h3>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15mm;">
            <tr>
                <td style="padding: 4px; border: 1px solid #ccc; width: 30%;">CLIENT NAME:</td>
                <td style="padding: 4px; border: 1px solid #ccc; width: 70%;">${quotationData.customer}</td>
            </tr>
            <tr>
                <td style="padding: 4px; border: 1px solid #ccc;">SITE ADDRESS:</td>
                <td style="padding: 4px; border: 1px solid #ccc;">${quotationData.site}</td>
            </tr>
            <tr>
                <td style="padding: 4px; border: 1px solid #ccc;">REF.NO:</td>
                <td style="padding: 4px; border: 1px solid #ccc;">Vertex/25-26/Jul/${quotationData.sr}</td>
            </tr>
            <tr>
                <td style="padding: 4px; border: 1px solid #ccc;">DATE:</td>
                <td style="padding: 4px; border: 1px solid #ccc;">${quotationData.date}</td>
            </tr>
        </table>

        <h4 style="margin-bottom: 5px;">RANGE-</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15mm;">
            <tr><td style="padding: 4px; border: 1px solid #ccc; width: 30%;">NO.OF ELEVATOR</td><td style="padding: 4px; border: 1px solid #ccc; width: 70%;">01</td></tr>
            <tr><td style="padding: 4px; border: 1px solid #ccc;">PRODUCT</td><td style="padding: 4px; border: 1px solid #ccc;">MANUAL ELEVATOR</td></tr>
            <tr><td style="padding: 4px; border: 1px solid #ccc;">CAPICITY(kg)</td><td style="padding: 4px; border: 1px solid #ccc;">10 Persons/680 Kg.</td></tr>
            <tr><td style="padding: 4px; border: 1px solid #ccc;">SPEED(mps)</td><td style="padding: 4px; border: 1px solid #ccc;">ABOUT $.65~m/sec$</td></tr>
            <tr><td style="padding: 4px; border: 1px solid #ccc;">DOOR OPERATION</td><td style="padding: 4px; border: 1px solid #ccc;">MANUAL</td></tr>
        </table>

        <h4 style="margin-bottom: 5px;">MACHINE -</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15mm;">
            <tr><td style="padding: 4px; border: 1px solid #ccc; width: 30%;">MACHINE</td><td style="padding: 4px; border: 1px solid #ccc; width: 70%;">GEARED</td></tr>
            <tr><td style="padding: 4px; border: 1px solid #ccc;">MAIN POWER SYSTEM</td><td style="padding: 4px; border: 1px solid #ccc;">415 Volts, 3 Phase, 50HZ A.C. (By Client)</td></tr>
            <tr><td style="padding: 4px; border: 1px solid #ccc;">OPERATION</td><td style="padding: 4px; border: 1px solid #ccc;">FULL COLLECTIVE</td></tr>
            <tr><td style="padding: 4px; border: 1px solid #ccc;">REQUIRED DRIVE</td><td style="padding: 4px; border: 1px solid #ccc;">CLOSE LOOP V3F DRIVE.</td></tr>
            <tr><td style="padding: 4px; border: 1px solid #ccc;">CONTROLLER TYPE</td><td style="padding: 4px; border: 1px solid #ccc;">MICROPROCESSOR BASED DOWN COLLECTIVE AUTO CONTROL PANEL.</td></tr>
            <tr><td style="padding: 4px; border: 1px solid #ccc;">TRACTION MEDIA</td><td style="padding: 4px; border: 1px solid #ccc;">STEEL ROPE</td></tr>
        </table>

        <h4 style="margin-bottom: 5px;">ELEVATOR WELL -</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15mm;">
            <tr><td style="padding: 4px; border: 1px solid #ccc; width: 30%;">CAR TRAVEL</td><td style="padding: 4px; border: 1px solid #ccc; width: 70%;">G+5 RISES ABOUT 15 Mts.</td></tr>
            <tr><td style="padding: 4px; border: 1px solid #ccc;">NO. OF STOPS</td><td style="padding: 4px; border: 1px solid #ccc;">06 Nos.</td></tr>
            <tr><td style="padding: 4px; border: 1px solid #ccc;">SHAFT SIZE</td><td style="padding: 4px; border: 1px solid #ccc;">1800 mm Width, 1550 mm Depth</td></tr>
            <tr><td style="padding: 4px; border: 1px solid #ccc;">MACHINE ROOM</td><td style="padding: 4px; border: 1px solid #ccc;">3300 mm Width * 4050 mm Depth</td></tr>
            <tr><td style="padding: 4px; border: 1px solid #ccc;">PIT DEPTH</td><td style="padding: 4px; border: 1px solid #ccc;">1500 mm</td></tr>
            <tr><td style="padding: 4px; border: 1px solid #ccc;">OVERHEAD</td><td style="padding: 4px; border: 1px solid #ccc;">4800 mm</td></tr>
        </table>

        <h4 style="margin-bottom: 5px;">CAR ENCLOSURE -</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15mm;">
            <tr><td style="padding: 4px; border: 1px solid #ccc; width: 30%;">CAR NAME</td><td style="padding: 4px; border: 1px solid #ccc; width: 70%;">CABIN M.S P.C + S.S MIRROR( BACK SIDE) 8 PASSANGER</td></tr>
            <tr><td style="padding: 4px; border: 1px solid #ccc;">CAR SIZE</td><td style="padding: 4px; border: 1px solid #ccc;">1300 mm Width * 1100 mm Depth</td></tr>
            <tr><td style="padding: 4px; border: 1px solid #ccc;">CAR DOOR</td><td style="padding: 4px; border: 1px solid #ccc;">M.S TELESCOPIC MANUAL CABIN DOOR WITH SMALL VISION</td></tr>
            <tr><td style="padding: 4px; border: 1px solid #ccc;">FLOORING</td><td style="padding: 4px; border: 1px solid #ccc;">Chequered Plate</td></tr>
            <tr><td style="padding: 4px; border: 1px solid #ccc;">FALSE CEILING</td><td style="padding: 4px; border: 1px solid #ccc;">Standard False Ceiling In CABIN M.S P.C + S.S MIRROR( BACK SIDE) 8 PASSANGER</td></tr>
            <tr><td style="padding: 4px; border: 1px solid #ccc;">LIGHTS & FAN</td><td style="padding: 4px; border: 1px solid #ccc;">BLOWER, LED LIGHT FITTING</td></tr>
            <tr><td style="padding: 4px; border: 1px solid #ccc;">C.O.P.</td><td style="padding: 4px; border: 1px solid #ccc;">C.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S.HAIRLINE FOR MANUAL LIFT</td></tr>
        </table>

        <h4 style="margin-bottom: 5px;">LANDING -</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15mm;">
            <tr><td style="padding: 4px; border: 1px solid #ccc; width: 30%;">LANDING DOOR</td><td style="padding: 4px; border: 1px solid #ccc; width: 70%;">1)M S COLLAPSIBLE MANUAL LANDING DOOR-6</td></tr>
            <tr><td style="padding: 4px; border: 1px solid #ccc;">CLEAR OPENING</td><td style="padding: 4px; border: 1px solid #ccc;">800 mm Width * 2100 mm Height</td></tr>
            <tr><td style="padding: 4px; border: 1px solid #ccc;">L.O.P</td><td style="padding: 4px; border: 1px solid #ccc;">L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+5</td></tr>
        </table>

        <div style="position: absolute; bottom: 10mm; left: 10mm; width: calc(100% - 20mm); font-size: 8pt; text-align: center;">
            <p style="margin: 0;">B-307, Shubham Heights, S. No. 22/1/B1, Pimple Saudagar, Pune 411027</p>
            <p style="margin: 0;">020-27279009/7276266662 | www.vertexelevators.in | vertexelevators.india@gmail.com</p>
        </div>
    </div>

    <div style="page-break-before: always; page-break-after: always; padding-bottom: 10mm;">
        ${getHeader()}
        <p style="margin-bottom: 0;">CLIENT NAME: ${quotationData.customer}</p>
        <p style="margin-top: 0; margin-bottom: 10mm;">SITE ADDRESS: ${quotationData.site}</p>
        <p style="text-align: right; margin-top: 0; margin-bottom: 0;">REF.NO: Vertex/25-26/Jul</p>
        <p style="text-align: right; margin-top: 0; margin-bottom: 15mm;">DATE:${quotationData.date}</p>

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
                <tr>
                    <td style="padding: 4px; border: 1px solid #ccc;">10 Persons/680 Kg.Manual, 6 stops, 6 Openings, Rise-15 M CABIN In M.S P.C + S.S MIRROR( BACK SIDE) 8 PASSANGER</td>
                    <td style="padding: 4px; border: 1px solid #ccc;">1</td>
                    <td style="padding: 4px; border: 1px solid #ccc;">583175/-</td>
                    <td style="padding: 4px; border: 1px solid #ccc;">583175/-</td>
                    <td style="padding: 4px; border: 1px solid #ccc;">104972/-</td>
                    <td style="padding: 4px; border: 1px solid #ccc;">688147/-</td>
                </tr>
                ${quotationData.materialsList && quotationData.materialsList.length > 0 ?
                quotationData.materialsList.map(item => `
                        <tr>
                            <td style="padding: 4px; border: 1px solid #ccc;">${item.description}</td>
                            <td style="padding: 4px; border: 1px solid #ccc;">${item.quantity}</td>
                            <td style="padding: 4px; border: 1px solid #ccc;">${item.pricePerUnit}</td>
                            <td style="padding: 4px; border: 1px solid #ccc;">${item.total}</td>
                            <td style="padding: 4px; border: 1px solid #ccc;"></td>
                            <td style="padding: 4px; border: 1px solid #ccc;"></td>
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
            margin: [10, 10, 10, 10], // Top, Left, Bottom, Right margins in mm
            filename: `Quotation_${quotationData.customer.replace(/ /g, '_')}_${quotationData.sr}_WithLetterHead.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2, // Higher scale for better resolution
                useCORS: true, // Important if you have images from other domains
                logging: false, // Disable logging for cleaner console
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

        await html2pdf().from(element).set(opt).save();
        toast.success('PDF successfully downloaded!', { id: TOAST_ID });
    } catch (error) {
        console.error("PDF generation failed:", error);
        toast.error('Failed to generate PDF.', { id: TOAST_ID });
    } finally {
        if (onComplete) onComplete();
    }
};