package com.mangalaarangam.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class RazorpayOrderResponse {
    private Long paymentId;
    private String razorpayOrderId;
    private long amountInPaise;
    private String currency;
    private String keyId;
    private Long bookingId;
    private String hallName;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
}
