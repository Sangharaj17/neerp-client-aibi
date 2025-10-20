// src/components/ComplaintForm.js
"use client"; // <--- ADD THIS DIRECTIVE AT THE VERY TOP

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

    // Clean and determine the active ID
    const cleanJobId = jobId ? parseInt(jobId, 10) : null;
    const cleanRenewalId = renewalId ? parseInt(renewalId, 10) : null;
    const activeJobId = cleanJobId || cleanRenewalId;
    const isRenewal = !!cleanRenewalId;
    
    // --- Data Fetching Effect (Lifts) ---
    useEffect(() => {
        if (userType !== 'customer') return;

        if (!activeJobId) {
            setError('Missing Job ID or Renewal ID.');
            setLoading(false);
            return;
        }

        const fetchLifts = async () => {
            setLoading(true);
            setError(null);
            try {
                // *** IMPORTANT: Corrected the endpoint path to include '/amc' ***
                const endpoint = isRenewal
                    ? `/api/amc/complaint-form/getAllRenewalLiftsForAddBreakDownTodo`
                    : `/api/amc/complaint-form/getAllLiftsForAddBreakDownTodo`;
                
                const response = await axiosInstance.get(endpoint, { 
                    params: { jobId: activeJobId } // Corresponds to the @RequestParam Integer jobId in Java
                });
                
                // The API returns the list directly
                setLifts(response.data || []);
                
            } catch (err) {
                console.error("Error fetching lifts:", err);
                // Check for 400 or other specific error messages
                setError(err.response?.data?.message || 'Failed to load lift data. Check console for details.');
            } finally {
                setLoading(false);
            }
        };

        fetchLifts();
    }, [activeJobId, isRenewal, userType]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus('submitting');
        setError(null);

        // Validation: Must select at least one lift for breakdown reports
        if (userType === 'customer' && formData.activityType === '1' && selectedLiftIds.length === 0) {
            alert("For a Breakdown, please select the lift(s) that are experiencing issues.");
            setSubmitStatus(null);
            return;
        }

        const payload = {
            userId: userId, 
            purpose: formData.complaintFeedback, // Maps to 'Complaint / Feedback'
            todoDate: formData.todoDate, // YYYY-MM-DD
            time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }), 
            venue: `${siteName} - ${customerName}`, // site name concatenation
            jobActivityTypeId: parseInt(formData.activityType), // 1 for Breakdown
            status: 1, // Default status for new todo item
            complaintName: formData.yourName,
            complaintMob: formData.yourNumber,
            jobId: !isRenewal ? activeJobId : null,
            renewalJobId: isRenewal ? activeJobId : null,
            liftIds: selectedLiftIds, // List of Enquiry IDs
        };

        try {
            // POST request to the BreakdownTodoController
            await axiosInstance.post('/api/amc/complaint-form/create-breakdown-todo', payload);
            
            setSubmitStatus('success');
            // Optional: Clear form data after success
            setFormData(prev => ({ ...prev, yourName: '', yourNumber: '', complaintFeedback: '' }));
            setSelectedLiftIds([]);

        } catch (err) {
            console.error("Submission Error:", err.response ? err.response.data : err.message);
            setSubmitStatus('error');
            setError('Submission failed: ' + (err.response?.data?.message || 'Network error.'));
        }
    };
    
    // --- Render Components ---

    const CustomerForm = () => (
        <form onSubmit={handleSubmit} style={styles.form}>
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
            <div style={{...styles.inputGroup, marginTop: '20px'}}>
                <h3 style={{marginBottom: '10px'}}>Select Lift(s) </h3>
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

            {/* Contact Details */}
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

    const EmployeeForm = () => (
        <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '5px' }}>
            <h2>Employee Portal</h2>
            <p>This section is designated for internal staff use and requires separate implementation based on employee-specific workflows.</p>
        </div>
    );

    // --- Main Render ---
    return (
        <div style={styles.container}>
            <h1>Feedback / Complaint Form</h1>
            
            {/* User Type Selection */}
            <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                    <input type="radio" name="userType" value="customer" checked={userType === 'customer'} onChange={() => setUserType('customer')} /> Customer
                </label>
                <label style={styles.radioLabel}>
                    <input type="radio" name="userType" value="employee" checked={userType === 'employee'} onChange={() => setUserType('employee')} /> Employee
                </label>
            </div>
            <hr style={styles.divider} />
            
            {/* Conditional Display */}
            {!activeJobId && (
                 <div style={styles.errorMessage}>
                    <p>Invalid Entry: A valid Job ID or Renewal ID is required from the link.</p>
                 </div>
            )}

            {(userType === 'customer' && activeJobId) ? <CustomerForm /> : <EmployeeForm />}
        </div>
    );
}

// --- Basic Inline Styles (For Quick Setup) ---
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
    }
};