package com.mangalaarangam.dto.payment;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateRazorpayOrderRequest {
    @NotNull
    private Long bookingId;
}
