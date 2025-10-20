// src/components/QrCodeGenerator.jsx
"use client";

import React, { useMemo, useState, useEffect } from 'react';
import QRCode from "react-qr-code";

/**
 * QR Code Generator component that dynamically determines the base URL
 * from the browser's window.location.origin.
 * @param {string} jobId - The Job ID.
 * @param {string} renewalId - The Renewal ID.
 * @param {string} customerName - The Customer Name.
 * @param {string} siteName - The Site Name.
 * @param {string} [targetRoute="/complaint-form"] - The path segment of the target page.
 */
export default function QrCodeGenerator({
    jobId,
    renewalId,
    customerName,
    siteName,
    targetRoute = "/complaint-form" // ⭐ UPDATED default target route
}) {
    const [baseUrl, setBaseUrl] = useState('');

    // 1. Get the base URL from the browser (e.g., http://localhost:3000 or https://app.com)
    useEffect(() => {
        // window is only available on the client side, which is guaranteed by "use client"
        if (typeof window !== 'undefined') {
            // window.location.origin gives us the protocol + domain + port (e.g., https://app.com)
            setBaseUrl(window.location.origin);
        }
    }, []);


    // 2. Construct the final URL when data or the base URL changes
    const qrCodeUrl = useMemo(() => {
        if (!baseUrl) return null; // Wait until the baseUrl is set

        // 1. Create a URLSearchParams object to safely build the query string
        const params = new URLSearchParams();

        // 2. Append the data
        params.append('jobId', jobId || '');
        params.append('renewalId', renewalId || '');
        params.append('customerName', customerName || '');
        params.append('siteName', siteName || '');

        // 3. Combine the base URL, the target route, and the encoded parameters
        return `${baseUrl}${targetRoute}?${params.toString()}`;
    }, [baseUrl, targetRoute, jobId, renewalId, customerName, siteName]);


    // 3. Basic check for required data
    if (!jobId || !renewalId) {
        return (
            <p style={{ color: 'red' }}>Error: Missing required Job ID or Renewal ID data.</p>
        );
    }

    // 4. Show a loading state until the base URL is determined
    if (!qrCodeUrl) {
        return <p>Loading QR Code Generator...</p>;
    }

    // 5. Rendering
    return (
        <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', maxWidth: '300px' }}>
            <h2>QR Code for {siteName}</h2>

            {/* The QRCode component renders the image */}
            <QRCode
                value={qrCodeUrl}
                size={256}
                level="H" // High error correction level, good for printing
                bgColor="#FFFFFF"
                fgColor="#000000"
            />

            <div style={{ marginTop: '15px', fontSize: '14px', textAlign: 'left' }}>
                <p><strong>Job ID:</strong> {jobId}</p>
                <p><strong>Renewal ID:</strong> {renewalId}</p>
                <p><strong>Customer:</strong> {customerName}</p>
            </div>

            {/* Display the full encoded URL for verification (optional) */}
            <p style={{ wordBreak: 'break-all', marginTop: '15px', fontSize: '10px', color: '#666' }}>
                **Encoded URL:** {qrCodeUrl}
            </p>
        </div>
    );
}