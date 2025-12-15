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

    return (
        <div className="bg-white shadow-lg rounded-lg border border-gray-200 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4 border-b border-gray-200 gap-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    Pending Invoices Payments
                    <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {pagination.totalElements}
                    </span>
                </h2>

                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="Search invoice..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPagination((prev) => ({ ...prev, page: 0 }));
                        }}
                        className="pl-3 pr-4 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors w-full md:w-64"
                    />
                    <button
                        onClick={() => router.push('/dashboard/jobs/add-payment')}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm whitespace-nowrap"
                    >
                        <FaIndianRupeeSign className="w-4 h-4" />
                        <span>Add Payment</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="text-center py-10 text-blue-600">
                        <div
                            className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent rounded-full"
                            role="status"
                        ></div>
                        <p className="mt-2 text-sm">Loading...</p>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {[
                                    { key: "invoiceNo", label: "Invoice No", sortable: true, align: "left" },
                                    { key: "invoiceFor", label: "Invoice For", sortable: true, align: "left" }, // Added Invoice For
                                    { key: "siteName", label: "Site Name", sortable: true, align: "left" },
                                    { key: "siteAddress", label: "Site Address", sortable: true, align: "left" }, // Added Site Address Column
                                    { key: "invoiceDate", label: "Date", sortable: true, align: "center" },
                                    { key: "totalAmt", label: "Amount", sortable: false, align: "right" },
                                    { key: "action", label: "Action", sortable: false, align: "center" },
                                ].map((col) => (
                                    <th
                                        key={col.key}
                                        onClick={() => col.sortable && handleSort(col.key)}
                                        className={`px-6 py-3 text-${col.align} text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.sortable
                                            ? "cursor-pointer hover:bg-gray-100"
                                            : ""
                                            }`}
                                    >
                                        <div
                                            className={`flex items-center ${col.align === "center"
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
                        <tbody className="bg-white divide-y divide-gray-200 text-sm">
                            {invoices.length > 0 ? (
                                invoices.map((invoice, i) => (
                                    <tr
                                        key={invoice.invoiceId}
                                        className="hover:bg-gray-50 transition duration-100"
                                    >
                                        <td className="px-6 py-3 whitespace-nowrap font-medium text-gray-900">
                                            {invoice.invoiceNo}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-gray-600">
                                            {invoice.invoiceFor || "-"}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-gray-600">
                                            {invoice.siteName || "-"}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-gray-600">
                                            <div className="truncate max-w-[200px]" title={invoice.siteAddress}>
                                                {invoice.siteAddress || "-"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                                            {invoice.invoiceDate}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-gray-900 font-medium text-right">
                                            ₹{invoice.totalAmt?.toFixed(2) || "0.00"}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-center text-sm font-medium flex justify-center gap-2">
                                            <button
                                                onClick={() => handleAddPayment(invoice)}
                                                className="text-white bg-green-600 hover:bg-green-700 transition duration-150 py-1 px-2 rounded flex items-center text-xs"
                                                title="Add Payment"
                                            >
                                                <FaIndianRupeeSign className="w-3 h-3 mr-1" /> Pay
                                            </button>
                                            <button
                                                onClick={() => handlePrintPdf(invoice)}
                                                className="text-blue-600 hover:text-blue-900 transition duration-150 p-1 rounded-full hover:bg-blue-100"
                                                title="Print Invoice PDF"
                                            >
                                                <FaPrint className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="text-center py-8 text-gray-500"
                                    >
                                        No pending invoices found.
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
