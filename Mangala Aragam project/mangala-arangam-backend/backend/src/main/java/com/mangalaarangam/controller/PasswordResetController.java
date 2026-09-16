package com.mangalaarangam.controller;

import com.mangalaarangam.dto.otp.ForgotPasswordRequest;
import com.mangalaarangam.dto.otp.OtpMessageResponse;
import com.mangalaarangam.dto.otp.ResetPasswordRequest;
import com.mangalaarangam.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/password-reset")
@RequiredArgsConstructor
public class PasswordResetController {

    private final OtpService otpService;

    @PostMapping("/send-otp")
    public ResponseEntity<OtpMessageResponse> sendOtp(@Valid @RequestBody ForgotPasswordRequest request) {
        otpService.sendPasswordResetOtp(request.getEmail());
        return ResponseEntity.ok(new OtpMessageResponse("A reset code was sent to " + request.getEmail() + ".", false));
    }

    @PostMapping("/reset")
    public ResponseEntity<OtpMessageResponse> reset(@Valid @RequestBody ResetPasswordRequest request) {
        otpService.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword());
        return ResponseEntity.ok(new OtpMessageResponse("Password reset successfully. You can now log in.", true));
    }
}
