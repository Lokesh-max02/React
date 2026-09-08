package com.mangalaarangam.service;

import com.mangalaarangam.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
public class UploadService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif"
    );

    @Value("${app.uploads.directory}")
    private String uploadsDirectory;

    @Value("${app.uploads.public-base-url}")
    private String publicBaseUrl;

    public String storeHallImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("No file was uploaded.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Only JPG, PNG, WEBP, or GIF images are allowed.");
        }

        try {
            Path uploadPath = Paths.get(uploadsDirectory).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            String extension = extractExtension(file.getOriginalFilename(), contentType);
            String filename = UUID.randomUUID() + extension;

            Path target = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            return publicBaseUrl + "/" + filename;
        } catch (IOException e) {
            log.error("Failed to store uploaded file", e);
            throw new BadRequestException("Could not save the uploaded file. Please try again.");
        }
    }

    public List<String> storeHallImages(List<MultipartFile> files) {
        return files.stream().map(this::storeHallImage).toList();
    }

    private String extractExtension(String originalFilename, String contentType) {
        if (originalFilename != null && originalFilename.contains(".")) {
            return originalFilename.substring(originalFilename.lastIndexOf('.')).toLowerCase();
        }
        // Fall back to inferring from content type if the original filename has no extension.
        return switch (contentType.toLowerCase()) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            default -> ".jpg";
        };
    }
}
