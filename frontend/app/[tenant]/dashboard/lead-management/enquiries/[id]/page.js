'use client';

import ConfirmDeleteModal from '@/components/AMC/ConfirmDeleteModal';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { Eye, Trash2, Pencil, FilePlus, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '@/utils/axiosInstance';
//import jwtEncode from "jwt-encode";

export default function ViewEnquiryClientPage() {
  const { id, tenant } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawType = searchParams.get('enquiryTypeName') || '';
  const enquiryTypeNameParam = rawType || 'AMC'; // no encoding here

  console.log('Enquiry Type Name:', rawType);

  const [selectedCategory, setSelectedCategory] = useState(enquiryTypeNameParam);

  const [selectedCategoryObj, setSelectedCategoryObj] = useState({});
  const [groupedData, setGroupedData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isBackLoading, setIsBackLoading] = useState(false);
  const [isAddEnquiryLoading, setAddEnquiryLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(null);
  const [quotationLoadingId, setQuotationLoadingId] = useState(null);

  const leadId = id;

  const [refreshKey, setRefreshKey] = useState(0); // 👈 used to trigger re-fetch


  useEffect(() => {
    const fetchData = async () => {
      try {
        // const res = await fetch(`http://localhost:8080/api/combined-enquiry/group-by-type?leadId=${leadId}`);
        // const data = await res.json();
        // setGroupedData(data);
        const response = await axiosInstance.get("/api/combined-enquiry/group-by-type", {
          params: { leadId }
        });
        const data = response.data; // Axios auto-parses JSON
        setGroupedData(data);
        setLoading(false);

      } catch (err) {
        // const msg = err.response?.data || err.message; // Extract backend message
        //  toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey, leadId]);

  const [enquiryTypes, setEnquiryTypes] = useState([]);

  useEffect(() => {
    axiosInstance.get('/api/enquiry-types')
      .then((res) => {
        setEnquiryTypes(res.data);

        // Set the first item as default
        if (res.data.length > 0) {
          if (selectedCategory === "") {
            setSelectedCategory(res.data[0].enquiryTypeName);
            setSelectedCategoryObj(res.data[0]);
          } else {
            for (let index = 0; index < res.data.length; index++) {
              const element = res.data[index];
              if (element.enquiryTypeName === selectedCategory) {
                setSelectedCategoryObj(element);
                break;
              }
            }
          }
        }
      })
      .catch((err) => console.error('Failed to fetch enquiry types', err));
  }, []);

  const setCombinedEnquiryInSessionStorage = (combinedId) => {
    console.log('Setting combined enquiry in session storage for ID:', combinedId);

    let match = null;

    for (const groupOfEnqType of groupedData) {
      const found = groupOfEnqType.enquiries.find((combinedEnquiry) => combinedEnquiry.id === combinedId);

      if (found) {
        match = found; // This is your CombinedEnquiryResponseDto object
        break;
      }
    }

    console.log('Matched Combined Enquiry:', match);

    if (match) {
      sessionStorage.setItem('combinedEnquiry', JSON.stringify(match));
    }
  };

  const handleEditNavigation = (action) => {
    const basePath = `/${tenant}/dashboard/lead-management/enquiries/${id}/edit`;

    // Extract type info
    const enquiryTypeName = selectedCategoryObj?.enquiryTypeName;
    const enquiryTypeId = selectedCategoryObj?.enquiryTypeId;

    if (!enquiryTypeName || !enquiryTypeId) {
      toast.error("Please select a valid enquiry category.");
      return;
    }

    // Fetch query params
    const customer = encodeURIComponent(searchParams.get('customer') || '');
    const site = encodeURIComponent(searchParams.get('site') || '');

    // Build query string
    const queryParams = [
      `customer=${customer}`,
      `site=${site}`,
      `enquiryTypeId=${enquiryTypeId}`,
      `enquiryTypeName=${encodeURIComponent(enquiryTypeName)}`,
      `action=${encodeURIComponent(action)}`
    ];

    // Final path: /.../edit/AMC?enquiryTypeId=1&enquiryTypeName=AMC&...
    const fullPath = `${basePath}/${encodeURIComponent(enquiryTypeName)}?${queryParams.join('&')}`;
    router.push(fullPath);
  };

  const handleNavigateToQuotation = (combinedEnquiryId) => {
    const enquiryTypeName = selectedCategoryObj?.enquiryTypeName;
    const enquiryTypeId = selectedCategoryObj?.enquiryTypeId;

    if (!enquiryTypeName || !enquiryTypeId) {
      toast.error("Please select a valid enquiry category.");
      return;
    }

    const customer = searchParams.get("customer") || "";
    const site = searchParams.get("site") || "";

    const payload = {
      tenant,
      customer,
      site,
      enquiryTypeId,
      enquiryTypeName,
      combinedEnquiryId,
      iat: Date.now(),
    };

    // 🔒 Save payload in sessionStorage
    sessionStorage.setItem("quotationPayload", JSON.stringify(payload));

    // ✅ Clean navigation (no query string in URL)
    router.push(`/${tenant}/dashboard/lead-management/enquiries/${id}/quotation/add`);
  };


  // const handleNavigateToQuotation = (combinedEnquiryId) => {
  //   const enquiryTypeName = selectedCategoryObj?.enquiryTypeName;
  //   const enquiryTypeId = selectedCategoryObj?.enquiryTypeId;

  //   if (!enquiryTypeName || !enquiryTypeId) {
  //     toast.error("Please select a valid enquiry category.");
  //     return;
  //   }

  //   // Extract params
  //   const customer = searchParams.get("customer") || "";
  //   const site = searchParams.get("site") || "";

  //   // Build payload
  //   const payload = {
  //     customer,
  //     site,
  //     enquiryTypeId,
  //     enquiryTypeName,
  //     combinedEnquiryId,
  //     iat: Date.now(),
  //   };
  //   console.log("==combinedEnquiryId======>", combinedEnquiryId);
  //   console.log("==payload======>", payload);

  //   // Secret key (optional, for signing)
  //   const secret = "combinedEquiryId";
  //   const token = jwtEncode(payload, secret);

  //   // Store token
  //   sessionStorage.setItem("quotationToken", token);

  //   // Navigate
  //   router.push(`/${tenant}/dashboard/lead-management/enquiries/${id}/quotation/add`);
  // };


  const filteredEnquiries = Array.isArray(groupedData)
    ? groupedData
      .filter((e) => e.enquiryType?.enquiryTypeName === selectedCategory)
      .map((group) =>
        group.enquiries.map((combined) => ({
          combinedId: combined.id,
          enquiryTitle: combined.projectName,
          createdDate: combined.enquiryDate, // 👈 Add this line
           customerName: combined.customerName,
           customerSite: combined.customerSite,
           selectLead: combined.selectLead,
           leadId: combined.leadId,

          entries: combined.enquiries.map((entry) => ({
            id: entry.enquiryId,
            date: entry.enqDate?.split('T')[0] ?? '-',
            liftType: entry.liftType?.name ?? '-',
            machineType: entry.reqMachineRoom?.machineRoomName ?? '-',
            noOfFloors: entry.noOfFloors?.name ?? '-',
            capacityTerm: entry.capacityTerm?.capacityType ?? '-',
            from: entry.from?.from ?? '',
            selectPerson:
              entry.capacityTerm?.capacityType === 'Person'
                ? `${entry.personCapacity?.personCount ?? '-'} Persons / ${entry.personCapacity?.weight ?? '-'}Kg`
                : `${entry.weight?.weightValue ?? '-'} Kg`,
            cabinType: entry.cabinType?.cabinType ?? '-'
            ,
          })),
        }))
      )
      .flat()
    : [];

  const handleAddEnquiry = () => {
    setAddEnquiryLoading(true);

    const basePath = `/${tenant}/dashboard/lead-management/enquiries/${id}/add`;

    // Extract type info
    const enquiryTypeName = selectedCategoryObj?.enquiryTypeName; // e.g., "AMC"
    const enquiryTypeId = selectedCategoryObj?.enquiryTypeId;

    if (!enquiryTypeName || !enquiryTypeId) {
      toast.error("Please select a valid enquiry category.");
      setAddEnquiryLoading(false);
      return;
    }

    // Fetch other query params
    const customer = encodeURIComponent(searchParams.get('customer') || '');
    const site = encodeURIComponent(searchParams.get('site') || '');

    // Build query string
    const queryParams = [
      `customer=${customer}`,
      `site=${site}`,
      `enquiryTypeId=${enquiryTypeId}`,
      `enquiryTypeName=${encodeURIComponent(enquiryTypeName)}`
    ];

    // Final path: /.../add/AMC?enquiryTypeId=1&enquiryTypeName=AMC&...
    const fullPath = `${basePath}/${encodeURIComponent(enquiryTypeName)}?${queryParams.join('&')}`;
    router.push(fullPath);
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`/api/combined-enquiry/${deleteId}`);
      toast.success("Enquiry deleted successfully.");
      setModalOpen(false);
      setRefreshKey(prev => prev + 1); // 👈 trigger re-fetch
    } catch (err) {
      toast.error(err?.response?.data || "Failed to delete.");
      setModalOpen(false);
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    setDeleteId(null);
  };

  const [isActionClick, setIsActionClick] = useState(null); // Track action type for loader


  return (
    <>
      {/* Modal Component */}
      <ConfirmDeleteModal
        isOpen={modalOpen}
        onCancel={handleCancel}
        onConfirm={handleConfirmDelete}
      />
      <div className="p-6 min-h-screen text-gray-700">
        {/* Header */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Enquiry List for{' '}
            <span className="font-bold text-blue-600">
              {searchParams.get('customer')} ({searchParams.get('site')})
            </span>
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsBackLoading(true);
                router.back();
              }}
              disabled={isBackLoading}
              className="border border-gray-300 px-4 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-200 transition flex items-center gap-2"
            >
              {isBackLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Back To List
            </button>

            <button
              onClick={handleAddEnquiry}
              disabled={isAddEnquiryLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition flex items-center gap-2"
            >
              {isAddEnquiryLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Add New Enquiry
            </button>
          </div>
        </div>

        {/* Category Buttons */}
        <div className="mb-6 flex justify-center gap-3">
          {enquiryTypes && enquiryTypes.map((type) => (
            <button
              key={type.enquiryTypeId}
              onClick={() => {
                setCategoryLoading(type.enquiryTypeName);
                setTimeout(() => {
                  setSelectedCategory(type.enquiryTypeName);
                  setSelectedCategoryObj(type);
                  setCategoryLoading(null);
                }, 400); // simulate delay
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-2 ${selectedCategory === type.enquiryTypeName
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              disabled={categoryLoading !== null}
            >
              {categoryLoading === type.enquiryTypeName && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              {type.enquiryTypeName}
            </button>
          ))}
        </div>

        {/* Grouped Enquiry Tables */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : filteredEnquiries.length === 0 ? (
          <p className="text-center text-gray-500">
            No enquiries found for this category.
          </p>
        ) : (
          filteredEnquiries.map((group, groupIndex) => (
            <div
              key={group.enquiryTitle + groupIndex}
              className="mb-15 bg-white border border-gray-200 rounded-lg shadow-sm relative"
            >
              {/* Header Row */console.log("==filteredEnquiries======>", filteredEnquiries)}
              {/* Header Row */console.log(groupIndex)}
              {/* Header Row */console.log(group)}
              <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gray-50">
                <div className="font-semibold text-gray-800 text-base">
                  {"Enquiry " + (groupIndex + 1)}
                  <span className="ml-4 text-sm text-gray-500">
                    {/* Format date (optional) */}
                    {group.createdDate
                      ? `Created At: ${new Date(group.createdDate).toLocaleDateString()}`
                      : ""}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setCombinedEnquiryInSessionStorage(group.combinedId);
                      handleEditNavigation("View"); // define separately
                      setIsActionClick('View' + "-" + groupIndex); // Set action type for loader
                    }}
                    className="p-1.5 hover:bg-blue-100 rounded-full">

                    {isActionClick === 'View' + "-" + groupIndex ? <Loader2 className="w-4 h-4 animate-spin" /> :
                      <Eye className="w-4 h-4 text-blue-500" />}



                  </button>
                  <button
                    className="p-1.5 hover:bg-green-100 rounded-full"
                    onClick={() => {
                      setCombinedEnquiryInSessionStorage(group.combinedId);
                      handleEditNavigation("Edit"); // define separately
                      setIsActionClick('Edit' + "-" + groupIndex); // Set action type for loader
                    }}
                  >
                    {isActionClick === 'Edit' + "-" + groupIndex ? <Loader2 className="w-4 h-4 animate-spin" /> :
                      <Pencil className="w-4 h-4 text-green-500" />}

                  </button>
                  <button
                    className="p-1.5 hover:bg-red-100 rounded-full"
                    onClick={() => confirmDelete(group.combinedId)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Lift ID.</th>
                      {/* <th className="px-4 py-3 text-left font-medium">Date</th> */}
                      <th className="px-4 py-3 text-left font-medium">Lift Type</th>
                      <th className="px-4 py-3 text-left font-medium">Machine Type</th>
                      <th className="px-4 py-3 text-left font-medium">No. of Floors</th>
                      <th className="px-4 py-3 text-left font-medium">Capacity Type</th>
                      <th className="px-4 py-3 text-left font-medium">Capacity value</th>
                      {/* <th className="px-4 py-3 text-left font-medium">Cabin Type</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {group.entries.map((entry, i) => (

                      <tr
                        key={entry.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-2">{i + 1}</td>
                        {/* <td className="px-4 py-2">{entry.date}</td> */}
                        <td className="px-4 py-2">{entry.liftType}</td>
                        <td className="px-4 py-2">{entry.machineType}</td>
                        <td className="px-4 py-2">{entry.noOfFloors}</td>

                        <td className="px-4 py-2">{entry.capacityTerm}</td>

                        <td className="px-4 py-2">{entry.selectPerson}</td>
                        {/* <td className="px-4 py-2">{entry.cabinType}</td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Quotation Button */}
              <div className="absolute -bottom-10 right-1">
                <button
                  onClick={() => {
                    setQuotationLoadingId(groupIndex);
                    console.log(quotationLoadingId)

                     if(selectedCategory == "AMC"){
                      console.log("AMC Quotation group-->"+JSON.stringify(group));
                          localStorage.setItem('combinedEnquiry', JSON.stringify(group));
                         router.push(
                          `/${tenant}/dashboard/lead-management/enquiries/${id}/add-amc-quotation?customer=${encodeURIComponent(
                            searchParams.get('customer')
                          )}&site=${encodeURIComponent(searchParams.get('site'))}`
                        );
                     }else{

                        router.push(
                          `/${tenant}/dashboard/lead-management/enquiries/${id}/quotation/add?customer=${encodeURIComponent(
                            searchParams.get('customer')
                          )}&site=${encodeURIComponent(searchParams.get('site'))}`
                        );
                      }

                  }}
                  // onClick={() => {
                  //   setQuotationLoadingId(groupIndex);
                  //   console.log(quotationLoadingId)
                  //   router.push(
                  //     `/${tenant}/dashboard/lead-management/enquiries/${id}/quotation/add?customer=${encodeURIComponent(
                  //       searchParams.get('customer')
                  //     )}&site=${encodeURIComponent(searchParams.get('site'))}`
                  //   );
                  // }}
                  disabled={quotationLoadingId === groupIndex}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-yellow-600 transition shadow-md"
                >
                  {quotationLoadingId === groupIndex ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FilePlus className="w-4 h-4" />
                  )}
                  Add Quotation
                </button>
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        <div className="mt-10 flex justify-center gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 transition">
            Previous
          </button>
          <button className="px-3 py-1 border border-gray-300 bg-gray-200 rounded-md text-sm">
            1
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 transition">
            Next
          </button>
        </div>
      </div>

    </>
  );
}
