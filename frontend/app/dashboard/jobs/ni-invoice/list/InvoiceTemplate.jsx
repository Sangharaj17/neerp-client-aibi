const InvoiceTemplate = ({ invoice }) => {
  return (
    <table>
      <thead>
        <tr>
          <th colSpan="7" style={{ textAlign: "center" }}>
            TAX INVOICE
          </th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td colSpan="3">
            <b>SMASH ELEVATORS AND ESCALATORS</b>
            <br />
            Address: Office No.002, Karve Nagar Pune
            <br />
            <br />
            <b>GSTIN:</b> 27BEXPS9412N1ZC
            <br />
            Contact: 8888006500
          </td>

          <td colSpan="2">
            <b>Invoice No</b>
            <br />
            {invoice.invoiceNo}
          </td>

          <td colSpan="2">
            <b>Dated</b>
            <br />
            {invoice.invoiceDate}
          </td>
        </tr>

        <tr>
          <td colSpan="3">
            <b>Buyer Address</b>
            <br />
            {invoice.customerName}
            <br />
            GSTIN: {invoice.customerGst}
          </td>

          <td colSpan="4">
            <b>Site Name / Ship To</b>
            <br />
            {invoice.siteName}
            <br />
            {invoice.siteAddress}
          </td>
        </tr>

        <tr>
          <th>Sr</th>
          <th>Particulars</th>
          <th>HSN</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Per</th>
          <th>Amount</th>
        </tr>

        <tr style={{ height: "120px" }}>
          <td>1</td>
          <td>
            Maintenance & Repairs Service Of Elevators
            <br />
            AMC Charges
            <br />
            Period {invoice.periodFrom} To {invoice.periodTo}
          </td>
          <td>998718</td>
          <td>{invoice.noOfLifts}</td>
          <td>{invoice.basicPerLift}</td>
          <td></td>
          <td>{invoice.basicAmount}</td>
        </tr>

        <tr>
          <td colSpan="6">Sub Total</td>
          <td>{invoice.basicAmount}</td>
        </tr>

        <tr>
          <td colSpan="6">CGST</td>
          <td>{invoice.cgst}</td>
        </tr>

        <tr>
          <td colSpan="6">SGST</td>
          <td>{invoice.sgst}</td>
        </tr>

        <tr>
          <td colSpan="6">
            <b>Grand Total</b>
          </td>
          <td>
            <b>{invoice.totalAmount}</b>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default InvoiceTemplate;
