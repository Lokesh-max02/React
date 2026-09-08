package com.mangalaarangam.dto.payment;

import com.mangalaarangam.entity.Payment;
import com.mangalaarangam.entity.PaymentMethod;
import com.mangalaarangam.entity.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentResponse {
    private Long id;
    private Long bookingId;
    private String hallName;
    private String customerName;
    private BigDecimal amount;
    private PaymentMethod method;
    private PaymentStatus status;
    private LocalDateTime paidAt;
    private String otp;
    private LocalDateTime otpExpiresAt;

    public static PaymentResponse from(Payment p) {
        boolean awaitingConfirmation = p.getStatus() == PaymentStatus.AWAITING_OWNER_CONFIRMATION;
        return PaymentResponse.builder()
                .id(p.getId())
                .bookingId(p.getBooking().getId())
                .hallName(p.getBooking().getHall().getName())
                .customerName(p.getBooking().getCustomer().getFullName())
                .amount(p.getAmount())
                .method(p.getMethod())
                .status(p.getStatus())
                .paidAt(p.getPaidAt())
                .otp(awaitingConfirmation ? p.getOtpCode() : null)
                .otpExpiresAt(awaitingConfirmation ? p.getOtpExpiresAt() : null)
                .build();
    }
}
