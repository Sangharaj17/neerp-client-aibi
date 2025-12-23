package com.aibi.neerp.exception;

import com.aibi.neerp.componentpricing.payload.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
//        Map<String, String> errors = new HashMap<>();
//
//        ex.getBindingResult().getFieldErrors().forEach(error ->
//                errors.put(error.getField(), error.getDefaultMessage())
//        );
//
//        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
//    }

//    @ExceptionHandler(IllegalArgumentException.class)
//    public ResponseEntity<String> handleIllegalArgs(IllegalArgumentException ex) {
//        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
//    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgument(IllegalArgumentException ex) {
        log.error("Invalid argument: {}", ex.getMessage());
        return ResponseEntity
                .badRequest()
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Object>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        log.error("Data Integrity Violation", ex);

        String message = "Database constraint violated";
        Throwable rootCause = ex.getRootCause();

        if (rootCause != null && rootCause.getMessage() != null) {
            String causeMsg = rootCause.getMessage();

            if (causeMsg.toLowerCase().contains("foreign key constraint")) {
                // Extract the last "table ..." occurrence (the referencing table)
                String tableName = "";
                int lastIndex = causeMsg.lastIndexOf("table \"");
                if (lastIndex != -1) {
                    int start = lastIndex + 7; // after 'table "'
                    int end = causeMsg.indexOf("\"", start);
                    if (end != -1) {
                        tableName = causeMsg.substring(start, end);
                    }
                }

                message = "Cannot delete: This record is still referenced in table '" + tableName + "'.";
            } else if (causeMsg.toLowerCase().contains("unique constraint")) {
                message = "Duplicate entry: This value must be unique.";
            }
        }

//        return ResponseEntity
//                .badRequest()
//                .body(new ApiResponse<>(false, message, null));

            return ResponseEntity
                // ✅ Change this to HttpStatus.CONFLICT
                .status(HttpStatus.CONFLICT)
                .body(new ApiResponse<>(false, message, null));
    }


//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
//        Map<String, String> fieldErrors = new HashMap<>();
//        ex.getBindingResult().getFieldErrors().forEach(error ->
//                fieldErrors.put(error.getField(), error.getDefaultMessage())
//        );
//
//        Map<String, Object> body = new HashMap<>();
//        body.put("timestamp", java.time.LocalDateTime.now());
//        body.put("status", HttpStatus.BAD_REQUEST.value());
//        body.put("errors", fieldErrors);
//
//        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
//    }


    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFound(ResourceNotFoundException ex) {
        Map<String, Object> errorBody = new HashMap<>();
        errorBody.put("timestamp", java.time.LocalDateTime.now());
        errorBody.put("status", HttpStatus.NOT_FOUND.value());
        errorBody.put("error", "Not Found");
        errorBody.put("message", ex.getMessage());

        log.error("Resource not found: {}", ex.getMessage());

        return new ResponseEntity<>(errorBody, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<Object>> handleDuplicateResource(DuplicateResourceException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<String>> handleRuntimeException(RuntimeException ex) {
        log.error("Unhandled exception: ", ex);
        return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<String>> handleConstraintViolation(ConstraintViolationException ex) {
        return ResponseEntity
                .badRequest()
                .body(new ApiResponse<>(false, "Validation failed: " + ex.getMessage(), null));
    }

    @ExceptionHandler(ResourceInUseException.class)
    public ResponseEntity<String> handleResourceInUse(ResourceInUseException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

//    @ExceptionHandler(DataIntegrityViolationException.class)
//    public ResponseEntity<String> handleDBError(DataIntegrityViolationException ex) {
//        return ResponseEntity.status(HttpStatus.CONFLICT).body("Data integrity error: " + ex.getMostSpecificCause().getMessage());
//    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        log.error("Validation errors: {}", errors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse<>(false, "Validation failed", errors));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception ex) {
        log.error("Unexpected error occurred", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "An unexpected error occurred: " + ex.getMessage(), null));
    }

    @ExceptionHandler(FileStorageException.class)
    public ResponseEntity<ApiResponse<Object>> handleFileStorage(FileStorageException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }
}
