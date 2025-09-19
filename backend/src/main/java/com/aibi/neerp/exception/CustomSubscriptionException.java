package com.aibi.neerp.exception;

import lombok.Getter;
@Getter
public class CustomSubscriptionException extends RuntimeException {
    private final int statusCode;
    private final String rawJson;

    public CustomSubscriptionException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.rawJson = null;
    }

    public CustomSubscriptionException(String message, int statusCode, String rawJson) {
        super(message);
        this.statusCode = statusCode;
        this.rawJson = rawJson;
    }

}


