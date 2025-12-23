
import { formatDateShort, formatCurrency } from "@/utils/common";

// Function to generate the HTML table for a single lift
export const generateLiftTable = (liftDetail, index, customerName, site_address, refName, financialYear, monthName, quotationNo, newQuatationDate) => {
  const {
    liftTypeName,
    capacityType,
    personCapacityName,
    weightName,
    speed,
    typeOfLiftName,
    mainSupplySystem,
    operationTypeName,
    floorDesignations,
    carTravel,
    stops,
    floorSelectionLabels,
    shaftWidth,
    shaftDepth,
    machineRoomName,
    pitDepth,
    overhead,
    cabinTypeName,
    carInternalDepth,
    carInternalHeight,
    carInternalWidth,
    carEntranceSubTypeName,
    cabinFlooringName,
    cabinCeilingName,
    airTypeName,
    lightFittingName,
    copTypeName,
    landingEntranceSubType1Name,
    landingEntranceSubType2Name,
    landingEntranceSubType2_fromFloor,
    landingEntranceSubType2_toFloor,
    landingEntranceCount,
    lopTypeName,
  } = liftDetail;


  const lift_qnty = 1;

  const liftTableId = `lift-spec-${index}`;

  const capacity = capacityType == 1 ? personCapacityName : weightName;
  const carTravel1 = carTravel / 1000;
  const carSize = `${carInternalWidth} mm Width, ${carInternalDepth} mm Depth`;
  const noFloorLandingSecond = landingEntranceSubType2_toFloor - landingEntranceSubType2_fromFloor + 1;
  const carEnteranceSize = `${carInternalDepth} mm Depth, ${carInternalHeight} mm Height`;

  let liftHtml = `   
    <style>
        /* BASE STYLE: Smaller font for readability, 14pt looks good for scaling */
        .lift-spec-table {
            border: 1px solid #999;
            line-height: 1.25; /* Adjusted line height for tighter spacing */
        }

        /* Default style for all TH and TD cells */
        .lift-spec-table th, .lift-spec-table td {
            border: 1px solid #ccc;
            vertical-align: top; /* Ensures text starts high */
            word-wrap: break-word;   
        }

        /* Style for the light gray header/separator rows */
        .lift-spec-table .group-header {
            background: #f2f2f2;
            font-weight: bold;
            text-align: left;
            font-size: 12pt; /* Match base font size */            
            padding-left: 10px;
        }

        /* Style for the main, title header row (e.g., TECHNICAL SPECIFICATION SHEET) */
        .lift-spec-table .main-header th {
            background: #e9f2ff;
            color: #003f7d;
            font-weight: bold;
            text-align: center;
            font-size: 17pt; /* Slightly larger font for the title header */
        }
        
        /* Style for the Client/Ref cells (multi-line row) */
        .client-ref-row td {
            /* T R B L - use slightly more top/bottom padding for the multi-line row */
            padding: 5px 5px 5px 5px;
            font-weight: 600;
            text-transform: uppercase;
            vertical-align: top;
            font-size: 10pt;
        }
        .client-ref-row b {
            /* Ensure the labels are bold */
            font-weight: 800;
        }

        /* Style for the row label (left column) */
        .row-label {
            width: 40%;
            font-weight: 600;
            text-transform: uppercase;
        }
        
    </style>

    <table class="lift-spec-table">        
        <tr class="main-header">
            <th colspan="2">
                TECHNICAL SPECIFICATION SHEET (Lift ${index + 1})
            </th>
        </tr>

        <tr class="client-ref-row">
            <td>
                <b>Client Name:</b> <span class="case">${customerName}</span><br>
                <b>Site Address:</b> <span class="case">${site_address}</span>
            </td>

            <td>
                <b>Ref. No:</b> ${refName}/${financialYear}/${monthName}/${quotationNo}<br>
                <b>Date:</b> ${newQuatationDate}
            </td>
        </tr>

        <tr class="group-header">
            <th colspan="2">
                RANGE
            </th>
        </tr>

        ${row("No. of Elevator", `0${lift_qnty}`)}
        ${row("Product", `${liftTypeName} Elevator`)}
        ${row("Capacity", capacity)}
        ${row("Speed", `About ${speed} m/sec`)}
        ${row("Door Operation", liftTypeName)}

        <tr class="group-header">
            <th colspan="2">
                MACHINE
            </th>
        </tr>
        
        ${row("Machine", typeOfLiftName)}
        ${row("Main Power System", mainSupplySystem)}
        ${row("Operation", operationTypeName)}
        ${row("Required Drive", "Close Loop V3F Drive")}
        ${row("Controller Type", "Microprocessor Based Down Collective Auto Panel")}
        ${row("Traction Media", "Steel Rope")}

        <tr class="group-header">
            <th colspan="2">
                ELEVATOR WELL
            </th>
        </tr>

        ${row("Car Travel", `${floorDesignations} rises – About ${carTravel1} M`)}
        ${row("No. of Stops", `0${stops} Nos [${floorDesignations}, ${floorSelectionLabels}]`)}
        ${row("Shaft Size", `${shaftWidth} mm W × ${shaftDepth} mm D`)}
        ${row("Machine Room", machineRoomName)}
        ${row("Pit Depth", `${pitDepth} mm`)}
        ${row("Overhead", `${overhead} mm`)}

        <tr class="group-header">
            <th colspan="2">
                CAR ENCLOSURE
            </th>
        </tr>

        ${row("Car Type", cabinTypeName)}
        ${row("Car Size", carSize)}
        ${row("Car Door", carEntranceSubTypeName)}
        ${row("Flooring", cabinFlooringName)}
        ${row("False Ceiling", `${cabinCeilingName} in ${cabinTypeName}`)}
        ${row("Lights & Fan", `${airTypeName}, ${lightFittingName}`)}
        ${row("C.O.P", copTypeName)}

        <tr class="group-header">
            <th colspan="2">
                LANDING
            </th>
        </tr>

        ${row("Landing Door",
    `
                        ${landingEntranceSubType1Name ?
      `1) ${landingEntranceSubType1Name}${landingEntranceCount > 0 ? ' - ' + landingEntranceCount : ''}<br>`
      : ''
    }
                        ${landingEntranceSubType2Name ?
      `2) ${landingEntranceSubType2Name}${noFloorLandingSecond > 0 ? ' - ' + noFloorLandingSecond : ''}`
      : ''
    }
                    `
  )}

        ${row("Clear Opening", carEnteranceSize)}
        ${row("L.O.P", lopTypeName)}
    </table>
  `;
  return liftHtml;

};

