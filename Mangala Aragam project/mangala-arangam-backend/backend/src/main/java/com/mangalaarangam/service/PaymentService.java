package com.mangalaarangam.service;

import com.mangalaarangam.dto.payment.OtpConfirmRequest;
import com.mangalaarangam.dto.payment.PaymentRequest;
import com.mangalaarangam.dto.payment.PaymentResponse;
import com.mangalaarangam.dto.payment.RazorpayOrderResponse;
import com.mangalaarangam.dto.payment.RazorpayVerifyRequest;
import com.mangalaarangam.dto.payment.RazorpayVerifyResponse;
import com.mangalaarangam.entity.*;
import com.mangalaarangam.exception.BadRequestException;
import com.mangalaarangam.exception.ForbiddenException;
import com.mangalaarangam.exception.ResourceNotFoundException;
import com.mangalaarangam.repository.BookingRepository;
import com.mangalaarangam.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
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
    private final RazorpayService razorpayService;

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final int OTP_VALIDITY_MINUTES = 15;

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

    /**
     * Step 9a: customer initiates a real online payment (UPI/GPay/cards via
     * Razorpay Checkout) for a CONFIRMED booking. Creates a Razorpay order and
     * a local PENDING payment record tied to it.
     */
    @Transactional
    public RazorpayOrderResponse createRazorpayOrder(User customer, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
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
        if (payment.getStatus() == PaymentStatus.AWAITING_OWNER_CONFIRMATION) {
            throw new BadRequestException(
                    "A payment for this booking is awaiting the hall owner's OTP confirmation. " +
                    "Show them the code you already received."
            );
        }

        String razorpayOrderId = razorpayService.createOrder(booking.getTotalAmount(), "booking-" + booking.getId());
        payment.setRazorpayOrderId(razorpayOrderId);
        payment.setStatus(PaymentStatus.PENDING);
        payment = paymentRepository.save(payment);

        return RazorpayOrderResponse.builder()
                .paymentId(payment.getId())
                .razorpayOrderId(razorpayOrderId)
                .amountInPaise(razorpayService.amountToPaise(booking.getTotalAmount()))
                .currency("INR")
                .keyId(razorpayService.getKeyId())
                .bookingId(booking.getId())
                .hallName(booking.getHall().getName())
                .customerName(customer.getFullName())
                .customerEmail(customer.getEmail())
                .customerPhone(customer.getPhone())
                .build();
    }

    /**
     * Step 9b: after Razorpay Checkout succeeds client-side, verify the
     * signature server-side (never trust the client alone), then generate a
     * one-time code the customer shows the hall owner in person as a
     * receipt-confirmation step — mirroring how ride-hailing apps confirm
     * trip completion via a rider-shown OTP.
     */
    @Transactional
    public RazorpayVerifyResponse verifyRazorpayPayment(User customer, RazorpayVerifyRequest request) {
        Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for this order."));

        if (!payment.getBooking().getCustomer().getId().equals(customer.getId())) {
            throw new ForbiddenException("This payment does not belong to you.");
        }

        boolean valid = razorpayService.verifySignature(
                request.getRazorpayOrderId(), request.getRazorpayPaymentId(), request.getRazorpaySignature()
        );
        if (!valid) {
            throw new BadRequestException("Payment verification failed. Please contact support before retrying.");
        }

        String otp = String.format("%06d", RANDOM.nextInt(1_000_000));

        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setOtpCode(otp);
        payment.setOtpExpiresAt(LocalDateTime.now().plusMinutes(OTP_VALIDITY_MINUTES));
        payment.setStatus(PaymentStatus.AWAITING_OWNER_CONFIRMATION);
        payment = paymentRepository.save(payment);

        Booking booking = payment.getBooking();
        notificationService.notify(booking.getHall().getOwner(),
                "Payment received for booking #" + booking.getId() + " (" + booking.getHall().getName() +
                "). Ask the customer for their confirmation code to finalize it.");

        return RazorpayVerifyResponse.builder()
                .payment(PaymentResponse.from(payment))
                .otp(otp)
                .otpValidityMinutes(OTP_VALIDITY_MINUTES)
                .build();
    }

    /**
     * Step 9c: the hall owner enters the code the customer showed them,
     * finalizing the payment. This is the human trust layer on top of the
     * gateway's own (already-verified) confirmation.
     */
    @Transactional
    public PaymentResponse confirmPaymentOtp(User owner, Long paymentId, OtpConfirmRequest request) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found."));

        if (!payment.getBooking().getHall().getOwner().getId().equals(owner.getId())) {
            throw new ForbiddenException("This payment is not for one of your halls.");
        }
        if (payment.getStatus() != PaymentStatus.AWAITING_OWNER_CONFIRMATION) {
            throw new BadRequestException("This payment is not awaiting OTP confirmation.");
        }
        if (payment.getOtpExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("This code has expired. Ask the customer to contact support.");
        }
        if (!payment.getOtpCode().equals(request.getOtp())) {
            throw new BadRequestException("Incorrect code.");
        }

        payment.setStatus(PaymentStatus.PAID);
        payment.setPaidAt(LocalDateTime.now());
        payment.setOtpCode(null);
        payment.setOtpExpiresAt(null);
        payment = paymentRepository.save(payment);

        notificationService.notify(payment.getBooking().getCustomer(),
                "Your payment for " + payment.getBooking().getHall().getName() + " has been confirmed by the hall owner.");

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
