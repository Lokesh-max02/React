package com.mangalaarangam.dto.payment;

import com.mangalaarangam.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentRequest {
    @NotNull
    private Long bookingId;

    @NotNull
    private PaymentMethod method;
}
