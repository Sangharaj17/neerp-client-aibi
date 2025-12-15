"use client";

import { useState, useEffect } from "react";
import {
    FaPrint,
    FaSort,
    FaSortUp,
    FaSortDown,
    FaChevronLeft,
    FaChevronRight,
    FaIndianRupeeSign
} from "react-icons/fa6";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import ActionModal from "../AMC/ActionModal";
import AMCInvoicePrint from "../Jobs/AMCInvoicePrint";
import MaterialQuotationPrint from "../Jobs/MaterialQuotationPrint";
import OncallInvoicePrint from "../Oncall/OncallInvoicePrint";
import ModernizationInvoicePrint from "../Modernization/ModernizationInvoicePrint";

const getSortIcon = (column, sortBy, direction) => {
    if (sortBy === column) {
        return direction === "asc" ? (
            <FaSortUp className="ml-1" />
        ) : (
            <FaSortDown className="ml-1" />
        );
    }
    return <FaSort className="ml-1 text-gray-400" />;
};

const PendingInvoicesList = () => {
    const router = useRouter();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);

    const [pagination, setPagination] = useState({
        page: 0,
        size: 5, // Default smaller size for dashboard
        totalPages: 0,
        totalElements: 0,
    });

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("invoiceDate");
    const [direction, setDirection] = useState("desc");

    // Fetch invoice list
    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("/api/amc/invoices/getAllPendingInvoices", {
                params: {
                    page: pagination.page,
                    size: pagination.size,
                    search: search || null,
                    sortBy,
                    direction,
                },
            });
            const data = response.data;
            setInvoices(data.content);
            setPagination((prev) => ({
                ...prev,
                page: data.number,
                size: data.size,
                totalPages: data.totalPages,
                totalElements: data.totalElements,
            }));
        } catch (error) {
            console.error("Error fetching pending invoices:", error);
        } finally {
            setLoading(false);
        }
    };

    // Initial load & Refetch
    useEffect(() => {
        fetchInvoices();
    }, [pagination.page, pagination.size, search, sortBy, direction]);

    const handleSort = (column) => {
        if (sortBy === column) {
            setDirection(direction === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setDirection("asc");
        }
        setPagination((prev) => ({ ...prev, page: 0 }));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < pagination.totalPages) {
            setPagination({ ...pagination, page: newPage });
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

    const [isMaterialInvoiceModalOpen, setIsMaterialInvoiceModalOpen] = useState(false);
    const [isOncallInvoiceModalOpen, setIsOncallInvoiceModalOpen] = useState(false);
    const [isModernizationInvoiceModalOpen, setIsModernizationInvoiceModalOpen] = useState(false);
    const [selectedMaterialQuotationId, setSelectedMaterialQuotationId] = useState(null);
    const [selectedOncallQuotationId, setSelectedOncallQuotationId] = useState(null);
    const [selectedModernizationQuotationId, setSelectedModernizationQuotationId] = useState(null);

    const closeMaterialInvoiceModal = () => {
        setIsMaterialInvoiceModalOpen(false);
        setSelectedMaterialQuotationId(null);
    };

    const closeOncallInvoiceModal = () => {
        setIsOncallInvoiceModalOpen(false);
        setSelectedOncallQuotationId(null);
    };

    const closeModernizationInvoiceModal = () => {
        setIsModernizationInvoiceModalOpen(false);
        setSelectedModernizationQuotationId(null);
    };


    const handlePrintPdf = (invoice) => {
        const invoiceId = invoice.invoiceId;
        setSelectedInvoiceId(invoiceId);

        const jobNo = invoice.jobNo;
        const renewlJobId = invoice.renewlJobId;

        const materialRepairQuotationId = invoice.materialRepairQuotationId;
        const oncallQuotationId = invoice.oncallQuotationId;
        const modernizationId = invoice.modernizationId;

        if (jobNo !== null || renewlJobId !== null)
            setIsModalOpen(true);
        else {
            if (materialRepairQuotationId !== null) {
                setSelectedMaterialQuotationId(materialRepairQuotationId);
                setIsMaterialInvoiceModalOpen(true);
            }
            else if (oncallQuotationId !== null) {
                setSelectedOncallQuotationId(oncallQuotationId);
                setIsOncallInvoiceModalOpen(true);
            }
            else if (modernizationId !== null) {
                setSelectedModernizationQuotationId(modernizationId);
                setIsModernizationInvoiceModalOpen(true);
            }
        }
    };

    const handleAddPayment = (invoice) => {
        let queryParams = {
            invoiceId: invoice.invoiceId,
        };

        if (invoice.renewlJobId) {
            queryParams.jobType = 'amc';
            queryParams.jobId = invoice.renewlJobId;
            queryParams.isRenewal = 'true';
        } else if (invoice.jobNo) {
            if (invoice.invoiceFor === "New Installation") {
                queryParams.jobType = 'new';
            } else {
                queryParams.jobType = 'amc';
            }
            queryParams.jobId = invoice.jobNo;
        } else if (invoice.materialRepairQuotationId) {
            queryParams.jobType = 'materialRepair';
            queryParams.jobId = invoice.materialRepairQuotationId;
        } else if (invoice.oncallQuotationId) {
            queryParams.jobType = 'onCall';
            queryParams.jobId = invoice.oncallQuotationId;
        } else if (invoice.modernizationId) {
            queryParams.jobType = 'modernization';
            queryParams.jobId = invoice.modernizationId;
        }

        const searchParams = new URLSearchParams(queryParams);
        router.push(`/dashboard/jobs/add-payment?${searchParams.toString()}`);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedInvoiceId(null);
    };

    // Helper for currency formatting
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    return (
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 mb-8 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between px-8 py-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 gap-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <FaIndianRupeeSign className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            Payments Overview
                        </h2>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-0.5">
                            Pending Invoices ({pagination.totalElements})
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="relative group w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search invoices..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPagination((prev) => ({ ...prev, page: 0 }));
                            }}
                            className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full outline-none transition-all duration-200"
                        />
                    </div>
                    <button
                        onClick={() => router.push('/dashboard/jobs/add-payment')}
                        className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap w-full sm:w-auto"
                    >
                        <FaIndianRupeeSign className="w-3.5 h-3.5" />
                        <span>Record Payment</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 text-blue-600">
                        <div className="relative w-12 h-12">
                            <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <p className="mt-4 text-sm font-medium text-gray-500">Loading invoices...</p>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead>
                            <tr className="bg-gray-50/50">
                                {[
                                    { key: "invoiceNo", label: "Invoice No", sortable: true, align: "left" },
                                    { key: "invoiceFor", label: "Type", sortable: true, align: "left" },
                                    { key: "siteName", label: "Client & Site", sortable: true, align: "left" },
                                    { key: "siteAddress", label: "Address", sortable: true, align: "left" },
                                    { key: "invoiceDate", label: "Date", sortable: true, align: "center" },
                                    { key: "totalAmt", label: "Amount", sortable: false, align: "right" },
                                    { key: "action", label: "Actions", sortable: false, align: "center" },
                                ].map((col) => (
                                    <th
                                        key={col.key}
                                        onClick={() => col.sortable && handleSort(col.key)}
                                        className={`px-6 py-4 text-${col.align} text-xs font-bold text-gray-500 uppercase tracking-wider ${col.sortable
                                            ? "cursor-pointer hover:text-blue-600 hover:bg-gray-100 transition-colors"
                                            : ""
                                            }`}
                                    >
                                        <div
                                            className={`flex items-center gap-1 ${col.align === "center"
                                                ? "justify-center"
                                                : col.align === "right"
                                                    ? "justify-end"
                                                    : ""
                                                }`}
                                        >
                                            {col.label}
                                            {col.sortable && getSortIcon(col.key, sortBy, direction)}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100 text-sm">
                            {invoices.length > 0 ? (
                                invoices.map((invoice, i) => (
                                    <tr
                                        key={invoice.invoiceId}
                                        className="group hover:bg-blue-50/50 transition duration-200"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                                                {invoice.invoiceNo}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-gray-200">
                                                {invoice.invoiceFor || "General"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">
                                            {invoice.siteName || "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                            <div className="truncate max-w-[180px]" title={invoice.siteAddress}>
                                                {invoice.siteAddress || "-"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-center font-mono text-xs">
                                            {invoice.invoiceDate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <span className="font-bold text-gray-900 group-hover:text-green-600 transition-colors text-base font-mono tracking-tight">
                                                {formatCurrency(invoice.totalAmt)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleAddPayment(invoice)}
                                                    className="relative inline-flex items-center justify-center px-3 py-1.5 overflow-hidden text-xs font-medium text-white transition-all duration-300 bg-green-600 rounded-lg group/btn hover:bg-green-700 hover:shadow-md hover:-translate-y-0.5"
                                                    title="Record Payment"
                                                >
                                                    <span className="relative flex items-center gap-1.5">
                                                        <FaIndianRupeeSign className="w-3 h-3" />
                                                        Pay
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={() => handlePrintPdf(invoice)}
                                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                                    title="Print Invoice"
                                                >
                                                    <FaPrint className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="text-center py-12"
                                    >
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <div className="p-4 bg-gray-50 rounded-full mb-3">
                                                <FaIndianRupeeSign className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <p className="text-lg font-medium text-gray-500">No pending invoices found</p>
                                            <p className="text-sm">Great job! All payments are cleared.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                        Page {pagination.page + 1} of {pagination.totalPages}
                    </div>
                    <div className="flex space-x-2">
                        <button
                            disabled={pagination.page === 0}
                            onClick={() => handlePageChange(pagination.page - 1)}
                            className="p-1 px-3 border rounded text-xs hover:bg-gray-100 disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <button
                            disabled={pagination.page === pagination.totalPages - 1}
                            onClick={() => handlePageChange(pagination.page + 1)}
                            className="p-1 px-3 border rounded text-xs hover:bg-gray-100 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            <ActionModal
                isOpen={isModalOpen}
                onCancel={closeModal}
            >
                {selectedInvoiceId !== null && (
                    <AMCInvoicePrint invoiceId={selectedInvoiceId} />
                )}
                <div className="flex justify-end pt-4 print:hidden">
                    <button
                        onClick={closeModal}
                        className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Close Preview
                    </button>
                </div>
            </ActionModal>

            <ActionModal
                isOpen={isMaterialInvoiceModalOpen}
                onCancel={closeMaterialInvoiceModal}
            >
                {selectedMaterialQuotationId !== null && (
                    <MaterialQuotationPrint quotationId={selectedMaterialQuotationId}
                        onCancel={closeMaterialInvoiceModal} />
                )}

            </ActionModal>

            <ActionModal
                isOpen={isOncallInvoiceModalOpen}
                onCancel={closeOncallInvoiceModal}
            >
                {selectedOncallQuotationId !== null && (
                    <OncallInvoicePrint invoiceId={selectedOncallQuotationId}
                        onCancel={closeOncallInvoiceModal} />
                )}
            </ActionModal>

            <ActionModal
                isOpen={isModernizationInvoiceModalOpen}
                onCancel={closeModernizationInvoiceModal}
            >
                {selectedModernizationQuotationId !== null && (
                    <ModernizationInvoicePrint invoiceId={selectedModernizationQuotationId}
                        onCancel={closeModernizationInvoiceModal} />
                )}
            </ActionModal>

        </div>
    );
};

export default PendingInvoicesList;
