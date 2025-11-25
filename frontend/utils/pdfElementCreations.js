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
    stdFeatureIds,
    vfdMainDriveName,
    controlPanelMakeName,
    doorOperatorName,
    mainMachineSetName,
    carRailsName,
    wireRopeName,
    wiringHarnessName,
  } = liftDetail;


  const lift_qnty = 1;

  const liftTableId = `lift-spec-${index}`;

  const capacity = capacityType == 1 ? personCapacityName : weightName;
  const carTravel1 = carTravel / 1000;
  const carSize = `${carInternalWidth} mm Width, ${carInternalDepth} mm Depth`;
  const noFloorLandingSecond = landingEntranceSubType2_toFloor - landingEntranceSubType2_fromFloor;
  const carEnteranceSize = `${carInternalDepth} mm Depth, ${carInternalHeight} mm Height`;

  return `
    <div id="${liftTableId}" style="page-break-before: auto; margin-top: 20px;">
        
        <table class='speci' style="width: 100%; font-size: 10pt;">
            <tr style='border-top: 1px solid black;'>
                <th style='border:1px solid black; width:60%; text-align:left; padding: 5px;'>
                    CLIENT NAME: <span class='case'>${customerName}</span><br>
                    SITE ADDRESS: <span class='case'>${site_address}</span>
                </th>
                <th style='border:1px solid black; width:40%; text-align:left; padding: 5px;'>
                    <br>REF.NO: ${refName}/${financialYear}/${monthName}/${quotationNo}<br>
                    DATE: ${newQuatationDate}
                </th>
            </tr>

            <tr>
                <td colspan="2" style='text-align:center; border:1px solid black; width:100%; padding: 5px; background-color: #f0f0f0;'>
                    <strong>TECHINICAL SPECIFICATIONS SHEET (LIFT ${index + 1})</strong>
                </td>
            </tr>

            <tr style='border: 1px solid black;'>
                <th colspan="2" style='text-align:left; font-size: 12px; padding: 5px; background-color: #e0e0e0;'>RANGE -</th>
            </tr>
            <tr>
                <td style='border:1px solid black; padding: 5px;'>NO.OF ELEVATOR</td>
                <td style='border:1px solid black; padding: 5px;'>0${lift_qnty}</td>
            </tr>
            <tr>
                <td style='border:1px solid black; padding: 5px;'>PRODUCT</td>
                <td style='border:1px solid black; padding: 5px;'>${liftTypeName} ELEVATOR</td>
            </tr>
            <tr>
                <td style='border:1px solid black; padding: 5px;'>CAPICITY(kg)</td>
                <td style='border:1px solid black; padding: 5px;'>${capacity}</td>
            </tr>
            <tr>
                <td style='border:1px solid black; padding: 5px;'>SPEED(mps)</td>
                <td style='border:1px solid black; padding: 5px;'>ABOUT ${speed} m/sec</td>
            </tr>
            <tr>
                <td style='border:1px solid black; padding: 5px;'>DOOR OPERATION</td>
                <td style='border:1px solid black; padding: 5px;'>${liftTypeName}</td>
            </tr>
            <tr style='border: 1px solid black;'>
                <th colspan="2" style='text-align:left; font-size: 12px; padding: 5px; background-color: #e0e0e0;'>MACHINE -</th>
            </tr>

            <tr>
                <td style='border:1px solid black; padding: 5px;'>MACHINE</td>
                <td style='border:1px solid black; padding: 5px;'>${typeOfLiftName}</td>
            </tr>
            <tr>
                <td style='border:1px solid black; padding: 5px;'>MAIN POWER SYSTEM</td>
                <td style='border:1px solid black; padding: 5px;'>${mainSupplySystem}</td>
            </tr>
            <tr>
                <td style='border:1px solid black; padding: 5px;'>OPERATION</td>
                <td style='border:1px solid black; padding: 5px;'>${operationTypeName}</td>
            </tr>
            <tr>
                <td style='border:1px solid black; padding: 5px;'>REQUIRED DRIVE</td>
                <td style='border:1px solid black; padding: 5px;'>CLOSE LOOP V3F DRIVE.</td>
            </tr>
            <tr>
                <td style='border:1px solid black; padding: 5px;'>CONTROLLER TYPE</td>
                <td style='border:1px solid black; padding: 5px;'> MICROPROCESSOR BASED DOWN COLLECTIVE AUTO CONTROL PANEL.</td>
            </tr>
            <tr>
                <td style='border:1px solid black; padding: 5px;'>TRACTION MEDIA</td>
                <td style='border:1px solid black; padding: 5px;'>STEEL ROPE</td>
            </tr>
            <tr style='border: 1px solid black;'>
                <th colspan="2" style='text-align:left; font-size: 12px; padding: 5px; background-color: #e0e0e0;'>ELEVATOR WELL -</th>
            </tr>
            <tr>
                <td style='border:1px solid black; padding: 5px;'>CAR TRAVEL</td>
                <td style='border:1px solid black; padding: 5px;'>${floorDesignations} RISES ABOUT ${carTravel1} Mts.</td>
            </tr>

            <tr>
                <td style='border:1px solid black; padding: 5px;'>NO. OF STOPS</td>
                <td style='border:1px solid black; padding: 5px;'>0${stops} Nos.</td>
            </tr>
            <tr>
                <td style='border:1px solid black; padding: 5px;'>SHAFT SIZE</td>
                <td style='border:1px solid black; padding: 5px;'>${shaftWidth} mm Width, ${shaftDepth} mm Depth</td>
            </tr>
            <tr>
                <td style='border:1px solid black; padding: 5px;'>MACHINE ROOM</td>
                <td style='border:1px solid black; padding: 5px;'>${machineRoomName}</td>
            </tr>
            <tr>
                <td style='border:1px solid black; padding: 5px;'>PIT DEPTH</td>
                <td style='border:1px solid black; padding: 5px;'>${pitDepth} mm</td>
            </tr>
            <tr>
                <td style='border:1px solid black; padding: 5px;'>OVERHEAD</td>
                <td style='border:1px solid black; padding: 5px;'>${overhead} mm</td>
            </tr>
            <tr style='border: 1px solid black;'>
                <th colspan="2" style='text-align:left; font-size: 12px; padding: 5px; background-color: #e0e0e0;'>CAR ENCLOSURE –</th>
            </tr>
            <tr>
                <td style='border:1px solid black; padding: 5px;'>CAR NAME</td>
                <td style='border:1px solid black; padding: 5px;'>${cabinTypeName}</td> 
            </tr>
            <tr>
                <td style='border:1px solid black; padding: 5px;'>CAR SIZE</td>
                <td style='border:1px solid black; padding: 5px;'>${carSize}</td>
            </tr>
            <tr>
                <td style='border:1px solid black; padding: 5px;'>CAR DOOR</td>
                <td style='border:1px solid black; padding: 5px;'>${carEntranceSubTypeName}</td>
            </tr>
            <tr>
                <td style='border:1px solid black; padding: 5px;'>FLOORING</td>
                <td style='border:1px solid black; padding: 5px;'>${cabinFlooringName}</td>
            </tr> 
            <tr>
                <td style='border:1px solid black; padding: 5px;'>FALSE CEILING</td>
                <td style='border:1px solid black; padding: 5px;'>${cabinCeilingName} In ${cabinTypeName}</td>
            </tr>
            <tr>
                <td style='border:1px solid black; padding: 5px;'>LIGHTS & FAN</td>
                <td style='border:1px solid black; padding: 5px;'>${airTypeName},${lightFittingName}</td>
            </tr>

            <tr>
                <td style='border:1px solid black; padding: 5px;'>C.O.P.</td>
                <td style='border:1px solid black; padding: 5px;'>${copTypeName}</td>
            </tr>

            <tr style='border: 1px solid black;'>
                <th colspan="2" style='text-align:left; font-size: 12px; padding: 5px; background-color: #e0e0e0;'>LANDING -</th>
            </tr>
            <tr>
                <td style='border:1px solid black; padding: 5px;'>LANDING DOOR</td>
                <td style='border:1px solid black; font-size: 10px; padding: 5px;'>
                    1)${landingEntranceSubType1Name}&nbsp;-&nbsp;${landingEntranceCount}<br>
                    ${landingEntranceSubType2Name}&nbsp;-&nbsp;${noFloorLandingSecond}
                </td>
            </tr>

            <tr>
                <td style='border:1px solid black; padding: 5px;'>CLEAR OPENING</td>
                <td style='border:1px solid black; padding: 5px;'>${carEnteranceSize}</td>
            </tr>
            <tr>
                <td style='border:1px solid black; padding: 5px;'>L.O.P</td>
                <td style='border:1px solid black; padding: 5px;'>${lopTypeName}</td>
            </tr>
        </table>
    </div>
    `;
};


