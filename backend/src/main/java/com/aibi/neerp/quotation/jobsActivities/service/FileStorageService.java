package com.aibi.neerp.quotation.jobsActivities.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;


import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {

    @Value("${file.upload.base-path}")
    private String baseUploadPath;

//    @Value("${file.upload.dir:uploads/job-activities}")
//    private String uploadDir;

    @Value("${file.max.size:5242880}") // 5MB default
    private long maxFileSize;

    // private static final List<String> ALLOWED_EXTENSIONS =
    //         Arrays.asList("jpg", "jpeg", "png", "pdf");
    private static final List<String> ALLOWED_IMAGE_EXTENSIONS =
            Arrays.asList("jpg", "jpeg", "png");

    private static final List<String> ALLOWED_DOCUMENT_EXTENSIONS =
            Arrays.asList("jpg", "jpeg", "png", "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt");

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(baseUploadPath));
            log.info("Upload directory created: {}", baseUploadPath);
        } catch (IOException e) {
            log.error("Could not create upload directory", e);
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    /**
     * Store photo and return file path
     */
        /* ============================================================
       PHOTO STORAGE
       ============================================================ */
    public String storePhoto(
            MultipartFile file,
            Integer clientId,
            Integer jobId,
            Integer activityId
    ) throws IOException {

        validateImageFile(file);

        String extension = getFileExtension(file.getOriginalFilename());
        String filename = String.format(
                "photo_%d_%d.%s",
                activityId,
                System.currentTimeMillis(),
                extension
        );

        Path photoDir = Paths.get(
                baseUploadPath,
                clientId.toString(),
                "jobs",
                jobId.toString(),
                "activities",
                activityId.toString(),
                "photos"
        );

        Files.createDirectories(photoDir);

        Path target = photoDir.resolve(filename);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        log.info("Photo stored at {}", target);

        log.info("Photo buildRelativePath {}", buildRelativePath(photoDir, filename));

//        return buildRelativePath(photoDir, filename);
        return getRelativePath(target);
    }

    /* ============================================================
       JOB DOCUMENT STORAGE
       ============================================================ */
    public String storeJobDocument(
            MultipartFile file,
            Integer clientId,
            Integer jobId
    ) throws IOException {

        validateDocumentFile(file);

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = getFileExtension(originalFilename);
        String filename = String.format(
                "job_doc_%d_%d_%s.%s",
                jobId,
                System.currentTimeMillis(),
                UUID.randomUUID().toString().substring(0, 8),
                extension
        );

        Path docDir = Paths.get(
                baseUploadPath,
                clientId.toString(),
                "jobs",
                jobId.toString(),
                "documents"
        );

        Files.createDirectories(docDir);

        Path target = docDir.resolve(filename);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        log.info("Job Document stored at {}", target);
        return getRelativePath(target);
    }


    /* ============================================================
       SIGNATURE STORAGE
       ============================================================ */
    public String storeSignature(
            MultipartFile file,
            Integer clientId,
            Integer jobId,
            Integer activityId,
            String personName
    ) throws IOException {

        validateImageFile(file);

        String safeName = personName.replaceAll("\\s+", "_");
        String filename = jobId + "_" + activityId + "_" + safeName + ".png";

        Path signatureDir = Paths.get(
                baseUploadPath,
                clientId.toString(),
                "jobs",
                jobId.toString(),
                "activities",
                activityId.toString(),
                "signature"
        );

        Files.createDirectories(signatureDir);

        Path target = signatureDir.resolve(filename);
//        Files.write(target, file.getBytes());

        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        log.info("Signature stored at {}", target);

        log.info("Signature buildRelativePath {}", buildRelativePath(signatureDir, filename));


//        return buildRelativePath(signatureDir, filename);
        return getRelativePath(target);
    }

    /* ============================================================
       FILE LOADING
       ============================================================ */
    public Resource loadFileAsResource(String relativePath) throws IOException {
        Path filePath = Paths.get(baseUploadPath).resolve(relativePath).normalize();
        log.info("Downloading filePath: {}", filePath.toAbsolutePath());
        Resource resource = new UrlResource(filePath.toUri());

        if (!filePath.startsWith(baseUploadPath)) {
            throw new SecurityException("Invalid file path");
        }

        if (!resource.exists()) {
            throw new FileNotFoundException("File not found: " + relativePath);
        }
        return resource;
    }

    /* ============================================================
       DELETE FILE
       ============================================================ */
    public void deleteFile(String relativePath) {
        try {
            Path path = Paths.get(baseUploadPath).resolve(relativePath).normalize();
            Files.deleteIfExists(path);
        } catch (IOException e) {
            log.error("Failed to delete file {}", relativePath, e);
        }
    }

    /* ============================================================
       HELPERS
       ============================================================ */
    private void validateImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("File exceeds size limit");
        }

        String contentType = file.getContentType();
        if (contentType == null ||
                !(contentType.equals("image/png")
                        || contentType.equals("image/jpeg")
                        || contentType.equals("image/jpg")
                ))
        {
            throw new IllegalArgumentException(
                    "Invalid file type. Allowed: jpg, jpeg, png"
            );
        }

        String ext = getFileExtension(file.getOriginalFilename());
        if (!ALLOWED_IMAGE_EXTENSIONS.contains(ext.toLowerCase())) {
            throw new IllegalArgumentException(
                    "Invalid file type. Allowed: " + ALLOWED_IMAGE_EXTENSIONS
            );
        }
    }

    private void validateDocumentFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("File exceeds size limit");
        }

        // We can be less strict about content-type for docs or just check extension
        String ext = getFileExtension(file.getOriginalFilename());
        if (!ALLOWED_DOCUMENT_EXTENSIONS.contains(ext.toLowerCase())) {
            throw new IllegalArgumentException(
                    "Invalid file type. Allowed: " + ALLOWED_DOCUMENT_EXTENSIONS
            );
        }
    }


    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf('.') + 1);
    }

    private String buildRelativePath(Path dir, String filename) {
        return Paths.get(baseUploadPath)
                .relativize(dir.resolve(filename))
                .toString()
                .replace("\\", "/");
    }

    private String getRelativePath(Path fullPath) {
        return Paths.get(baseUploadPath)
                .relativize(fullPath)
                .toString()
                .replace("\\", "/");
    }
}


