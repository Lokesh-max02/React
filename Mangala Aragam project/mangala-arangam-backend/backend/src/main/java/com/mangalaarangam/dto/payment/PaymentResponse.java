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

    public static PaymentResponse from(Payment p) {
        return PaymentResponse.builder()
                .id(p.getId())
                .bookingId(p.getBooking().getId())
                .hallName(p.getBooking().getHall().getName())
                .customerName(p.getBooking().getCustomer().getFullName())
                .amount(p.getAmount())
                .method(p.getMethod())
                .status(p.getStatus())
                .paidAt(p.getPaidAt())
                .build();
    }
}
