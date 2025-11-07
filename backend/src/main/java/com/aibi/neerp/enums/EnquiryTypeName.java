package com.aibi.neerp.enums;

public enum EnquiryTypeName {
    AMC("AMC"),
    NEW_INSTALLATION("New Installation"),
    MODERNIZATION("Moderization"),
    ON_CALL("On Call");

    private final String displayName;

    EnquiryTypeName(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    // Optional helper method — to get enum by name ignoring case
    public static EnquiryTypeName fromString(String name) {
        for (EnquiryTypeName type : EnquiryTypeName.values()) {
            if (type.displayName.equalsIgnoreCase(name) || type.name().equalsIgnoreCase(name)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown Enquiry Type: " + name);
    }
}
