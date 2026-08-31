package com.mangalaarangam.controller;

import com.mangalaarangam.dto.review.ReviewRequest;
import com.mangalaarangam.dto.review.ReviewResponse;
import com.mangalaarangam.security.UserPrincipal;
import com.mangalaarangam.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/api/reviews")
    public ResponseEntity<ReviewResponse> create(@AuthenticationPrincipal UserPrincipal principal,
                                                  @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.create(principal.getUser(), request));
    }

    @GetMapping("/api/halls/{id}/reviews")
    public ResponseEntity<List<ReviewResponse>> getForHall(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getForHall(id));
    }

    @GetMapping("/api/owner/reviews")
    public ResponseEntity<List<ReviewResponse>> getForOwner(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(reviewService.getForOwner(principal.getUser()));
    }
}
