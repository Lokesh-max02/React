package com.mangalaarangam.dto.otp;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OtpMessageResponse {
    private String message;
    private boolean verified;
}