/* Helper to generate a clean two-column row */
function row(label, value) {
  // This helper now uses the centralized styles (lift-spec-table th/td)
  // and applies the specific width and the row-label class.
  return `
        <tr>
            <td class="row-label" style="padding: 5px 5px 5px 20px;           
            font-size: 10pt; ">
                ${label}
            </td>
            <td style="padding: 5px 5px 5px 10px;           
            font-size: 10pt; ">
                ${value}
            </td>
        </tr>
    `;
}






/**
 * Generates the two-column table HTML for standard features.
 * @param {Array<string>} stdFeatureIds - The array of feature strings.
 * @returns {string} The HTML string for the table.
 */
/**
 * Generates the two-column table HTML for standard features.
 * @param {Array<string>} stdFeatureIds - The array of feature strings.
 * @returns {string} The HTML string for the table.
 */
export const generateStandardFeaturesTable = (stdFeatureIds, featureNameMap, doorType,
  vfdMainDriveName,
  controlPanelMakeName,
  doorOperatorName,
  mainMachineSetName,
  carRailsName,
  wireRopeName,
  wiringHarnessName) => {
  let html = `
  
		<table class='table' style='
			width: 85%;
      table-layout: fixed;
			border-collapse: collapse; 
			border: 1px solid black; /* Full table border */
      margin: 5% auto auto 5%; /* T R B L */
			/* margin: 0 auto; */ /* Center the table */
			font-size: 15pt;
		'>
			<tr style='border: 1px solid black; '>
				<th colspan="2" style="
					border: 1px solid black; 
					padding: 5px 10px 5px 10px; 
					background-color: #f0f0f0; 
					text-align: center;
					/* Ensure border is visible even with collapse */
					border-bottom: 1px solid black; 
				">STANDARD FEATURES – FOR ${doorType} DOOR ELEVATOR</th>
			</tr>
		`;

  const featureNames = stdFeatureIds
    .map(id => featureNameMap.get(Number(id)))
    .filter(name => name);


  // Iterate through the array using a standard 'for' loop
  for (let i = 0; i < featureNames.length; i++) {
    const feature = featureNames[i];

    // 1. Check if we need to start a new row (i is even)
    if (i % 2 === 0) {
      html += `<tr>`;
    }

    // 2. Add the feature to the current cell (<td>)
    if (feature && feature.trim() !== '') {
      // Explicitly setting width to 50% here
      html += `
				<td style='border: 0px; width:50%; vertical-align: middle;'>
					<ul style='margin: 0; margin-left:10px; padding: 5px; padding-left:20px;'><li style='line-height: 1.2; vertical-align: middle;'> ${feature}</li></ul>
				</td>
				`;
    } else {
      // Add an empty cell if the feature is null or empty
      html += `<td style='border: 0px; width:50%; padding:7px;'></td>`;
    }

    // 3. Check if we need to close the row (i is odd)
    if (i % 2 !== 0) {
      html += `</tr>`;
    }
  }

  // 4. Handle the last row if the total count is odd.
  // The loop ended after adding the feature but before closing the row.
  if (featureNames.length % 2 !== 0) {
    // Add a blank closing cell and close the row
    html += `<td style='border: 0px; width:50%; padding:7px;'></td>`;
    html += `</tr>`;
  }

  html += `</table><br>`;

  html += generateComponentsTable(vfdMainDriveName,
    controlPanelMakeName,
    doorOperatorName,
    mainMachineSetName,
    carRailsName,
    wireRopeName,
    wiringHarnessName)

  return html;
};

