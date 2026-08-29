package com.mangalaarangam.service;

import com.mangalaarangam.dto.hall.AvailabilityRequest;
import com.mangalaarangam.dto.hall.AvailabilityResponse;
import com.mangalaarangam.entity.*;
import com.mangalaarangam.exception.BadRequestException;
import com.mangalaarangam.exception.ForbiddenException;
import com.mangalaarangam.exception.ResourceNotFoundException;
import com.mangalaarangam.repository.HallAvailabilityRepository;
import com.mangalaarangam.repository.WeddingHallRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AvailabilityService {

    private final HallAvailabilityRepository availabilityRepository;
    private final WeddingHallRepository hallRepository;

    @Transactional(readOnly = true)
    public List<AvailabilityResponse> getAvailability(Long hallId, LocalDate start, LocalDate end) {
        WeddingHall hall = getHallOrThrow(hallId);
        return availabilityRepository.findByHallAndDateBetween(hall, start, end).stream()
                .map(AvailabilityResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * Returns the effective status for a date: an explicit record if one exists,
     * otherwise AVAILABLE by default (a hall is assumed open unless the owner
     * has blocked or booked that date).
     */
    @Transactional(readOnly = true)
    public AvailabilityStatus getEffectiveStatus(WeddingHall hall, LocalDate date) {
        return availabilityRepository.findByHallAndDate(hall, date)
                .map(HallAvailability::getStatus)
                .orElse(AvailabilityStatus.AVAILABLE);
    }

    /**
     * Owner manually sets a date's status (e.g. block a date, mark maintenance,
     * or reopen a date). Owners cannot directly set BOOKED / BOOKING_PENDING —
     * those transitions are driven by the booking workflow only, to prevent the
     * calendar and booking records from drifting out of sync.
     */
    @Transactional
    public AvailabilityResponse setOwnerManagedStatus(Long hallId, User owner, AvailabilityRequest request) {
        WeddingHall hall = getHallOrThrow(hallId);
        assertOwnsHall(hall, owner);

        if (request.getStatus() == AvailabilityStatus.BOOKED || request.getStatus() == AvailabilityStatus.BOOKING_PENDING) {
            throw new BadRequestException(
                    "BOOKED and BOOKING_PENDING are set automatically by the booking workflow and cannot be set directly."
            );
        }

        HallAvailability record = availabilityRepository.findByHallAndDate(hall, request.getDate())
                .orElseGet(() -> HallAvailability.builder().hall(hall).date(request.getDate()).build());

        record.setStatus(request.getStatus());
        record.setBookingId(null);

        return AvailabilityResponse.from(availabilityRepository.save(record));
    }

    /**
     * Used internally by BookingService to drive status transitions tied to
     * the booking lifecycle (BOOKING_PENDING -> BOOKED / AVAILABLE).
     */
    @Transactional
    void setSystemStatus(WeddingHall hall, LocalDate date, AvailabilityStatus status, Long bookingId) {
        HallAvailability record = availabilityRepository.findByHallAndDate(hall, date)
                .orElseGet(() -> HallAvailability.builder().hall(hall).date(date).build());
        record.setStatus(status);
        record.setBookingId(bookingId);
        availabilityRepository.save(record);
    }

    // package-private helper exposed to BookingService via the same package boundary pattern
    HallAvailabilityRepository repository() {
        return availabilityRepository;
    }

    private WeddingHall getHallOrThrow(Long hallId) {
        return hallRepository.findById(hallId)
                .orElseThrow(() -> new ResourceNotFoundException("Wedding hall not found."));
    }

    private void assertOwnsHall(WeddingHall hall, User owner) {
        if (!hall.getOwner().getId().equals(owner.getId())) {
            throw new ForbiddenException("You do not own this wedding hall.");
        }
    }
}