//    public String storePhoto(MultipartFile file, Integer jobActivityId)
//            throws IOException {
//
//        // Validation
//        validateFile(file);
//
//        // Generate unique filename
//        String originalFilename = StringUtils.cleanPath(
//                file.getOriginalFilename() != null ? file.getOriginalFilename() : "photo"
//        );
//        String extension = getFileExtension(originalFilename);
//        String newFilename = String.format("activity_%d_%d_%s.%s",
//                jobActivityId,
//                System.currentTimeMillis(),
//                UUID.randomUUID().toString().substring(0, 8),
//                extension
//        );
//
//        // Create subdirectory for each activity
//        Path activityDir = Paths.get(uploadDir, "activity_" + jobActivityId);
//        Files.createDirectories(activityDir);
//
//        // Store file
//        Path targetLocation = activityDir.resolve(newFilename);
//        Files.copy(file.getInputStream(), targetLocation,
//                StandardCopyOption.REPLACE_EXISTING);
//
//        log.info("File stored: {}", targetLocation);
//
//        // Return relative path
//        return activityDir.getFileName() + "/" + newFilename;
//    }

//    public String storeSignature(MultipartFile file,
//                                 Integer jobId,
//                                 Integer activityId,
//                                 String personName, String tenantId) throws IOException {
//
//        String fileName = jobId + "_" + activityId + "_" +
//                personName.replaceAll("\\s+", "_") + ".png";
//
//        Path dir = Paths.get(
//                "uploads", tenantId, "jobs", jobId.toString(),
//                "activities", activityId.toString(), "signature"
//        );
//
//        Files.createDirectories(dir);
//
//        Path filePath = dir.resolve(fileName);
//        Files.write(filePath, file.getBytes());
//
//        return filePath.toString();
//    }

