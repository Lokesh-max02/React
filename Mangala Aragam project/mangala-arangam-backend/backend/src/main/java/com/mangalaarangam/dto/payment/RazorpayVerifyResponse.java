package com.mangalaarangam.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class RazorpayVerifyResponse {
    private PaymentResponse payment;
    private String otp;
    private int otpValidityMinutes;
}
