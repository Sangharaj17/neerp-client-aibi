// src/components/ComplaintForm.js
"use client";

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance'; // Make sure the path is correct

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
    userId = 1, // Defaulting for testing, replace with actual user context/prop
}) {
    // --- State Management ---
    const [userType, setUserType] = useState('customer');
    const [lifts, setLifts] = useState([]);
    const [selectedLiftIds, setSelectedLiftIds] = useState([]);
    const [formData, setFormData] = useState({
        activityType: '1', // Default: Breakdown
        todoDate: new Date().toISOString().split('T')[0],
        yourName: '',
        yourNumber: '',
        complaintFeedback: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', 'submitting'
    
    // --- EMPLOYEE STATE ---
    const [empCode, setEmpCode] = useState('');
    const [empData, setEmpData] = useState(null); // Stores fetched ComplaintFormEmpData
    const [empLoading, setEmpLoading] = useState(false);
    const [empError, setEmpError] = useState(null);
    
    // --- NEW EMPLOYEE ACTIVITY STATE ---
    const [empActivityData, setEmpActivityData] = useState({
        date: new Date().toISOString().split('T')[0],
        selectedSite: `${customerName} - ${siteName}`, // Default to the site from props
        inTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        outTime: '',
    });

    // Clean and determine the active ID
    const cleanJobId = jobId ? parseInt(jobId, 10) : null;
    const cleanRenewalId = renewalId ? parseInt(renewalId, 10) : null;
    const activeJobId = cleanJobId || cleanRenewalId;
    const isRenewal = !!cleanRenewalId;
    
    // --- Data Fetching Effect (Lifts) ---
    // (Existing Lift fetching logic remains the same for CustomerForm)
    // ...

    // --- Handlers ---

    const handleFormChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleLiftSelection = (enquiryId) => {
        setSelectedLiftIds(prev =>
            prev.includes(enquiryId)
                ? prev.filter(id => id !== enquiryId) // Deselect
                : [...prev, enquiryId] // Select
        );
    };

    // --- NEW EMPLOYEE ACTIVITY HANDLER ---
    const handleEmpActivityChange = (e) => {
        const { id, value } = e.target;
        setEmpActivityData(prev => ({ ...prev, [id]: value }));
    };

    // --- EMPLOYEE CODE HANDLER ---
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
                // Reset errors and loading after success
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
    // --- END EMPLOYEE HANDLER ---


    const handleSubmit = async (e) => {
        // (Submission logic remains the same)
        e.preventDefault();
        setSubmitStatus('submitting');
        setError(null);

        // Validation: Must select at least one lift for breakdown reports (if applicable)
        if (formData.activityType === '1' && selectedLiftIds.length === 0) {
            alert("For a Breakdown, please select the lift(s) that are experiencing issues.");
            setSubmitStatus(null);
            return;
        }
        
        // ... build payload ...
    };
    
    // --- Render Components ---
    
    // --- NEW EMPLOYEE ACTIVITY FORM COMPONENT ---
    const EmployeeActivityForm = () => (
        <div style={{...styles.form, marginTop: '25px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px'}}>
            <h3 style={{marginBottom: '15px', color: '#444'}}>Log Employee Activity</h3>

            {/* Date Field */}
            <div style={styles.inputGroup}>
                <label htmlFor="date" style={styles.label}>Date</label>
                <input 
                    type="date" 
                    id="date" 
                    value={empActivityData.date} 
                    onChange={handleEmpActivityChange} 
                    style={styles.input} 
                    required 
                />
            </div>

            {/* Site Selection Field */}
            <div style={styles.inputGroup}>
                <label htmlFor="selectedSite" style={styles.label}>Select Site</label>
                <select 
                    id="selectedSite" 
                    value={empActivityData.selectedSite} 
                    onChange={handleEmpActivityChange} 
                    style={styles.input} 
                    required
                >
                    {/* The current site/job context is the default/only option */}
                    <option value={`${customerName} - ${siteName}`}>
                        {customerName} - {siteName} (Job/Renewal ID: {activeJobId})
                    </option>
                    {/* Placeholder for future options if employee has multiple assigned jobs */}
                    {/* <option value="other_site">Other Site - Other Customer</option> */}
                </select>
            </div>

            {/* In Time and Out Time */}
            <div style={styles.row}>
                <div style={styles.inputGroupHalf}>
                    <label htmlFor="inTime" style={styles.label}>In Time</label>
                    <input 
                        type="time" 
                        id="inTime" 
                        value={empActivityData.inTime} 
                        onChange={handleEmpActivityChange} 
                        style={styles.input} 
                        required 
                    />
                </div>
                <div style={styles.inputGroupHalf}>
                    <label htmlFor="outTime" style={styles.label}>Out Time</label>
                    <input 
                        type="time" 
                        id="outTime" 
                        value={empActivityData.outTime} 
                        onChange={handleEmpActivityChange} 
                        style={styles.input} 
                    />
                </div>
            </div>

            {/* Future: Submit button for this activity form */}
            <button 
                type="button" // Use type="button" since this is not the main complaint submission
                onClick={() => alert(`Activity Data Captured: ${JSON.stringify(empActivityData)}`)}
                style={{...styles.submitButton, backgroundColor: '#007bff'}}
            >
                Log Attendance / Start Task
            </button>
        </div>
    );
    // --- END EMPLOYEE ACTIVITY FORM COMPONENT ---


    const CustomerForm = () => (
        <form onSubmit={handleSubmit} style={styles.form}>
            {/* ... (Existing CustomerForm content remains the same) ... */}
            {/* Read-Only Info */}
            <div style={styles.inputGroup}>
                <label style={styles.label}>Site & Customer Name</label>
                <input type="text" value={`${siteName} - ${customerName}`} style={styles.input} readOnly />
                <p style={{fontSize: '0.8em', color: '#555'}}>
                    {isRenewal ? `Renewal ID: ${renewalId}` : `Job ID: ${jobId}`}
                </p>
            </div>

            {/* Activity Type & Date */}
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

            {/* Lift Selection Grid */}
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

            {/* Contact Details (Always editable/used for Customer Form) */}
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

            {/* Complaint/Feedback */}
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
    );

    // --- EMPLOYEE COMPONENT (WITH NEW ACTIVITY FORM) ---
    const EmployeeForm = () => (
        <div>
            {/* 1. Employee Code Input Form (Always Visible) */}
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
                    
                    <p style={{marginTop: '15px', color: '#555', fontSize: '0.9em'}}>
                        Use the form above to log your attendance and activity for this site.
                    </p>
                </div>
            )}
            
        </div>
    );
    // --- END EMPLOYEE COMPONENT ---

    // --- Main Render ---
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
                        // Clear employee context when switching to customer
                        onChange={() => { setUserType('customer'); setEmpData(null); setEmpCode(''); setEmpError(null);}} 
                    /> Customer
                </label>
                <label style={styles.radioLabel}>
                    <input 
                        type="radio" 
                        name="userType" 
                        value="employee" 
                        checked={userType === 'employee'} 
                        // Clear customer form data (in case it was pre-filled) when switching to employee
                        onChange={() => { setUserType('employee'); setFormData(prev => ({ ...prev, yourName: '', yourNumber: ''})); }} 
                    /> Employee
                </label>
            </div>
            <hr style={styles.divider} />
            
            {/* Conditional Display */}
            {!activeJobId && (
                 <div style={styles.errorMessage}>
                     <p>Invalid Entry: A valid Job ID or Renewal ID is required from the link.</p>
                 </div>
            )}

            {/* Render the appropriate form */}
            {activeJobId && (userType === 'customer' ? <CustomerForm /> : <EmployeeForm />)}
        </div>
    );
}

// --- Basic Inline Styles (Updated to include activity form colors) ---
const styles = {
    // ... (Container and main styles remain the same)
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