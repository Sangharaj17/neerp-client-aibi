"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import axiosInstance from "@/utils/axiosInstance";
import { Loader2, FileText, RefreshCw, ThumbsUp, ThumbsDown, Mail, Eye } from "lucide-react";
import { AlignJustify } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import ActionModal from "../AMC/ActionModal";
import AmcQuotationPdfSettingPreviewAndPrint from "./pdf/AmcQuotationPdfSettingPreviewAndPrint";

import AmcQuotationView from "./AmcQuotationView";

import toast from "react-hot-toast";

import AmcQuotationPdfAutoSender from "./sms/AmcQuotationPdfAutoSender";

export default function RevisedQuotationList({ quotationId }) {

    const router = useRouter();

  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(null);
  const [selectedQuotationId, setSelectedQuotationId] = useState(null);

    const closeModal = () => setSelectedQuotationId(null);

     

  useEffect(() => {
    fetchRevisedQuotations();
  }, [quotationId]);

  const fetchRevisedQuotations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(
        `/api/amc/quotation/initial/revised/by-quotation/${quotationId}`
      );
      setQuotations(response.data);
    } catch (err) {
      console.error("Error fetching revised quotations:", err);
      setError("Failed to load revised quotations.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const generatePDF = async (id, withLetterhead) => {
    try {
      setLoadingBtn(`pdf-${id}-${withLetterhead}`);
      // Call backend API for PDF generation
      await axiosInstance.get(
        `/api/amc/quotation/initial/revised/${id}/generate-pdf?letterhead=${withLetterhead}`
      );
    } finally {
      setLoadingBtn(null);
    }
  };

  const handleRevise = (id) => {

    // Navigate to revise page
    window.location.href = `/dashboard/quotations/amc_quatation_list/revise_quatation_list/${quotationId}/revision/${id}`;
  };

  const previewMail = (id) => {
    console.log("Preview mail for revised quotation:", id);
  };

   const handleFinalize = async (quotationId) => {
      try {
       // setLoading(true);
         setLoadingBtn(`final-${quotationId}`);
        const res = await axiosInstance.put(`/api/amc/quotation/initial/revised/${quotationId}/finalize`);
        toast.success("Quotation finalized successfully!");
        fetchRevisedQuotations(); // ✅ Re-fetch the quotations list
      } catch (error) {
        console.error("Error finalizing quotation:", error);
        toast.error("Failed to finalize quotation");
      } finally {
       // setLoading(false);
      }
    };

    const [isWithoutLetterhead, setIsWithoutLetterhead] = useState(false);
  const [isWithLetterHead, setIsWithLetterHead] = useState(false);
    const [siteName,setSiteName] = useState('');
  
   const [amcRevisedQuotationId, setRevisedAmcQuotationId] = useState(false);

   const [shouldSendPdf, setShouldSendPdf] = useState('idle');
   
   const handleSendSms = () => {
     // Trigger the PDF generation and sending
     setShouldSendPdf('sending');
   };
   
   const handleSuccess = () => {
     console.log("PDF sent successfully!");
     setShouldSendPdf('idle'); // ✅ Reset to idle
     toast.success("Revised Quotation PDF sent successfully via email!");
     setLoadingBtn(null);
   };
   
   const handleError = (error) => {
     console.error("Failed to send PDF:", error);
     setShouldSendPdf('idle'); // ✅ Reset to idle
     toast.error("Failed to send PDF. Please try again.");
     setLoadingBtn(null);
   };


  return (
    <div className="min-h-screen">
      <Head>
        <title>Revised Quotation List</title>
        
      </Head>

      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="flex items-center justify-between mb-4">
    <h1 className="text-2xl font-bold text-gray-800">
      Revised Quotation List
    </h1>

    <button
      type="button"
      onClick={() => {
        router.push(`/dashboard/quotations/amc_quatation_list`);
      }}
      className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
    >
      Back to List
    </button>
  </div>

        <div className="bg-white rounded shadow overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : quotations.length === 0 ? (
            <div className="text-center text-gray-600 py-8">
              No revised quotations found.
            </div>
          ) : (
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-2 text-left">S.No</th>
                  <th className="px-2 py-2">Date</th>
                  <th className="px-2 py-2">Customer</th>
                  <th className="px-2 py-2">Site</th>
                  <th className="px-2 py-2">Generated By</th>
                  <th className="px-2 py-2">Place</th>
                  <th className="px-2 py-2">Make</th>
                  {/* <th className="px-2 py-2 ">View</th> */}
                  <th className="px-2 py-2">AMC Period</th>
                  <th className="px-2 py-2">Edition</th>
                  
                  <th colSpan="2" className="px-2 py-2 text-center font-medium">
                    Generate Quotation
                  </th>
                  <th className="px-2 py-2 text-center">Revise</th>
                  {/* <th className="px-2 py-2 text-center">Revision</th> */}
                  <th className="px-2 py-2 text-center">Is Final</th>
                  <th className="px-2 py-2 text-center">View</th>
                  <th className="px-2 py-2 text-center">Preview Mail</th>
                </tr>
                <tr className="bg-gray-100">
                  <th colSpan="9"></th>
                  <th className="px-2 py-1 text-center">PDF</th>
                  <th className="px-2 py-1 text-center">No Letterhead</th>
                  <th colSpan="4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {quotations.map((q, i) => (
                  <tr key={q.id} className="hover:bg-gray-50">
                    <td className="px-2 py-2">{i + 1}</td>
                    <td className="px-2 py-2">{formatDate(q.quatationDate)}</td>
                    <td className="px-2 py-2">{q.customerName || "-"}</td>
                    <td className="px-2 py-2">{q.siteName || "-"}</td>
                    <td className="px-2 py-2">{q.employeeName || "-"}</td>
                    <td className="px-2 py-2">{q.place || "-"}</td>
                    <td className="px-2 py-2">{q.makeOfElevator || "-"}</td>

                    {/* <td> <button onClick={() => setSelectedQuotationId(q.id)} className="text-blue-600 hover:text-blue-900 p-0.5">
                          <Eye className="w-4 h-4" />
                        </button></td> */}
                        
                    <td className="px-2 py-2">{q.amcPeriod || "-"}</td>
                    <td className="px-2 py-2">{q.edition || "-"}</td>

                    

                    {/* Generate PDF */}
                    <td className="px-2 py-2 text-center">
                      <button
                        onClick={() =>{
setSiteName(q.siteName);
                        setIsWithLetterHead(true);
                        setRevisedAmcQuotationId(q.id);
                         //generatePDF(q.id, true)
                      }}

                        className="bg-sky-400 hover:bg-sky-500 text-white p-1 rounded"
                      >
                        {loadingBtn === `pdf-${q.id}-true` ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <button

                       onClick={() =>{
                          setSiteName(q.siteName);
                        setIsWithoutLetterhead(true);
                        setRevisedAmcQuotationId(q.id);
                         //generatePDF(q.id, true)
                      }}                        
                        className="bg-sky-400 hover:bg-sky-500 text-white p-1 rounded"
                      >
                        {loadingBtn === `pdf-${q.id}-false` ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* Revise */}
                    <td className="px-2 py-2 text-center">
                      <button
                        onClick={() => {
                            handleRevise(q.id);
                            setLoadingBtn(`revise-${q.id}`);
                        }}
                        className="bg-sky-400 hover:bg-sky-500 text-white p-1 rounded flex items-center justify-center w-6 h-7"
                      >
                        {loadingBtn === `revise-${q.id}` ? (
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                        ) : (
                          <RefreshCw className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* Revision */}
                    {/* <td className="px-2 py-2 text-center">
                      <span className="bg-sky-400 text-white w-9 h-6 rounded flex items-center justify-center">
                        <AlignJustify size={14} strokeWidth={2} />
                      </span>
                    </td> */}

                    {/* Is Final */}
                  <td className="px-2 py-2 text-center">
      {q.isFinal ? (
<ThumbsUp 
  className="w-4 h-4 text-green-600" 
  fill="currentColor" 
  stroke="currentColor" 
/>
      ) : loadingBtn ===  `final-${q.id}`? (
        <Loader2 className="w-4 h-4 animate-spin text-sky-500 " />
      ) : (
                  <ThumbsDown onClick={() => handleFinalize(q.id)} className="w-4 h-4 text-gray-400" />

      )}
    </td>   

                    <td className="px-2 py-2 text-center"> <button  className="text-blue-600 hover:text-blue-900 p-0.5">
                          <Eye onClick={() => setSelectedQuotationId(q.id)} className="w-4 h-4" />
                        </button></td>

                    {/* Preview Mail */}
                    <td className="px-2 py-2 text-center">


                      {/* <button
                        onClick={() => previewMail(q.revisedQuatationId)}
                        className="bg-green-400 hover:bg-green-500 text-white p-1 rounded"
                      >
                        <Mail className="w-4 h-4" />
                      </button> */}
                       <button
                        disabled={loadingBtn === `sms-${q.id}`}
                        onClick={() => {
                          if (loadingBtn) return;
                      
                          setLoadingBtn(`sms-${q.id}`);
                      
                          setSiteName(q.siteName);
                          setRevisedAmcQuotationId(q.id);                      
                          handleSendSms(); // no concern about async / success
                        }}
                        className={`p-1 rounded transition
                          ${loadingBtn === `sms-${q.id}`
                            ? "bg-green-300 cursor-not-allowed"
                            : "bg-green-400 hover:bg-green-500 text-white"}
                        `}
                      >
                        {loadingBtn === `sms-${q.revisedQuatationId}` ? (
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                        ) : (
                          <Mail className="w-4 h-4" />
                        )}
                      </button>
                      


                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

          {/* Action Modal */}
                <ActionModal
                  isOpen={isWithoutLetterhead || isWithLetterHead}
                  onCancel={()=>{
                    setIsWithoutLetterhead(false);
                    setIsWithLetterHead(false);
                  }}
                  title="Generate AMC Quotation PDF"
                  
                >
                   <AmcQuotationPdfSettingPreviewAndPrint 
                   revisedQuotationId = {amcRevisedQuotationId} 
                   siteName={siteName}
                     isWithoutLetterhead={isWithoutLetterhead}
           isWithLetterHead={isWithLetterHead}
                   />
          
                </ActionModal>

                
                 {/* Hidden component that auto-generates and sends PDF */}
                {shouldSendPdf === 'sending' && (
                          <AmcQuotationPdfAutoSender
                         revisedQuotationId={amcRevisedQuotationId}
                          siteName={siteName}
                          isWithoutLetterhead={false}
                          isWithLetterHead={true}
                          onSuccess={handleSuccess}
                          onError={handleError}
                          shouldSendPdf={shouldSendPdf}
                        />
                      )}

        
      </main>
        {/* Quotation View Modal */}
            {selectedQuotationId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-gray-200/40 backdrop-blur-sm" onClick={closeModal}></div>
                <div className="relative bg-white w-11/12 max-w-6xl rounded-xl shadow-2xl p-4 max-h-[90vh] overflow-y-auto">
                  <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold" onClick={closeModal}>
                    ✕
                  </button>
                  <AmcQuotationView params={{ quotationId: selectedQuotationId , revision : true }} />
                </div>
              </div>
            )}
    </div>
  );
}
