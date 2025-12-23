package com.aibi.neerp.componentpricing.payload;

import lombok.*;

@Setter
@Getter
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;

//    public ApiResponse() {}

//    public ApiResponse(boolean success, String message, T data) {
//        this.success = success;
//        this.message = message;
//        this.data = data;
//    }

    // Getters and Setters

}