const generateComponentsTable = (vfdMainDriveName,
  controlPanelMakeName,
  doorOperatorName,
  mainMachineSetName,
  carRailsName,
  wireRopeName,
  wiringHarnessName) => {

  /* -------------------- COMPONENTS TABLE -------------------- */
  const components = [
    { sr: 1, name: "VFD - Main Drive", make: vfdMainDriveName },
    { sr: 2, name: "Microprocessor Control Panel", make: controlPanelMakeName },
    { sr: 3, name: "Doors", make: doorOperatorName },
    { sr: 4, name: "Main Machine Set", make: mainMachineSetName },
    { sr: 5, name: "Car Rails", make: carRailsName },
    { sr: 6, name: "Counter Weight Rails", make: carRailsName },
    { sr: 7, name: "Wire Rope Usha", make: wireRopeName },
    { sr: 8, name: "Wiring Harness", make: wiringHarnessName },
  ];

  let html = `
  
    <p style="
			font-size: 15pt; 
			font-weight: normal; 
			text-align: left; 
			width: 85%; 
			margin: 5% auto auto 5%; /* T R B L */
		">We will provide you following company's parts for elevator.</p>
    
    <table style="
      width: 85%;
      border-collapse: collapse;
      margin: 2% auto auto 8%; /* T R B L */
      font-size: 12pt;
      font-family: Roboto, 'Segoe UI', Calibri, Arial, sans-serif;
      border: 1px solid black; 
    ">
      <thead>
        <tr style="background:#d0e3ff; border:1px solid #000;">
          <th style="padding:12px;  border:1px solid #000; width:10%;">SR</th>
          <th style="padding:12px;  border:1px solid #000; width:50%;">COMPONENT NAME</th>
          <th style="padding:12px;  border:1px solid #000; width:40%;">COMPANY MAKE</th>
        </tr>
      </thead>
      <tbody>
  `;

  components.forEach(item => {
    html += `
      <tr>
        <td style="padding:10px;  border:1px solid #999; text-align:center;">${item.sr}</td>
        <td style="padding:10px;  border:1px solid #999;">${item.name}</td>
        <td style="padding:10px;  border:1px solid #999;">${item.make}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table><br>
  `;

  return html;
};




export const generateScopeOfWorkHtml = (scopeOfWorkContent, liftScopeData = [], liftPriceTables = "", proposalContent, company_name, values) => {

  const groups = [];
  liftScopeData.forEach(item => {
    const key = `${item.warranty_period}-${item.pwd_including}-${item.scaf_including}`;

    let group = groups.find(g => g.key === key);

    if (!group) {
      group = { key, liftNos: [], data: item };
      groups.push(group);
    }

    group.liftNos.push(item.liftNo);
  });



  let liftSpecificItemsCompanyScope = "";

  groups.forEach(group => {
    const liftNumbers = group.liftNos.join(", "); // e.g., "1, 2"
    const d = group.data;
    const showHeading = (d.pwd_including || d.scaf_including);

    liftSpecificItemsCompanyScope += `
      

      <ul style="padding-left:22px; font-size:15pt; line-height:1.5;">
        <li>Comprehensive service during the warranty period of 
          <strong><u>${d.warranty_period} Month.</u></strong>
        </li>

        ${d.pwd_including ?
        "<li><b>PWD</b> Charges Extra.</li>" :
        ""}

        ${d.scaf_including ?
        "<li><b>Bamboo Scaffolding</b> Charges Extra.</li>" :
        ""}

      </ul>
    `;
  });


  let liftSpecificItemsCustommerScope = "";

  groups.forEach(group => {
    const liftNumbers = group.liftNos.join(", "); // e.g., "1, 2"
    const d = group.data;
    const showHeading = (!d.pwd_including || !d.scaf_including);

    liftSpecificItemsCustommerScope += `
      
      <ul style="padding-left:20px; font-size:20pt; line-height:1.5;">
        ${!d.pwd_including ?
        "<li><b>PWD</b> Charges Extra.</li>" :
        ""}

        ${!d.scaf_including ?
        "<li><b>Bamboo Scaffolding</b> Charges Extra.</li>" :
        ""}
      </ul>
    `;
  });

  const defaultContent = `
        <div style="width: 100%; margin-top:5%; ">

            <h1 style="font-weight: bold; margin-bottom: 10px; text-align: left; color: #00bcd4;">SCOPE OF WORK</h1>

            <div style="font-size: 15pt; line-height: 1.5;">
                <!-- This content should come from quotationData.scopeOfWorkContent or similar DB field -->
                <p><strong>Company’s scope</strong> of work related to elevators works <strong>includes:</strong></p>

                <ul style="padding-left: 22px;">
                    <li>Supply of the Elevators as per specification agreed.</li>

                    <li>Installation, testing & commissioning of the elevators.</li>
                </ul>
                    
                 ${liftSpecificItemsCompanyScope}
            </div>

            <div style="font-size: 15pt; line-height: 1.5; margin-top:2%; ">
                <p><strong>Customer’s scope</strong> of related to elevators works <strong>excluded:</strong></p>

                <ul style="padding-left: 22px;">
                    <li>All civil & whitewash leakages proofing etc required for elevator installation.</li>

                    <li>Dismantling, all electrical works required for elevator installation.</li>

                    <li>Architrave or elevator entrance civil work. </li>

                    <li>Extra steel if required to suit the site conditions.</li>

                    <li><b>Mathadi Workers</b> problems will be manage by builder/Owner.</li>
                </ul>
                    
                ${liftSpecificItemsCustommerScope}

                ${liftPriceTables}
            </div>
            <p style='background-color:#FFFF00; font-size: 15pt; padding-bottom:10px;'><strong>Note </strong>: Quotation is valid for 3 Months.</p> 

            <h1 style="font-weight: bold; margin-bottom: 30px; margin-top:1%; text-align: left; color: #00bcd4;">PAYMENT TERMS: </h1>

            <div style="font-size: 15pt; line-height: 1.5;">
                <!-- This content should come from quotationData.scopeOfWorkContent or similar DB field -->
                <ul>

                    <li><strong>50%</strong> of the contract value as interest-free advance along with the order.</li>

                    <li><strong>40%</strong> of the contract value upon delivery of material.</li>

                    <li><strong>10%</strong> of the contract value upon lifts handing over.S</li>
                </ul>
                    
                <p>The price/s quoted herein is/are <strong>${values}</strong> of all taxes, as currently applicable, whether levied by the Central Government or the State Government or any Local Authority.  In the event of  any amendment or variation in the rate or methodology for charging the applicable  taxes, and/or, should be any new levies imposed in respect of this contract, the entire burden of any additional levy shall be borne and payable by you on demand at any time, in addition to the price/s stated herein.
		            All necessary & correct documents & drawings required procuring erection permission & lift license to be provided by <strong>${company_name}.</strong></p>
            </div>
        </div>
    `;
  return scopeOfWorkContent || defaultContent;
};


export const generateCombinedLiftPriceTable = (
  liftRows,
  customerName,
  siteAddress,
  refName,
  financialYear,
  monthName,
  newQuatationDate
) => {
  return `
    <div>
      <p><strong>We propose to furnish and erect the installation outlined in the foregoing proposal.</strong></p>

      <table style="
        width: 100%; 
        border-collapse: collapse; 
        font-size: 13pt; 
        margin-top: 30px;">

        <!-- HEADER ROW (ONLY ONCE) -->
        <tr style="border:1px solid black;">
          <th colspan="4" style="text-align:left; padding: 20px;">
            CLIENT NAME: ${customerName} <br>
            SITE ADDRESS: ${siteAddress}
          </th>
          <th colspan="3" style="text-align:left; border-left:1px solid black; padding: 20px;">
            REF.NO: ${refName}/${financialYear}/${monthName} <br>
            DATE: ${newQuatationDate}
          </th>
        </tr>

        <!-- COLUMN TITLES -->
        <tr>
          <td colspan="2" style="border:1px solid black; text-align:center; padding: 20px;"><strong>Lift Specification</strong></td>
          <td style="border:1px solid black; text-align:center; padding: 20px;"><strong>Unit</strong></td>
          <td style="border:1px solid black; text-align:center; padding: 20px;"><strong>Price Per Unit</strong></td>
          <td style="border:1px solid black; text-align:center; padding: 20px;"><strong>Price</strong></td>
          <td style="border:1px solid black; text-align:center; padding: 20px;"><strong>GST Amount</strong></td>
          <td style="border:1px solid black; text-align:center;padding: 20px; "><strong>Final Price</strong></td>
        </tr>

        <!-- ALL LIFT ROWS INSERTED HERE -->
        ${liftRows}
      </table>
    </div>
  `;
};



export const generateLiftPriceRow = (lift) => {
  const gstRate = Number(lift.tax) || 0;   // e.g. 5, 12, 18
  const total = Number(lift.totalAmount) || 0;

  // Reverse calculation
  const basic = gstRate ? (total / (1 + gstRate / 100)) : total;
  const gstAmount = total - basic;

  const basicDisplay = formatCurrency(basic) + "/-";
  const gstDisplay = formatCurrency(gstAmount) + "/-";

  return `
    <tr>
      <td colspan="2" style="border:1px solid black; text-align:center; font-weight:bold; padding: 20px; padding-top:10px;">
        ${lift.capacityType == 1
      ? (lift.personCapacityName || "")
      : (lift.weightName || "")
    } ${lift.liftTypeName},<br>

        ${lift.stops} stops, ${lift.openings} openings,
        Rise – ${lift.carTravel / 1000} M <br>

        ${lift.cabinTypeName}
      </td>

      <td style="border:1px solid black; text-align:center; padding: 20px; padding-top:10px;">1</td>
      <td style="border:1px solid black; text-align:center; padding: 20px; padding-top:10px;">${basicDisplay}</td>
      <td style="border:1px solid black; text-align:center; padding: 20px; padding-top:10px;">${basicDisplay}</td>
      <td style="border:1px solid black; text-align:center; padding: 20px; padding-top:10px;">${gstDisplay}</td>
      <td style="border:1px solid black; text-align:center; padding: 20px; padding-top:10px;">${formatCurrency(total)}/-</td>
    </tr>
  `;
};


export const generateTermsAndConditionsHtml = (tncContent) => {
  // FIX: Apply 90% width and auto-margin to the main container inside this function
  const defaultContent = `
        <h1 style="font-weight: semibold; text-align: center;; color: #00bcd4;">TERMS AND CONDITION</h1>
        <table style='font-size:10px' width='100%'  >
        <tr>
        <td style='border: 0px; width:50%; padding-right:2%; text-align: justify; font-size:14px;>
        <p style='text-align: justify; '><strong>1.Taxes and Duties</strong>
        <br>Quoted price is exclusive of all taxes. ANY TAXES & DUTIES ARE EXTRA.
        </p>
        <p style='text-align: justify; '><strong>2. Delivery and Installation:</strong>
        <br><b>A. Delivery</b><br>Delivery of material will be 8 weeks for the elevators from the release for ordering of materials, approval of GAD , technical specification, and full compliance of contractual payment terms whichever is later
            <ul>
                <li style='list-style-type:number;text-align:justify;'>Availability of 'A' Form Documents from Client for Submission to PWD/ Inspection Authorities.</li>
                <li style='list-style-type:number;text-align:justify;'>Availability of M/c Room Roof Slab with Enclosed Wall Plastering (Only for MR jobs).</li>
                <li style='list-style-type:number;text-align:justify;'>Plastering of Lift shaft walls (If enclosure walls are in Brick).</li>
                <li style='list-style-type:number;text-align:justify;'>Scaffolding Erected in lift shaft as per Prime Drawing.</li>
                <li style='list-style-type:number;text-align:justify;'>Roof Slab ready with Hoisting 'I' Beams grouted and Finished on the front and Back Wall. (Only for MRL jobs)</li>
            </ul>
        </p>
        <p style='text-align: justify; '><strong>B. Installation:</strong><br>
        Installation will be completed in 8 weeks from the date of start of Installation work at site.<br>
        We shall start Installation work at site on compliance of following 2 conditions:
          <ul>
                <li style='list-style-type:number;text-align:justify;'>Completion of all technical activities at site as per the Check list   enclosed (Annexure).</li>
                <li style='list-style-type:number;text-align:justify;'>Fulfillment of Payment Terms against Intimation of material Ready at warehouse. </li>
          </ul>    

        </p>
        <p style='text-align: justify; '><strong>3. Right to Use:</strong><br>
        You are not entitled to use the elevator under any of the following circumstances
          <ul>
                <li style='list-style-type:number;text-align:justify;'>Any usage of our elevator, for any purpose whatsoever before the formal handover to you.</li>
                <li style='list-style-type:number;text-align:justify;'>Without making the full and final payment. </li>
                <li style='list-style-type:number;text-align:justify;'>Any unauthorized use or attempt of unauthorized use shall render the warranty and free maintenance period null and void. </li>
          </ul>    
        </p>
        </td>

        <td style='border: 0px; width:50%; padding-left:2%; ; text-align: justify; font-size:14px;'>
        <p style='text-align: justify; '>
        <b>4.Warranty</b><br>
        The warranty is for a period of 12 months from date of the physical completion of installation. The warranty covers component defects and does not intend to cover at any time any damages caused by vandalism, negligence, rain, theft, fire, riots, acts of nature and God, absence of stable and permanent power supply.<br><br>
        <b>5.Free Maintenance</b><br>
        The free maintenance is for the period of up to 12 months and will commence from the date of the physical completion of installation. The date of commencement of free maintenance will remain unchanged, irrespective of any delay in building completion, availability of permanent power supply, inspection taking over, or commencing use of the elevator.<br><br>
        <b>6.Statutory permissions from various authorities</b><br>
        All statutory permissions for starting / executing, completing and handing over the works from various authorities will be obtained by you. Fees or any other payment, incidential charges required to be paid, for concerned liaison for getting above work done will be paid directly by you. While we will coordinate for inspections required as per statutory requirements as applicable on the date of this order,<br><br>
        <b>7.Transfer of Property</b><br>
        The elevator shall remain our undisputed property till receiving the full payment as per the terms of the contract. In case the payment is not made as per the terms of contract we have the right to dismantle our elevator and take the material supplied back in our possession. This will be without prejudice to our right to recover the unpaid amount and interest by any means or process of proceedings whatsoever. We shall be entitled to recover from you legal expenses incurred in collecting payments hereunder. We shall be entitled to recover from you cost incurred in dismantling the elevator, logistics cost of moving the same, labour cost arising with such dismantling / moving and all the applicable taxes / duties / cess. We are not bound to furnish any document in support of such recoveries.
        </p>
        </td>
        </tr>
      </table>
    `;
  return tncContent || defaultContent;
};

export const generateProposalTermsHtml = (proposalTermsContent) => {
  // FIX: Apply 90% width and auto-margin to the main container inside this function
  const defaultContent = `
        <div style="width: 100%; margin-top:7%">
          <h1 style="font-size: 32pt; font-weight: bold; margin-bottom: 10px; text-align: left; color: #00bcd4;">PROPOSAL WITH PAYMENT TERMS</h1>

              <div style="font-size: 22pt; line-height: 1.6;">
                <!-- This content should come from quotationData.proposalTermsContent -->
                <p>We propose a total supply and installation cost of [Total Quotation Value] (excluding applicable taxes) for the specified elevator equipment and services.</p>
                <p><strong>Payment Schedule:</strong></p>
                <ul style="padding-left: 20px;">
                    <li style="margin-bottom: 10px;"><strong>30% Advance:</strong> Upon confirmation of the order and signing of the purchase agreement.</li>
                    <li style="margin-bottom: 10px;"><strong>60% Material Dispatch:</strong> Upon readiness of the equipment for dispatch from our warehouse (prior to shipment).</li>
                    <li style="margin-bottom: 10px;"><strong>10% Installation & Commissioning:</strong> Upon successful testing and final handover of the elevator.</li>
                </ul>
                <p>All payments must be made within 7 days of the invoice date. Delays in payment may affect the project timeline.</p>
            </div>
        </div>
    `;
  return proposalTermsContent || defaultContent;
};