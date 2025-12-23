package com.aibi.neerp.quotation.jobsActivities.service;

import com.aibi.neerp.leadmanagement.entity.NewLeads;
import com.aibi.neerp.quotation.jobs.entity.QuotationJobs;
import com.aibi.neerp.quotation.jobsActivities.dto.JobActivityPhotoDTO;
import com.aibi.neerp.quotation.jobsActivities.dto.JobActivityResponseDTO;
import com.aibi.neerp.quotation.jobsActivities.entity.NiJobActivity;
import com.aibi.neerp.settings.dto.CompanySettingDTO;
import com.aibi.neerp.settings.service.CompanySettingService;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.WriterProperties;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.properties.AreaBreakType;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityPdfGenerator {
    private final CompanySettingService companySettingService;

    @Value("${app.backend.url:http://localhost:8080}")
    private String backendUrl;

    @Value("${file.upload.base-path:uploads}")
    private String uploadBasePath;

    private static final long MAX_PDF_SIZE = 5 * 1024 * 1024; // 5MB
    private static final int MAX_PHOTOS_IN_PDF = 4;

//    private Image loadCompressedImage(String imageUrl) throws Exception {
//
//        BufferedImage original;
//
//        if (imageUrl.startsWith("data:image")) {
//            String base64 = imageUrl.substring(imageUrl.indexOf(",") + 1);
//            byte[] decoded = Base64.getDecoder().decode(base64);
//            original = ImageIO.read(new ByteArrayInputStream(decoded));
//        } else {
//            original = ImageIO.read(new URL(imageUrl));
//        }
//
//        if (original == null) return null;
//
//        // Resize image (reduce memory)
//        int targetWidth = 600;
//        int targetHeight = (original.getHeight() * targetWidth) / original.getWidth();
//
//        BufferedImage resized = new BufferedImage(
//                targetWidth,
//                targetHeight,
//                BufferedImage.TYPE_INT_RGB
//        );
//
//        Graphics2D g = resized.createGraphics();
//        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION,
//                RenderingHints.VALUE_INTERPOLATION_BILINEAR);
//        g.drawImage(original, 0, 0, targetWidth, targetHeight, null);
//        g.dispose();
//
//        // Compress JPEG
//        ByteArrayOutputStream baos = new ByteArrayOutputStream();
//        ImageWriter jpgWriter = ImageIO.getImageWritersByFormatName("jpg").next();
//        ImageWriteParam param = jpgWriter.getDefaultWriteParam();
//
//        param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
//        param.setCompressionQuality(0.6f); // 🔥 60% quality (perfect for PDF)
//
//        ImageOutputStream ios = ImageIO.createImageOutputStream(baos);
//        jpgWriter.setOutput(ios);
//        jpgWriter.write(null, new IIOImage(resized, null, null), param);
//
//        jpgWriter.dispose();
//        ios.close();
//
//        ImageData imageData = ImageDataFactory.create(baos.toByteArray());
//        return new Image(imageData);
//    }

    private Image createJpegImage(BufferedImage image, float quality) throws Exception {

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageWriter writer = ImageIO.getImageWritersByFormatName("jpg").next();
        ImageWriteParam param = writer.getDefaultWriteParam();

        param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
        param.setCompressionQuality(quality);

        ImageOutputStream ios = ImageIO.createImageOutputStream(baos);
        writer.setOutput(ios);
        writer.write(null, new IIOImage(image, null, null), param);

        writer.dispose();
        ios.close();

        return new Image(ImageDataFactory.create(baos.toByteArray()));
    }

    private BufferedImage resizeImage(BufferedImage original, int targetWidth) {

        int height = (original.getHeight() * targetWidth) / original.getWidth();

        BufferedImage resized = new BufferedImage(
                targetWidth, height, BufferedImage.TYPE_INT_RGB
        );

        Graphics2D g = resized.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION,
                RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g.drawImage(original, 0, 0, targetWidth, height, null);
        g.dispose();

        return resized;
    }

    private Image loadSignatureImage(String url) throws Exception {

        BufferedImage original = ImageIO.read(new URL(url));

        // Resize while keeping transparency
        BufferedImage resized = resizeImageWithAlpha(original, 400);

        byte[] pngBytes = bufferedImageToPNG(resized);

        ImageData imageData = ImageDataFactory.create(pngBytes);
        return new Image(imageData);
    }

    private byte[] bufferedImageToPNG(BufferedImage image) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "png", baos);   // ✅ PNG keeps transparency
        return baos.toByteArray();
    }


    private BufferedImage resizeImageWithAlpha(BufferedImage original, int targetWidth) {

        int width = original.getWidth();
        int height = original.getHeight();

        int targetHeight = (int) ((double) targetWidth / width * height);

        BufferedImage resized = new BufferedImage(
                targetWidth,
                targetHeight,
                BufferedImage.TYPE_INT_ARGB   // ✅ KEEP ALPHA
        );

        Graphics2D g2d = resized.createGraphics();
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION,
                RenderingHints.VALUE_INTERPOLATION_BICUBIC);
        g2d.setRenderingHint(RenderingHints.KEY_RENDERING,
                RenderingHints.VALUE_RENDER_QUALITY);
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
                RenderingHints.VALUE_ANTIALIAS_ON);

        g2d.drawImage(original, 0, 0, targetWidth, targetHeight, null);
        g2d.dispose();

        return resized;
    }


    private void addOptimizedSignature(Document document, JobActivityResponseDTO activity) {

        if (activity.getSignatureUrl() == null || activity.getSignatureUrl().isBlank())
            return;

        try {
            document.add(new Paragraph("\nSignature").setBold());

            Image signature = loadSignatureImage(activity.getSignatureUrl());
            signature.setMaxWidth(250);
            signature.setMaxHeight(90);
            signature.setMarginTop(5);

            document.add(signature);

        } catch (Exception e) {
            log.warn("Signature rendering failed", e);
            document.add(new Paragraph("Signature unavailable").setItalic());
        }
    }


    private Image loadCompressedImage(String imageUrl) throws Exception {

        BufferedImage original = imageUrl.startsWith("data:image")
                ? ImageIO.read(new ByteArrayInputStream(
                Base64.getDecoder().decode(imageUrl.substring(imageUrl.indexOf(",") + 1))
        ))
                : ImageIO.read(new URL(imageUrl));

        if (original == null) return null;

        BufferedImage resized = resizeImage(original, 600);

        return createJpegImage(resized, 0.6f);
    }


    public byte[] generateActivityPDF(
            JobActivityResponseDTO activity,
            NiJobActivity jobActivity,
            String companyName
    ) {

        byte[] pdfWithPhotos = generatePdfInternal(activity, jobActivity, companyName, true);

        // 🔐 Size Guard
        if (pdfWithPhotos.length > MAX_PDF_SIZE) {
            log.warn("PDF size {} bytes exceeds limit. Regenerating without photos",
                    pdfWithPhotos.length);
            return generatePdfInternal(activity, jobActivity, companyName, false);
        }

        return pdfWithPhotos;
    }

    private byte[] generatePdfInternal(
            JobActivityResponseDTO activity,
            NiJobActivity jobActivity,
            String companyName,
            boolean includePhotos
    ) {

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            PdfWriter writer = new PdfWriter(baos,
                    new WriterProperties().setCompressionLevel(9));

            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);
            pdfDoc.setCloseWriter(true);

            // ================= HEADER =================
            document.add(new Paragraph("NI Job Activity Report")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBold()
                    .setFontSize(16));

            document.add(new Paragraph("\n"));

            // ================= MAIN CONTENT =================
            addJobInfo(document, activity, jobActivity, companyName);
            addActivityInfo(document, activity);

            // ================= APPENDIX =================
            if (includePhotos) {
                addPhotoAppendix(document, activity);
            }

            // ================= SIGNATURE =================
            addOptimizedSignature(document, activity);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    private void addPhotoAppendix(Document document, JobActivityResponseDTO activity) {

        if (activity.getPhotos() == null || activity.getPhotos().isEmpty()) return;

        document.add(new AreaBreak(AreaBreakType.NEXT_PAGE));

        document.add(new Paragraph("Appendix A – Activity Photos")
                .setBold()
                .setFontSize(12));

        Table photoTable = new Table(UnitValue.createPercentArray(new float[]{1, 1}))
                .useAllAvailableWidth();

        activity.getPhotos()
                .stream()
                .limit(MAX_PHOTOS_IN_PDF)
                .forEach(photo -> {
                    try {
                        Image img = loadCompressedImage(photo.getPhotoUrl());
                        img.setMaxWidth(200);
                        img.setMaxHeight(150);
                        img.setAutoScale(true);

                        photoTable.addCell(
                                new Cell().add(img).setPadding(5)
                        );
                    } catch (Exception e) {
                        photoTable.addCell(
                                new Cell().add(new Paragraph("Photo unavailable"))
                        );
                    }
                });

        // Fill empty cell if odd count
        if (photoTable.getNumberOfRows() % 2 != 0) {
            photoTable.addCell(new Cell());
        }

        document.add(photoTable);
    }


    private void addJobInfo(
            Document document,
            JobActivityResponseDTO activity,
            NiJobActivity jobActivity,
            String companyName
    ) {

        QuotationJobs job = jobActivity.getJob();
        NewLeads lead = job.getLead();

        LocalDate startDate = job.getStartDate();
        String yearRange = "";
        if (startDate != null) {
            yearRange = "(" + startDate.getYear() + "-" + (startDate.getYear() + 1) + ")";
        }

        String formattedJobRef = companyName + ":" + job.getJobId() + yearRange;

        document.add(new Paragraph("Job Information")
                .setBold()
                .setFontSize(12));

        Table table = new Table(UnitValue.createPercentArray(new float[]{2, 3, 2, 3}))
                .useAllAvailableWidth();

        addHeaderCell(table, "Field");
        addHeaderCell(table, "Value");
        addHeaderCell(table, "Field");
        addHeaderCell(table, "Value");

        addDataRow(table, "Job No", formattedJobRef,
                "Order Date", formatDate(job.getCreatedAt()));

        addDataRow(table, "Customer",
                lead.getCustomerName(),
                "Start Date", formatDate(job.getStartDate()));

        addDataRow(table, "Site Name",
                lead.getSiteName(),
                "Job Type",
                job.getJobType().getEnquiryTypeName());

        addDataRow(table, "Address",
                lead.getSiteAddress(),
                "Status",
                job.getJobStatus());

        addDataRow(table, "Sales Executive",
                job.getSalesExecutive().getEmployeeName(),
                "Service Engineer",
                job.getServiceEngineer().getEmployeeName());

        addDataRow(table, "No. of Lifts",
                String.valueOf(job.getNiQuotation().getLiftDetails().size()),
                "Job Amount",
                job.getJobAmount().toString());

        document.add(table);
        document.add(new Paragraph("\n"));
    }

    private void addActivityInfo(
            Document document,
            JobActivityResponseDTO activity
    ) {

        document.add(new Paragraph("Activity Details")
                .setBold()
                .setFontSize(12));

        Table table = new Table(UnitValue.createPercentArray(new float[]{2, 5}))
                .useAllAvailableWidth();

        addHeaderCell(table, "Field");
        addHeaderCell(table, "Value");

        addDataCell(table, "Activity Date",
                formatDate(activity.getActivityDate()));

        addDataCell(table, "Activity Type",
                activity.getJobActivityTypeName());

        addDataCell(table, "Executed By",
                activity.getJobActivityByName());

        addDataCell(table, "Title",
                activity.getActivityTitle());

        addDataCell(table, "Description",
                activity.getActivityDescription());

        addDataCell(table, "Remark",
                activity.getRemark());

        document.add(table);
    }


