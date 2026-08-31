package com.mangalaarangam.controller;

import com.mangalaarangam.dto.upload.UploadResponse;
import com.mangalaarangam.service.UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/uploads")
@RequiredArgsConstructor
public class UploadController {

    private final UploadService uploadService;

    // Single main hall image.
    @PostMapping(value = "/hall-image", consumes = "multipart/form-data")
    public ResponseEntity<UploadResponse> uploadHallImage(@RequestParam("file") MultipartFile file) {
        String url = uploadService.storeHallImage(file);
        return ResponseEntity.ok(new UploadResponse(url));
    }

    // Multiple gallery images in one request.
    @PostMapping(value = "/hall-gallery", consumes = "multipart/form-data")
    public ResponseEntity<List<String>> uploadHallGallery(@RequestParam("files") List<MultipartFile> files) {
        return ResponseEntity.ok(uploadService.storeHallImages(files));
    }
}
