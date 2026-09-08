package com.mangalaarangam.controller;

import com.mangalaarangam.dto.complaint.ComplaintRequest;
import com.mangalaarangam.dto.complaint.ComplaintResponse;
import com.mangalaarangam.security.UserPrincipal;
import com.mangalaarangam.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<ComplaintResponse> create(@AuthenticationPrincipal UserPrincipal principal,
                                                      @Valid @RequestBody ComplaintRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(complaintService.create(principal.getUser(), request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ComplaintResponse>> mine(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(complaintService.getForCustomer(principal.getUser()));
    }
}