//    public String storeSignature(String base64,
//                                 Integer activityId,
//                                 String signerName) throws IOException {
//
//        byte[] decodedBytes = Base64.getDecoder().decode(
//                base64.replaceFirst("^data:image/\\w+;base64,", "")
//        );
//
//        String fileName = "signature_" + System.currentTimeMillis() + ".png";
//
//        String uploadBasePath = "";
//        Path path = Paths.get(
//                uploadBasePath,
//                "job-activities",
//                activityId.toString(),
//                "signature",
//                fileName
//        );
//
//        Files.createDirectories(path.getParent());
//        Files.write(path, decodedBytes);
//
//        return path.toString().replace(uploadBasePath, "");
//    }

//
//    /**
//     * Store signature (Base64 to file)
//     */
//    public String storeSignatureBase64(String base64Data, Integer jobActivityId,
//                                       String filename) throws IOException {
//
//        if (base64Data == null || base64Data.isEmpty()) {
//            return null;
//        }
//
//        // Remove data:image prefix if present
//        String base64Image = base64Data;
//        if (base64Data.contains(",")) {
//            base64Image = base64Data.split(",")[1];
//        }
//
//        byte[] imageBytes = Base64.getDecoder().decode(base64Image);
//
//        // Generate filename
//        String newFilename = String.format("signature_%d_%d.png",
//                jobActivityId,
//                System.currentTimeMillis()
//        );
//
//        Path activityDir = Paths.get(uploadDir, "activity_" + jobActivityId);
//        Files.createDirectories(activityDir);
//
//        Path targetLocation = activityDir.resolve(newFilename);
//        Files.write(targetLocation, imageBytes);
//
//        log.info("Signature stored: {}", targetLocation);
//
//        return activityDir.getFileName() + "/" + newFilename;
//    }
//
//    /**
//     * Load file as Resource
//     */
//    public Resource loadFileAsResource(String filePath) throws IOException {
//        try {
//            Path path = Paths.get(uploadDir).resolve(filePath).normalize();
//            Resource resource = new UrlResource(path.toUri());
//
//            if (resource.exists() && resource.isReadable()) {
//                return resource;
//            } else {
//                throw new FileNotFoundException("File not found: " + filePath);
//            }
//        } catch (MalformedURLException e) {
//            throw new FileNotFoundException("File not found: " + filePath);
//        }
//    }
//
//    /**
//     * Delete file
//     */
//    public void deleteFile(String filePath) {
//        try {
//            Path path = Paths.get(uploadDir).resolve(filePath).normalize();
//            Files.deleteIfExists(path);
//            log.info("File deleted: {}", filePath);
//        } catch (IOException e) {
//            log.error("Could not delete file: {}", filePath, e);
//        }
//    }
//
//    // Validation methods
//    private void validateFile(MultipartFile file) throws IOException {
//        if (file.isEmpty()) {
//            throw new IllegalArgumentException("File is empty");
//        }
//
//        if (file.getSize() > maxFileSize) {
//            throw new IllegalArgumentException(
//                    String.format("File size exceeds maximum limit of %d MB",
//                            maxFileSize / 1024 / 1024)
//            );
//        }
//
//        String extension = getFileExtension(file.getOriginalFilename());
//        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
//            throw new IllegalArgumentException(
//                    "File type not allowed. Allowed types: " + ALLOWED_EXTENSIONS
//            );
//        }
//    }
//
//    private String getFileExtension(String filename) {
//        if (filename == null || !filename.contains(".")) {
//            return "";
//        }
//        return filename.substring(filename.lastIndexOf(".") + 1);
//    }
//}
