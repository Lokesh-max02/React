package com.mangalaarangam.controller;

import com.mangalaarangam.dto.hall.AvailabilityRequest;
import com.mangalaarangam.dto.hall.AvailabilityResponse;
import com.mangalaarangam.security.UserPrincipal;
import com.mangalaarangam.service.AvailabilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    @GetMapping("/api/halls/{hallId}/availability")
    public ResponseEntity<List<AvailabilityResponse>> get(
            @PathVariable Long hallId,
            @RequestParam @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        return ResponseEntity.ok(availabilityService.getAvailability(hallId, start, end));
    }

    @PostMapping("/api/halls/{hallId}/availability")
    public ResponseEntity<AvailabilityResponse> set(
            @PathVariable Long hallId,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody AvailabilityRequest request
    ) {
        return ResponseEntity.ok(availabilityService.setOwnerManagedStatus(hallId, principal.getUser(), request));
    }

    @PutMapping("/api/halls/{hallId}/availability")
    public ResponseEntity<AvailabilityResponse> update(
            @PathVariable Long hallId,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody AvailabilityRequest request
    ) {
        return ResponseEntity.ok(availabilityService.setOwnerManagedStatus(hallId, principal.getUser(), request));
    }
}
