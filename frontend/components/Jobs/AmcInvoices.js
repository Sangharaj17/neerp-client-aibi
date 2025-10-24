// components/AmcInvoices.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance'; // Adjust path as needed
import { FaPrint, FaSpinner } from 'react-icons/fa'; // Import necessary icons

const AmcInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Pagination and Sorting State ---
    const [pagination, setPagination] = useState({
        page: 0,
        size: 20,
        sortBy: 'totalAmt',
        direction: 'asc',
    });

    // --- Data Fetching Logic ---
    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            setError(null);
            
            // Construct the query string from the state
            const params = {
                page: pagination.page,
                size: pagination.size,
                sortBy: pagination.sortBy,
                direction: pagination.direction,
                // Assuming 'search' is not required for the default view
                search: '', 
            };

            try {
                const response = await axiosInstance.get('/api/amc/invoices/getAllInvoices', { params });
                
                // The API returns a Spring Page object; extract 'content'
                setInvoices(response.data.content);
                // Optionally update total pages/elements here if needed for full pagination UI
                
            } catch (err) {
                console.error("Failed to fetch invoices:", err);
                setError("Failed to load invoices. Please check the network.");
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, [pagination]); // Dependency array: Re-run on pagination/sort change

    // --- Helper Function for 'Is Received' status ---
    const getPaymentStatus = (isCleared) => {
        // isCleared = 1 means Cleared (received), isCleared = 0 means Pending (not received)
        const status = isCleared === 1 ? 'Received' : 'Pending';
        const color = isCleared === 1 ? 'text-green-600' : 'text-red-600';

        return <span className={`font-medium ${color}`}>{status}</span>;
    };

    // --- Placeholder for PDF generation ---
    const handlePrintPdf = (invoiceId) => {
        console.log(`PDF Print Icon clicked for Invoice ID: ${invoiceId}`);
        alert(`Prepare to generate PDF for Invoice ID: ${invoiceId}`);
        // TODO: Implement PDF generation logic here
    };

    // --- Rendering Logic ---

    if (loading) {
        return <div className="p-4 text-center text-blue-500"><FaSpinner className="animate-spin inline mr-2" />Loading Invoices...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">{error}</div>;
    }

    if (invoices.length === 0) {
        return <div className="p-4 text-center text-gray-500">No current/next month pending invoices found.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Pending AMC Invoices (Current & Next Month)</h1>
            
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="py-2 px-4 border-b">Sr No</th>
                        <th className="py-2 px-4 border-b text-left">Invoice No</th>
                        <th className="py-2 px-4 border-b text-left">Invoice For Site</th>
                        <th className="py-2 px-4 border-b text-left">Site Address</th>
                        <th className="py-2 px-4 border-b">Invoice Date</th>
                        <th className="py-2 px-4 border-b text-right">Amount (Total)</th>
                        <th className="py-2 px-4 border-b">Is Received</th>
                        <th className="py-2 px-4 border-b">PDF</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice, index) => (
                        <tr key={invoice.invoiceId} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b text-center">{index + 1 + (pagination.page * pagination.size)}</td>
                            <td className="py-2 px-4 border-b">{invoice.invoiceNo}</td>
                            <td className="py-2 px-4 border-b">{invoice.siteName || 'N/A'}</td>
                            {/* Display Site Address, handling null/empty string */}
                            <td className="py-2 px-4 border-b text-sm text-gray-500">
                                {invoice.siteAddress || 'No Address Provided'}
                            </td>
                            <td className="py-2 px-4 border-b text-center">{invoice.invoiceDate}</td>
                            <td className="py-2 px-4 border-b text-right font-mono">
                                {/* Format as currency string (simple fixed 2 decimal) */}
                                {invoice.totalAmt ? `₹${invoice.totalAmt.toFixed(2)}` : 'N/A'}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                {/* Display status and color based on isCleared */}
                                {getPaymentStatus(invoice.isCleared)}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                {/* PDF Print Icon */}
                                <FaPrint 
                                    className="text-gray-500 hover:text-blue-600 cursor-pointer transition-colors"
                                    title={`Print Invoice ${invoice.invoiceNo}`}
                                    onClick={() => handlePrintPdf(invoice.invoiceId)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AmcInvoices;