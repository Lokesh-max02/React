package com.mangalaarangam.service;

import com.mangalaarangam.dto.payment.PaymentRequest;
import com.mangalaarangam.dto.payment.PaymentResponse;
import com.mangalaarangam.entity.*;
import com.mangalaarangam.exception.BadRequestException;
import com.mangalaarangam.exception.ForbiddenException;
import com.mangalaarangam.exception.ResourceNotFoundException;
import com.mangalaarangam.repository.BookingRepository;
import com.mangalaarangam.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;

    /**
     * Step 9-10: customer pays for a CONFIRMED booking. In a real deployment this
     * would integrate a gateway (Razorpay/Stripe); here it simulates a successful
     * charge and marks the payment PAID immediately.
     */
    @Transactional
    public PaymentResponse pay(User customer, PaymentRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found."));

        if (!booking.getCustomer().getId().equals(customer.getId())) {
            throw new ForbiddenException("This booking does not belong to you.");
        }
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new BadRequestException("Payment can only be made for a confirmed booking.");
        }

        Payment payment = paymentRepository.findByBooking(booking)
                .orElseGet(() -> Payment.builder().booking(booking).amount(booking.getTotalAmount()).build());

        if (payment.getStatus() == PaymentStatus.PAID) {
            throw new BadRequestException("This booking has already been paid for.");
        }

        payment.setMethod(request.getMethod());
        payment.setStatus(PaymentStatus.PAID);
        payment.setTransactionReference("TXN-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase());
        payment.setPaidAt(LocalDateTime.now());

        payment = paymentRepository.save(payment);

        notificationService.notify(customer,
                "Payment of \u20B9" + booking.getTotalAmount() + " for " + booking.getHall().getName() + " was successful.");
        notificationService.notify(booking.getHall().getOwner(),
                "Payment received for booking #" + booking.getId() + " (" + booking.getHall().getName() + ").");

        return PaymentResponse.from(payment);
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getForCustomer(User customer) {
        return paymentRepository.findByBooking_Customer(customer).stream()
                .map(PaymentResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getForOwner(User owner) {
        return paymentRepository.findByBooking_Hall_Owner(owner).stream()
                .map(PaymentResponse::from)
                .collect(Collectors.toList());
    }
}
