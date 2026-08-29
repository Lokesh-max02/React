package com.mangalaarangam.controller;

import com.mangalaarangam.dto.booking.BookingRequest;
import com.mangalaarangam.dto.booking.BookingResponse;
import com.mangalaarangam.security.UserPrincipal;
import com.mangalaarangam.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/api/bookings")
    public ResponseEntity<BookingResponse> create(@AuthenticationPrincipal UserPrincipal principal,
                                                   @Valid @RequestBody BookingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(principal.getUser(), request));
    }

    @GetMapping("/api/bookings/my")
    public ResponseEntity<List<BookingResponse>> myBookings(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(bookingService.getMyBookings(principal.getUser()));
    }

    @GetMapping("/api/owner/bookings")
    public ResponseEntity<List<BookingResponse>> ownerBookings(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(bookingService.getOwnerBookings(principal.getUser()));
    }

    @PutMapping("/api/bookings/{id}/approve")
    public ResponseEntity<BookingResponse> approve(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(bookingService.approveBooking(id, principal.getUser()));
    }

    @PutMapping("/api/bookings/{id}/reject")
    public ResponseEntity<BookingResponse> reject(@PathVariable Long id,
                                                   @AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.get("reason") : null;
        return ResponseEntity.ok(bookingService.rejectBooking(id, principal.getUser(), reason));
    }

    @PutMapping("/api/bookings/{id}/cancel")
    public ResponseEntity<BookingResponse> cancel(@PathVariable Long id,
                                                   @AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.get("reason") : null;
        return ResponseEntity.ok(bookingService.cancelBooking(id, principal.getUser(), reason));
    }
}
