package com.mangalaarangam.controller;

import com.mangalaarangam.dto.booking.BookingResponse;
import com.mangalaarangam.dto.common.UserSummary;
import com.mangalaarangam.dto.complaint.ComplaintResponse;
import com.mangalaarangam.dto.hall.HallResponse;
import com.mangalaarangam.entity.ComplaintStatus;
import com.mangalaarangam.service.AdminService;
import com.mangalaarangam.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final ComplaintService complaintService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminService.DashboardStats> dashboard() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserSummary>> customers() {
        return ResponseEntity.ok(adminService.getCustomers());
    }

    @GetMapping("/owners")
    public ResponseEntity<List<UserSummary>> owners() {
        return ResponseEntity.ok(adminService.getOwners());
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<UserSummary> setUserStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        return ResponseEntity.ok(adminService.setUserActive(id, Boolean.TRUE.equals(body.get("active"))));
    }

    @GetMapping("/halls")
    public ResponseEntity<List<HallResponse>> halls() {
        return ResponseEntity.ok(adminService.getAllHalls());
    }

    @PutMapping("/halls/{id}/approve")
    public ResponseEntity<HallResponse> approveHall(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.approveHall(id));
    }

    @PutMapping("/halls/{id}/reject")
    public ResponseEntity<HallResponse> rejectHall(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.rejectHall(id));
    }

    @DeleteMapping("/halls/{id}")
    public ResponseEntity<Void> deleteHall(@PathVariable Long id) {
        adminService.deleteHall(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> bookings() {
        return ResponseEntity.ok(adminService.getAllBookings());
    }

    @GetMapping("/complaints")
    public ResponseEntity<List<ComplaintResponse>> complaints() {
        return ResponseEntity.ok(complaintService.getAll());
    }

    @PutMapping("/complaints/{id}")
    public ResponseEntity<ComplaintResponse> updateComplaint(@PathVariable Long id, @RequestBody Map<String, String> body) {
        ComplaintStatus status = ComplaintStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(complaintService.updateStatus(id, status, body.get("resolutionNotes")));
    }
}