/**
 * Generates the two-column table HTML for standard features.
 * @param {Array<string>} stdFeatureIds - The array of feature strings.
 * @returns {string} The HTML string for the table.
 */
const generateStandardFeaturesTable = (stdFeatureIds) => {
    let html = `
    <br><br>
    <table class='table' style='width:100%'>
        <tr style='border: 1px solid black;'>
            <th colspan="2">STANDARD FEATURES – FOR MANUAL DOOR ELEVATOR</th>
        </tr>
    `;

    // Iterate through the array using a standard 'for' loop
    for (let i = 0; i < stdFeatureIds.length; i++) {
        const feature = stdFeatureIds[i];

        // 1. Check if we need to start a new row (i is even)
        if (i % 2 === 0) {
            html += `<tr>`;
        }
        
        // 2. Add the feature to the current cell (<td>)
        if (feature && feature.trim() !== '') {
            html += `
                <td style='border: 0px; padding:7px;'>
                    <ul><li style='list-style-type:disc;'> ${feature}</li></ul>
                </td>
            `;
        } else {
            // Add an empty cell if the feature is null or empty
            html += `<td style='border: 0px; padding:7px;'></td>`; 
        }

        // 3. Check if we need to close the row (i is odd)
        if (i % 2 !== 0) {
            html += `</tr>`;
        }
    }
    
    // 4. Handle the last row if the total count is odd.
    // The loop ended after adding the feature but before closing the row.
    if (stdFeatureIds.length % 2 !== 0) {
        // Add a blank closing cell and close the row
        html += `<td style='border: 0px; width:50%; padding:7px;'></td>`;
        html += `</tr>`;
    }

    html += `</table><br>`;
    
    return html;
};