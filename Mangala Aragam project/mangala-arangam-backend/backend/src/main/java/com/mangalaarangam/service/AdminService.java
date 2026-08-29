package com.mangalaarangam.service;

import com.mangalaarangam.dto.booking.BookingResponse;
import com.mangalaarangam.dto.common.UserSummary;
import com.mangalaarangam.dto.hall.HallResponse;
import com.mangalaarangam.entity.*;
import com.mangalaarangam.exception.ResourceNotFoundException;
import com.mangalaarangam.repository.*;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final WeddingHallRepository hallRepository;
    private final BookingRepository bookingRepository;
    private final ComplaintRepository complaintRepository;
    private final NotificationService notificationService;

    public List<UserSummary> getCustomers() {
        return userRepository.findByRole(Role.ROLE_CUSTOMER).stream()
                .map(UserSummary::from).collect(Collectors.toList());
    }

    public List<UserSummary> getOwners() {
        return userRepository.findByRole(Role.ROLE_OWNER).stream()
                .map(UserSummary::from).collect(Collectors.toList());
    }

    @Transactional
    public UserSummary setUserActive(Long userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        user.setActive(active);
        return UserSummary.from(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public List<HallResponse> getAllHalls() {
        return hallRepository.findAll().stream().map(HallResponse::from).collect(Collectors.toList());
    }

    @Transactional
    public HallResponse approveHall(Long hallId) {
        WeddingHall hall = hallRepository.findById(hallId)
                .orElseThrow(() -> new ResourceNotFoundException("Wedding hall not found."));
        hall.setApprovalStatus(ApprovalStatus.APPROVED);
        hall = hallRepository.save(hall);
        notificationService.notify(hall.getOwner(), "Your hall \"" + hall.getName() + "\" has been approved and is now live.");
        return HallResponse.from(hall);
    }

    @Transactional
    public HallResponse rejectHall(Long hallId) {
        WeddingHall hall = hallRepository.findById(hallId)
                .orElseThrow(() -> new ResourceNotFoundException("Wedding hall not found."));
        hall.setApprovalStatus(ApprovalStatus.REJECTED);
        hall = hallRepository.save(hall);
        notificationService.notify(hall.getOwner(), "Your hall \"" + hall.getName() + "\" was not approved. Please review and resubmit.");
        return HallResponse.from(hall);
    }

    @Transactional
    public void deleteHall(Long hallId) {
        WeddingHall hall = hallRepository.findById(hallId)
                .orElseThrow(() -> new ResourceNotFoundException("Wedding hall not found."));
        hallRepository.delete(hall);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream().map(BookingResponse::from).collect(Collectors.toList());
    }

    @Data
    @Builder
    public static class DashboardStats {
        private long totalCustomers;
        private long totalOwners;
        private long totalHalls;
        private long pendingHallApprovals;
        private long totalBookings;
        private long confirmedBookings;
        private long openComplaints;
        private BigDecimal totalRevenue;
    }

    public DashboardStats getDashboardStats() {
        BigDecimal totalRevenue = bookingRepository.findAll().stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED || b.getStatus() == BookingStatus.COMPLETED)
                .map(Booking::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return DashboardStats.builder()
                .totalCustomers(userRepository.countByRole(Role.ROLE_CUSTOMER))
                .totalOwners(userRepository.countByRole(Role.ROLE_OWNER))
                .totalHalls(hallRepository.count())
                .pendingHallApprovals(hallRepository.countByApprovalStatus(ApprovalStatus.PENDING))
                .totalBookings(bookingRepository.count())
                .confirmedBookings(bookingRepository.countByStatus(BookingStatus.CONFIRMED))
                .openComplaints(complaintRepository.countByStatus(ComplaintStatus.OPEN))
                .totalRevenue(totalRevenue)
                .build();
    }
}
