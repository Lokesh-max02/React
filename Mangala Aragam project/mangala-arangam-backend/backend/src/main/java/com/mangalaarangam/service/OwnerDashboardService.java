package com.mangalaarangam.service;

import com.mangalaarangam.entity.BookingStatus;
import com.mangalaarangam.entity.User;
import com.mangalaarangam.repository.BookingRepository;
import com.mangalaarangam.repository.WeddingHallRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class OwnerDashboardService {

    private final WeddingHallRepository hallRepository;
    private final BookingRepository bookingRepository;

    @Data
    @Builder
    public static class OwnerStats {
        private long totalHalls;
        private long pendingRequests;
        private long confirmedBookings;
        private long upcomingEvents;
        private BigDecimal totalRevenue;
    }

    public OwnerStats getStats(User owner) {
        return OwnerStats.builder()
                .totalHalls(hallRepository.countByOwner(owner))
                .pendingRequests(bookingRepository.countByHallOwnerAndStatus(owner, BookingStatus.PENDING))
                .confirmedBookings(bookingRepository.countByHallOwnerAndStatus(owner, BookingStatus.CONFIRMED))
                .upcomingEvents(bookingRepository.findByHallOwnerAndStatusOrderByCreatedAtDesc(owner, BookingStatus.CONFIRMED).size())
                .totalRevenue(bookingRepository.sumConfirmedRevenueForOwner(owner))
                .build();
    }
}
