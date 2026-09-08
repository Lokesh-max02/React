package com.mangalaarangam.service;

import com.mangalaarangam.dto.booking.BookingRequest;
import com.mangalaarangam.dto.booking.BookingResponse;
import com.mangalaarangam.entity.*;
import com.mangalaarangam.exception.BadRequestException;
import com.mangalaarangam.exception.ForbiddenException;
import com.mangalaarangam.exception.ResourceNotFoundException;
import com.mangalaarangam.repository.BookingRepository;
import com.mangalaarangam.repository.WeddingHallRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final WeddingHallRepository hallRepository;
    private final AvailabilityService availabilityService;
    private final NotificationService notificationService;

    /**
     * Step 1-4 of the booking logic: validate the hall is APPROVED and the
     * requested date is AVAILABLE, then create a PENDING booking and flip the
     * date to BOOKING_PENDING so no other customer can request the same date
     * while the owner is deciding.
     */
    @Transactional
    public BookingResponse createBooking(User customer, BookingRequest request) {
        WeddingHall hall = hallRepository.findById(request.getHallId())
                .orElseThrow(() -> new ResourceNotFoundException("Wedding hall not found."));

        if (hall.getApprovalStatus() != ApprovalStatus.APPROVED || !hall.isActive()) {
            throw new BadRequestException("This wedding hall is not currently available for booking.");
        }

        AvailabilityStatus current = availabilityService.getEffectiveStatus(hall, request.getEventDate());
        if (current != AvailabilityStatus.AVAILABLE) {
            throw new BadRequestException(
                    "This hall is not available on " + request.getEventDate() + ". Please choose another date."
            );
        }

        BigDecimal additionalCharges = request.getGuests() > hall.getGuestCapacity()
                ? BigDecimal.valueOf(15000)
                : BigDecimal.ZERO;
        BigDecimal total = hall.getPrice().add(additionalCharges);

        Booking booking = Booking.builder()
                .hall(hall)
                .customer(customer)
                .eventDate(request.getEventDate())
                .eventType(request.getEventType())
                .guests(request.getGuests())
                .contactName(request.getContactName())
                .contactPhone(request.getContactPhone())
                .contactEmail(request.getContactEmail())
                .additionalRequirements(request.getAdditionalRequirements())
                .hallPrice(hall.getPrice())
                .additionalCharges(additionalCharges)
                .totalAmount(total)
                .status(BookingStatus.PENDING)
                .build();

        booking = bookingRepository.save(booking);

        // Step 4: date becomes BOOKING_PENDING so it can't be double-requested.
        availabilityService.setSystemStatus(hall, request.getEventDate(), AvailabilityStatus.BOOKING_PENDING, booking.getId());

        // Step 5: owner receives a notification.
        notificationService.notify(hall.getOwner(),
                "New booking request from " + customer.getFullName() + " for " + hall.getName() + " on " + request.getEventDate() + ".");

        return BookingResponse.from(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(User customer) {
        return bookingRepository.findByCustomerOrderByCreatedAtDesc(customer).stream()
                .map(BookingResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getOwnerBookings(User owner) {
        return bookingRepository.findByHallOwnerOrderByCreatedAtDesc(owner).stream()
                .map(BookingResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * Step 6-8: owner accepts -> booking becomes CONFIRMED, hall date becomes BOOKED.
     */
    @Transactional
    public BookingResponse approveBooking(Long bookingId, User owner) {
        Booking booking = getOwnedBookingOrThrow(bookingId, owner);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only pending bookings can be approved.");
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        availabilityService.setSystemStatus(booking.getHall(), booking.getEventDate(), AvailabilityStatus.BOOKED, booking.getId());

        notificationService.notify(booking.getCustomer(),
                "Your booking for " + booking.getHall().getName() + " on " + booking.getEventDate() + " has been approved. You can now make payment.");

        return BookingResponse.from(booking);
    }

    /**
     * Step 12: owner rejects -> booking REJECTED, date becomes AVAILABLE again.
     */
    @Transactional
    public BookingResponse rejectBooking(Long bookingId, User owner, String reason) {
        Booking booking = getOwnedBookingOrThrow(bookingId, owner);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only pending bookings can be rejected.");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setCancellationReason(reason);
        bookingRepository.save(booking);

        availabilityService.setSystemStatus(booking.getHall(), booking.getEventDate(), AvailabilityStatus.AVAILABLE, null);

        notificationService.notify(booking.getCustomer(),
                "Your booking request for " + booking.getHall().getName() + " on " + booking.getEventDate() + " was declined by the owner.");

        return BookingResponse.from(booking);
    }

    /**
     * Customer (or admin) cancels a pending/confirmed booking. Frees the date back to AVAILABLE.
     */
    @Transactional
    public BookingResponse cancelBooking(Long bookingId, User requester, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found."));

        boolean isOwnerOfBooking = booking.getCustomer().getId().equals(requester.getId());
        boolean isAdmin = requester.getRole() == Role.ROLE_ADMIN;
        if (!isOwnerOfBooking && !isAdmin) {
            throw new ForbiddenException("You cannot cancel this booking.");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED || booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BadRequestException("This booking can no longer be cancelled.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancellationReason(reason);
        bookingRepository.save(booking);

        availabilityService.setSystemStatus(booking.getHall(), booking.getEventDate(), AvailabilityStatus.AVAILABLE, null);

        notificationService.notify(booking.getHall().getOwner(),
                "Booking for " + booking.getHall().getName() + " on " + booking.getEventDate() + " was cancelled.");

        return BookingResponse.from(booking);
    }

    private Booking getOwnedBookingOrThrow(Long bookingId, User owner) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found."));
        if (!booking.getHall().getOwner().getId().equals(owner.getId())) {
            throw new ForbiddenException("This booking does not belong to one of your halls.");
        }
        return booking;
    }
}
