import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axiosInstance from '@/utils/axiosInstance';
import toast from 'react-hot-toast';

/**
 * Reusable PDF Generator Utility
 * Fetches data from backend and generates PDF
 * @param {string} reportId - The inspection report ID
 * @param {string} customer - Customer name (optional)
 * @param {string} site - Site name (optional)
 */
export const generateInspectionPDF = async (reportId, customer = 'N/A', site = 'N/A') => {
  if (!reportId) {
    toast.error('Report ID is required');
    return;
  }

  const loadingToast = toast.loading('Generating PDF...');

  try {
    // Fetch data from backend
    const response = await axiosInstance.get(
      `/api/inspection-report/${reportId}/view-pdf-data`
    );

    const data = response.data || [];

    if (!data.length) {
      toast.dismiss(loadingToast);
      toast.error('No data available to generate PDF');
      return;
    }

    // Create PDF
    const doc = new jsPDF();

    // ============ HEADER ============
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text('Inspection Report', 14, 22);

    // Metadata
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Report ID: ${reportId}`, 14, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);

    // Customer & Site
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Customer: ${customer}`, 14, 45);
    doc.text(`Site: ${site}`, 14, 51);

    // ============ TABLE ============
    const tableRows = data.map((item, index) => [
      index + 1,
      item.categoryName || '-',
      item.liftname || '-',
      item.checkPointName || '-',
      (item.checkPointStatus || '-').toUpperCase(),
      item.remark || '-'
    ]);

    autoTable(doc, {
      startY: 60,
      head: [[
        'Sr. No',
        'Category',
        'Lift Name',
        'Inspection Point',
        'Status',
        'Remarks'
      ]],
      body: tableRows,
      theme: 'striped',
      headStyles: {
        fillColor: [44, 62, 80],
        textColor: [255, 255, 255]
      },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { halign: 'center', cellWidth: 15 },
        4: { fontStyle: 'bold' }
      }
    });

    // Save PDF
    doc.save(`Report_${reportId}_${customer || 'Export'}.pdf`);

    toast.dismiss(loadingToast);
    toast.success('PDF generated successfully!');

  } catch (error) {
    toast.dismiss(loadingToast);
    console.error('PDF Generation Error:', error);
    toast.error(
      error?.response?.data?.message || 'Failed to generate PDF'
    );
  }
};