// src/components/ComplaintForm.js
"use client";

import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '@/utils/axiosInstance'; 
import SignatureCanvas from 'react-signature-canvas'; 

/**
 * Complaint Form component.
 * @param {object} props
 * @param {number | string | null} props.jobId - The Job ID (either this or renewalId should be present).
 * @param {number | string | null} props.renewalId - The Renewal ID.
 * @param {string} props.customerName - The Customer Name.
 * @param {string} props.siteName - The Site Name.
 * @param {number} props.userId - The ID of the currently logged-in user (for the backend DTO).
 */
export default function ComplaintForm({
    jobId,
    renewalId,
    customerName,
    siteName,
    userId = 1, 
}) {
    // --- State Management (Customer) ---
    const [userType, setUserType] = useState('customer');
    const [lifts, setLifts] = useState([]);
    const [selectedLiftIds, setSelectedLiftIds] = useState([]); 
    const [formData, setFormData] = useState({
        activityType: '1', 
        todoDate: new Date().toISOString().split('T')[0],
        yourName: '',
        yourNumber: '',
        complaintFeedback: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitStatus, setSubmitStatus] = useState(null); 
    
    // --- EMPLOYEE STATE ---
    const [empCode, setEmpCode] = useState('');
    const [empData, setEmpData] = useState(null); 
    const [empLoading, setEmpLoading] = useState(false);
    const [empError, setEmpError] = useState(null);
    const [empSubmitStatus, setEmpSubmitStatus] = useState(null); 
    
    // --- NEW EMPLOYEE ACTIVITY STATE (UPDATED) ---
    const [empActivityData, setEmpActivityData] = useState({
        date: new Date().toISOString().split('T')[0],
        selectedSite: `${customerName} - ${siteName}`, 
        inTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        outTime: '',
        typeOfWork: '', 
        description: '', 
        customerFeedback: '', 
        customerName: '', 
        customerSignature: false, 
        remark: '', 
        emailId: '',
        signatureBase64: null, // <<<< NEW: Holds the signature image data as Base64 string
    });
    const [empActivityType, setEmpActivityType] = useState('service'); 
    const [breakdownTodos, setBreakdownTodos] = useState([]);
    const [selectedTodoId, setSelectedTodoId] = useState(''); 
    const [todosLoading, setTodosLoading] = useState(false);
    
    // --- LIFT STATE FOR EMPLOYEE ---
    const [breakdownLifts, setBreakdownLifts] = useState([]);
    const [selectedBreakdownLiftIds, setSelectedBreakdownLiftIds] = useState([]); 
    const [liftsLoading, setLiftsLoading] = useState(false);


    // Clean and determine the active ID
    const cleanJobId = jobId ? parseInt(jobId, 10) : null;
    const cleanRenewalId = renewalId ? parseInt(renewalId, 10) : null;
    const activeJobId = cleanJobId || cleanRenewalId;
    const isRenewal = !!cleanRenewalId;
    
    // Helper to strip Base64 prefix
    const getSignatureBytes = (base64String) => {
        if (!base64String) return null;
        // The backend expects the raw Base64 string to map to byte[], strip the prefix here.
        return base64String.replace(/^data:image\/(png|jpeg|svg\+xml);base64,/, "");
    };

    // --- Data Fetching Effects (Unchanged) ---
    useEffect(() => {
        if (userType !== 'customer' || !activeJobId) {
            setLoading(false);
            if (!activeJobId && userType === 'customer') {
                setError('Missing Job ID or Renewal ID.');
            }
            return;
        }

        const fetchLifts = async () => {
            setLoading(true);
            setError(null);
            try {
                const endpoint = isRenewal
                    ? `/api/amc/complaint-form/getAllRenewalLiftsForAddBreakDownTodo`
                    : `/api/amc/complaint-form/getAllLiftsForAddBreakDownTodo`;
                
                const response = await axiosInstance.get(endpoint, { 
                    params: { jobId: activeJobId }
                });
                
                setLifts(response.data || []);
                
            } catch (err) {
                console.error("Error fetching lifts:", err);
                setError(err.response?.data?.message || 'Failed to load lift data.');
            } finally {
                setLoading(false);
            }
        };

        fetchLifts();
    }, [activeJobId, isRenewal, userType]);


    useEffect(() => {
        if (userType === 'employee' && empActivityType === 'breakdown' && activeJobId) {
            const fetchTodos = async () => {
                setTodosLoading(true);
                setBreakdownTodos([]);
                setSelectedTodoId('');

                let endpoint = '';
                let idToPass = null;
                
                if (cleanJobId) {
                    endpoint = `/api/amc/complaint-form/getTodosByJob/${cleanJobId}`;
                    idToPass = cleanJobId;
                } else if (cleanRenewalId) {
                    endpoint = `/api/amc/complaint-form/getTodosByRenewalJob/${cleanRenewalId}`;
                    idToPass = cleanRenewalId;
                }
                
                if (!idToPass) {
                    setEmpError("Cannot fetch breakdown tickets: Missing Job ID or Renewal ID.");
                    setTodosLoading(false);
                    return;
                }

                try {
                    const response = await axiosInstance.get(endpoint);
                    
                    if (response.data && response.data.length > 0) {
                        setBreakdownTodos(response.data);
                        setEmpError(null); 
                    } else {
                        setEmpError("No pending breakdown tickets found for this job/renewal.");
                    }
                } catch (err) {
                    console.error("Breakdown Todo Fetch Error:", err);
                    setEmpError('Failed to fetch breakdown tickets. Check API connection.');
                } finally {
                    setTodosLoading(false);
                }
            };

            fetchTodos();
        } else if (empActivityType === 'service') {
            setBreakdownTodos([]);
            setSelectedTodoId('');
        }
    }, [userType, empActivityType, cleanJobId, cleanRenewalId, activeJobId]);


    useEffect(() => {
        if (empActivityType === 'breakdown' && selectedTodoId) {
            const fetchLifts = async () => {
                setLiftsLoading(true);
                setBreakdownLifts([]);
                setSelectedBreakdownLiftIds([]); 

                let endpoint = '';
                const breakdownId = parseInt(selectedTodoId, 10);
                
                if (cleanJobId) {
                    endpoint = `/api/amc/complaint-form/getLiftsByBreakDownId/${breakdownId}`;
                } else if (cleanRenewalId) {
                    endpoint = `/api/amc/complaint-form/getRenewalLiftsByBreakDownId/${breakdownId}`;
                }
                
                if (!endpoint) {
                    setLiftsLoading(false);
                    return;
                }

                try {
                    const response = await axiosInstance.get(endpoint);
                    
                    if (response.data && response.data.length > 0) {
                        setBreakdownLifts(response.data);
                        setEmpError(null);
                    } else {
                        setEmpError(`No lifts found associated with ticket ID: ${breakdownId}.`);
                    }
                } catch (err) {
                    console.error("Lifts by Breakdown ID Fetch Error:", err);
                    setEmpError('Failed to fetch associated lift data.');
                } finally {
                    setLiftsLoading(false);
                }
            };

            fetchLifts();
        } else if (empActivityType === 'service') {
             if (empData && activeJobId) {
                setLiftsLoading(true);
                const fetchAllLifts = async () => {
                    try {
                        const endpoint = isRenewal
                            ? `/api/amc/complaint-form/getAllRenewalLiftsForAddBreakDownTodo`
                            : `/api/amc/complaint-form/getAllLiftsForAddBreakDownTodo`;
                        
                        const response = await axiosInstance.get(endpoint, { 
                            params: { jobId: activeJobId }
                        });
                        
                        setBreakdownLifts(response.data || []); 
                    } catch (err) {
                        console.error("Error fetching all lifts for service:", err);
                        setEmpError('Failed to load all lift data for service activity.');
                    } finally {
                        setLiftsLoading(false);
                    }
                };
                fetchAllLifts();
             } else {
                setBreakdownLifts([]);
             }
            setSelectedBreakdownLiftIds([]);
        } else {
            setBreakdownLifts([]);
            setSelectedBreakdownLiftIds([]);
        }
    }, [selectedTodoId, cleanJobId, cleanRenewalId, empActivityType, empData, activeJobId, isRenewal]);


    // ----------------------------------------------------------------------
    // --- HANDLERS (CONFIRMING FIX HERE) -----------------------------------
    // ----------------------------------------------------------------------

    const handleFormChange = (e) => {
        const { id, value } = e.target;
        // The use of 'prev => ({...prev, [id]: value})' is the correct fix.
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleLiftSelection = (enquiryId) => {
        setSelectedLiftIds(prev =>
            prev.includes(enquiryId)
                ? prev.filter(id => id !== enquiryId) 
                : [...prev, enquiryId] 
        );
    };

    const handleEmpActivityChange = (e) => {
        const { id, value, type, checked } = e.target;
        // The use of 'prev => ({...prev, [id]: value})' is the correct fix.
        setEmpActivityData(prev => ({ 
            ...prev, 
            [id]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleBreakdownLiftSelection = (enquiryId) => {
        setSelectedBreakdownLiftIds(prev =>
            prev.includes(enquiryId)
                ? prev.filter(id => id !== enquiryId) 
                : [...prev, enquiryId] 
        );
    };


    const handleEmpCodeSubmit = async (e) => {
        e.preventDefault();
        setEmpLoading(true);
        setEmpError(null);
        setEmpData(null); 

        if (!empCode) {
            setEmpError("Please enter an Employee Code.");
            setEmpLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.get(`/api/amc/complaint-form/getComplaintFormEmpDataByEmpCode/${empCode}`);
            
            const fetchedData = response.data;
            
            if (fetchedData && fetchedData.empCode) {
                setEmpData(fetchedData);
                setEmpError(null); 
            } else {
                setEmpError(`Employee not found for code: ${empCode}`);
            }

        } catch (err) {
            console.error("Employee Data Fetch Error:", err.response ? err.response.data : err.message);
            setEmpError('Failed to fetch employee data. Network error or invalid code.');
        } finally {
            setEmpLoading(false);
        }
    };

    // Customer Form: Handler for CREATING a new breakdown/todo 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus('submitting');
        setError(null);

        if (formData.activityType === '1' && selectedLiftIds.length === 0) {
            alert("For a Breakdown, please select the lift(s) that are experiencing issues.");
            setSubmitStatus(null);
            return;
        }

        const payload = {
            userId: userId, 
            purpose: formData.complaintFeedback,
            todoDate: formData.todoDate,
            time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }), 
            venue: `${siteName} - ${customerName}`,
            jobActivityTypeId: parseInt(formData.activityType), 
            status: 1, 
            complaintName: formData.yourName,
            complaintMob: formData.yourNumber,
            jobId: !isRenewal ? activeJobId : null,
            renewalJobId: isRenewal ? activeJobId : null,
            liftIds: selectedLiftIds, 
        };

        try {
            await axiosInstance.post('/api/amc/complaint-form/create-breakdown-todo', payload);
            
            setSubmitStatus('success');
            setFormData(prev => ({ ...prev, yourName: '', yourNumber: '', complaintFeedback: '' }));
            setSelectedLiftIds([]);

        } catch (err) {
            console.error("Submission Error:", err.response ? err.response.data : err.message);
            setSubmitStatus('error');
            setError('Submission failed: ' + (err.response?.data?.message || 'Network error.'));
        }
    };
    
    // Employee Form: Handler for LOGGING EMPLOYEE ACTIVITY (UPDATED)
    const handleBreakdownSubmit = async (e) => {
        e.preventDefault();
        setEmpSubmitStatus('submitting'); 
        setEmpError(null);

        // --- Validation ---
        if (empActivityType === 'breakdown') {
            if (!selectedTodoId) {
                setEmpError("Please select a Breakdown Ticket.");
                setEmpSubmitStatus(null);
                return;
            }
        }
        
        if (selectedBreakdownLiftIds.length === 0) {
            setEmpError("Please select at least one lift that was serviced/repaired.");
            setEmpSubmitStatus(null);
            return;
        }

        if (!empActivityData.outTime) {
            setEmpError("Out Time is required to log the activity.");
            setEmpSubmitStatus(null);
            return;
        }
        
        // NEW SIGNATURE VALIDATION
        if (!empActivityData.signatureBase64) {
            setEmpError("Customer Signature is required. Please capture the signature.");
            setEmpSubmitStatus(null);
            return;
        }
        // --- End Validation ---

        // Map DTO Fields
        const payload = {
            // DTO Fields
            jobId: cleanJobId,
            renewalJobId: cleanRenewalId || 0,
            jobActivityTypeId: empActivityType === 'breakdown' ? 1 : 2, 
            activityDate: empActivityData.date,
            activityTime: empActivityData.outTime, 
            activityDescription: empActivityData.description,
            jobService: empActivityType, 
            jobTypeWork: empActivityData.typeOfWork,
            executiveId: empData.empId || 0, 
            jobActivityById: empData.empId, 
            jobActivityBy2: empData.empName, 
            mailSent: false, 
            remark: empActivityData.remark,
            signatureName: empActivityData.customerName,
            // --- UPDATED FIELD TO SEND BASE64 DATA ---
            signatureValue: getSignatureBytes(empActivityData.signatureBase64), 
            // ------------------------------------------
            customerFeedback: empActivityData.customerFeedback,
            inTime: empActivityData.inTime,
            outTime: empActivityData.outTime,
            actService: empActivityType, 
            breakdownTodoId: empActivityType === 'breakdown' ? parseInt(selectedTodoId) : null,
            liftIds: selectedBreakdownLiftIds, 
        };

        // Determine API Endpoint
        const endpoint = cleanRenewalId
            ? '/api/amc/complaint-form/add-amc-renewal-job-activity'
            : '/api/amc/complaint-form/add-amc-job-activity';

        try {
            await axiosInstance.post(endpoint, payload);
            
            setEmpSubmitStatus('success');
            
            // Reset fields
            setEmpActivityData(prev => ({ 
                ...prev, 
                outTime: '', 
                typeOfWork: '', 
                description: '', 
                customerFeedback: '', 
                customerName: '', 
                customerSignature: false, 
                remark: '', 
                emailId: '',
                signatureBase64: null, // <<<< Reset signature
            }));
            setSelectedTodoId(''); 
            setSelectedBreakdownLiftIds([]); 
            setBreakdownLifts([]); 

        } catch (err) {
            console.error("Employee Log Error:", err.response ? err.response.data : err.message);
            setEmpSubmitStatus('error');
            setEmpError('Employee log failed: ' + (err.response?.data?.message || 'Network error.'));
        }
    };
    
    // ----------------------------------------------------------------------
    // --- NEW SIGNATURE PAD COMPONENT ---
    // ----------------------------------------------------------------------

    const SignaturePadComponent = ({ onSave }) => {
        const sigPadRef = useRef(null);

        const clearSignature = () => {
            sigPadRef.current.clear();
            setEmpActivityData(prev => ({ ...prev, signatureBase64: null, customerSignature: false }));
        };

        const saveSignature = () => {
            if (sigPadRef.current.isEmpty()) {
                alert("Please provide a signature before saving.");
                return;
            }
            // Get the signature as a Base64 encoded PNG image
            // toDataURL('image/png') is recommended for web API consistency
            const base64Image = sigPadRef.current.toDataURL('image/png');
            
            setEmpActivityData(prev => ({ 
                ...prev, 
                signatureBase64: base64Image,
                customerSignature: true // Set confirmation based on captured data
            }));
            onSave(); // Close the signature area
        };

        const canvasStyles = {
            border: '1px solid #000',
            borderRadius: '4px',
            backgroundColor: '#fff',
            width: '100%',
            height: '150px' 
        };

        return (
            <div style={{ padding: '10px', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '5px' }}>
                <label style={styles.label}>Draw Customer Signature Below</label>
                <SignatureCanvas 
                    ref={sigPadRef} 
                    penColor='black'
                    // Using fixed pixel size in canvasProps but styling for responsiveness
                    canvasProps={{ width: 480, height: 150, className: 'sigCanvas', style: canvasStyles }}
                    backgroundColor='rgb(255,255,255)' 
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <button type="button" onClick={clearSignature} style={{...styles.submitButtonSmall, backgroundColor: '#dc3545', width: '48%'}}>
                        Clear
                    </button>
                    <button type="button" onClick={saveSignature} style={{...styles.submitButtonSmall, backgroundColor: '#28a745', width: '48%'}}>
                        Save Signature
                    </button>
                </div>
            </div>
        );
    };

    // ----------------------------------------------------------------------
    // --- RENDER COMPONENTS (EmployeeActivityForm, CustomerForm, EmployeeForm) ---
    // ----------------------------------------------------------------------
    
    const [isSignatureAreaOpen, setIsSignatureAreaOpen] = useState(false);
    const EmployeeActivityForm = () => {
        

        return (
            <form onSubmit={handleBreakdownSubmit} 
              style={{...styles.form, marginTop: '25px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px'}}>
                
                <h3 style={{marginBottom: '15px', color: '#444'}}>Log Employee Activity</h3>

                {/* 1. Select Activity Type (Radio Button) */}
                <div style={{...styles.inputGroup, marginBottom: '20px'}}>
                    <label style={styles.label}>Select Activity Type</label>
                    <div style={styles.radioGroup}>
                        <label style={styles.radioLabelSmall}>
                            <input 
                                type="radio" 
                                name="empActivityType" 
                                value="service" 
                                checked={empActivityType === 'service'} 
                                onChange={() => {setEmpActivityType('service'); setEmpError(null); setEmpSubmitStatus(null);}} 
                            /> Service
                        </label>
                        <label style={styles.radioLabelSmall}>
                            <input 
                                type="radio" 
                                name="empActivityType" 
                                value="breakdown" 
                                checked={empActivityType === 'breakdown'} 
                                onChange={() => {setEmpActivityType('breakdown'); setEmpError(null); setEmpSubmitStatus(null);}} 
                            /> Breakdown
                        </label>
                    </div>
                </div>

                {/* 2. Breakdown Ticket Selection (Conditional Dropdown) */}
                {empActivityType === 'breakdown' && (
                    <>
                        <div style={styles.inputGroup}>
                            <label htmlFor="selectedTodoId" style={styles.label}>Select Breakdown Ticket <span style={{color: 'red'}}>*</span></label>
                            {todosLoading ? (
                                <p style={{color: '#007bff'}}>Loading tickets...</p>
                            ) : (
                                <select 
                                    id="selectedTodoId" 
                                    value={selectedTodoId} 
                                    onChange={(e) => setSelectedTodoId(e.target.value)} 
                                    style={styles.input} 
                                    required
                                >
                                    <option value="">-- Select a Ticket --</option>
                                    {breakdownTodos.length > 0 ? (
                                        breakdownTodos.map(todo => (
                                            <option key={todo.custTodoId} value={todo.custTodoId}>
                                                {`ID: ${todo.custTodoId} | Date: ${todo.todoDate} | Purpose: ${todo.purpose}`}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>No pending breakdown tickets found.</option>
                                    )}
                                </select>
                            )}
                        </div>
                    </>
                )}

                {/* 2b. Display and Select Associated Lifts (Checkboxes) */}
                {(empActivityType === 'service' || (empActivityType === 'breakdown' && selectedTodoId)) && (liftsLoading || breakdownLifts.length > 0) && (
                    <div style={{...styles.inputGroup, borderTop: '1px dashed #ddd', paddingTop: '15px'}}>
                        <label style={styles.label}>
                            Select Lift(s) Serviced/Repaired <span style={{color: 'red'}}>*</span>
                        </label>
                        
                        {liftsLoading ? (
                            <p style={{color: '#007bff'}}>Loading associated lifts...</p>
                        ) : (
                            <div style={styles.liftGridContainerSmall}>
                                {breakdownLifts.map(lift => (
                                    <div key={lift.enquiryId} style={styles.liftCardSmall}>
                                        <label style={styles.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                checked={selectedBreakdownLiftIds.includes(lift.enquiryId)}
                                                onChange={() => handleBreakdownLiftSelection(lift.enquiryId)}
                                                style={{marginRight: '8px'}}
                                            />
                                            <strong>{lift.liftName}</strong>
                                        </label>
                                        <p style={styles.liftDetail}>Type: {lift.typeOfElevators}</p>
                                    </div>
                                ))}
                                {breakdownLifts.length === 0 && (
                                    <p style={{gridColumn: '1 / -1', color: '#dc3545'}}>No lifts available for selection.</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
                
                {/* NEW FIELDS: Type of Work & Description - CONFIRMED FIX APPLIED */}
                <div style={styles.row}>
                    <div style={styles.inputGroupHalf}>
                        <label htmlFor="typeOfWork" style={styles.label}>Type Of Work Done <span style={{color: 'red'}}>*</span></label>
                        <input type="text" id="typeOfWork" value={empActivityData.typeOfWork} onChange={handleEmpActivityChange} style={styles.input} required/>
                    </div>
                    <div style={styles.inputGroupHalf}>
  <label htmlFor="description" style={styles.label}>
    Detailed Description <span style={{ color: 'red' }}>*</span>
  </label>
  <input
    type="text"
    id="description"
    name="description"
    placeholder="Enter detailed description"
    value={empActivityData.description}
    onChange={handleEmpActivityChange}
    style={{
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      outline: 'none',
      fontSize: '14px',
      transition: 'border-color 0.2s ease',
    }}
    onFocus={(e) => (e.target.style.borderColor = '#007bff')}
    onBlur={(e) => (e.target.style.borderColor = '#ccc')}
    required
  />
</div>

                </div>
                
                {/* 3. Time & Date Fields (Shared) - CONFIRMED FIX APPLIED */}
                <div style={styles.inputGroup}>
                    <label htmlFor="date" style={styles.label}>Date</label>
                    <input type="date" id="date" value={empActivityData.date} onChange={handleEmpActivityChange} style={styles.input} required />
                </div>

                <div style={styles.row}>
                    <div style={styles.inputGroupHalf}>
                        <label htmlFor="inTime" style={styles.label}>In Time <span style={{color: 'red'}}>*</span></label>
                        <input type="time" id="inTime" value={empActivityData.inTime} onChange={handleEmpActivityChange} style={styles.input} required />
                    </div>
                    <div style={styles.inputGroupHalf}>
                        <label htmlFor="outTime" style={styles.label}>Out Time <span style={{color: 'red'}}>*</span></label>
                        <input type="time" id="outTime" value={empActivityData.outTime} onChange={handleEmpActivityChange} style={styles.input} required />
                    </div>
                </div>
                
                <div style={styles.inputGroup}>
                    <label htmlFor="remark" style={styles.label}>Remark (Internal)</label>
                    <textarea id="remark" rows="2" value={empActivityData.remark} onChange={handleEmpActivityChange}  />
                </div>

                {/* --- CUSTOMER SIGN-OFF SECTION --- */}
                <h4 style={{marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '15px'}}>Customer Sign-Off Details</h4>
                
                {/* Customer Feedback - CONFIRMED FIX APPLIED */}
                <div style={styles.inputGroup}>
                    <label htmlFor="customerFeedback" style={styles.label}>Customer Feedback <span style={{color: 'red'}}>*</span></label>
                    <textarea id="customerFeedback" rows="3" value={empActivityData.customerFeedback} onChange={handleEmpActivityChange} style={styles.textarea} required />
                </div>

                {/* Customer Name & Email - CONFIRMED FIX APPLIED */}
                <div style={styles.row}>
                    <div style={styles.inputGroupHalf}>
                        <label htmlFor="customerName" style={styles.label}>Customer Name <span style={{color: 'red'}}>*</span></label>
                        <input type="text" id="customerName" value={empActivityData.customerName} onChange={handleEmpActivityChange} style={styles.input} required />
                    </div>
                    <div style={styles.inputGroupHalf}>
                        <label htmlFor="emailId" style={styles.label}>Customer Email ID <span style={{color: 'red'}}>*</span></label>
                        <input type="email" id="emailId" value={empActivityData.emailId} onChange={handleEmpActivityChange} style={styles.input} required />
                    </div>
                </div>

                {/* --- SIGNATURE CAPTURE SECTION (NEW) --- */}
                <div style={{...styles.inputGroup, border: '1px solid #cce5ff', padding: '10px', borderRadius: '4px', backgroundColor: '#e6f7ff', marginTop: '20px'}}>
                    
                    {/* Signature Status/Button */}
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <p style={{margin: '0', fontWeight: 'bold', color: '#007bff'}}>
                            Signature Status: 
                            {empActivityData.signatureBase64 ? 
                                <span style={{color: 'green', marginLeft: '10px'}}>✅ Captured</span> : 
                                <span style={{color: 'red', marginLeft: '10px'}}>❌ Missing</span>
                            }
                        </p>
                        <button 
                            type="button" 
                            onClick={() => setIsSignatureAreaOpen(prev => !prev)}
                            style={{...styles.submitButtonSmall, width: 'auto', backgroundColor: isSignatureAreaOpen ? '#ffc107' : '#007bff', flexShrink: 0}}
                        >
                            {isSignatureAreaOpen ? 'Hide Signature Pad' : 'Capture Signature'}
                        </button>
                    </div>

                    {/* Signature Preview */}
                    {empActivityData.signatureBase64 && !isSignatureAreaOpen && (
                        <div style={{marginTop: '10px', padding: '10px', border: '1px dashed #007bff'}}>
                            <p style={{fontSize: '0.9em', margin: '0 0 5px 0'}}>Current Signature Preview:</p>
                            <img 
                                src={empActivityData.signatureBase64} 
                                alt="Captured Signature" 
                                style={{maxWidth: '150px', maxHeight: '100px', border: '1px solid #ccc', backgroundColor: 'white'}}
                            />
                        </div>
                    )}

                    {/* Signature Pad Area (Conditional) */}
                    {isSignatureAreaOpen && (
                        <div style={{marginTop: '15px'}}>
                            <SignaturePadComponent onSave={() => setIsSignatureAreaOpen(false)} />
                        </div>
                    )}
                </div>


                {/* Signature Confirmation (Linked to capture data) */}
                <div style={{...styles.inputGroup, border: '1px solid #ffcc00', padding: '10px', borderRadius: '4px', backgroundColor: '#fffbe5', marginTop: '20px'}}>
                    <label style={styles.checkboxLabel}>
                        <input 
                            type="checkbox" 
                            id="customerSignature" 
                            checked={!!empActivityData.signatureBase64} 
                            onChange={() => {}} 
                            style={{marginRight: '10px'}}
                            disabled
                        />
                        I confirm that the **Customer Signature** has been captured. <span style={{color: 'red'}}>*</span>
                    </label>
                </div>


                <button 
                    type="submit"
                    style={{...styles.submitButton, backgroundColor: '#007bff'}}
                    disabled={empSubmitStatus === 'submitting' || empLoading || !empActivityData.signatureBase64}
                >
                    {empSubmitStatus === 'submitting' ? 'Logging Activity...' : `Log ${empActivityType === 'breakdown' ? 'Breakdown' : 'Service'} Activity`}
                </button>
                
                {empSubmitStatus === 'success' && <p style={styles.successMessage}>✅ Employee activity logged successfully!</p>}
                {empSubmitStatus === 'error' && <p style={styles.errorMessage}>❌ Logging failed. Error: {empError || 'Please check form data.'}</p>}

            </form>
        );
    };

    const CustomerForm = () => (
        <>
       

        <form onSubmit={handleSubmit} style={styles.form}>
            {/* Read-Only Info */}
            <div style={styles.inputGroup}>
                <label style={styles.label}>Site & Customer Name</label>
                <input type="text" value={`${siteName} - ${customerName}`} style={styles.input} readOnly />
                <p style={{fontSize: '0.8em', color: '#555'}}>
                    {isRenewal ? `Renewal ID: ${renewalId}` : `Job ID: ${jobId}`}
                </p>
            </div>

            {/* Activity Type & Date - CONFIRMED FIX APPLIED */}
            <div style={styles.row}>
                <div style={styles.inputGroupHalf}>
                    <label htmlFor="activityType" style={styles.label}>Select Activity Type</label>
                    <select id="activityType" value={formData.activityType} onChange={handleFormChange} style={styles.input}>
                        <option value="1">Breakdown (Default)</option>
                        <option value="2">General Feedback / Inquiry</option>
                    </select>
                </div>
                <div style={styles.inputGroupHalf}>
                    <label htmlFor="todoDate" style={styles.label}>Date</label>
                    <input type="date" id="todoDate" value={formData.todoDate} onChange={handleFormChange} style={styles.input} required />
                </div>
            </div>

            {/* Lift Selection Grid (Unchanged) */}
            <div style={{...styles.inputGroup, marginTop: '20px', display: formData.activityType === '1' ? 'block' : 'none'}}>
                <h3 style={{marginBottom: '10px'}}>Select Lift(s) for Breakdown </h3>
                {loading ? (
                    <p>Loading Lifts...</p>
                ) : (
                    <div style={styles.liftGridContainer}>
                        {lifts.length > 0 ? (
                            lifts.map(lift => (
                                <div
                                    key={lift.enquiryId}
                                    onClick={() => handleLiftSelection(lift.enquiryId)}
                                    style={{
                                        ...styles.liftCard,
                                        ...(selectedLiftIds.includes(lift.enquiryId) ? styles.liftCardSelected : {})
                                    }}
                                >
                                    <strong>{lift.liftName}</strong>
                                    <p style={styles.liftDetail}>Type: {lift.typeOfElevators}</p>
                                    <p style={styles.liftDetail}>Cap: {lift.capacityValue} | Floors: {lift.noOfFloors}</p>
                                </div>
                            ))
                        ) : (
                            <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>No lifts found for this job/renewal.</p>
                        )}
                    </div>
                )}
            </div>

            {/* Contact Details - CONFIRMED FIX APPLIED */}
            <div style={styles.row}>
                <div style={styles.inputGroupHalf}>
                    <label htmlFor="yourName" style={styles.label}>Your Name</label>
                    <input type="text" id="yourName" value={formData.yourName} onChange={handleFormChange} style={styles.input} required />
                </div>
                <div style={styles.inputGroupHalf}>
                    <label htmlFor="yourNumber" style={styles.label}>Your Number</label>
                    <input type="tel" id="yourNumber" value={formData.yourNumber} onChange={handleFormChange} style={styles.input} required />
                </div>
            </div>

            {/* Complaint/Feedback - CONFIRMED FIX APPLIED */}
            <div style={styles.inputGroup}>
                <label htmlFor="complaintFeedback" style={styles.label}>Complaint / Feedback</label>
                <textarea id="complaintFeedback" rows="4" value={formData.complaintFeedback} onChange={handleFormChange} style={styles.textarea} required />
            </div>

            <button type="submit" style={styles.submitButton} disabled={submitStatus === 'submitting' || loading}>
                {submitStatus === 'submitting' ? 'Submitting...' : 'Submit Service Request'}
            </button>
            
            {submitStatus === 'success' && <p style={styles.successMessage}>✅ Submission successful! Your request has been logged.</p>}
            {submitStatus === 'error' && <p style={styles.errorMessage}>❌ Submission failed. Error: {error || 'Please check your details.'}</p>}
        </form>
        </>
    );

    let EmployeeForm = () => (
        <div>
            {/* 1. Employee Code Input Form - (Uses standard setter for empCode, which is okay) */}
            <form onSubmit={handleEmpCodeSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label htmlFor="empCode" style={styles.label}>Enter Employee Code</label>
                    <input 
                        type="text" 
                        id="empCode" 
                        value={empCode} 
                        onChange={(e) => setEmpCode(e.target.value)} 
                        style={styles.input} 
                        required 
                    />
                </div>
                <button 
                    type="submit" 
                    style={styles.submitButtonSmall} 
                    disabled={empLoading}
                >
                    {empLoading ? 'Loading...' : 'Verify Code'}
                </button>
                {empError && <p style={styles.errorMessage}>{empError}</p>}
            </form>
            
            {/* 2. Display Employee Details and Activity Form (Conditionally Visible upon success) */}
            {empData && (
                <div style={styles.verificationBox}>
                    <h3 style={{borderBottom: '1px solid #ddd', paddingBottom: '10px', color: '#007bff'}}>Employee Details Verified:</h3>
                    <p style={styles.detailText}>
                        <strong>Employee Name:</strong> {empData.empName}
                    </p>
                    <p style={styles.detailText}>
                        <strong>Contact Number:</strong> {empData.empContactNumber}
                    </p>
                    <p style={styles.detailText}>
                        <strong>Employee Code:</strong> {empData.empCode}
                    </p>
                    
                    <EmployeeActivityForm />
                </div>
            )}
        </div>
    );


    // ----------------------------------------------------------------------
    // --- MAIN RENDER (Unchanged) ------------------------------------------
    // ----------------------------------------------------------------------
    return (
        <div style={styles.container}>
            <h1>Feedback / Complaint Form</h1>

            
            
            {/* User Type Selection */}
            <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                    <input 
                        type="radio" 
                        name="userType" 
                        value="customer" 
                        checked={userType === 'customer'} 
                        onChange={() => { setUserType('customer'); setEmpData(null); setEmpCode(''); setEmpError(null); setEmpActivityType('service'); setBreakdownTodos([]); setBreakdownLifts([]); setEmpSubmitStatus(null);}} 
                    /> Customer
                </label>
                <label style={styles.radioLabel}>
                    <input 
                        type="radio" 
                        name="userType" 
                        value="employee" 
                        checked={userType === 'employee'} 
                        onChange={() => { setUserType('employee'); setFormData(prev => ({ ...prev, yourName: '', yourNumber: ''})); setSubmitStatus(null); }} 
                    /> Employee
                </label>
            </div>
            <hr style={styles.divider} />
            
            {/* Conditional Display */}
            {!activeJobId && (
                 <div style={styles.errorMessage}>
                     <p>Invalid Entry: A valid **Job ID** or **Renewal ID** is required from the link.</p>
                 </div>
            )}

            {/* Render the appropriate form */}
            {activeJobId && (userType === 'customer' ? 
        <form onSubmit={handleSubmit} style={styles.form}>
            {/* Read-Only Info */}
            <div style={styles.inputGroup}>
                <label style={styles.label}>Site & Customer Name</label>
                <input type="text" value={`${siteName} - ${customerName}`} style={styles.input} readOnly />
                <p style={{fontSize: '0.8em', color: '#555'}}>
                    {isRenewal ? `Renewal ID: ${renewalId}` : `Job ID: ${jobId}`}
                </p>
            </div>

            {/* Activity Type & Date - CONFIRMED FIX APPLIED */}
            <div style={styles.row}>
                <div style={styles.inputGroupHalf}>
                    <label htmlFor="activityType" style={styles.label}>Select Activity Type</label>
                    <select id="activityType" value={formData.activityType} onChange={handleFormChange} style={styles.input}>
                        <option value="1">Breakdown (Default)</option>
                        <option value="2">General Feedback / Inquiry</option>
                    </select>
                </div>
                <div style={styles.inputGroupHalf}>
                    <label htmlFor="todoDate" style={styles.label}>Date</label>
                    <input type="date" id="todoDate" value={formData.todoDate} onChange={handleFormChange} style={styles.input} required />
                </div>
            </div>

            {/* Lift Selection Grid (Unchanged) */}
            <div style={{...styles.inputGroup, marginTop: '20px', display: formData.activityType === '1' ? 'block' : 'none'}}>
                <h3 style={{marginBottom: '10px'}}>Select Lift(s) for Breakdown </h3>
                {loading ? (
                    <p>Loading Lifts...</p>
                ) : (
                    <div style={styles.liftGridContainer}>
                        {lifts.length > 0 ? (
                            lifts.map(lift => (
                                <div
                                    key={lift.enquiryId}
                                    onClick={() => handleLiftSelection(lift.enquiryId)}
                                    style={{
                                        ...styles.liftCard,
                                        ...(selectedLiftIds.includes(lift.enquiryId) ? styles.liftCardSelected : {})
                                    }}
                                >
                                    <strong>{lift.liftName}</strong>
                                    <p style={styles.liftDetail}>Type: {lift.typeOfElevators}</p>
                                    <p style={styles.liftDetail}>Cap: {lift.capacityValue} | Floors: {lift.noOfFloors}</p>
                                </div>
                            ))
                        ) : (
                            <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>No lifts found for this job/renewal.</p>
                        )}
                    </div>
                )}
            </div>

            {/* Contact Details - CONFIRMED FIX APPLIED */}
            <div style={styles.row}>
                <div style={styles.inputGroupHalf}>
                    <label htmlFor="yourName" style={styles.label}>Your Name</label>
                    <input type="text" id="yourName" value={formData.yourName} onChange={handleFormChange} style={styles.input} required />
                </div>
                <div style={styles.inputGroupHalf}>
                    <label htmlFor="yourNumber" style={styles.label}>Your Number</label>
                    <input type="tel" id="yourNumber" value={formData.yourNumber} onChange={handleFormChange} style={styles.input} required />
                </div>
            </div>

            {/* Complaint/Feedback - CONFIRMED FIX APPLIED */}
            <div style={styles.inputGroup}>
                <label htmlFor="complaintFeedback" style={styles.label}>Complaint / Feedback</label>
                <textarea id="complaintFeedback" rows="4" value={formData.complaintFeedback} onChange={handleFormChange} style={styles.textarea} required />
            </div>

            <button type="submit" style={styles.submitButton} disabled={submitStatus === 'submitting' || loading}>
                {submitStatus === 'submitting' ? 'Submitting...' : 'Submit Service Request'}
            </button>
            
            {submitStatus === 'success' && <p style={styles.successMessage}>✅ Submission successful! Your request has been logged.</p>}
            {submitStatus === 'error' && <p style={styles.errorMessage}>❌ Submission failed. Error: {error || 'Please check your details.'}</p>}
        </form> : <div>
            {/* 1. Employee Code Input Form - (Uses standard setter for empCode, which is okay) */}
            <form onSubmit={handleEmpCodeSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label htmlFor="empCode" style={styles.label}>Enter Employee Code</label>
                    <input 
                        type="text" 
                        id="empCode" 
                        value={empCode} 
                        onChange={(e) => setEmpCode(e.target.value)} 
                        style={styles.input} 
                        required 
                    />
                </div>
                <button 
                    type="submit" 
                    style={styles.submitButtonSmall} 
                    disabled={empLoading}
                >
                    {empLoading ? 'Loading...' : 'Verify Code'}
                </button>
                {empError && <p style={styles.errorMessage}>{empError}</p>}
            </form>
            
            {/* 2. Display Employee Details and Activity Form (Conditionally Visible upon success) */}
            {empData && (
                <div style={styles.verificationBox}>
                    <h3 style={{borderBottom: '1px solid #ddd', paddingBottom: '10px', color: '#007bff'}}>Employee Details Verified:</h3>
                    <p style={styles.detailText}>
                        <strong>Employee Name:</strong> {empData.empName}
                    </p>
                    <p style={styles.detailText}>
                        <strong>Contact Number:</strong> {empData.empContactNumber}
                    </p>
                    <p style={styles.detailText}>
                        <strong>Employee Code:</strong> {empData.empCode}
                    </p>
                    
                    <form onSubmit={handleBreakdownSubmit} 
              style={{...styles.form, marginTop: '25px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px'}}>
                
                <h3 style={{marginBottom: '15px', color: '#444'}}>Log Employee Activity</h3>

                {/* 1. Select Activity Type (Radio Button) */}
                <div style={{...styles.inputGroup, marginBottom: '20px'}}>
                    <label style={styles.label}>Select Activity Type</label>
                    <div style={styles.radioGroup}>
                        <label style={styles.radioLabelSmall}>
                            <input 
                                type="radio" 
                                name="empActivityType" 
                                value="service" 
                                checked={empActivityType === 'service'} 
                                onChange={() => {setEmpActivityType('service'); setEmpError(null); setEmpSubmitStatus(null);}} 
                            /> Service
                        </label>
                        <label style={styles.radioLabelSmall}>
                            <input 
                                type="radio" 
                                name="empActivityType" 
                                value="breakdown" 
                                checked={empActivityType === 'breakdown'} 
                                onChange={() => {setEmpActivityType('breakdown'); setEmpError(null); setEmpSubmitStatus(null);}} 
                            /> Breakdown
                        </label>
                    </div>
                </div>

                {/* 2. Breakdown Ticket Selection (Conditional Dropdown) */}
                {empActivityType === 'breakdown' && (
                    <>
                        <div style={styles.inputGroup}>
                            <label htmlFor="selectedTodoId" style={styles.label}>Select Breakdown Ticket <span style={{color: 'red'}}>*</span></label>
                            {todosLoading ? (
                                <p style={{color: '#007bff'}}>Loading tickets...</p>
                            ) : (
                                <select 
                                    id="selectedTodoId" 
                                    value={selectedTodoId} 
                                    onChange={(e) => setSelectedTodoId(e.target.value)} 
                                    style={styles.input} 
                                    required
                                >
                                    <option value="">-- Select a Ticket --</option>
                                    {breakdownTodos.length > 0 ? (
                                        breakdownTodos.map(todo => (
                                            <option key={todo.custTodoId} value={todo.custTodoId}>
                                                {`ID: ${todo.custTodoId} | Date: ${todo.todoDate} | Purpose: ${todo.purpose}`}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>No pending breakdown tickets found.</option>
                                    )}
                                </select>
                            )}
                        </div>
                    </>
                )}

                {/* 2b. Display and Select Associated Lifts (Checkboxes) */}
                {( (empActivityType === 'breakdown' && selectedTodoId)) && (liftsLoading || breakdownLifts.length > 0) && (
                    <div style={{...styles.inputGroup, borderTop: '1px dashed #ddd', paddingTop: '15px'}}>
                        <label style={styles.label}>
                            Select Lift(s) Serviced/Repaired <span style={{color: 'red'}}>*</span>
                        </label>
                        
                        {liftsLoading ? (
                            <p style={{color: '#007bff'}}>Loading associated lifts...</p>
                        ) : (
                            <div style={styles.liftGridContainerSmall}>
                                {breakdownLifts.map(lift => (
                                    <div key={lift.enquiryId} style={styles.liftCardSmall}>
                                        <label style={styles.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                checked={selectedBreakdownLiftIds.includes(lift.enquiryId)}
                                                onChange={() => handleBreakdownLiftSelection(lift.enquiryId)}
                                                style={{marginRight: '8px'}}
                                            />
                                            <strong>{lift.liftName}</strong>
                                        </label>
                                        <p style={styles.liftDetail}>Type: {lift.typeOfElevators}</p>
                                    </div>
                                ))}
                                {breakdownLifts.length === 0 && (
                                    <p style={{gridColumn: '1 / -1', color: '#dc3545'}}>No lifts available for selection.</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
                
                {/* NEW FIELDS: Type of Work & Description - CONFIRMED FIX APPLIED */}
                <div style={styles.row}>
                    <div style={styles.inputGroupHalf}>
                        <label htmlFor="typeOfWork" style={styles.label}>Type Of Work Done <span style={{color: 'red'}}>*</span></label>
                        <input type="text" id="typeOfWork" value={empActivityData.typeOfWork} onChange={handleEmpActivityChange} style={styles.input} required/>
                    </div>
                    <div style={styles.inputGroupHalf}>
  <label htmlFor="description" style={styles.label}>
    Detailed Description <span style={{ color: 'red' }}>*</span>
  </label>
  <input
    type="text"
    id="description"
    name="description"
    placeholder="Enter detailed description"
    value={empActivityData.description}
    onChange={handleEmpActivityChange}
    style={{
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      outline: 'none',
      fontSize: '14px',
      transition: 'border-color 0.2s ease',
    }}
    onFocus={(e) => (e.target.style.borderColor = '#007bff')}
    onBlur={(e) => (e.target.style.borderColor = '#ccc')}
    required
  />
</div>

                </div>
                
                {/* 3. Time & Date Fields (Shared) - CONFIRMED FIX APPLIED */}
                <div style={styles.inputGroup}>
                    <label htmlFor="date" style={styles.label}>Date</label>
                    <input type="date" id="date" value={empActivityData.date} onChange={handleEmpActivityChange} style={styles.input} required />
                </div>

                <div style={styles.row}>
                    <div style={styles.inputGroupHalf}>
                        <label htmlFor="inTime" style={styles.label}>In Time <span style={{color: 'red'}}>*</span></label>
                        <input type="time" id="inTime" value={empActivityData.inTime} onChange={handleEmpActivityChange} style={styles.input} required />
                    </div>
                    <div style={styles.inputGroupHalf}>
                        <label htmlFor="outTime" style={styles.label}>Out Time <span style={{color: 'red'}}>*</span></label>
                        <input type="time" id="outTime" value={empActivityData.outTime} onChange={handleEmpActivityChange} style={styles.input} required />
                    </div>
                </div>
                
                <div style={styles.inputGroup}>
                    <label htmlFor="remark" style={styles.label}>Remark (Internal)</label>
                    <textarea id="remark" rows="2" value={empActivityData.remark} onChange={handleEmpActivityChange}  />
                </div>

                {/* --- CUSTOMER SIGN-OFF SECTION --- */}
                <h4 style={{marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '15px'}}>Customer Sign-Off Details</h4>
                
                {/* Customer Feedback - CONFIRMED FIX APPLIED */}
                <div style={styles.inputGroup}>
                    <label htmlFor="customerFeedback" style={styles.label}>Customer Feedback <span style={{color: 'red'}}>*</span></label>
                    <textarea id="customerFeedback" rows="3" value={empActivityData.customerFeedback} onChange={handleEmpActivityChange} style={styles.textarea} required />
                </div>

                {/* Customer Name & Email - CONFIRMED FIX APPLIED */}
                <div style={styles.row}>
                    <div style={styles.inputGroupHalf}>
                        <label htmlFor="customerName" style={styles.label}>Customer Name <span style={{color: 'red'}}>*</span></label>
                        <input type="text" id="customerName" value={empActivityData.customerName} onChange={handleEmpActivityChange} style={styles.input} required />
                    </div>
                    <div style={styles.inputGroupHalf}>
                        <label htmlFor="emailId" style={styles.label}>Customer Email ID <span style={{color: 'red'}}>*</span></label>
                        <input type="email" id="emailId" value={empActivityData.emailId} onChange={handleEmpActivityChange} style={styles.input} required />
                    </div>
                </div>

                {/* --- SIGNATURE CAPTURE SECTION (NEW) --- */}
                <div style={{...styles.inputGroup, border: '1px solid #cce5ff', padding: '10px', borderRadius: '4px', backgroundColor: '#e6f7ff', marginTop: '20px'}}>
                    
                    {/* Signature Status/Button */}
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <p style={{margin: '0', fontWeight: 'bold', color: '#007bff'}}>
                            Signature Status: 
                            {empActivityData.signatureBase64 ? 
                                <span style={{color: 'green', marginLeft: '10px'}}>✅ Captured</span> : 
                                <span style={{color: 'red', marginLeft: '10px'}}>❌ Missing</span>
                            }
                        </p>
                        <button 
                            type="button" 
                            onClick={() => setIsSignatureAreaOpen(prev => !prev)}
                            style={{...styles.submitButtonSmall, width: 'auto', backgroundColor: isSignatureAreaOpen ? '#ffc107' : '#007bff', flexShrink: 0}}
                        >
                            {isSignatureAreaOpen ? 'Hide Signature Pad' : 'Capture Signature'}
                        </button>
                    </div>

                    {/* Signature Preview */}
                    {empActivityData.signatureBase64 && !isSignatureAreaOpen && (
                        <div style={{marginTop: '10px', padding: '10px', border: '1px dashed #007bff'}}>
                            <p style={{fontSize: '0.9em', margin: '0 0 5px 0'}}>Current Signature Preview:</p>
                            <img 
                                src={empActivityData.signatureBase64} 
                                alt="Captured Signature" 
                                style={{maxWidth: '150px', maxHeight: '100px', border: '1px solid #ccc', backgroundColor: 'white'}}
                            />
                        </div>
                    )}

                    {/* Signature Pad Area (Conditional) */}
                    {isSignatureAreaOpen && (
                        <div style={{marginTop: '15px'}}>
                            <SignaturePadComponent onSave={() => setIsSignatureAreaOpen(false)} />
                        </div>
                    )}
                </div>


                {/* Signature Confirmation (Linked to capture data) */}
                <div style={{...styles.inputGroup, border: '1px solid #ffcc00', padding: '10px', borderRadius: '4px', backgroundColor: '#fffbe5', marginTop: '20px'}}>
                    <label style={styles.checkboxLabel}>
                        <input 
                            type="checkbox" 
                            id="customerSignature" 
                            checked={!!empActivityData.signatureBase64} 
                            onChange={() => {}} 
                            style={{marginRight: '10px'}}
                            disabled
                        />
                        I confirm that the **Customer Signature** has been captured. <span style={{color: 'red'}}>*</span>
                    </label>
                </div>


                <button 
                    type="submit"
                    style={{...styles.submitButton, backgroundColor: '#007bff'}}
                    disabled={empSubmitStatus === 'submitting' || empLoading || !empActivityData.signatureBase64}
                >
                    {empSubmitStatus === 'submitting' ? 'Logging Activity...' : `Log ${empActivityType === 'breakdown' ? 'Breakdown' : 'Service'} Activity`}
                </button>
                
                {empSubmitStatus === 'success' && <p style={styles.successMessage}>✅ Employee activity logged successfully!</p>}
                {empSubmitStatus === 'error' && <p style={styles.errorMessage}>❌ Logging failed. Error: {empError || 'Please check form data.'}</p>}

            </form>
                </div>
            )}
        </div>)}
        </div>
    );
}

// --- Basic Inline Styles (Included for completeness) ---
const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        maxWidth: '800px',
        margin: 'auto',
        border: '1px solid #ddd',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        backgroundColor: '#fff',
    },
    radioGroup: {
        marginBottom: '20px',
        display: 'flex',
        gap: '20px',
    },
    radioLabel: {
        fontSize: '1.1em',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    radioLabelSmall: { 
        fontSize: '1em',
        fontWeight: 'normal',
        cursor: 'pointer',
        marginRight: '15px',
    },
    checkboxLabel: { 
        display: 'flex',
        alignItems: 'center',
        fontWeight: 'normal',
        cursor: 'pointer',
        fontSize: '0.95em',
    },
    divider: {
        margin: '15px 0',
        borderColor: '#eee',
    },
    form: {
        marginTop: '20px',
    },
    inputGroup: {
        marginBottom: '15px',
    },
    row: {
        display: 'flex',
        gap: '20px',
        marginBottom: '15px',
    },
    inputGroupHalf: {
        flex: 1,
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        width: '100%',
        padding: '10px',
        boxSizing: 'border-box',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    textarea: {
        width: '100%',
        padding: '10px',
        boxSizing: 'border-box',
        border: '1px solid #ccc',
        borderRadius: '4px',
        resize: 'vertical',
    },
    liftGridContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        padding: '10px',
        border: '1px solid #eee',
        borderRadius: '5px',
        backgroundColor: '#f9f9f9',
    },
    liftGridContainerSmall: { 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '10px',
    },
    liftCard: {
        padding: '10px',
        border: '2px solid #ddd',
        borderRadius: '6px',
        backgroundColor: '#fff',
        cursor: 'pointer',
        transition: 'border-color 0.2s, background-color 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        lineHeight: '1.4',
    },
    liftCardSmall: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: '#fff',
        lineHeight: '1.3',
    },
    liftCardSelected: {
        borderColor: '#007bff',
        backgroundColor: '#e6f7ff',
    },
    liftDetail: {
        margin: '2px 0',
        fontSize: '0.9em',
        color: '#555',
    },
    submitButton: {
        padding: '12px 25px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        marginTop: '20px',
        width: '100%',
        transition: 'background-color 0.2s',
    },
    submitButtonSmall: { 
        padding: '8px 15px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        marginTop: '10px',
        transition: 'background-color 0.2s',
    },
    successMessage: {
        color: 'green',
        marginTop: '15px',
        fontWeight: 'bold',
        backgroundColor: '#d4edda',
        padding: '10px',
        borderRadius: '4px',
        textAlign: 'center',
    },
    errorMessage: {
        color: 'red',
        marginTop: '15px',
        fontWeight: 'bold',
        backgroundColor: '#f8d7da',
        padding: '10px',
        borderRadius: '4px',
        textAlign: 'center',
    },
    verificationBox: { 
        border: '1px solid #007bff',
        padding: '20px',
        borderRadius: '5px',
        marginTop: '20px',
        backgroundColor: '#f0f8ff',
    },
    detailText: {
        marginBottom: '5px',
    }
};