//    public byte[] generateActivityPDF(JobActivityResponseDTO activity, NiJobActivity jobActivity, String companyName) {
//        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
//
//            NewLeads lead = jobActivity.getJob().getLead();
//            QuotationJobs job = jobActivity.getJob();
//
//
//            LocalDate startDate = job.getStartDate();
//            String yearRange = "";
//
//            if (startDate != null) {
//                int startYear = startDate.getYear();
//                int nextYear = startYear + 1;
//                yearRange = "(" + startYear + "-" + nextYear + ")";
//            }
//            String formattedJobRef =
//                    companyName + ":" + job.getJobId() + yearRange;
//
//            // PdfWriter writer = new PdfWriter(baos);
//            PdfWriter writer = new PdfWriter(baos,
//                    new WriterProperties().setCompressionLevel(9));
//
//            PdfDocument pdfDoc = new PdfDocument(writer);
//            Document document = new Document(pdfDoc);
//
//            // Header
//            Paragraph header = new Paragraph("NI Job Activity Report")
//                    .setFontSize(16)
//                    .setBold()
//                    .setFontColor(new DeviceRgb(41, 128, 185))
//                    .setTextAlignment(TextAlignment.CENTER);
//            document.add(header);
//
//            // Generated date
//            Paragraph genDate = new Paragraph(String.format("Generated on: %s",
//                    java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss"))))
//                    .setFontSize(10)
//                    .setFontColor(ColorConstants.GRAY)
//                    .setTextAlignment(TextAlignment.CENTER);
//            document.add(genDate);
//
//            document.add(new Paragraph("\n"));
//
//            // Job Information Table
//            document.add(new Paragraph("Job Information")
//                    .setFontSize(12)
//                    .setBold());
//
//            Table jobTable = new Table(UnitValue.createPercentArray(new float[]{1, 1, 1, 1}))
//                    .useAllAvailableWidth();
//
//            // Header row
//            addHeaderCell(jobTable, "Field");
//            addHeaderCell(jobTable, "Value");
//            addHeaderCell(jobTable, "Field");
//            addHeaderCell(jobTable, "Value");
//
//            // Data rows
//            addDataRow(jobTable, "Job No", formattedJobRef, "Order Date",
//                    formatDate(job.getCreatedAt()));
//            addDataRow(jobTable, "Customer", lead.getCustomerName(), "Start Date",
//                    formatDate(job.getCreatedAt()));
//            addDataRow(jobTable, "Site Name", lead.getSiteName(), "Job Type",
//                    job.getJobType().getEnquiryTypeName());
//            addDataRow(jobTable, "Address", lead.getSiteAddress(), "Status",
//                    job.getJobStatus());
//            addDataRow(jobTable, "Sales Exec.", job.getSalesExecutive().getEmployeeName(), "Service Eng.",
//                    job.getServiceEngineer().getEmployeeName());
//            addDataRow(jobTable, "No of Lifts", job.getNiQuotation().getLiftDetails().size()+"", "Job Amount",
//                    job.getJobAmount().toString());
//            addDataRow(jobTable, "Received Amount", "0", "Balance",
//                    String.valueOf((job.getJobAmount().doubleValue() - 0.0)));
//
//            document.add(jobTable);
//            document.add(new Paragraph("\n"));
//
//            // Activity Details Table
//            document.add(new Paragraph("Activity Details")
//                    .setFontSize(12)
//                    .setBold());
//
//            Table activityTable = new Table(UnitValue.createPercentArray(new float[]{1, 2}))
//                    .useAllAvailableWidth();
//
//            addHeaderCell(activityTable, "Field");
//            addHeaderCell(activityTable, "Value");
//
//            addDataCell(activityTable, "Activity Date", formatDate(activity.getActivityDate()));
//            addDataCell(activityTable, "Activity Type", activity.getJobActivityTypeName());
//            addDataCell(activityTable, "Executed By", activity.getJobActivityByName());
//            addDataCell(activityTable, "Title", activity.getActivityTitle());
//            addDataCell(activityTable, "Description", activity.getActivityDescription());
//            addDataCell(activityTable, "Remark", activity.getRemark());
//
//            document.add(activityTable);
//
//            // Photos section - EMBED ACTUAL IMAGES
//            if (activity.getPhotos() != null && !activity.getPhotos().isEmpty()) {
//                document.add(new Paragraph("\n"));
//                document.add(new Paragraph(String.format("Activity Photos (%d)", activity.getPhotos().size()))
//                        .setFontSize(12)
//                        .setBold());
//
//                // Create a table for photos (2 columns)
//                Table photoTable = new Table(UnitValue.createPercentArray(new float[]{1, 1}))
//                        .useAllAvailableWidth();
//
//                for (JobActivityPhotoDTO photo : activity.getPhotos()) {
//                    try {
//                        //Image img = loadImage(photo.getPhotoUrl());
//                        Image img = loadCompressedImage(photo.getPhotoUrl());
//                        if (img != null) {
//                            img.setMaxWidth(150);
//                            img.setMaxHeight(100);
//                            img.setAutoScale(true);
//                            photoTable.addCell(new Cell().add(img).setPadding(5));
//                        }
//                    } catch (Exception e) {
//                        log.warn("Failed to load photo: {}", photo.getPhotoUrl(), e);
//                        photoTable.addCell(new Cell().add(new Paragraph("Photo unavailable")).setPadding(5));
//                    }
//                }
//
//                // If odd number of photos, add empty cell
//                if (activity.getPhotos().size() % 2 != 0) {
//                    photoTable.addCell(new Cell().add(new Paragraph("")));
//                }
//
//                document.add(photoTable);
//            }
//
//            // Signature section - EMBED ACTUAL SIGNATURE IMAGE
//            if (activity.getSignatureUrl() != null && !activity.getSignatureUrl().isEmpty()) {
//                document.add(new Paragraph("\n"));
//                document.add(new Paragraph("Signature")
//                        .setFontSize(12)
//                        .setBold());
//                document.add(new Paragraph(String.format("Signed By: %s",
//                        activity.getSignaturePersonName() != null ? activity.getSignaturePersonName() :
//                                activity.getJobActivityByName()))
//                        .setFontSize(10));
//
//                try {
//                    Image signatureImg = loadImage(activity.getSignatureUrl());
//                    if (signatureImg != null) {
//                        signatureImg.setMaxWidth(300);
//                        signatureImg.setMaxHeight(100);
//                        document.add(signatureImg);
//                    }
//                } catch (Exception e) {
//                    log.warn("Failed to load signature: {}", activity.getSignatureUrl(), e);
//                    document.add(new Paragraph("Signature image unavailable")
//                            .setFontSize(10)
//                            .setItalic());
//                }
//            }
//
//            document.close();
//            pdfDoc.setCloseWriter(true);
//            return baos.toByteArray();
//
//        } catch (Exception e) {
//            log.error("Failed to generate PDF for activity: {}", activity.getJobActivityId(), e);
//            throw new RuntimeException("Failed to generate PDF", e);
//        }
//    }

    private void addHeaderCell(Table table, String text) {
        table.addCell(new Cell().add(new Paragraph(text))
                .setBackgroundColor(new DeviceRgb(41, 128, 185))
                .setFontColor(ColorConstants.WHITE)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER));
    }

    private void addDataRow(Table table, String label1, String value1, String label2, String value2) {
        table.addCell(new Cell().add(new Paragraph(label1)).setBold());
        table.addCell(new Cell().add(new Paragraph(value1 != null ? value1 : "-")));
        table.addCell(new Cell().add(new Paragraph(label2)).setBold());
        table.addCell(new Cell().add(new Paragraph(value2 != null ? value2 : "-")));
    }

    private void addDataCell(Table table, String label, String value) {
        table.addCell(new Cell().add(new Paragraph(label)).setBold());
        table.addCell(new Cell().add(new Paragraph(value != null ? value : "-")));
    }

    private String formatDate(Object date) {
        if (date == null) return "-";
        if (date instanceof java.time.LocalDate) {
            return ((java.time.LocalDate) date).format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
        }
        if (date instanceof java.time.LocalDateTime) {
            return ((java.time.LocalDateTime) date).format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
        }
        return date.toString();
    }

    /**
     * Load image from URL, file path, or base64 data URL
     */
    private Image loadImage(String imageUrl) {
        try {
            // Check if it's a data URL (base64)
            if (imageUrl.startsWith("data:image")) {
                String base64Data = imageUrl.substring(imageUrl.indexOf(",") + 1);
                byte[] imageBytes = Base64.getDecoder().decode(base64Data);
                ImageData imageData = ImageDataFactory.create(imageBytes);
                return new Image(imageData);
            }

            // Check if it's a file path
            if (!imageUrl.startsWith("http")) {
                Path imagePath = Paths.get(uploadBasePath, imageUrl);
                if (Files.exists(imagePath)) {
                    ImageData imageData = ImageDataFactory.create(imagePath.toString());
                    return new Image(imageData);
                }
            }

            // Try as URL
            ImageData imageData = ImageDataFactory.create(new URL(imageUrl));
            return new Image(imageData);

        } catch (Exception e) {
            log.error("Failed to load image from: {}", imageUrl, e);
            return null;
        }
    }
}
