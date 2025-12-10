package com.aibi.neerp.quotation.utility;

public enum QuotationStatus {
    // Define the official statuses
    DRAFTED,     // Currently being edited (newly created or unsaved changes)
    SAVED,      // Saved, but not finalized/sent
    FINALIZED,  // Officially approved/sent
    DELETED,    // Soft-deleted by user
    SUPERSEDED;     // 💡 CRITICAL: This revision has been replaced by a newer edition.
}

